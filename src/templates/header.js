import { escapeHtml } from '../utils/html.js';
import { getEquivalentRoute, getRoute, getWhatsAppMessage } from '../utils/data.js';

const icon = (name) => {
  const icons = {
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    sun: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"/></svg>',
    moon: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.8a8 8 0 0 1-11.8 7L4 20l1.2-4.1A8 8 0 1 1 20 11.8Z"/><path d="M9.2 8.6c.2 2 2.2 4 4.2 4.5.5.1 1-.5 1.4-1l1.6.8c-.3 1.3-1.2 2.1-2.5 2.2-3.4-.3-6.6-3.5-7-6.9.1-1.3.9-2.2 2.2-2.5l.8 1.7c-.6.3-1.1.8-1 1.3Z"/></svg>'
  };
  return icons[name] || '';
};

export function renderHeader(data, language, routeKey) {
  const global = data.content[language].global;
  const labels = data.navigation.labels[language];
  const nav = data.navigation.order.map(key => {
    const current = key === routeKey ? ' aria-current="page"' : '';
    return `<li><a href="${getRoute(data, key, language)}"${current}>${escapeHtml(labels[key])}</a></li>`;
  }).join('');
  const languageHref = getEquivalentRoute(data, routeKey, language);
  const wa = context => `https://wa.me/${data.business.whatsapp.number}?text=${encodeURIComponent(getWhatsAppMessage(data, language, context))}`;
  return `
<a class="skip-link" href="#main-content">${escapeHtml(global.skip)}</a>
<header class="site-header" data-site-header>
  <div class="container header-inner">
    <a class="brand" href="${getRoute(data, 'home', language)}" aria-label="${escapeHtml(data.business.name)}">
      <img
    class="brand-logo brand-logo-for-light"
    src="/${escapeHtml(data.assets.images.logoLight)}"
    width="360"
    height="96"
    alt="${escapeHtml(data.business.name)}"
  >

  <img
    class="brand-logo brand-logo-for-dark"
    src="/${escapeHtml(data.assets.images.logoDark)}"
    width="360"
    height="96"
    alt=""
    aria-hidden="true"
  >  

    </a>
    <nav class="primary-nav" id="primary-navigation" aria-label="${escapeHtml(global.menu)}" data-navigation>
      <button class="nav-close icon-button" type="button" data-menu-close aria-label="${escapeHtml(global.closeMenu)}">${icon('close')}</button>
      <ul>${nav}</ul>
      <a class="button button-primary nav-quote" href="${wa('bottomQuote')}" data-whatsapp-context="bottomQuote">${escapeHtml(global.quote)}</a>
    </nav>
    <div class="header-actions">
      <a class="language-link" href="${languageHref}" hreflang="${language === 'es' ? 'en' : 'es'}" data-track="language_changed">${escapeHtml(global.language)}</a>
      <button class="icon-button theme-toggle" type="button" data-theme-toggle data-label-light="${escapeHtml(global.themeLight)}" data-label-dark="${escapeHtml(global.themeDark)}" aria-label="${escapeHtml(global.themeDark)}">
        <span data-theme-icon-light>${icon('sun')}</span><span data-theme-icon-dark hidden>${icon('moon')}</span>
      </button>
      <button class="icon-button menu-toggle" type="button" data-menu-toggle aria-controls="primary-navigation" aria-expanded="false" aria-label="${escapeHtml(global.menu)}">${icon('menu')}</button>
    </div>
  </div>
</header>
<div class="nav-backdrop" data-nav-backdrop hidden></div>
<div class="mobile-action-bar" aria-label="${escapeHtml(global.menu)}">
  <a href="${wa('bottomWhatsapp')}" data-whatsapp-context="bottomWhatsapp">${icon('whatsapp')}<span>${escapeHtml(global.whatsapp)}</span></a>
  <a href="${wa('bottomQuote')}" data-whatsapp-context="bottomQuote">${escapeHtml(global.quote)}</a>
</div>`;
}
