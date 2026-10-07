# REQUISITOS FUNCIONALES — WiFi QR (Centro Recreativo)

> Fuente única de verdad del proyecto. Versión 2 — persistencia migrada de Supabase a **Upstash Redis (Vercel Marketplace)**.
> Estado de cada punto: **[DEFINIDO]** = confirmado por Brayan · **[PROPUESTA]** = pendiente de confirmar.

---

## 1. Resumen

Un QR se imprime **una sola vez** y apunta siempre a la misma URL. Esa página muestra la contraseña WiFi **actual**. El administrador puede cambiarla en cualquier momento desde un panel protegido, y el cambio se ve al instante, sin reimprimir nada.

---

## 2. Requisitos funcionales

| ID | Requisito | Estado |
|----|-----------|--------|
| RF-01 | El QR codifica una **URL fija** (`https://<proyecto>.vercel.app/wifi_contra`). Nunca contiene la contraseña. | [DEFINIDO] |
| RF-02 | Al escanear, el cliente ve el nombre de la red y la contraseña actual, con botón **Copiar**. Sin login. | [DEFINIDO] |
| RF-03 | Existe un panel de administración (`/admin`) protegido por una contraseña única de administrador. | [DEFINIDO] |
| RF-04 | El admin cambia la contraseña WiFi desde el panel; el cambio se refleja de inmediato para los clientes. | [DEFINIDO] |
| RF-05 | El admin puede ver y descargar el QR (PNG) desde el panel. | [PROPUESTA] |

---

## 3. Requisitos no funcionales

| ID | Requisito | Detalle |
|----|-----------|---------|
| RNF-01 | Seguridad web | Protección contra XSS, CSRF y SSRF. Toda entrada validada con `zod`. |
| RNF-02 | Auth de admin | Contraseña de admin **hasheada con bcrypt**, nunca en texto plano. Distinta de la contraseña WiFi. |
| RNF-03 | HTTPS | Siempre (Vercel lo provee). Cookies `Secure`. |
| RNF-04 | Rendimiento | Respuesta de `/api/wifi` < 100 ms. |
| RNF-05 | Diseño | Minimalista, negro + dorado. |
| RNF-06 | Responsive | Móvil primero; también escritorio. |
| RNF-07 | Hosting | Vercel (deploy automático desde GitHub). |
| RNF-08 | Disponibilidad | El servicio debe estar **siempre activo**: la persistencia no puede pausarse por inactividad. |
| RNF-09 | Frescura | La página pública **nunca** se cachea (`no-store`); un cambio de contraseña se ve en el siguiente escaneo. |

---

## 4. Decisiones de arquitectura

| # | Decisión | Motivo | Estado |
|---|----------|--------|--------|
| D-01 | URL fija en el QR; la contraseña se lee dinámicamente | QR impreso una sola vez | [DEFINIDO] |
| D-02 | El QR apunta a una URL, **no** usa el formato `WIFI:T:WPA;S:...;P:...;;` | Ese formato incrusta la contraseña y el QR quedaría obsoleto al cambiarla | [DEFINIDO] |
| D-03 | Contraseña WiFi guardada en texto plano en Redis | Debe mostrarse al cliente; se transmite solo por HTTPS | [DEFINIDO] |
| D-04 | Contraseña de admin guardada como hash bcrypt en variable de entorno (`ADMIN_PASSWORD_HASH`) | Evita tabla de usuarios para un único admin | [PROPUESTA] |
| D-05 | Persistencia: **Upstash Redis** vía Vercel Marketplace | Vercel KV ya no existe para proyectos nuevos; Redis no se pausa por inactividad y las credenciales se inyectan como variables de entorno | [DEFINIDO] |
| D-06 | Sesión de admin = clave en Redis con **TTL de 3600 s** | Cumple "1 hora" sin lógica de expiración propia | [DEFINIDO] |
| D-07 | QR generado en el servidor (`qrcode`) | Una sola fuente, sin JS extra en el cliente | [PROPUESTA] |
| D-08 | Cron diario a `/api/health` que toca Redis | Respaldo contra políticas de inactividad del plan gratuito. En Hobby el mínimo es **1 vez al día** (no usar expresiones más frecuentes: fallan en el deploy) | [PROPUESTA] |
| D-09 | URL de producción: la generada por Vercel (`*.vercel.app`) | No hay dominio propio por ahora | [DEFINIDO] |

