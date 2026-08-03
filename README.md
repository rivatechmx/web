# rivatech.mx

Sitio de Riva Tech. HTML y CSS estáticos, sin dependencias ni paso de compilación.

## Estructura

```
wrangler.jsonc      Configuración de despliegue en Cloudflare
public/             Todo lo que se publica
├── index.html      Página de inicio
├── 404.html        Página de error
├── styles.css      Estilos, con soporte de tema claro y oscuro
├── robots.txt
└── sitemap.xml
```

## Despliegue

Cada push a `main` republica el sitio automáticamente en Cloudflare.
No hay comando de compilación: Cloudflare copia el contenido de `public/` tal cual.

## Trabajar en local

No hace falta servidor. Abre `public/index.html` directamente en el navegador.

## Dominio

- Producción: https://rivatech.mx
- DNS y CDN administrados en Cloudflare
