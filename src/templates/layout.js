import { jsonScript } from '../utils/html.js';
import { getImage, getRoute } from '../utils/data.js';
import { buildCanonical, buildSchemas, buildSeo } from '../utils/seo.js';
import { renderBreadcrumbs } from './breadcrumbs.js';
import { renderFooter } from './footer.js';
import { renderHeader } from './header.js';

export function renderLayout(data, language, routeKey, body) {
  const page = data.content[language].pages[routeKey];
  const seo = buildSeo(data, routeKey, language, page);
  const schemas = buildSchemas(data, routeKey, language, page);
  const alternate = language === 'es' ? 'en' : 'es';
  const runtime = {
    language,
    routeKey,
    whatsapp: data.business.whatsapp,
    messages: data.whatsappMessages[language],
    forms: data.forms[language],
    analytics: data.settings.analytics,
    calculatorLabels: data.content[language].global.calculatorLabels
  };
  const themeScript = `(function(){try{var saved=localStorage.getItem('mimo-theme');var theme=saved||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=theme;document.documentElement.style.colorScheme=theme;}catch(e){document.documentElement.dataset.theme='light';}})();`;
  return `<!doctype html>
<html lang="${language}" data-theme="light">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <script>${themeScript}</script>
  <title>${seo.title}</title>
  <meta name="description" content="${seo.description}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#173f43">
  <link rel="canonical" href="${seo.canonical}">
  <link rel="alternate" hreflang="es" href="${buildCanonical(data, routeKey, 'es')}">
  <link rel="alternate" hreflang="en" href="${buildCanonical(data, routeKey, 'en')}">
  <link rel="alternate" hreflang="x-default" href="${buildCanonical(data, routeKey, 'es')}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${data.settings.siteName}">
  <meta property="og:locale" content="${language === 'es' ? 'es_PA' : 'en_US'}">
  <meta property="og:title" content="${seo.title}">
  <meta property="og:description" content="${seo.description}">
  <meta property="og:url" content="${seo.canonical}">
  <meta property="og:image" content="${seo.image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seo.title}">
  <meta name="twitter:description" content="${seo.description}">
  <meta name="twitter:image" content="${seo.image}">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" href="${getImage(data, 'favicon')}" type="image/svg+xml">
  <link rel="stylesheet" href="/assets/css/styles.css">
  ${schemas.map(schema => `<script type="application/ld+json">${jsonScript(schema)}</script>`).join('\n  ')}
  <script id="runtime-config" type="application/json">${jsonScript(runtime)}</script>
  <script type="module" src="/assets/js/app.js"></script>
</head>
<body data-route="${routeKey}" data-language="${language}">
  ${renderHeader(data,language,routeKey)}
  ${renderBreadcrumbs(data,language,routeKey)}
  <main id="main-content" tabindex="-1">${body}</main>
  ${renderFooter(data,language)}
</body>
</html>`;
}
