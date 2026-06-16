import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildPageBody } from './src/pages/page-builders.js';
import { renderLayout } from './src/templates/layout.js';
import { slugToOutputPath } from './src/utils/html.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, 'dist');
const data = JSON.parse(await readFile(path.join(root, 'data/site-data.json'), 'utf8'));

function assertData() {
  const routeKeys = Object.keys(data.routes);
  for (const language of data.settings.languages) {
    for (const routeKey of routeKeys) {
      if (!data.routes[routeKey]?.[language]) throw new Error(`Missing ${language} route for ${routeKey}`);
      if (!data.content[language]?.pages?.[routeKey]) throw new Error(`Missing ${language} content for ${routeKey}`);
      if (!data.seo[language]?.[routeKey]) throw new Error(`Missing ${language} SEO for ${routeKey}`);
    }
  }
  for (const [key, value] of Object.entries(data.assets.images)) {
    if (!value.startsWith('img/')) throw new Error(`Image ${key} must be stored under img/.`);
  }
}

async function writeRoute(route, html) {
  const relative = slugToOutputPath(route);
  const output = path.join(dist, relative);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, html, 'utf8');
}

function absolute(route) {
  return new URL(route, data.settings.siteUrl).toString();
}

function sitemap() {
  const entries = Object.keys(data.routes).flatMap(routeKey => data.settings.languages.map(language => {
    const route = data.routes[routeKey][language];
    const alternates = data.settings.languages.map(alt => `<xhtml:link rel="alternate" hreflang="${alt}" href="${absolute(data.routes[routeKey][alt])}"/>`).join('');
    return `<url><loc>${absolute(route)}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(data.routes[routeKey].es)}"/><lastmod>${data.settings.buildDate}</lastmod></url>`;
  }));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries.join('')}</urlset>`;
}

function render404(language = 'es') {
  const isEs = language === 'es';
  const home = data.routes.home[language];
  const contact = data.routes.contact[language];
  return `<!doctype html><html lang="${language}" data-theme="light"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${isEs ? 'Página no encontrada' : 'Page not found'} | Mimo Senior</title><link rel="stylesheet" href="/assets/css/styles.css"></head><body><main id="main-content"><section class="hero"><div class="container narrow"><p class="eyebrow">404</p><h1>${isEs ? 'No encontramos esta página' : 'We could not find this page'}</h1><p class="hero-lead">${isEs ? 'La dirección puede haber cambiado o estar incompleta.' : 'The address may have changed or may be incomplete.'}</p><div class="hero-actions"><a class="button button-primary" href="${home}">${isEs ? 'Volver al inicio' : 'Return home'}</a><a class="button button-secondary" href="${contact}">${isEs ? 'Contactar' : 'Contact us'}</a></div></div></section></main></body></html>`;
}

assertData();
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(path.join(root, 'assets'), path.join(dist, 'assets'), { recursive: true });
await cp(path.join(root, 'img'), path.join(dist, 'img'), { recursive: true });

let pageCount = 0;
for (const routeKey of Object.keys(data.routes)) {
  for (const language of data.settings.languages) {
    const body = buildPageBody(data, language, routeKey);
    const html = renderLayout(data, language, routeKey, body);
    await writeRoute(data.routes[routeKey][language], html);
    pageCount += 1;
  }
}

await writeFile(path.join(dist, '404.html'), render404('es'), 'utf8');
await mkdir(path.join(dist, 'en'), { recursive: true });
await writeFile(path.join(dist, 'en', '404.html'), render404('en'), 'utf8');
await writeFile(path.join(dist, 'sitemap.xml'), sitemap(), 'utf8');
await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${absolute('/sitemap.xml')}\n`, 'utf8');
await writeFile(path.join(dist, 'manifest.webmanifest'), JSON.stringify({
  name: 'Mimo Senior',
  short_name: 'Mimo Senior',
  description: data.seo.es.home.description,
  lang: 'es',
  start_url: '/',
  display: 'standalone',
  background_color: '#fcfaf6',
  theme_color: '#173f43',
  icons: [{ src: `/${data.assets.images.favicon}`, sizes: 'any', type: 'image/svg+xml', purpose: 'any' }]
}, null, 2), 'utf8');

console.log(`Built ${pageCount} prerendered pages in dist/.`);
if (data.settings.siteUrl.endsWith('.example')) {
  console.warn('Reminder: replace settings.siteUrl before production deployment.');
}
