# Mimo Senior — sitio web estático bilingüe

Proyecto mobile-first generado desde una única fuente de contenido JSON. No utiliza frameworks, paquetes npm, fuentes remotas ni servicios externos obligatorios.

## Arquitectura

- `data/site-data.json`: fuente central de textos, traducciones, rutas, SEO, imágenes, formularios y mensajes de WhatsApp.
- `build.mjs`: generador estático con módulos nativos de Node.js.
- `src/`: plantillas, constructores de página y utilidades del build.
- `assets/`: CSS y JavaScript Vanilla ejecutado en el navegador.
- `img/`: placeholders locales que deben sustituirse por imágenes definitivas conservando nombres o actualizando el JSON.
- `dist/`: salida prerenderizada lista para desplegar.

## Requisito previo

Node.js 20 o superior. No es necesario ejecutar `npm install` porque no hay dependencias externas.

## Generar el sitio

```bash
node build.mjs
```

También puedes utilizar:

```bash
npm run build
```

El generador borra y reconstruye `dist/`.

## Visualizar localmente

Desde la raíz del proyecto:

```bash
python -m http.server 8080 -d dist
```

Abre `http://localhost:8080/`. Es importante usar un servidor local y no abrir los HTML con `file://`, porque el sitio usa módulos JavaScript.

## 1. Modificar textos

Edita `data/site-data.json`:

- Español: `content.es.pages`
- Inglés: `content.en.pages`
- Textos globales: `content.es.global` y `content.en.global`

Después ejecuta `node build.mjs`.

## 2. Modificar traducciones

Cada página usa la misma clave en ambos idiomas. Por ejemplo:

- `content.es.pages.diapers`
- `content.en.pages.diapers`

Mantén las claves y la estructura equivalentes para que el selector de idioma conserve la página correspondiente.

## 3. Cambiar imágenes

Todas las rutas están agrupadas en:

```json
"assets": {
  "images": {}
}
```

Puedes sustituir directamente los archivos de `img/` conservando sus nombres. Para usar otro nombre, cambia una sola vez el apuntador correspondiente en `assets.images`. El contenido solo utiliza claves como `imageKey: "homeHero"`.

Tamaños recomendados de los placeholders actuales:

- Héroes `img.png` a `img7.png` e `img11.png`: 720 × 600 px.
- Imágenes de contenido `img8.png`, `img9.png`, `img10.png`: 640 × 520 px.
- Open Graph `img12.png`: 1200 × 630 px.

Usa imágenes optimizadas en WebP o AVIF solo después de actualizar las rutas del JSON y las dimensiones declaradas en las plantillas si cambia la proporción.

## 4. Cambiar el número de WhatsApp

Modifica únicamente:

```json
"business": {
  "whatsapp": {
    "display": "NÚMERO_CON_FORMATO",
    "number": "SOLO_DÍGITOS"
  }
}
```

El generador y los scripts reutilizan esta fuente. Los mensajes se administran en `whatsappMessages.es` y `whatsappMessages.en`.

## 5. Agregar una página

1. Añade una clave en `routes` con URL española e inglesa.
2. Añade el contenido en `content.es.pages` y `content.en.pages` con esa misma clave.
3. Añade metadatos en `seo.es` y `seo.en`.
4. Si debe aparecer en el menú, agrega la clave a `navigation.order` y sus etiquetas a `navigation.labels`.
5. Utiliza los tipos de sección existentes en `src/templates/sections.js` o añade uno nuevo.
6. Ejecuta `node build.mjs`.

## 6. Ejecutar el generador

```bash
node build.mjs
```

El script valida que existan rutas, contenido y SEO en ambos idiomas, copia recursos y genera páginas, sitemap, robots, manifest y páginas 404.

## 7. Visualizar localmente

```bash
python -m http.server 8080 -d dist
```

Para probar desde otro dispositivo en la misma red puedes usar la IP local del equipo y permitir el puerto 8080 en el firewall.

## 8. Desplegar

Sube **el contenido de la carpeta `dist/`** a la raíz pública del hosting. El servidor debe:

- Servir `index.html` dentro de cada directorio.
- Entregar `/404.html` como página de error.
- Mantener las rutas con barra final o redirigir de forma consistente.
- Servir `.webmanifest`, `.xml`, `.svg`, `.js` y `.css` con tipos MIME correctos.

Antes del despliegue cambia `settings.siteUrl`, que actualmente usa el dominio reservado `https://mimosenior.example`. El build utiliza ese valor para canonical, Open Graph, sitemap y robots.

## 9. Reemplazar placeholders

Los PNG actuales son placeholders locales. Reemplázalos con fotografías dignas, positivas y coherentes con el cuidado, evitando imágenes de sufrimiento. Conserva las dimensiones/proporciones indicadas para evitar cambios de diseño.

## 10. Agregar dirección y horario posteriormente

En `business` existen los campos:

```json
"address": "",
"hours": {}
```

No se muestran mientras estén vacíos. Al añadirlos, actualiza la plantilla o sección de contacto que deba representarlos y amplía `src/utils/seo.js` para incorporarlos al JSON-LD. No publiques información no confirmada.

## Analítica

La función `trackEvent(eventName, eventData)` registra eventos en `window.mimoEvents`. Si más adelante habilitas `settings.analytics.enabled`, también utiliza el nombre de capa configurado. La entrega no incluye identificadores reales ni carga plataformas externas.

## Privacidad de formularios

Los formularios no se envían a un servidor. Preparan un resumen local y abren WhatsApp. Los borradores se conservan temporalmente en `sessionStorage`; la preferencia de tema se guarda en `localStorage`.
