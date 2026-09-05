# Guía para agentes

Instrucciones operativas para trabajar en este repositorio. Léelo completo antes
de tocar un archivo. La referencia técnica a fondo está en [LEEME.md](LEEME.md).

---

## Qué es esto

Un sitio corporativo de una sola página, estático, en español de México.
HTML + CSS + JavaScript vanilla. **No hay build, no hay dependencias, no hay backend.**

Cloudflare publica el contenido de `public/` tal cual, en cada push a `main`.

---

## Restricciones duras

No las negocies con el usuario salvo que él las cambie explícitamente.

| Regla | Por qué |
|---|---|
| Nada de frameworks, bundlers, npm ni preprocesadores | El despliegue copia archivos, no compila |
| Cero dependencias JS | Rendimiento y cero mantenimiento de versiones |
| Iconos en SVG en línea | Sin librerías de iconos ni sprites externos |
| Rutas **relativas** en `index.html` | El sitio debe abrir con doble clic (`file://`) |
| Español de México en todo el contenido | Es el idioma del negocio y del público |
| Sin emojis en la interfaz | Decisión de marca |

---

## Dónde tocar cada cosa

| Quiero cambiar… | Archivo | Nota |
|---|---|---|
| Un color, tipo o espaciado | `public/css/variables.css` | Cambia el token, nunca el valor suelto |
| Estilos de una sección | `public/css/style.css` | 15 bloques numerados; busca el encabezado |
| Animaciones de entrada | `public/css/animations.css` + `public/js/animations.js` | |
| Texto o estructura | `public/index.html` | Es una sola página con todas las secciones |
| Navbar o footer | `public/index.html` **y** `public/components/` | **Ambos.** Ver la trampa de abajo |
| Comportamiento del menú, scrollspy | `public/js/main.js` | Módulos numerados |
| Dominios o carpeta publicada | `wrangler.jsonc` | Cambiarlo altera la infraestructura |
| Metadatos SEO, Open Graph | `public/index.html` (`<head>`) | Actualiza también `sitemap.xml` |

---

## Trampas conocidas

**`components/` está duplicado a propósito.** `public/components/header.html` y
`footer.html` son la fuente de verdad para cuando el sitio migre a un backend con
includes. Hoy el markup vive en línea dentro de `index.html` para que abra sin
servidor. **Si editas el header o el footer, replica el cambio en los dos lugares.**
Esos archivos no se sirven al público.

**La clase `js` en `<html>`.** Un script en línea al inicio del `<head>` agrega
`document.documentElement.classList.add('js')`. Las animaciones de entrada y el
preloader solo se activan si esa clase existe. Sin JavaScript el sitio se ve
completo en lugar de quedar en blanco. **No muevas ese script ni lo pongas después
de los estilos.**

**El preloader tiene un timeout de seguridad de 2 segundos.** Si un recurso falla,
igual libera la pantalla. No lo quites sin reemplazar esa protección.

**Los elementos con `data-reveal` arrancan en `opacity: 0`.** Si mides posiciones
o tomas capturas antes de que entren, vas a ver valores raros. No son bugs de
layout.

**No confíes en capturas de Chrome/Edge headless para juzgar el responsive.**
Headless no emula métricas de dispositivo y recorta el texto de forma engañosa.
Mide con `scrollWidth` contra `clientWidth` en un navegador real.

---

## Flujo de trabajo, de inicio a fin

**1. Sincroniza antes de nada.**

```bash
git pull --ff-only origin main
```

El repositorio se edita desde varias máquinas. Empezar sin sincronizar es la forma
más rápida de generar un conflicto.

**2. Haz el cambio.** Un solo tema por commit.

**3. Verifica en local.** Abre `public/index.html` en un navegador real.
Comprueba también `404.html` si tocaste estilos globales.

**4. Si borraste algo, busca el código huérfano.** Al quitar un componente quedan
CSS y JS sin uso. Barre las clases y funciones asociadas antes de confirmar:

```bash
grep -rn "nombre-de-la-clase" public/
```

**5. Confirma y publica.**

```bash
git add -A && git commit -m "descripcion clara del cambio" && git push
```

**6. Verifica en producción**, unos 40 segundos después:

```bash
curl -s https://rivatech.mx | grep -o '<title>[^<]*</title>'
curl -s -o /dev/null -w '%{http_code}\n' https://rivatech.mx
curl -s -o /dev/null -w '%{http_code}\n' https://www.rivatech.mx
```

Ambos hosts deben devolver `200`.

---

## Lo que nunca debes romper

**El correo.** El dominio sirve el sitio y el correo corporativo al mismo tiempo.
Si borras o modificas los registros `MX` o `TXT` del DNS, la empresa deja de
recibir correo y sus mensajes empiezan a caer en spam. Detalle en
[LEEME.md](LEEME.md#infraestructura).

**Los dominios en `wrangler.jsonc`.** Las entradas `routes` con `custom_domain`
crean el registro DNS y el certificado. Quitarlas tumba el sitio.

**La etiqueta canónica.** `<link rel="canonical" href="https://rivatech.mx/">` en
`index.html` es lo que evita que Google indexe `www` como contenido duplicado.

**El correo de contacto.** `contacto@rivatech.mx` aparece en varios lugares del
sitio y funciona de verdad. No lo cambies por un correo de ejemplo.

---

## Antes de reportar algo como problema

Este proyecto ya pagó el costo de asumir en lugar de medir. Si vas a afirmar que
algo está roto, **compruébalo primero** y muestra el dato: el código HTTP, la
medición, el registro DNS. No la impresión visual de una captura.
