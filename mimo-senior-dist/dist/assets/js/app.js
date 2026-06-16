import { initCalculators } from './calculator.js';
import { initForms } from './forms.js';
import { initNavigation } from './navigation.js';
import { initTheme } from './theme.js';
import { initWhatsApp } from './whatsapp.js';
import { trackEvent } from './analytics.js';

function readConfig() {
  const node = document.getElementById('runtime-config');
  if (!node) return null;
  try { return JSON.parse(node.textContent); }
  catch (error) {
    console.error('Mimo Senior: invalid runtime configuration.', error);
    return null;
  }
}

const config = readConfig();
if (config) {
  initNavigation();
  initTheme(config);
  initWhatsApp(config);
  initForms(config);
  initCalculators(config);
  document.querySelectorAll('[data-track="language_changed"]').forEach(link => {
    link.addEventListener('click', () => trackEvent('language_changed', { from: config.language, route: config.routeKey }, config.analytics));
  });
}
