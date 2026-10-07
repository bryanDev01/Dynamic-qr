<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:project-agent-rules -->

## Reglas obligatorias del proyecto

- ANTES de escribir o editar código, cargar y aplicar las skills relevantes de `.agents/skills/`. Mínimo:
  `next-best-practices`, `next-cache-components`, `react-best-practices`, `tailwind-css-patterns`,
  `typescript-advanced-types`, `nodejs-backend-patterns`. Según aplique: `frontend-design`,
  `accessibility`, `seo`, `composition-patterns`.
- Seguir SIEMPRE las reglas y convenciones de los subagentes definidos en `.opencode/agents/`
  (`nextjs-developer`, `fullstack-developer`, `backend-developer`, `security-auditor`, `reviewer`,
  `documentation-engineer`, `ux-researcher`).
- Responder siempre en español, sin importar el idioma de la pregunta. Solo el código fuente y los
  comandos se mantienen en inglés.
- `REQUISITOS_FUNCIONALES.md` es la fuente única de verdad del proyecto: cualquier cambio de alcance
  debe reflejarse ahí primero.
- Commits según `.opencode/commands/am-super-commit.md`: formato `<type>(<scope>): <message>`,
  ramas `feat/*` o `bugfix/*`, sin secretos ni archivos `.env`.

<!-- END:project-agent-rules -->
