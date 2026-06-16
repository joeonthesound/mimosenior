import { escapeHtml } from '../utils/html.js';
import { getRoute } from '../utils/data.js';

export function renderBreadcrumbs(data, language, routeKey) {
  if (routeKey === 'home') return '';
  const global = data.content[language].global;
  const label = data.navigation.labels[language][routeKey];
  return `<nav class="breadcrumbs container" aria-label="${escapeHtml(global.breadcrumbs)}"><ol><li><a href="${getRoute(data,'home',language)}">${escapeHtml(global.home)}</a></li><li aria-current="page">${escapeHtml(label)}</li></ol></nav>`;
}
