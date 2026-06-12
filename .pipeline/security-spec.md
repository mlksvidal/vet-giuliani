# Security Spec — vet-giuliani

Fecha: 2026-06-11
Tipo de proyecto: Landing **estática** (Vite + React + TS + Tailwind 4, GSAP + Lenis)
Deploy: **Vercel** (managed — sin OS host, sección Linux hardening SALTADA por doctrina)
Backend: NINGUNO · DB: NINGUNA · Auth: NINGUNA · Forms server-side: NINGUNO
Superficie de ataque: **mínima**. CTAs salen a `wa.me` / `tel:`. Embed de Google Maps. Datos en `src/data/site.ts` (placeholders).

> Threat model proporcional. NO se infla: sin backend ni inputs de usuario, las amenazas de Injection/Auth/Access Control son N/A. El foco real es: headers, embed seguro, supply chain, links externos, no-secrets, no Mixed Content.

---

## 1. Threat Model (STRIDE) — proporcional a estático

| STRIDE | Componente | Amenaza realista | Riesgo | Mitigación concreta |
|---|---|---|---|---|
| **Spoofing** | Links `target="_blank"` (wa.me, maps "cómo llegar") | Tab-nabbing: el sitio destino accede a `window.opener` y redirige la pestaña original a un phishing | Medio | `rel="noopener noreferrer"` OBLIGATORIO en todo `<a target="_blank">`. Browsers modernos ya hacen noopener por default pero se declara explícito (enforce en frontend + reality-checker). |
| **Tampering** | Assets servidos (JS/CSS bundle) | MITM inyecta/modifica contenido en tránsito | Bajo (HTTPS forzado por Vercel) | HSTS header. Todo recurso `https://`. Sin `http://` en código (sin Mixed Content). |
| **Tampering** | Dependencias npm (GSAP, Lenis, React) | Paquete envenenado / lockfile apuntando a host malicioso (supply chain) | Medio | `package-lock.json` commiteado + versiones **pinneadas exactas** (sin `^`/`~`) para GSAP y Lenis. `lockfile-lint` en CI. `npm audit` en build. |
| **Repudiation** | N/A | Sin usuarios autenticados ni transacciones | N/A | — |
| **Info Disclosure** | Repo / bundle | Secrets hardcodeados, source maps en prod revelando código fuente | Bajo-Medio | NO secrets (no hay backend ⇒ no debería haber ninguno). `.env` en `.gitignore`. `build.sourcemap=false` en `vite.config.ts` para prod, o verificar `*.map` no accesibles vía HTTP. |
| **Info Disclosure** | Google Maps iframe | Iframe con permisos amplios expone APIs del browser al origen embebido | Bajo | `referrerpolicy="no-referrer-when-downgrade"`, `loading="lazy"`, `sandbox` mínimo (ver §3). CSP `frame-src` acotado a Google. |
| **DoS** | Hosting | Flood | N/A (Vercel CDN absorbe; fuera de scope app) | Gestionado por Vercel. |
| **Elevation** | N/A | Sin roles ni backend | N/A | — |
| **XSS (reflected/stored/DOM)** | Contenido del sitio | Inyección de HTML/script | Muy bajo | TODO el contenido es **estático y hardcodeado** en `site.ts` (no input de usuario, no `dangerouslySetInnerHTML`, no `v-html`). React escapa por default. CSP como defensa en profundidad. **Si en el futuro se agrega rich-text/CMS → sanitizar con allowlist (ver §7).** |

**Amenazas que NO aplican (y por qué no se documentan en detalle)**: SQL/NoSQL Injection, Broken Access Control, Auth Failures, SSRF, CSRF, Insecure Deserialization, Mass Assignment — **todas requieren backend/DB/auth que este proyecto no tiene**.

---

## 2. Security Headers (vía `vercel.json`)

Vercel NO agrega headers de seguridad por default (y `Cache-Control: max-age=0` es su default). Configurar en `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://maps.gstatic.com; font-src 'self' data:; frame-src https://www.google.com https://maps.google.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; object-src 'none'; upgrade-insecure-requests"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

### Notas de decisión sobre la CSP

- **`X-Frame-Options: SAMEORIGIN`** + **`frame-ancestors 'self'`** → la landing NO puede ser embebida por terceros (anti-clickjacking). Doble defensa (XFO legacy + CSP moderno).
- **`style-src 'unsafe-inline'`**: necesario. Tailwind 4 + GSAP setean estilos inline (`element.style.transform`, etc.) y React inyecta `<style>`. Sin `unsafe-inline` GSAP rompe. Es un trade-off aceptable: sin contenido dinámico de usuario, el vector XSS vía style es nulo.
- **`script-src 'self'`** SIN `unsafe-inline` ni `unsafe-eval`: el bundle de Vite es un `.js` servido desde el mismo origen. GSAP/Lenis NO requieren `eval`. Mantener estricto.
- **`img-src`** incluye `data:` (íconos inline / gradientes), `googleapis`/`gstatic` (tiles de Maps cuando usa el embed con marcador).
- **`frame-src https://www.google.com`**: dominio del embed de Maps (`google.com/maps/embed`). Si se usa `maps.google.com` también está cubierto.
- **`upgrade-insecure-requests`**: fuerza cualquier `http://` accidental a `https://` (defensa anti Mixed Content).
- **`object-src 'none'`, `base-uri 'self'`, `form-action 'self'`**: hardening barato sin costo funcional.

