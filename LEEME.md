# RIVA Tech — Referencia técnica

Documentación a fondo del sitio. Para el arranque rápido ve al
[README.md](README.md); para las reglas de trabajo, [AGENTS.md](AGENTS.md).

---

## Índice

1. [Estructura de archivos](#estructura-de-archivos)
2. [Design system](#design-system)
3. [Anatomía de la página](#anatomía-de-la-página)
4. [JavaScript](#javascript)
5. [Convenciones de código](#convenciones-de-código)
6. [Responsive](#responsive)
7. [Accesibilidad](#accesibilidad)
8. [Rendimiento](#rendimiento)
9. [Infraestructura](#infraestructura)
10. [Cómo verificar un cambio](#cómo-verificar-un-cambio)
11. [Pendientes](#pendientes)

---

## Estructura de archivos

| Ruta | Qué contiene |
|---|---|
| `wrangler.jsonc` | Nombre del Worker, carpeta publicada, dominios propios, `workers_dev: false` |
| `public/index.html` | La página completa. Header, seis secciones y footer, todo en línea |
| `public/404.html` | Error. Reutiliza `variables.css` y `style.css`, con estilos propios en línea |
| `public/css/variables.css` | Todos los design tokens. **Punto único de cambio para color, tipo y espacio** |
| `public/css/style.css` | Estilos por sección, en 15 bloques numerados con encabezado de comentario |
| `public/css/animations.css` | Keyframes y estados de `data-reveal` |
| `public/js/main.js` | Cinco módulos numerados. Sin dependencias |
| `public/js/animations.js` | Tres módulos: reveal, contadores, parallax |
| `public/components/` | Parciales de header y footer. **Referencia, no se sirven** |
| `public/assets/logo/` | `isotipo.svg`, `logo-horizontal.svg`, `favicon.svg` |
| `public/assets/images/` | `og-cover.png`, 1200×630, para Open Graph |
| `public/site.webmanifest` | Manifiesto PWA básico |
| `public/robots.txt` | Permite todo, apunta al sitemap |
| `public/sitemap.xml` | La raíz más las cinco anclas de sección |

---

## Design system

Todos los tokens viven en `public/css/variables.css`. **Nunca escribas un color o
una medida a mano en `style.css`: usa el token.**

### Color

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F5F7FA` | Fondo principal, no blanco puro |
| `--bg-alt` | `#EEF2F7` | Bandas alternas entre secciones |
| `--bg-deep` | `#0B1B2B` | CTA y footer |
| `--surface` | `#FFFFFF` | Tarjetas |
| `--ink` | `#0B1B2B` | Titulares |
| `--ink-2` | `#37485A` | Cuerpo de texto |
| `--ink-3` | `#586778` | Secundario y captions |
| `--blue` | `#0F52BA` | Azul tecnológico, color primario |
| `--petrol` | `#0E4F63` | Azul petróleo |
| `--teal` | `#0F9B8E` | Turquesa accesible, para texto e iconos |
| `--teal-bright` | `#14B8A6` | Turquesa vivo, **solo decorativo** |

Hay variantes numeradas (`--blue-600`, `--blue-100`, `--teal-100`, `--petrol-100`)
para estados y fondos suaves.

Todos los pares pasan contraste **WCAG AA**: mínimo 3.4:1 en placeholders y 4.8:1
en texto. Si introduces un color nuevo, verifica el contraste antes.

### Tipografía

**Plus Jakarta Sans**, vía Google Fonts. Se eligió sobre Inter por sus formas
geométricas más marcadas en los pesos altos, que sostienen mejor un titular grande.

Escala en tokens: `--fs-display`, `--fs-h2`, `--fs-h3`, `--fs-lead`, `--fs-body`,
`--fs-sm`, `--fs-xs`. Alturas de línea: `--lh-tight`, `--lh-snug`, `--lh-body`.

Casi todos los tamaños usan `clamp()`, así que escalan solos entre móvil y
escritorio sin media queries.

### Espacio, radios, sombras y movimiento

Escala de espaciado `--sp-1` a `--sp-8`. Radios `--r-*`. Sombras `--sh-*`,
deliberadamente sutiles. Duraciones y curvas en `--t-*` y `--ease`.

### Logo

Tres nodos unidos por líneas: dos sólidos, que representan los sistemas que la
empresa ya tiene, y uno abierto en turquesa, que es la solución que RIVA Tech
construye y conecta. Comunica integración y arquitectura sin caer en el cliché
del engranaje o el circuito.

El isotipo está embebido como SVG en línea dentro de `index.html`, `404.html` y
los parciales de `components/`. **Si lo cambias, hay cuatro lugares que actualizar.**

---

## Anatomía de la página

`index.html` es una sola página con anclas. El orden importa: la navegación, el
scrollspy y el `sitemap.xml` dependen de estos identificadores.

| Ancla | Sección | Fondo |
|---|---|---|
| `#inicio` | Hero: titular, subtítulo, dos botones y tres métricas | claro |
| `#servicios` | Qué ofrecen, en tarjetas | `section--surface` |
| `#experiencia` | Casos y trayectoria, en tarjetas con encabezado | `section--alt` |
| `#proceso` | Cómo trabajan, en línea de tiempo | `section--surface` |
| `#nosotros` | Quiénes son y por qué RIVA Tech | `section--alt` |
| *(sin ancla)* | Banda CTA oscura | `cta` |
| `#contacto` | Ubicación, correo, horario y botón de correo | claro |

La sección de contacto **no tiene formulario**. Se quitó a propósito: el sitio es
estático y no hay backend que procese envíos. El contacto es directo por correo.
Si algún día se agrega uno, hay que resolver antes el endpoint y el antispam.

---

## JavaScript

Dos archivos, sin dependencias, ambos envueltos en IIFE con `"use strict"`.
Se cargan con `defer`.

### `main.js`

| Módulo | Qué hace |
|---|---|
| 1. Preloader | Oculta la pantalla de carga. Timeout de seguridad de 2 s |
| 2. Navbar | Estado al hacer scroll, barra de progreso, menú móvil con ARIA, scrollspy |
| 3. Back to top | Botón que aparece al bajar |
| 4. Año del footer | Rellena `[data-year]` con el año actual |
| 5. Anclas | Scroll suave con ajuste por la altura del navbar y manejo de foco |

### `animations.js`

| Módulo | Qué hace |
|---|---|
| 1. Reveal | `IntersectionObserver` sobre `[data-reveal]` y `[data-reveal-group]` |
| 2. Contadores | Anima `[data-count]`, con sufijo opcional en `[data-suffix]` |
| 3. Parallax | Desplazamiento muy sutil de `[data-parallax]` en el hero |

Ambos respetan `prefers-reduced-motion`: si el usuario lo pide, las animaciones
se desactivan por completo.

### Atributos `data-*` en uso

`data-reveal` · `data-reveal-group` · `data-hero` · `data-count` · `data-suffix`
· `data-parallax` · `data-year`

---

## Convenciones de código

- **CSS con BEM suelto:** `bloque__elemento` y `bloque--modificador`.
  Ejemplos reales: `nav__link`, `btn--primary`, `exp-card__head`, `section--alt`.
- **JavaScript ES5.** Nada de `let`, arrow functions ni template literals: el
  código actual usa `var` y funciones normales. Mantén el estilo.
- **Comentarios en español**, con encabezados de bloque numerados.
- **Indentación de 2 espacios** en HTML, CSS y JS.
- **Los SVG llevan `aria-hidden="true"`** salvo que comuniquen información.

---

## Responsive

Los tamaños se resuelven principalmente con `clamp()`, no con breakpoints.
Las media queries existentes son puntuales:

`560` · `620` · `720` · `760` · `820` · `860` · `900` · `901` · `980` · `1000` · `1060` px

Más una hoja de impresión y el bloque de `prefers-reduced-motion`.

**Observación honesta:** ese conjunto de breakpoints es inconsistente, producto de
ajustes puntuales. Funciona, pero si alguna vez se hace una refactorización de
estilos, conviene consolidarlos en tres o cuatro valores.

Verificado sin desbordamiento horizontal a 375 px: `scrollWidth` es igual a
`clientWidth` en toda la altura de la página.

---

## Accesibilidad

- HTML semántico: `header`, `nav`, `main`, `section`, `footer`.
- Skip link al inicio para saltar directo al contenido.
- Foco visible en todos los elementos interactivos.
- ARIA en el menú móvil: `aria-expanded`, `aria-controls`, `aria-label`.
- Scrollspy que marca la sección activa.
- `prefers-reduced-motion` respetado.
- Contraste WCAG AA en todos los pares de color.
- Sin JavaScript el sitio se ve completo, no en blanco.

---

## Rendimiento

- **196 KB** en total, todo incluido.
- Cero dependencias JavaScript.
- Todos los iconos en SVG en línea, sin peticiones extra.
- Listeners de scroll con `requestAnimationFrame` y `{ passive: true }`.
- Fuentes con `preconnect` y `preload`.
- Servido desde la red global de Cloudflare, con caché y HTTPS automáticos.

---

## Infraestructura

> **Advertencia.** El dominio sirve el sitio **y** el correo corporativo al mismo
> tiempo. Modificar registros DNS a la ligera deja a la empresa sin correo.

### Dominio y DNS

| | |
|---|---|
| Dominio | `rivatech.mx` |
| Registrador | Porkbun, con candado de transferencia y renovación automática |
| Vencimiento | 2 de agosto de 2027 |
| Nameservers | `laila.ns.cloudflare.com` · `vick.ns.cloudflare.com` |
| DNS, CDN y TLS | Cloudflare |

### Sitio

Cloudflare Workers con Static Assets. Los dominios propios están declarados en
`wrangler.jsonc`, no configurados a mano en el panel: al desplegar, wrangler crea
el registro DNS y el certificado. `workers_dev` está en `false` para que el sitio
solo responda en el dominio propio.

### Correo — no tocar sin entender

El correo son tres piezas independientes:

| Función | Cómo está resuelto |
|---|---|
| **Recibir** | Cloudflare Email Routing. Tres `MX` en la raíz hacia `route1/2/3.mx.cloudflare.net` |
| **Buzón** | Cuenta de Gmail compartida, con delegación para cada socio |
| **Enviar** | Resend por SMTP (`smtp.resend.com:587`), conectado a Gmail como *Enviar mensaje como* |

Registros DNS involucrados:

| Nombre | Tipo | Para qué |
|---|---|---|
| `rivatech.mx` | `MX` ×3 | Recepción vía Cloudflare |
| `rivatech.mx` | `TXT` | SPF de recepción: `v=spf1 include:_spf.mx.cloudflare.net ~all` |
| `resend._domainkey` | `TXT` | Llave pública DKIM, 218 caracteres |
| `send` | `TXT` | SPF de envío: `v=spf1 include:amazonses.com ~all` |
| `send` | `MX` | Retroalimentación de rebotes hacia Amazon SES |
| `_dmarc` | `TXT` | `v=DMARC1; p=quarantine; sp=reject; rua=mailto:contacto@rivatech.mx; fo=1` |

El envío usa `send.rivatech.mx` como Return-Path a propósito: así el SPF y el MX
de Resend viven en el subdominio y **no chocan** con los MX de recepción en la
raíz. Ambos conviven porque están en niveles distintos.

SPF, DKIM y DMARC pasan y alinean, verificado con encabezados reales.

**Pendiente programado:** subir DMARC de `p=quarantine` a `p=reject` una vez
revisados los reportes, alrededor de finales de agosto de 2026.

---

## Cómo verificar un cambio

**En local**, abre `public/index.html` en un navegador real.

**En producción**, unos 40 segundos después del push:

```bash
curl -s -o /dev/null -w 'raiz %{http_code}\n' https://rivatech.mx
```

```bash
curl -s https://rivatech.mx | grep -o '<title>[^<]*</title>'
```

**Que el correo siga vivo.** Haz esto siempre que hayas tocado DNS:

```bash
nslookup -type=MX rivatech.mx 1.1.1.1
```

Deben aparecer los tres `route*.mx.cloudflare.net`.

**Responsive:** mide `document.documentElement.scrollWidth` contra `clientWidth`
en un navegador real con emulación móvil. No juzgues por capturas de headless.

---

## Pendientes

**1. Redes sociales.** En la sección de contacto hay un bloque comentado
(busca `REDES SOCIALES` en `index.html`) con LinkedIn, Facebook, Instagram y WhatsApp.
Descomenta y pon las URLs reales cuando existan las cuentas. Los handles
apartados son `rivatechmx` en X y GitHub, y `rivatech.mx` en Instagram y YouTube.

**2. Subir DMARC a `p=reject`.** Ver [Infraestructura](#infraestructura).

**3. Consolidar breakpoints.** Ver [Responsive](#responsive). No urge.

**4. Logo definitivo.** El isotipo actual es un SVG geométrico hecho a mano. Si se
encarga una identidad profesional, hay que reemplazarlo en los cuatro lugares
donde está embebido.
