export function initNavigation() {
  const nav = document.querySelector('[data-navigation]');
  const toggle = document.querySelector('[data-menu-toggle]');
  const close = document.querySelector('[data-menu-close]');
  const backdrop = document.querySelector('[data-nav-backdrop]');
  if (!nav || !toggle || !backdrop) return;

  let previousFocus = null;
  const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

  function openMenu() {
    previousFocus = document.activeElement;
    nav.classList.add('is-open');
    backdrop.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
    requestAnimationFrame(() => (close || nav.querySelector(focusableSelector))?.focus());
  }

  function closeMenu({ restoreFocus = true } = {}) {
    nav.classList.remove('is-open');
    backdrop.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    if (restoreFocus) previousFocus?.focus();
  }

  toggle.addEventListener('click', () => nav.classList.contains('is-open') ? closeMenu() : openMenu());
  close?.addEventListener('click', () => closeMenu());
  backdrop.addEventListener('click', () => closeMenu());
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu({ restoreFocus: false });
  });
  document.addEventListener('keydown', event => {
    if (!nav.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = [...nav.querySelectorAll(focusableSelector)].filter(item => !item.hidden && item.offsetParent !== null);
    if (!items.length) return;
    const first = items[0];
    const last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener('resize', () => {
    if (window.matchMedia('(min-width: 55rem)').matches && nav.classList.contains('is-open')) {
      closeMenu({ restoreFocus: false });
    }
  });
}