### Cache-Control
- `/assets/**` (bundles hasheados por Vite) → `max-age=31536000, immutable` (1 año, son content-hashed, seguro cachear agresivo).
- `index.html` → queda en default de Vercel (`max-age=0` revalidate), correcto para que el HTML refleje nuevos hashes de assets sin cache stale.

---

## 3. Google Maps Embed — decisión de seguridad

**Recomendación: usar el `<iframe>` de embed de Google Maps (modo `place`/`search` por query textual), NO la JavaScript Maps API.**

Razón: la JS API requiere una **API key expuesta en el cliente** (info disclosure + posible abuso de cuota si no se restringe por referrer). El embed por iframe NO requiere key y es suficiente para "mostrar dónde queda".

### iframe seguro

```html
<iframe
  src="https://www.google.com/maps?q=<MAPS_QUERY_URLENCODED>&output=embed"
  title="Ubicación aproximada — Veterinaria Luciano Giuliani, San Rafael, Mendoza"
  loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  width="100%"
  height="400"
  style="border:0"
  allowfullscreen
></iframe>
```

- **`title`** obligatorio (a11y + claridad).
- **`loading="lazy"`** (performance + no carga Google hasta scroll).
- **`referrerpolicy="no-referrer-when-downgrade"`**: Google Maps necesita el referrer para funcionar; este policy lo envía solo en https→https. NO usar `sandbox` agresivo aquí — el embed de Maps necesita scripts/same-origin de Google y `sandbox` lo rompería (mapa en blanco). El aislamiento real lo da el `frame-src` de la CSP.
- **NO** poner API keys en el src del iframe del modo `output=embed`.

### Alternativa / fallback (si la CSP complica el embed)
Link estático en vez de iframe: `<a href="https://www.google.com/maps/search/?api=1&query=<MAPS_QUERY>" target="_blank" rel="noopener noreferrer">Ver en Google Maps / Cómo llegar</a>`.
- Cero superficie de iframe, cero CSP `frame-src` necesario, cero key.
- Trade-off UX: no muestra el mapa inline. **Decisión recomendada al orquestador/frontend**: usar iframe (mejor UX para una vet de barrio), con el link estático como CTA "Cómo llegar" complementario. Si en QA el iframe da problemas de CSP/carga, degradar al link.

---

## 4. Supply Chain

| Control | Acción | Fase |
|---|---|---|
| Lockfile commiteado | `package-lock.json` versionado (no en `.gitignore`) | 0 |
| Versiones pinneadas | GSAP y Lenis con versión **exacta** (sin `^`/`~`) en `package.json`. React/Vite pueden usar `^` (mantenedores confiables, semver respetado). | 0 |
| lockfile-lint | `npx lockfile-lint --allowed-hosts npm --allowed-schemes "https:" --type npm --path package-lock.json` → solo resuelve de registro npm oficial vía https | 4 |
| npm audit | `npm audit --audit-level=high` en CI/pre-deploy. Falla el build si hay HIGH/CRITICAL | 4 |
| Recomendación CI (no implementa este agente) | git-agent/deployer: pinnear GitHub Actions a SHA (no tags mutables); CodeQL SAST opcional para una landing es bajo ROI pero documentado | — |

---

## 5. Checklist OWASP Top 10 (aplicable a estático)

