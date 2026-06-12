# Veterinaria Luciano Giuliani

Landing web para el veterinario Luciano Giuliani, San Rafael, Mendoza. Enfocada en urgencias 24 h y contacto directo desde mobile.

## Stack

- **Framework**: React 19 + TypeScript 6
- **Build**: Vite 8
- **Estilos**: Tailwind CSS 4 (`@tailwindcss/vite`)
- **Animación**: GSAP 3 + ScrollTrigger (Tier 3) + Lenis smooth scroll
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint 10 + Prettier 3
- **Hooks**: Husky + lint-staged (pre-commit: lint + tsc --noEmit)
- **Deploy**: Vercel (configurado en `vercel.json`)

## Setup local

```bash
# 1. Clonar el repo
git clone <url-del-repo>
cd vet-giuliani

# 2. Instalar dependencias
npm install

# 3. Copiar variables de entorno (actualmente vacías)
cp .env.example .env

# 4. Levantar servidor de desarrollo
npm run dev
# → http://localhost:5173
```

## Scripts disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Build de producción → `dist/` |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | ESLint sobre todos los archivos TS/TSX |
| `npm run lint:fix` | ESLint con auto-fix |
| `npm run typecheck` | TypeScript `tsc --noEmit` |
| `npm test` | Vitest en modo run (CI) |
| `npm run test:watch` | Vitest en modo watch (desarrollo) |

## Estructura de carpetas

```
vet-giuliani/
├── public/                  # Assets estáticos servidos desde raíz
│   ├── favicon.svg
│   ├── icons.svg
│   └── assets/              # Imágenes, logos, video (pipeline creativo)
├── src/
│   ├── __tests__/           # Tests unitarios (mirror de src/)
│   │   └── setup.ts         # Setup de Testing Library
│   ├── assets/              # Assets importados por módulos JS (optimizados por Vite)
│   ├── components/
│   │   ├── ui/              # Componentes reutilizables (EmergencyCTA, Nav, ThemeToggle)
│   │   └── sections/        # Secciones de página (Hero, Services, About, LocationHours, Footer)
│   ├── data/
│   │   └── site.ts          # FUENTE DE VERDAD: todos los datos del cliente (placeholders marcados)
│   ├── hooks/               # Custom hooks (useLenis, useReducedMotion, etc.)
│   ├── lib/
│   │   └── lenis.ts         # Setup de Lenis smooth scroll con guard reduce-motion
│   ├── types/
│   │   └── index.ts         # Tipos TypeScript compartidos
│   ├── App.tsx              # Componente raíz con layout de secciones
│   ├── index.css            # Tailwind 4 import + tokens CSS + reset global
│   └── main.tsx             # Entry point React
├── .editorconfig
├── .env.example
├── .gitignore
├── .husky/
│   └── pre-commit           # lint-staged + tsc --noEmit
├── .prettierrc
├── eslint.config.js
├── index.html               # Template HTML (lang="es", meta SEO, noscript)
├── package.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vercel.json              # Security headers + Cache-Control
├── vite.config.ts
└── vitest.config.ts
```

## Notas de desarrollo

### Datos del cliente
Todos los datos del cliente (teléfono, dirección, horarios) son placeholders centralizados en `src/data/site.ts`. Reemplazar en ese único archivo cuando el cliente provea los datos reales.

### CTA de urgencias — prioridad máxima
El componente `EmergencyCTA` (Tarea 2) es el corazón del proyecto. Ninguna animación puede bloquear o demorar el acceso al botón de llamada/WhatsApp.

### prefers-reduced-motion
El guard global está en `src/index.css`. Cada componente con GSAP tiene su propio guard. Verificar con Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.

### Imágenes placeholder
No usar picsum.photos ni unsplash. Usar gradientes cálidos con `alt` descriptivo hasta que lleguen los assets del pipeline creativo (brand-agent → image-agent).

## Deploy

El proyecto despliega en Vercel automáticamente desde la rama principal. La configuración de headers de seguridad y caché está en `vercel.json`.

```bash
# Build manual de producción
npm run build
# → genera dist/ (listo para Vercel o cualquier static host)
```
