# RIVA Tech — Sitio web corporativo

HTML5 + CSS3 + JavaScript Vanilla. Sin frameworks, sin librerías externas, sin build.

## Cómo verlo

Doble clic en `index.html`. Funciona directamente desde el sistema de archivos.

## Estructura

```
index.html            Página completa (header y footer en línea)
css/variables.css     Design tokens: color, tipografía, espacio, sombras
css/style.css         Estilos por sección
css/animations.css    Keyframes y reveals al hacer scroll
js/main.js            Navbar, menú móvil, scrollspy, formulario, back-to-top
js/animations.js      IntersectionObserver, contadores, parallax del hero
components/           Parciales de header y footer (referencia para backend)
assets/logo/          Isotipo, logo horizontal y favicon en SVG
assets/images/        Imagen de Open Graph (1200×630)
robots.txt · sitemap.xml · site.webmanifest
```

`components/header.html` y `footer.html` son la fuente de verdad para cuando
migres a un backend con includes. Mientras el sitio sea estático, el markup vive
en línea dentro de `index.html` para que abra sin servidor. **Si editas uno,
replica el cambio en el otro.**

## Identidad

**Logo — nodos conectados.** Tres nodos unidos por líneas: dos sólidos (los
sistemas que ya existen en la empresa) y uno abierto en turquesa (la solución que
RIVA Tech construye y conecta). Comunica integración y arquitectura sin recurrir
al cliché del engranaje o el circuito.

| Token | Valor | Uso |
|---|---|---|
| `--bg` | `#F5F7FA` | Fondo principal |
| `--bg-alt` | `#EEF2F7` | Bandas alternas |
| `--bg-deep` | `#0B1B2B` | CTA y footer |
| `--blue` | `#0F52BA` | Azul tecnológico, primario |
| `--petrol` | `#0E4F63` | Azul petróleo |
| `--teal` | `#0F9B8E` | Turquesa (texto e iconos) |
| `--teal-bright` | `#14B8A6` | Turquesa vivo (solo decorativo) |

Tipografía: **Plus Jakarta Sans** (Google Fonts). Elegida sobre Inter por sus
formas geométricas más marcadas en los pesos altos, que sostienen mejor un
titular grande.

Todos los pares de color pasan contraste **WCAG AA** (verificados, mínimo 3.4:1
en placeholders y 4.8:1 en texto).

## Pendientes de configuración

**1. Formulario de contacto.** Hoy valida y muestra confirmación sin enviar nada.
Para conectarlo, en `js/main.js`:

```js
var CONFIG = {
  FORM_ENDPOINT: "/api/contacto",   // tu endpoint o servicio tipo Formspree
  RECAPTCHA_SITE_KEY: ""
};
```

Envía un `POST` con JSON: `nombre`, `empresa`, `email`, `telefono`, `mensaje`,
`consent`. Incluye honeypot antispam (campo `website`, se descarta en el cliente
— **valídalo también en el servidor**).

**2. Google reCAPTCHA.** Obtén tu site key en
[google.com/recaptcha/admin](https://www.google.com/recaptcha/admin), luego en
`index.html`: descomenta el `<div class="g-recaptcha">` con tu key, descomenta el
`<script>` de reCAPTCHA al final del documento y borra el `.captcha-placeholder`.
`main.js` ya detecta el widget y bloquea el envío si no está resuelto.

**3. Redes sociales.** Bloque comentado en la sección de contacto
(`<!-- REDES SOCIALES -->`). Descomenta y pon las URLs reales.

**4. Dominio.** Al publicar, reemplaza `https://rivatech.mx/` en las etiquetas
`canonical`, Open Graph y Twitter de `index.html`, y en `sitemap.xml` y
`robots.txt`.

## Notas técnicas

- **Responsive** con `clamp()` y grid; breakpoints en 560 / 720 / 900 / 1000 / 1060 px.
- **Accesibilidad**: HTML semántico, skip link, foco visible, ARIA en el menú,
  scrollspy, y `prefers-reduced-motion` respetado (desactiva todas las animaciones).
- **Rendimiento**: ~212 KB en total, cero dependencias JS, todos los iconos en SVG
  inline, scroll listeners con `requestAnimationFrame` y `{ passive: true }`.
- El preloader tiene un timeout de seguridad de 2 s: nunca deja la pantalla
  bloqueada aunque falle un recurso.
