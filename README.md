# WiFi QR — Centro Recreativo

QR dinámico para WiFi. El QR se imprime **una sola vez** y apunta siempre a la misma URL; esa página muestra la contraseña **actual** de la red. El administrador la actualiza desde un panel protegido y el cambio se ve al instante, sin reimprimir nada.

La app **no** controla el router: cuando alguien cambia la contraseña en el router, el admin debe registrarla manualmente en el panel para mantenerlas sincronizadas.

## Stack

- Next.js 16 (App Router, Cache Components / PPR) + React 19
- Tailwind CSS v4
- Upstash Redis (`@upstash/redis`) — persistencia
- `qrcode` (QR en el servidor), `bcryptjs` (hash del admin), `zod` (validación)

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

| Variable | Descripción |
|----------|-------------|
| `UPSTASH_REDIS_REST_URL` | URL REST de Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | Token de Upstash Redis |
| `WIFI_SSID` | Nombre de la red (fijo, no editable) |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt de la contraseña de admin |
| `CRON_SECRET` | Secreto para `/api/health` (Vercel Cron lo envía como Bearer) |
| `APP_URL` | URL pública del proyecto (opcional; para el QR) |

Si la integración de Upstash en Vercel inyecta las variables con prefijo `KV_` (`KV_REST_API_URL` / `KV_REST_API_TOKEN`), la app también las acepta.

### Generar el hash del admin

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CLAVE_SEGURA', 12))"
```

> Importante: el hash contiene `$`, y Next.js interpreta `$` como referencia a variables en los `.env`.
> Escapá cada `$` con `\$` y encerrá el valor entre comillas dobles, por ejemplo:
> `ADMIN_PASSWORD_HASH="\$2b\$12\$..."`.

## Desarrollo

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000/wifi_contra](http://localhost:3000/wifi_contra).

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir el build |
| `npm run lint` | ESLint |

## Estructura

```
app/
  wifi_contra/         # página pública (SSID + contraseña + copiar + conectarse)
  admin/               # login y panel de administración
  api/
    wifi/              # GET público (no-store)
    health/            # keep-alive para el cron
    admin/             # login, logout, wifi (PUT), qr (PNG)
lib/                   # redis, wifi, session, auth, rate-limit, validación
```

## Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/wifi_contra` | No | Página pública |
| GET | `/api/wifi` | No | `{ ssid, password }` — `no-store` |
| GET | `/admin` | Según sesión | Login o panel |
| POST | `/api/admin/login` | No | Crea sesión (cookie `httpOnly`) |
| POST | `/api/admin/logout` | Sí | Borra la sesión |
| PUT | `/api/admin/wifi` | Sí | `{ password }` |
| GET | `/api/admin/qr` | Sí | PNG del QR |
| GET | `/api/health` | `CRON_SECRET` | Keep-alive de Redis |

## Deploy en Vercel

1. Importá el repositorio en Vercel.
2. Agregá Upstash Redis desde el Marketplace (inyecta las credenciales).
3. Definí `WIFI_SSID`, `ADMIN_PASSWORD_HASH` y `CRON_SECRET`.
4. Deploy. El cron diario (`vercel.json`) llama a `/api/health` para evitar pausas por inactividad.

### Estabilidad del QR

La URL `*.vercel.app` es estable mientras el proyecto no se renombre ni se borre. Si más adelante se usa un dominio propio, hay que **reimprimir** el QR.

## Seguridad

- La sesión de admin vive en Redis con TTL de 3600 s y en una cookie `httpOnly; Secure; SameSite=Strict`.
- La contraseña de admin se compara con bcrypt contra `ADMIN_PASSWORD_HASH` (nunca en texto plano).
- Límite de 5 intentos de login por IP cada 15 minutos.
- Toda entrada se valida con `zod`.
- La página pública y sus respuestas usan `Cache-Control: no-store`.