### Notas importantes

- **Estabilidad del QR:** la URL `*.vercel.app` es estable mientras el proyecto no se borre ni se renombre. Si más adelante se compra un dominio propio, habrá que **reimprimir el QR**. Si se quiere evitar, comprar un dominio barato desde el inicio.
- **Plan Hobby de Vercel:** está orientado a uso personal/no comercial. Si el centro recreativo es un negocio, revisar los términos de Vercel antes de producción (podría requerir plan Pro).
- **Cron en Hobby:** puede ejecutarse en cualquier momento dentro de la hora programada y solo corre en producción.

---

## 5. Modelo de datos (Upstash Redis)

| Clave | Tipo | Contenido | TTL |
|-------|------|-----------|-----|
| `wifi:config` | Hash | `ssid`, `password`, `updatedAt` (ISO) | ninguno |
| `session:{id}` | String | `"1"` (o JSON mínimo) | **3600 s** |
| `login:fail:{ip}` | Contador | Intentos fallidos de login | 900 s *(PROPUESTA)* |

- `{id}` = 32 bytes aleatorios criptográficos (hex/base64url).
- No hay historial ni auditoría (fuera de alcance, ver P-04).

---

## 6. Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/wifi_contra` | No | Página pública con SSID + contraseña + botón Copiar |
| GET | `/api/wifi` | No | `{ ssid, password }` — `Cache-Control: no-store` |
| GET | `/admin` | Sí (redirige a login) | Panel: cambiar contraseña, ver/descargar QR |
| POST | `/api/admin/login` | No | Body `{ password }` → crea sesión, cookie `httpOnly; Secure; SameSite=Strict` |
| POST | `/api/admin/logout` | Sí | Borra la sesión en Redis y la cookie |
| PUT | `/api/admin/wifi` | Sí | Body `{ ssid?, password }` → actualiza `wifi:config` |
| GET | `/api/admin/qr` | Sí | PNG del QR de la URL fija |
| GET | `/api/health` | `CRON_SECRET` | Lee/escribe una clave trivial en Redis (keep-alive) |

---

## 7. Flujos

**Cliente:** escanea QR → `GET /wifi_contra` → servidor lee `wifi:config` → muestra datos → botón Copiar.

**Admin:** `/admin` → sin sesión válida → login → `POST /api/admin/login` (bcrypt compare, rate limit) → crea `session:{id}` con TTL 3600 → cookie → panel → `PUT /api/admin/wifi` → Redis actualizado → siguiente escaneo ya muestra el valor nuevo.

**Expiración:** a la hora, Redis elimina `session:{id}`; la siguiente petición pide login de nuevo.

---

## 8. Dependencias NPM

| Paquete | Motivo |
|---------|--------|
| `next`, `react`, `tailwindcss` | Framework y estilos |
| `@upstash/redis` | Cliente Redis (reemplaza a `@vercel/kv`) |
| `qrcode` | Generar QR en el servidor |
| `bcryptjs` | Hash/verificación de la contraseña de admin (puro JS, compatible con serverless) |
| `zod` | Validación de formularios y API |

---

## 9. Preguntas abiertas

| ID | Pregunta | Estado |
|----|----------|--------|
| P-01 | Timeout de sesión admin | ✅ **Cerrada: 1 hora** |
| P-05 | URL base | ✅ **Cerrada: URL `*.vercel.app` de producción** |
| P-02 | ¿Validación mínima de la contraseña WiFi (longitud, caracteres)? | Abierta |
| P-03 | ¿Notificar al admin cuando se cambia la contraseña? | Abierta |
| P-04 | ¿Guardar historial de cambios? | Abierta (por defecto: **no**) |
| P-06 | ¿Límite de intentos de login? (propuesta: 5 intentos / 15 min por IP) | Abierta |
| P-07 | ¿El SSID es editable desde el panel o fijo? | Abierta |
| P-08 | ¿Se necesita QR descargable (RF-05) en la primera versión? | Abierta |
| P-09 | ¿El centro es negocio? (define si el plan Hobby de Vercel es aplicable) | Abierta |

---

## 10. Fuera de alcance

Manejo de dinero, historial completo, múltiples redes WiFi, múltiples administradores.
