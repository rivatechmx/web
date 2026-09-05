# rivatech.mx

Sitio corporativo de **RIVA Tech**. HTML5, CSS3 y JavaScript vanilla.
Sin frameworks, sin dependencias, sin paso de compilación.

- **Producción:** https://rivatech.mx · https://www.rivatech.mx
- **Repositorio:** https://github.com/rivatechmx/web
- **Hosting:** Cloudflare Workers (Static Assets)

---

## Empezar en 30 segundos

```bash
git clone https://github.com/rivatechmx/web.git
cd web
```

Abre `public/index.html` con doble clic. **No hace falta servidor ni instalar nada.**
Todo el sitio funciona bajo el protocolo `file://`.

---

## Las cuatro reglas que no se rompen

1. **Sin build.** Cloudflare copia `public/` tal cual. No agregues npm, bundlers ni preprocesadores.
2. **Sin dependencias.** Cero librerías JS. Los iconos son SVG en línea. La única carga externa es Google Fonts.
3. **Rutas relativas** en `index.html` (`css/style.css`, no `/css/style.css`), para que el sitio abra con doble clic.
4. **Nunca toques los registros MX ni TXT del DNS.** Ahí vive el correo de la empresa. Ver [LEEME.md](LEEME.md#infraestructura).

---

## Estructura

```
wrangler.jsonc            Despliegue: dominios propios y carpeta a publicar
public/                   Todo lo que se sirve
├── index.html            Página única, con todas las secciones
├── 404.html              Página de error
├── css/
│   ├── variables.css     Design tokens: color, tipografía, espacio, sombras
│   ├── style.css         Estilos por sección, en 15 bloques numerados
│   └── animations.css    Keyframes y estados de reveal
├── js/
│   ├── main.js           Preloader, navbar, scrollspy, back-to-top, anclas
│   └── animations.js     IntersectionObserver, contadores, parallax del hero
├── components/           Parciales de header y footer (referencia, no se sirven)
├── assets/logo/          Isotipo, logo horizontal y favicon en SVG
├── assets/images/        Imagen Open Graph 1200×630
└── robots.txt · sitemap.xml · site.webmanifest
```

Peso total: **196 KB**.

---

## Publicar

```bash
git add -A && git commit -m "descripcion del cambio" && git push
```

Eso es todo. El push a `main` dispara el despliegue en Cloudflare y el sitio queda
actualizado en unos **40 segundos**. No hay comando de compilación.

Verificar que salió:

```bash
curl -s https://rivatech.mx | grep -o '<title>[^<]*</title>'
```

---

## Documentación

| Archivo | Para qué |
|---|---|
| [AGENTS.md](AGENTS.md) | **Empieza aquí si eres un agente.** Reglas, flujo de trabajo y dónde tocar cada cosa |
| [LEEME.md](LEEME.md) | Referencia completa: design system, anatomía, infraestructura y verificación |