| # | Aplica | Estado / Mitigación |
|---|---|---|
| A01 Broken Access Control | ❌ N/A | Sin auth/roles/recursos protegidos |
| A02 Cryptographic Failures | ✅ parcial | HTTPS forzado (Vercel + HSTS). **NO secrets en repo** (no hay backend ⇒ no debe existir ninguno). `.env` en `.gitignore` |
| A03 Injection | ❌ N/A | Sin DB, sin queries, sin input de usuario, sin `dangerouslySetInnerHTML` |
| A04 Insecure Design | ✅ | Este threat model. CTA urgencias = decisión de diseño segura y accesible |
| A05 Security Misconfiguration | ✅ | Headers vía `vercel.json` (§2). CSP estricta. Sin directory listing (Vercel). Source maps off en prod |
| A06 Vulnerable Components | ✅ | `npm audit` + lockfile-lint + versiones pinneadas (§4) |
| A07 Auth Failures | ❌ N/A | Sin login |
| A08 Data Integrity Failures | ✅ parcial | Lockfile + SRI implícito (Vite hashea assets, mismo origen). Sin CDN de scripts de terceros |
| A09 Logging/Monitoring | ⚪ delegado | Vercel Analytics opcional. Sin datos sensibles que loguear (no hay forms) |
| A10 SSRF | ❌ N/A | Sin fetch server-side de URLs del usuario |

---

## 6. Validación de "NO secrets en el repo"

Verificable (lo ejecuta git-agent pre-commit / reality-checker en certificación):

```bash
# 1. .env y derivados en .gitignore
grep -qE '^\.env' /Users/lucas/Documents/vet-giuliani/.gitignore && echo "OK .env ignored" || echo "FAIL"

# 2. Sin secrets hardcodeados en src/ (no debería haber API keys: el embed de Maps no las usa)
grep -rIEn '(api[_-]?key|secret|token|password|bearer|AIza[0-9A-Za-z_-]{20,})' \
  /Users/lucas/Documents/vet-giuliani/src/ 2>/dev/null \
  && echo "REVISAR coincidencias arriba" || echo "OK sin secrets en src/"

# 3. Sin http:// (Mixed Content) en código fuente
grep -rIn 'http://' /Users/lucas/Documents/vet-giuliani/src/ 2>/dev/null \
  | grep -v 'http://www.w3.org' \
  && echo "REVISAR http:// arriba (posible Mixed Content)" || echo "OK solo https"
```

- El número `tel:`/`wa.me` y la dirección son **datos de contacto públicos del cliente** en `site.ts` — NO son secrets. Está bien que estén en el código (es el punto: que la gente llame).

---

## 7. Reglas de validación de input (para el frontend-developer)

Aunque hoy NO hay input de usuario, dejar estas reglas como guardrail por si se agrega algo (ej. un form de contacto futuro):

- Todo input del usuario es malicioso hasta probar lo contrario. Validar server-side **siempre** (no aplica hoy, pero si se agrega un endpoint/serverless: parametrizar, validar).
- **NO** `dangerouslySetInnerHTML`. Si alguna vez se renderiza HTML de fuente externa (CMS, reseñas), sanitizar con **allowlist** (no blacklist):
  ```js
  const ALLOWLIST = {
    '*': ['class','dir','id','lang','role', /^aria-[\w-]*/i],
    a: ['target','href','title','rel'],
    p: [], em: [], strong: [], ul: [], ol: [], li: [],
  };
  const SAFE_URL = /^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i;
  ```
- URL-encodear el `?text=` del link `wa.me` (`encodeURIComponent(whatsappMessage)`) — evita romper el link y previene inyección de parámetros.

---

## 8. Checklist accionable para reality-checker (certificación Fase 4)

1. ✅ `vercel.json` presente con los 6 headers de §2 (incluida CSP).
2. ✅ CSP NO rompe la página (mapa carga, GSAP anima) — verificar en runtime (no solo grep).
3. ✅ Todo `<a target="_blank">` tiene `rel="noopener noreferrer"` (wa.me, "cómo llegar"). Grep: `grep -rn 'target="_blank"' src/` → cada match debe tener `rel`.
4. ✅ iframe de Maps con `title`, `loading="lazy"`, `referrerpolicy`. Carga sin error en network.
5. ✅ Sin Mixed Content: 0 requests `http://` en network inspection (todo https).
6. ✅ Sin secrets en `src/` ni en bundle; `.env` gitignored (§6).
7. ✅ Source maps NO accesibles en prod (`*.map` 404 vía HTTP, o `build.sourcemap=false`).
8. ✅ `npm audit --audit-level=high` sin findings HIGH/CRITICAL.
9. ✅ `lockfile-lint` pasa (solo registro npm oficial https).
10. ✅ GSAP/Lenis con versión pinneada exacta en `package.json`.

---

## Reglas inviolables aplicadas
- Nunca desactivar controles de seguridad.
- Nunca hardcodear secrets (no hay backend ⇒ no debería haber ninguno; los datos de contacto públicos NO cuentan).
- Default deny: CSP restrictiva, `object-src 'none'`, allowlist sobre blacklist.
- Cada recomendación incluye el fix concreto, no solo la descripción.
