import { trackEvent } from './analytics.js';

export function initTheme(config) {
  const button = document.querySelector('[data-theme-toggle]');
  if (!button) return;
  const lightIcon = button.querySelector('[data-theme-icon-light]');
  const darkIcon = button.querySelector('[data-theme-icon-dark]');

  function apply(theme, persist = false) {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    const isDark = theme === 'dark';
    lightIcon.hidden = isDark;
    darkIcon.hidden = !isDark;
    button.setAttribute('aria-label', isDark ? button.dataset.labelLight : button.dataset.labelDark);
    button.setAttribute('aria-pressed', String(isDark));
    if (persist) { try { localStorage.setItem('mimo-theme', theme); } catch { /* storage may be unavailable */ } }
  }

  apply(document.documentElement.dataset.theme || 'light');
  button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next, true);
    trackEvent('theme_changed', { theme: next }, config.analytics);
  });
}
