# rivatech.mx

Sitio de RIVA Tech. HTML5, CSS3 y JavaScript vanilla, sin frameworks ni paso de compilación.

## Estructura

```
wrangler.jsonc          Configuración de despliegue en Cloudflare
public/                 Todo lo que se publica
├── index.html          Página de inicio
├── 404.html            Página de error
├── css/
│   ├── variables.css   Design tokens: color, tipografía, espacio, sombras
│   ├── style.css       Estilos por sección
│   └── animations.css  Keyframes y reveals al hacer scroll
├── js/
│   ├── main.js         Navbar, menú móvil, scrollspy, formulario, back-to-top
│   └── animations.js   IntersectionObserver, contadores, parallax del hero
├── components/         Parciales de header y footer (referencia para backend)
├── assets/logo/        Isotipo, logo horizontal y favicon en SVG
├── assets/images/      Imagen de Open Graph (1200×630)
├── site.webmanifest
├── robots.txt
└── sitemap.xml
```

Ver [LEEME.md](LEEME.md) para identidad visual, design tokens y pendientes de configuración (formulario de contacto, reCAPTCHA, redes sociales).

## Despliegue

Cada push a `main` republica el sitio automáticamente en Cloudflare.
No hay comando de compilación: Cloudflare copia el contenido de `public/` tal cual.

## Trabajar en local

No hace falta servidor. Abre `public/index.html` directamente en el navegador.

## Dominio

- Producción: https://rivatech.mx
- DNS y CDN administrados en Cloudflare
