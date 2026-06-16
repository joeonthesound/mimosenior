# Mimo Senior — guía completa de administración y personalización

Sitio web estático, bilingüe y mobile-first para Mimo Senior. El proyecto está diseñado para que la mayor parte del contenido pueda actualizarse desde un único archivo JSON, sin depender de un CMS, una base de datos o un framework.

> **Regla principal:** edita los archivos fuente y después ejecuta `node build.mjs`.  
> No edites directamente la carpeta `dist/`, porque se elimina y se vuelve a generar en cada build.

---

## Índice

1. [Tecnologías utilizadas](#1-tecnologías-utilizadas)
2. [Cómo funciona la arquitectura](#2-cómo-funciona-la-arquitectura)
3. [Estructura de archivos](#3-estructura-de-archivos)
4. [Requisitos y puesta en marcha](#4-requisitos-y-puesta-en-marcha)
5. [Qué archivo modificar según el cambio](#5-qué-archivo-modificar-según-el-cambio)
6. [Administración de `site-data.json`](#6-administración-de-site-datajson)
7. [Modificar textos y traducciones](#7-modificar-textos-y-traducciones)
8. [Modificar páginas y secciones](#8-modificar-páginas-y-secciones)
9. [Modificar el Home](#9-modificar-el-home)
10. [Modificar encabezado, menú y logo](#10-modificar-encabezado-menú-y-logo)
11. [Modificar el footer](#11-modificar-el-footer)
12. [Modificar colores, temas y tipografía](#12-modificar-colores-temas-y-tipografía)
13. [Modificar imágenes, favicon y Open Graph](#13-modificar-imágenes-favicon-y-open-graph)
14. [Modificar WhatsApp](#14-modificar-whatsapp)
15. [Modificar formularios](#15-modificar-formularios)
16. [Modificar la calculadora](#16-modificar-la-calculadora)
17. [SEO, metadatos y datos estructurados](#17-seo-metadatos-y-datos-estructurados)
18. [Agregar una página nueva](#18-agregar-una-página-nueva)
19. [Agregar un nuevo tipo de sección](#19-agregar-un-nuevo-tipo-de-sección)
20. [Analítica](#20-analítica)
21. [Accesibilidad](#21-accesibilidad)
22. [Rendimiento](#22-rendimiento)
23. [Publicación](#23-publicación)
24. [Errores frecuentes](#24-errores-frecuentes)
25. [Flujo recomendado con Git](#25-flujo-recomendado-con-git)
26. [Lista de comprobación antes de publicar](#26-lista-de-comprobación-antes-de-publicar)

---

## 1. Tecnologías utilizadas

El proyecto utiliza exclusivamente tecnologías web estándar:

- **HTML5 semántico** para el contenido prerenderizado.
- **CSS3 nativo** para diseño, responsive, temas y componentes.
- **JavaScript Vanilla con módulos ES** para interacciones.
- **JSON** como fuente central de textos, rutas, traducciones y configuración.
- **Node.js 20 o superior** para generar el sitio estático.
- **SVG local** para iconos sencillos.
- **`localStorage`** para recordar el tema.
- **`sessionStorage`** para conservar temporalmente formularios.

No utiliza:

- React, Vue, Angular, Svelte, Astro o Next.js.
- Bootstrap o Tailwind.
- jQuery.
- CMS.
- Base de datos.
- Dependencias npm de producción.
- Renderizado completo del contenido en el navegador.
- Fuentes externas obligatorias.

El resultado final es una carpeta `dist/` con archivos HTML, CSS, JavaScript, imágenes, sitemap, robots y manifest listos para subir a un hosting.

---

## 2. Cómo funciona la arquitectura

El flujo del proyecto es:

```text
data/site-data.json
        +
src/templates/
src/pages/
src/utils/
assets/
img/
        ↓
    build.mjs
        ↓
      dist/
```

### Fuente de verdad

`data/site-data.json` contiene:

- Datos de la empresa.
- Número de WhatsApp.
- Rutas.
- Navegación.
- Contenido español e inglés.
- SEO.
- Formularios.
- Mensajes de WhatsApp.
- Referencias de imágenes.
- Opciones generales.

### Generación

`build.mjs`:

1. Lee el JSON.
2. Valida que cada ruta tenga contenido y SEO en ambos idiomas.
3. Genera HTML estático.
4. Copia `assets/` e `img/`.
5. Genera `sitemap.xml`.
6. Genera `robots.txt`.
7. Genera `manifest.webmanifest`.
8. Genera páginas 404.
9. Escribe todo dentro de `dist/`.

### Interactividad en el navegador

Los scripts de `assets/js/` agregan:

- Menú móvil.
- Cambio de tema.
- Formularios por pasos.
- Calculadora.
- Apertura de WhatsApp.
- Copia de resúmenes.
- Registro básico de eventos.

El contenido principal ya existe en el HTML, incluso si JavaScript está desactivado.

---

## 3. Estructura de archivos

```text
mimo-senior/
├── README.md
├── AUDIT.md
├── package.json
├── build.mjs
│
├── data/
│   └── site-data.json
│
├── src/
│   ├── pages/
│   │   └── page-builders.js
│   │
│   ├── templates/
│   │   ├── layout.js
│   │   ├── header.js
│   │   ├── footer.js
│   │   ├── breadcrumbs.js
│   │   ├── sections.js
│   │   └── forms.js
│   │
│   └── utils/
│       ├── data.js
│       ├── html.js
│       └── seo.js
│
├── assets/
│   ├── css/
│   │   └── styles.css
│   └── js/
│       ├── app.js
│       ├── analytics.js
│       ├── calculator.js
│       ├── forms.js
│       ├── navigation.js
│       ├── theme.js
│       └── whatsapp.js
│
├── img/
│   ├── favicon.svg
│   ├── img.png
│   ├── img1.png
│   ├── ...
│   └── img12.png
│
└── dist/
    ├── index.html
    ├── en/
    ├── assets/
    ├── img/
    ├── sitemap.xml
    ├── robots.txt
    ├── manifest.webmanifest
    └── 404.html
```

### Responsabilidad de cada carpeta

| Ruta | Función |
|---|---|
| `data/site-data.json` | Configuración y contenido administrable |
| `src/pages/` | Decide cómo se ensambla una página |
| `src/templates/` | Genera bloques HTML reutilizables |
| `src/utils/` | Rutas, imágenes, escape HTML y SEO |
| `assets/css/` | Apariencia visual |
| `assets/js/` | Interacciones del navegador |
| `img/` | Imágenes fuente |
| `dist/` | Resultado final; no se edita manualmente |

---

## 4. Requisitos y puesta en marcha

### Requisito

Instala **Node.js 20 o superior**.

Comprueba la instalación:

```cmd
node -v
```

Debe devolver algo similar a:

```text
v20.x.x
```

No es necesario ejecutar `npm install`, porque el sitio no tiene dependencias npm de producción.

### Generar el sitio

Desde la carpeta raíz:

```cmd
node build.mjs
```

También puedes usar:

```cmd
npm run build
```

Cada ejecución elimina y reconstruye `dist/`.

### Visualizar en Windows sin Python

```cmd
npx --yes serve dist -l 8080
```

Abre:

```text
http://localhost:8080
```

Detén el servidor con:

```text
Ctrl + C
```

### Visualizar con Python, cuando esté instalado

```cmd
python -m http.server 8080 -d dist
```

### Sobre `npm run serve`

El `package.json` original puede tener:

```json
"serve": "python -m http.server 8080 -d dist"
```

Si el equipo no tiene Python, puedes reemplazarlo por:

```json
"serve": "npx --yes serve dist -l 8080"
```

Después podrás ejecutar:

```cmd
npm run serve
```

> Abrir `dist/index.html` con doble clic no es la forma recomendada. Los módulos JavaScript funcionan correctamente mediante un servidor local.

---

## 5. Qué archivo modificar según el cambio

| Cambio | Archivo principal |
|---|---|
| Textos del sitio | `data/site-data.json` |
| Traducciones | `data/site-data.json` |
| Número de WhatsApp | `data/site-data.json` |
| Mensajes de WhatsApp | `data/site-data.json` |
| URLs de páginas | `data/site-data.json` |
| Títulos y descriptions SEO | `data/site-data.json` |
| Orden del menú | `data/site-data.json` |
| Campos y opciones de formularios | `data/site-data.json` y `src/templates/forms.js` |
| Colores | `assets/css/styles.css` |
| Tipografía | `assets/css/styles.css` |
| Espaciados, tarjetas y botones | `assets/css/styles.css` |
| Imágenes | `img/` y `data/site-data.json` |
| HTML de secciones | `src/templates/sections.js` |
| Ensamblado de páginas | `src/pages/page-builders.js` |
| Header | `src/templates/header.js` |
| Footer | `src/templates/footer.js` |
| `<head>`, scripts y metadatos globales | `src/templates/layout.js` |
| Datos estructurados | `src/utils/seo.js` |
| Menú móvil | `assets/js/navigation.js` |
| Tema claro/oscuro | `assets/js/theme.js` |
| Formularios en navegador | `assets/js/forms.js` |
| Calculadora | `assets/js/calculator.js` |
| WhatsApp en navegador | `assets/js/whatsapp.js` |
| Analítica | `assets/js/analytics.js` |
| Sitemap, robots, manifest y 404 | `build.mjs` |

---

## 6. Administración de `site-data.json`

Archivo:

```text
data/site-data.json
```

Estructura principal:

```json
{
  "settings": {},
  "business": {},
  "assets": {
    "images": {}
  },
  "routes": {},
  "navigation": {},
  "seo": {},
  "schemas": {},
  "content": {
    "es": {},
    "en": {}
  },
  "forms": {},
  "whatsappMessages": {
    "es": {},
    "en": {}
  }
}
```

### Reglas importantes del JSON

- Usa comillas dobles.
- No añadas comentarios.
- Separa las propiedades con comas.
- No dejes una coma después de la última propiedad.
- Conserva las mismas claves en español e inglés.
- Valida el JSON antes de generar.

Una coma incorrecta impedirá ejecutar el build.

---

### `settings`

Ejemplo:

```json
"settings": {
  "siteName": "Mimo Senior",
  "defaultLanguage": "es",
  "languages": ["es", "en"],
  "siteUrl": "https://mimosenior.example",
  "themeDefault": "light",
  "country": "Panamá",
  "countryCode": "PA",
  "buildDate": "2026-06-16",
  "analytics": {
    "enabled": false,
    "dataLayerName": "dataLayer"
  },
  "features": {
    "monthlyPlan": true,
    "institutional": true,
    "calculator": true
  }
}
```

#### Campos principales

- `siteName`: nombre global del sitio.
- `defaultLanguage`: idioma predeterminado.
- `languages`: idiomas que genera el build.
- `siteUrl`: dominio real, usado en canonical, sitemap y Open Graph.
- `themeDefault`: valor informativo; el script también respeta preferencias.
- `country`: país.
- `buildDate`: fecha de actualización de guías y sitemap.
- `analytics.enabled`: habilita el envío a una capa configurada.
- `features`: banderas preparadas para funcionalidades.

Antes de publicar cambia:

```json
"siteUrl": "https://mimosenior.example"
```

por el dominio definitivo, por ejemplo:

```json
"siteUrl": "https://mimosenior.com"
```

No agregues una barra al final del dominio.

---

### `business`

Ejemplo:

```json
"business": {
  "name": "Mimo Senior",
  "foundedYear": 2018,
  "country": "Panamá",
  "serviceArea": "Panamá",
  "whatsapp": {
    "display": "+507 6200-2765",
    "number": "50762002765"
  },
  "email": "",
  "address": "",
  "hours": {},
  "social": {}
}
```

- `name`: nombre comercial.
- `foundedYear`: año de inicio.
- `country`: país usado también en datos estructurados.
- `serviceArea`: área general de servicio.
- `whatsapp.display`: número visible.
- `whatsapp.number`: solo dígitos, con código de país.
- `email`: mantener vacío si no debe mostrarse.
- `address`: no inventar información.
- `hours`: horarios confirmados.
- `social`: redes sociales confirmadas.

Los campos vacíos no se muestran automáticamente a menos que una plantilla los utilice.

---

### `assets.images`

Todas las imágenes se centralizan aquí:

```json
"assets": {
  "images": {
    "homeHero": "img/img.png",
    "diapersHero": "img/img2.png",
    "ogDefault": "img/img12.png",
    "favicon": "img/favicon.svg"
  }
}
```

El contenido usa apuntadores:

```json
"imageKey": "homeHero"
```

No repitas rutas como `img/img.png` dentro de cada página.

---

### `routes`

Relaciona una clave interna con sus URLs:

```json
"routes": {
  "home": {
    "es": "/",
    "en": "/en/"
  },
  "contact": {
    "es": "/contacto/",
    "en": "/en/contact/"
  }
}
```

Las URLs deben:

- Comenzar con `/`.
- Terminar con `/`.
- Ser únicas.
- Tener equivalente en ambos idiomas.

---

### `navigation`

Controla el orden y las etiquetas del menú:

```json
"navigation": {
  "order": [
    "home",
    "diapers",
    "products",
    "monthly",
    "institutions",
    "guide",
    "about",
    "faq",
    "contact"
  ],
  "labels": {
    "es": {},
    "en": {}
  }
}
```

Para cambiar el orden, mueve las claves en `order`.

Para ocultar una página del menú, quita su clave de `order`. La página seguirá existiendo y podrá abrirse por URL.

---

### `seo`

Cada página necesita título y description en ambos idiomas:

```json
"seo": {
  "es": {
    "home": {
      "title": "Título SEO",
      "description": "Descripción SEO."
    }
  },
  "en": {
    "home": {
      "title": "SEO title",
      "description": "SEO description."
    }
  }
}
```

La clave debe coincidir con la clave de `routes` y `content.pages`.

---

### `content`

El contenido se divide por idioma:

```json
"content": {
  "es": {
    "global": {},
    "pages": {}
  },
  "en": {
    "global": {},
    "pages": {}
  }
}
```

- `global`: textos compartidos.
- `pages`: contenido de cada página.

---

### `forms`

Contiene etiquetas, opciones, errores y pasos:

```json
"forms": {
  "es": {
    "common": {},
    "labels": {},
    "options": {},
    "steps": []
  },
  "en": {}
}
```

---

### `whatsappMessages`

Contiene mensajes según el botón o contexto:

```json
"whatsappMessages": {
  "es": {
    "homeQuote": "Hola...",
    "contact": "Hola..."
  },
  "en": {
    "homeQuote": "Hello...",
    "contact": "Hello..."
  }
}
```

---

## 7. Modificar textos y traducciones

### Textos globales

Español:

```text
content.es.global
```

Inglés:

```text
content.en.global
```

Aquí están textos como:

- Botones globales.
- Etiquetas de calculadora.
- Títulos de preguntas frecuentes.
- CTA final.
- Texto legal del footer.
- Nombres de productos.

### Textos de una página

Ejemplo del Home:

```text
content.es.pages.home
content.en.pages.home
```

Ejemplo de Contacto:

```text
content.es.pages.contact
content.en.pages.contact
```

### Regla bilingüe

Cuando cambies contenido en español, revisa también su equivalente en inglés.

No uses atributos como:

```html
data-i18n="..."
```

El proyecto no traduce el contenido principal en el navegador. Cada idioma se prerenderiza durante el build.

---

## 8. Modificar páginas y secciones

Cada página suele tener:

```json
{
  "type": "home",
  "eyebrow": "Texto pequeño",
  "title": "Título principal",
  "lead": "Introducción",
  "imageKey": "homeHero",
  "imageAlt": "Descripción de la imagen",
  "primaryCta": {},
  "secondaryCta": {},
  "sections": [],
  "faqs": [],
  "formVariant": "family"
}
```

### Hero

El hero se genera desde:

- `eyebrow`
- `title`
- `lead`
- `imageKey`
- `imageAlt`
- `primaryCta`
- `secondaryCta`
- `updated`, cuando existe

### Orden de secciones

El orden del array determina el orden visual:

```json
"sections": [
  { "kind": "needSelector" },
  { "kind": "grid" },
  { "kind": "split" }
]
```

Mover un objeto cambia la posición de la sección.

Eliminar un objeto elimina la sección.

### Tipos de sección disponibles

| `kind` | Uso |
|---|---|
| `grid` | Tarjetas informativas |
| `needSelector` | Selector de necesidades enlazado a WhatsApp |
| `split` | Imagen y contenido en dos columnas |
| `steps` | Proceso paso a paso |
| `highlight` | Bloque destacado con CTA |
| `comparison` | Tabla comparativa |
| `measurement` | Guía de medición |
| `calculator` | Calculadora de consumo |
| `notice` | Aviso breve |
| `productCatalog` | Catálogo por categorías |
| `wizard` | Asistente para elegir |
| `institutionForm` | Formulario institucional |
| `familyForm` | Formulario familiar |
| `contactCard` | Tarjeta de contacto |
| `legal` | Contenido de política o texto legal |

### Propiedades habituales

```json
{
  "kind": "grid",
  "id": "categorias",
  "eyebrow": "Productos",
  "title": "Título",
  "intro": "Texto introductorio",
  "items": []
}
```

El `id`:

- Debe ser único en la página.
- No debe contener espacios.
- Puede usarse como ancla: `#categorias`.

---

### CTA hacia una página

```json
"cta": {
  "label": "Ver productos",
  "route": "products"
}
```

Con ancla:

```json
"cta": {
  "label": "Ir al formulario",
  "route": "contact",
  "anchor": "#formulario"
}
```

### CTA hacia WhatsApp

```json
"cta": {
  "label": "Solicitar cotización",
  "context": "homeQuote"
}
```

La clave `context` debe existir en:

```text
whatsappMessages.es
whatsappMessages.en
```

---

## 9. Modificar el Home

### Cambiar contenido

Edita:

```text
data/site-data.json
```

Busca:

```text
content.es.pages.home
content.en.pages.home
```

Ahí puedes cambiar:

- Hero.
- Botones.
- Necesidades.
- Categorías.
- Orientación.
- Pasos.
- Plan mensual.
- Confianza.
- FAQ.
- Formulario.

### Cambiar el orden

Mueve los objetos dentro de:

```json
"sections": []
```

### Cambiar la estructura HTML

El Home utiliza plantillas compartidas en:

```text
src/templates/sections.js
```

La página completa se ensambla en:

```text
src/pages/page-builders.js
```

Una modificación hecha en una función compartida puede afectar varias páginas.

Ejemplo: cambiar `renderGrid()` modificará todos los bloques con:

```json
"kind": "grid"
```

### Agregar una sección exclusiva del Home

La opción preferida es:

1. Crear un nuevo `kind`.
2. Crear su función en `sections.js`.
3. Agregarlo únicamente al array `sections` del Home.

Evita escribir textos directamente en `page-builders.js` si deben poder editarse desde JSON.

---

## 10. Modificar encabezado, menú y logo

Archivo:

```text
src/templates/header.js
```

Aquí se generan:

- Logo.
- Nombre Mimo Senior.
- Menú principal.
- Selector de idioma.
- Botón de tema.
- Botón de menú móvil.
- CTA de cotización.
- Barra inferior móvil.

### Cambiar orden del menú

No edites `header.js`. Cambia:

```text
navigation.order
```

en `site-data.json`.

### Cambiar etiquetas del menú

Edita:

```text
navigation.labels.es
navigation.labels.en
```

### Cambiar el icono de marca

El icono actual es un SVG inline dentro de `header.js` y `footer.js`.

Si modificas el SVG, actualízalo en ambos archivos o crea una función reutilizable para evitar duplicación.

### Cambiar el nombre visible

Actualmente el logo contiene texto escrito en la plantilla:

```html
<strong>Mimo</strong>
<small>Senior</small>
```

Si quieres administrarlo desde JSON, reemplázalo por valores derivados de `data.business.name` o agrega propiedades específicas como:

```json
"brandPrimary": "Mimo",
"brandSecondary": "Senior"
```

---

## 11. Modificar el footer

Archivo:

```text
src/templates/footer.js
```

Contenido administrable desde JSON:

```text
content.es.global.footerSummary
content.en.global.footerSummary
content.es.global.footerLegal
content.en.global.footerLegal
business.whatsapp
```

### Agregar crédito del desarrollador

Primero agrega en los textos globales:

```json
"footerCredit": "Sitio desarrollado por"
```

Y en inglés:

```json
"footerCredit": "Site developed by"
```

Después, dentro de `.footer-bottom`, usa:

```js
<div class="container footer-bottom">
  <p>© ${year} ${escapeHtml(data.business.name)}. ${escapeHtml(global.footerLegal)}</p>

  <p class="footer-credit">
    <span>${escapeHtml(global.footerCredit)}</span>
    <a
      href="https://josuethacevedo.online"
      target="_blank"
      rel="noopener noreferrer"
    >JoeCodex</a>
  </p>
</div>
```

Agrega a `assets/css/styles.css`:

```css
.footer-bottom p {
  margin-bottom: 0;
}

.footer-credit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: .35rem;
  margin-top: .65rem;
}

.footer-credit a {
  color: var(--color-brand-800);
  font-weight: 800;
  text-decoration: none;
}

.footer-credit a:hover {
  color: var(--color-accent-hover);
  text-decoration: underline;
}
```

---

## 12. Modificar colores, temas y tipografía

Archivo:

```text
assets/css/styles.css
```

### Tema claro

Las variables del tema claro están en:

```css
:root {
  /* variables */
}
```

### Tema oscuro

Las variables equivalentes están en:

```css
html[data-theme="dark"] {
  /* variables */
}
```

### Paleta actual

```css
:root {
  --color-brand-950: #0c3345;
  --color-brand-900: #124a62;
  --color-brand-800: #1c6889;
  --color-brand-700: #2d8cbe;
  --color-brand-200: #b8dce8;
  --color-brand-100: #e1f0f5;
  --color-brand-050: #f2f8f6;

  --color-accent: #59c749;
  --color-accent-hover: #2f7f29;
  --color-accent-soft: #e6f6df;
  --color-on-accent: #102a33;

  --color-milk: #fffdf1;
  --color-background: var(--color-milk);
  --color-surface: #f7f4e7;
  --color-text: #172b33;
  --color-text-muted: #53656c;
  --color-border: #d9d8c8;
}
```

### Variables más importantes

| Variable | Controla |
|---|---|
| `--color-background` | Fondo general |
| `--color-surface` | Tarjetas y formularios |
| `--color-text` | Texto normal |
| `--color-text-muted` | Texto secundario |
| `--color-brand-*` | Escala azul |
| `--color-accent` | Botones verdes |
| `--color-on-accent` | Texto sobre botón verde |
| `--color-border` | Bordes |
| `--color-success` | Estados positivos |
| `--color-warning` | Avisos |
| `--color-error` | Errores |
| `--color-milk` | Sustituto del blanco puro |
| `--color-final-cta-*` | Bloque final de llamada a la acción |

### CTA final

No uses directamente:

```css
color: #fff;
background: var(--color-brand-900);
```

porque en modo oscuro la escala `brand` se vuelve clara.

Usa variables específicas:

```css
.highlight,
.final-cta .container {
  color: var(--color-final-cta-text);
  background: var(--color-final-cta-background);
}
```

### Contraste en botones verdes

El verde Mantis no debe llevar texto blanco. Usa:

```css
.button-primary {
  color: var(--color-on-accent);
  background: var(--color-accent);
}
```

### Cambiar tipografía

Busca:

```css
--font-sans:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

La palabra `Inter` no descarga una fuente. Solo la usa si está instalada; de lo contrario utiliza la fuente del sistema.

Evita fuentes remotas si no son necesarias.

### Cambiar ancho máximo

```css
--container: 74rem;
```

### Cambiar altura del header

```css
--header-height: 4.75rem;
```

### Cambiar radios

```css
--radius-sm: .75rem;
--radius-md: 1.25rem;
--radius-lg: 2rem;
```

### Cambiar sombras

```css
--shadow-sm: ...;
--shadow-md: ...;
```

### Breakpoints responsive

Están al final del CSS:

```css
@media (min-width: 38rem) {}
@media (min-width: 55rem) {}
@media (min-width: 70rem) {}
```

El diseño base es móvil. Las reglas de escritorio amplían la interfaz.

### Otros colores que debes revisar

Al cambiar la marca, revisa también:

1. `src/templates/layout.js`

```html
<meta name="theme-color" content="#173f43">
```

2. `build.mjs`, dentro del manifest:

```js
background_color: '#fcfaf6',
theme_color: '#173f43',
```

Actualiza estos valores para que coincidan con la nueva paleta.

---

## 13. Modificar imágenes, favicon y Open Graph

### Sustituir una imagen conservando el nombre

Reemplaza el archivo dentro de:

```text
img/
```

Por ejemplo:

```text
img/img.png
```

Después ejecuta el build.

### Cambiar el nombre o formato

1. Guarda el archivo nuevo en `img/`.
2. Cambia su referencia en:

```text
assets.images
```

Ejemplo:

```json
"homeHero": "img/home-hero.webp"
```

3. Mantén:

```json
"imageKey": "homeHero"
```

en el contenido.

### Imágenes actuales

| Clave | Uso |
|---|---|
| `homeHero` | Hero del inicio |
| `homeNeeds` | Necesidades |
| `diapersHero` | Página de pañales |
| `productsHero` | Productos |
| `guideHero` | Guía |
| `monthlyPlanHero` | Plan mensual |
| `institutionsHero` | Instituciones |
| `aboutHero` | Nosotros |
| `familyCare` | Contenido familiar |
| `caregiverSupport` | Apoyo a cuidadores |
| `bedProtection` | Protección de cama |
| `contactSupport` | Contacto |
| `ogDefault` | Compartir en redes |
| `favicon` | Icono del navegador |

### Textos alternativos

Cada idioma debe tener su propio `imageAlt`.

Ejemplo:

```json
"imageAlt": "Cuidadora conversando con una adulta mayor"
```

No uses textos como:

```text
imagen1
foto
hero
```

Describe la imagen de forma breve y útil.

### Dimensiones

Las plantillas declaran dimensiones para evitar saltos de diseño.

- Hero: `720 × 600`
- Imágenes split: `640 × 520`
- Open Graph recomendado: `1200 × 630`

Si cambias la proporción, revisa:

```text
src/templates/sections.js
assets/css/styles.css
```

### Favicon

Archivo:

```text
img/favicon.svg
```

Referencia:

```json
"favicon": "img/favicon.svg"
```

### Open Graph

La imagen se toma normalmente de la imagen principal de cada página. Para una imagen general usa:

```json
"ogDefault": "img/img12.png"
```

---

## 14. Modificar WhatsApp

### Número

Edita una sola fuente:

```text
data/site-data.json
```

Busca:

```json
"whatsapp": {
  "display": "+507 6200-2765",
  "number": "50762002765"
}
```

- `display`: formato humano.
- `number`: solo dígitos, incluido el código de país.

Ejemplo:

```json
"whatsapp": {
  "display": "+507 6000-0000",
  "number": "50760000000"
}
```

No escribas manualmente el número en plantillas.

### Mensajes

Edita:

```text
whatsappMessages.es
whatsappMessages.en
```

Ejemplo:

```json
"homeQuote": "Hola, visité el sitio web..."
```

### Relacionar un botón con un mensaje

En JSON:

```json
"cta": {
  "label": "Cotizar ahora",
  "context": "homeQuote"
}
```

En HTML generado:

```html
<a data-whatsapp-context="homeQuote">Cotizar ahora</a>
```

### Archivos responsables

- `src/templates/sections.js`: genera enlaces iniciales.
- `src/templates/header.js`: CTA del menú y barra móvil.
- `src/templates/footer.js`: contacto del footer.
- `assets/js/whatsapp.js`: abre WhatsApp y copia mensajes.
- `src/templates/layout.js`: entrega configuración mínima al navegador.

### Agregar un contexto nuevo

1. Agrega el mensaje en español.
2. Agrega el mensaje en inglés.
3. Usa la misma clave en el CTA.

Ejemplo:

```json
"whatsappMessages": {
  "es": {
    "specialCampaign": "Hola, deseo información sobre..."
  },
  "en": {
    "specialCampaign": "Hello, I would like information about..."
  }
}
```

Después:

```json
"cta": {
  "label": "Consultar",
  "context": "specialCampaign"
}
```

---

## 15. Modificar formularios

### Archivos involucrados

| Archivo | Función |
|---|---|
| `data/site-data.json` | Etiquetas, opciones, pasos y mensajes |
| `src/templates/forms.js` | HTML de formularios |
| `assets/js/forms.js` | Validación, pasos, resumen y almacenamiento |
| `assets/js/whatsapp.js` | Envío del resumen a WhatsApp |

### Tipos de formulario

- Familiar.
- Institucional.
- Guía para elegir.

### Cambiar etiquetas

Edita:

```text
forms.es.labels
forms.en.labels
```

### Cambiar opciones

Edita:

```text
forms.es.options
forms.en.options
```

Ejemplo:

```json
"frequency": [
  "Compra puntual",
  "Semanal",
  "Quincenal",
  "Mensual",
  "Estoy evaluando"
]
```

### Cambiar nombres de pasos

Edita:

```text
forms.es.steps
forms.en.steps
forms.es.institutionSteps
forms.en.institutionSteps
forms.es.wizardSteps
forms.en.wizardSteps
```

### Cambiar errores y mensajes

Edita:

```text
forms.es.common
forms.en.common
```

### Agregar un campo nuevo

Agregar un campo requiere más que modificar JSON:

1. Agrega la etiqueta en ambos idiomas.
2. Agrega sus opciones si es un `select`, radio o checkbox.
3. Agrega el campo en `src/templates/forms.js`.
4. Asegúrate de que tenga atributo `name`.
5. Revisa `assets/js/forms.js`.
6. Confirma que el resumen incluye el campo.
7. Revisa validación y condicionales.
8. Prueba volver atrás y avanzar.
9. Prueba restauración desde `sessionStorage`.
10. Prueba el mensaje final de WhatsApp.

### Campos condicionales

La lógica está en:

```js
updateConditionalFields(form)
```

dentro de:

```text
assets/js/forms.js
```

Actualmente muestra información adicional según:

- Relación institucional.
- Talla desconocida.
- Movilidad o múltiples pacientes.

Si cambias el texto exacto de una opción utilizada para activar una condición, revisa también esta lógica.

### Privacidad

Los formularios:

- No envían datos a un servidor.
- Preparan un resumen.
- Abren WhatsApp.
- Guardan un borrador temporal en `sessionStorage`.
- Eliminan el borrador después de finalizar.
- Incluyen honeypot básico.

No solicites:

- Diagnósticos.
- Expedientes clínicos.
- Información médica innecesaria.

---

## 16. Modificar la calculadora

### Textos

Edita:

```text
content.es.global.calculatorLabels
content.en.global.calculatorLabels
```

### HTML y límites

Archivo:

```text
src/templates/sections.js
```

Función:

```js
renderCalculator()
```

Ahí puedes cambiar:

- Valores predeterminados.
- `min`.
- `max`.
- `step`.
- Estructura del resultado.

### Cálculo

Archivo:

```text
assets/js/calculator.js
```

Fórmula:

```js
unidadesPorDia * pacientes * dias
```

Resultados:

- Semanal.
- Quincenal.
- 30 días.
- Periodo seleccionado.

### Mensaje de WhatsApp

Contexto:

```text
whatsappMessages.es.calculator
whatsappMessages.en.calculator
```

No agregues precios a la calculadora si no existe una fuente de precios real y actualizada.

---

## 17. SEO, metadatos y datos estructurados

### SEO por página

Edita:

```text
seo.es
seo.en
```

Cada página necesita:

```json
{
  "title": "Título único",
  "description": "Descripción única"
}
```

### Dominio

Edita:

```text
settings.siteUrl
```

Este valor alimenta:

- Canonical.
- `hreflang`.
- Open Graph.
- Sitemap.
- Robots.
- Datos estructurados.

### Fecha de actualización

Edita:

```text
settings.buildDate
```

Formato:

```text
AAAA-MM-DD
```

### `<head>`

Archivo:

```text
src/templates/layout.js
```

Incluye:

- `<title>`.
- Meta description.
- Canonical.
- `hreflang`.
- Open Graph.
- Twitter Cards.
- Manifest.
- Favicon.
- CSS.
- JSON-LD.
- Configuración de runtime.
- JavaScript principal.

### Datos estructurados

Archivo:

```text
src/utils/seo.js
```

Genera:

- `LocalBusiness`.
- `WebSite`.
- `WebPage`.
- `BreadcrumbList`.
- `FAQPage`.
- `OfferCatalog`.
- `Article`.

No agregues:

- Reseñas ficticias.
- Calificaciones inventadas.
- Precios falsos.
- Disponibilidad no comprobada.
- `MedicalClinic`.
- `Hospital`.
- `Physician`.

### Dirección y horario

Cuando estén confirmados:

1. Completa `business.address`.
2. Completa `business.hours`.
3. Muestra la información en la página de contacto.
4. Actualiza `src/utils/seo.js`.
5. Usa propiedades válidas de Schema.org.
6. Regenera y valida el JSON-LD.

---

## 18. Agregar una página nueva

Ejemplo: agregar una página de entregas con clave `delivery`.

### 1. Agrega las rutas

```json
"delivery": {
  "es": "/entregas/",
  "en": "/en/delivery/"
}
```

### 2. Agrega etiquetas

```json
"navigation": {
  "labels": {
    "es": {
      "delivery": "Entregas"
    },
    "en": {
      "delivery": "Delivery"
    }
  }
}
```

### 3. Decide si aparece en el menú

Agrega `delivery` a:

```json
"order": []
```

### 4. Agrega SEO

```json
"seo": {
  "es": {
    "delivery": {
      "title": "Entregas | Mimo Senior",
      "description": "Información sobre coordinación de entregas."
    }
  },
  "en": {
    "delivery": {
      "title": "Delivery | Mimo Senior",
      "description": "Information about delivery coordination."
    }
  }
}
```

### 5. Agrega contenido español

```json
"delivery": {
  "type": "standard",
  "eyebrow": "Coordinación",
  "title": "Entregas",
  "lead": "Conoce cómo coordinamos la entrega de tu pedido.",
  "imageKey": "contactSupport",
  "imageAlt": "Pedido preparado para entrega",
  "primaryCta": {
    "label": "Consultar por WhatsApp",
    "context": "contact"
  },
  "sections": [],
  "faqs": []
}
```

### 6. Agrega contenido inglés

Usa la misma estructura y clave.

### 7. Revisa breadcrumbs

El sistema usa automáticamente la etiqueta de navegación.

### 8. Ejecuta

```cmd
node build.mjs
```

### 9. Verifica

Debes obtener:

```text
dist/entregas/index.html
dist/en/delivery/index.html
```

### Eliminar una página

Quita la clave de:

- `routes`.
- `navigation.order`.
- `navigation.labels.es`.
- `navigation.labels.en`.
- `seo.es`.
- `seo.en`.
- `content.es.pages`.
- `content.en.pages`.

Después ejecuta el build.

---

## 19. Agregar un nuevo tipo de sección

Supongamos que quieres crear `stats`.

### 1. Crea el contenido JSON

```json
{
  "kind": "stats",
  "id": "datos",
  "title": "Datos importantes",
  "items": [
    {
      "value": "2018",
      "label": "Año de inicio"
    }
  ]
}
```

No inventes cifras comerciales que no estén confirmadas.

### 2. Crea la función

En:

```text
src/templates/sections.js
```

Ejemplo:

```js
function renderStats(section) {
  return `
    <section class="section" id="${escapeHtml(section.id)}">
      <div class="container">
        <h2>${escapeHtml(section.title)}</h2>
        <div class="stats-grid">
          ${section.items.map(item => `
            <article class="stat-card">
              <strong>${escapeHtml(item.value)}</strong>
              <span>${escapeHtml(item.label)}</span>
            </article>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}
```

### 3. Registra el `kind`

Dentro de `renderSection()`:

```js
case 'stats':
  return renderStats(section);
```

### 4. Agrega CSS

En:

```text
assets/css/styles.css
```

### 5. Traduce

Agrega la sección en español e inglés.

### 6. Regenera y prueba

```cmd
node build.mjs
```

---

## 20. Analítica

Archivo:

```text
assets/js/analytics.js
```

Función:

```js
trackEvent(eventName, eventData, config)
```

La entrega puede registrar eventos en:

```js
window.mimoEvents
```

Eventos previstos:

- `whatsapp_click`
- `quote_started`
- `form_step_completed`
- `form_abandoned`
- `form_completed`
- `institutional_quote`
- `calculator_used`
- `monthly_plan_click`
- `product_click`
- `language_changed`
- `theme_changed`

Configuración:

```json
"analytics": {
  "enabled": false,
  "dataLayerName": "dataLayer"
}
```

No agregues un identificador de analítica inventado.

Antes de conectar una plataforma externa:

- Define consentimiento.
- Actualiza la política de privacidad.
- Evita cargar scripts antes de autorización cuando la ley aplicable lo requiera.
- Prueba que el sitio siga funcionando si el script externo falla.

---

## 21. Accesibilidad

Mantén estas reglas al personalizar:

- Un solo `<h1>` por página.
- Orden lógico de `h2` y `h3`.
- Contraste suficiente.
- Foco visible.
- Botones y enlaces con nombres claros.
- Campos con `<label>`.
- Errores asociados al campo.
- Tamaño táctil mínimo aproximado de 44 × 44 px.
- No depender solo del color.
- `alt` útil en imágenes.
- No eliminar el enlace “Saltar al contenido”.
- No eliminar `aria-current`.
- No eliminar `aria-expanded` del menú.
- Mantener funcionamiento por teclado.
- Mantener cierre del menú con Escape.
- Respetar `prefers-reduced-motion`.
- No agregar ARIA cuando HTML nativo ya resuelve la función.

Cuando cambies colores, revisa especialmente:

- Texto sobre verde.
- Texto sobre azul.
- Texto secundario.
- Estados hover.
- Foco.
- Errores.
- Tema oscuro.

---

## 22. Rendimiento

Para conservar una carga rápida:

- Optimiza imágenes.
- Usa WebP o AVIF cuando sea posible.
- No agregues librerías para tareas pequeñas.
- No uses videos automáticos.
- Evita carruseles.
- Evita fondos de varios megabytes.
- No cargues fuentes externas sin necesidad.
- Mantén JavaScript modular.
- No conviertas el sitio en SPA.
- No cargues el JSON completo en el navegador.
- No uses `innerHTML` con contenido del usuario.
- Mantén el contenido prerenderizado.

### Imágenes

Recomendaciones:

- Hero: idealmente menos de 250 KB.
- Imágenes secundarias: idealmente menos de 150 KB.
- Open Graph: optimizada, aunque puede ser mayor.
- Mantén dimensiones reales cercanas a las declaradas.

---

## 23. Publicación

### Qué se publica

Sube **el contenido interno** de:

```text
dist/
```

a la raíz pública del hosting.

No es obligatorio publicar:

- `src/`
- `data/`
- `build.mjs`
- `README.md`
- `package.json`

aunque puedes conservarlos en el repositorio.

### Configuración del servidor

Debe:

- Servir `index.html` automáticamente.
- Respetar directorios con barra final.
- Servir `/404.html`.
- Servir `.js` como JavaScript.
- Servir `.css` como CSS.
- Servir `.xml`.
- Servir `.webmanifest`.
- Servir `.svg`.
- Usar HTTPS.

### Antes de desplegar

1. Cambia `settings.siteUrl`.
2. Cambia `settings.buildDate`.
3. Ejecuta `node build.mjs`.
4. Prueba ambas versiones.
5. Revisa enlaces.
6. Revisa WhatsApp.
7. Revisa el tema.
8. Revisa formularios.
9. Revisa `sitemap.xml`.
10. Publica `dist/`.

---

## 24. Errores frecuentes

### “No se encontró Python”

Usa:

```cmd
npx --yes serve dist -l 8080
```

No es un error del sitio.

---

### “Unexpected token” al ejecutar el build

Normalmente indica JSON inválido.

Revisa:

- Comas.
- Comillas.
- Llaves.
- Corchetes.
- Coma final.

---

### El cambio no aparece

Comprueba que:

1. Modificaste el archivo fuente correcto.
2. Guardaste el archivo.
3. Ejecutaste:

```cmd
node build.mjs
```

4. Recargaste el navegador.
5. No estás viendo una versión antigua en caché.

---

### El cambio desapareció

Probablemente editaste un archivo dentro de:

```text
dist/
```

Edita el archivo fuente correspondiente y vuelve a generar.

---

### WhatsApp abre con el número anterior

Revisa:

```text
business.whatsapp
```

Después vuelve a ejecutar el build.

---

### Un botón abre un mensaje incorrecto

Revisa:

- El valor de `context`.
- `whatsappMessages.es`.
- `whatsappMessages.en`.

---

### Una imagen no aparece

Revisa:

1. El archivo existe dentro de `img/`.
2. La ruta en `assets.images` comienza con `img/`.
3. La clave `imageKey` existe.
4. Mayúsculas y minúsculas coinciden.
5. Ejecutaste el build.

---

### Una página no se genera

Cada clave debe existir en:

- `routes`.
- `content.es.pages`.
- `content.en.pages`.
- `seo.es`.
- `seo.en`.

El build se detiene si falta alguno.

---

### El tema oscuro muestra texto claro sobre fondo claro

No uses directamente una variable `brand` como fondo sólido si en el tema oscuro esa misma variable cambia a un tono claro.

Crea variables semánticas:

```css
--color-solid-brand
--color-on-solid-brand
--color-final-cta-background
--color-final-cta-text
```

---

### El menú no aparece en escritorio

Revisa que no hayas cambiado los breakpoints o las reglas de:

```css
.primary-nav
.menu-toggle
.nav-close
```

---

### Los enlaces funcionan mal al abrir con doble clic

Levanta un servidor local. No uses `file://`.

---

## 25. Flujo recomendado con Git

### Revisar cambios

```cmd
git status
```

### Añadir cambios

Para un cambio concreto:

```cmd
git add data/site-data.json assets/css/styles.css
```

Para todos los cambios:

```cmd
git add .
```

### Crear commit

Ejemplos:

```cmd
git commit -m "update site content and translations"
```

```cmd
git commit -m "update brand colors and dark theme"
```

```cmd
git commit -m "update WhatsApp contact number"
```

```cmd
git commit -m "add bilingual developer credit to footer"
```

```cmd
git commit -m "add new delivery page"
```

### Subir

```cmd
git push
```

### Flujo completo recomendado

```cmd
node build.mjs
git status
git add .
git commit -m "update Mimo Senior website"
git push
```

> Decide si el repositorio guardará `dist/`. Algunos hostings lo necesitan; otros construyen el sitio automáticamente. Mantén una sola estrategia para evitar diferencias entre fuente y producción.

---

## 26. Lista de comprobación antes de publicar

### Configuración

- [ ] `settings.siteUrl` usa el dominio real.
- [ ] `settings.buildDate` está actualizada.
- [ ] El número de WhatsApp es correcto.
- [ ] La dirección y horario, si aparecen, están confirmados.

### Contenido

- [ ] Español revisado.
- [ ] Inglés revisado.
- [ ] No hay texto de relleno.
- [ ] No hay testimonios inventados.
- [ ] No hay precios ficticios.
- [ ] No hay afirmaciones médicas.
- [ ] No hay disponibilidad inventada.

### Navegación

- [ ] Todos los enlaces abren.
- [ ] El selector de idioma conserva la página equivalente.
- [ ] El menú móvil abre y cierra.
- [ ] Escape cierra el menú.
- [ ] El botón atrás funciona.

### Diseño

- [ ] Tema claro revisado.
- [ ] Tema oscuro revisado.
- [ ] No hay texto claro sobre fondo claro.
- [ ] Botones verdes usan texto oscuro.
- [ ] El sitio funciona desde 320 px.
- [ ] El zoom al 200 % mantiene la funcionalidad.

### Formularios

- [ ] Los pasos avanzan y retroceden.
- [ ] Los errores aparecen correctamente.
- [ ] Los datos no se pierden al regresar.
- [ ] Los campos institucionales aparecen.
- [ ] La talla desconocida muestra ayuda.
- [ ] El resumen se copia.
- [ ] WhatsApp recibe el resumen.
- [ ] No se solicitan diagnósticos.

### Calculadora

- [ ] Los resultados son correctos.
- [ ] El CTA incluye los resultados.
- [ ] Se muestra el aviso de estimación.

### SEO

- [ ] Cada página tiene un title único.
- [ ] Cada página tiene description.
- [ ] Canonical correcto.
- [ ] `hreflang` correcto.
- [ ] Open Graph correcto.
- [ ] Favicon visible.
- [ ] `sitemap.xml` usa el dominio real.
- [ ] `robots.txt` usa el dominio real.
- [ ] JSON-LD válido.

### Imágenes

- [ ] No quedan placeholders.
- [ ] Todas tienen `alt`.
- [ ] Están optimizadas.
- [ ] No provocan saltos de diseño.
- [ ] Open Graph mide aproximadamente 1200 × 630.

### Build y publicación

- [ ] `node build.mjs` termina sin errores.
- [ ] No hay errores en consola.
- [ ] Se probó mediante servidor local.
- [ ] Se publicó el contenido correcto de `dist/`.

---

## Resumen operativo

Para la mayoría de actualizaciones:

1. Edita `data/site-data.json`.
2. Si el cambio es visual, edita `assets/css/styles.css`.
3. Si cambia la estructura HTML, edita `src/templates/`.
4. Ejecuta:

```cmd
node build.mjs
```

5. Prueba:

```cmd
npx --yes serve dist -l 8080
```

6. Guarda en Git:

```cmd
git add .
git commit -m "update Mimo Senior website"
git push
```
