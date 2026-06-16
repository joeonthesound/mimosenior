import { trackEvent } from './analytics.js';

let runtimeConfig = null;

function showToast(message) {
  let toast = document.querySelector('[data-toast]');
  if (!toast) {
    toast = document.createElement('div');
    toast.dataset.toast = '';
    toast.setAttribute('role', 'status');
    Object.assign(toast.style, {
      position: 'fixed', left: '50%', bottom: '5.5rem', zIndex: '999', transform: 'translateX(-50%)',
      maxWidth: 'min(90vw,34rem)', padding: '.8rem 1rem', borderRadius: '.7rem', color: '#fff', background: '#173f43', boxShadow: '0 12px 30px rgba(0,0,0,.25)'
    });
    document.body.append(toast);
  }
  toast.textContent = message;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.remove(), 3500);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    const copied = document.execCommand('copy');
    area.remove();
    return copied;
  }
}

export function buildWhatsAppUrl(contextKey, formData = {}) {
  if (!runtimeConfig) return '#';
  const base = runtimeConfig.messages[contextKey] || runtimeConfig.messages.contact || '';
  const extra = typeof formData === 'string'
    ? formData
    : Object.entries(formData).filter(([,value]) => value !== '' && value != null).map(([key,value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('\n');
  const message = [base, extra].filter(Boolean).join('\n\n');
  return `https://wa.me/${runtimeConfig.whatsapp.number}?text=${encodeURIComponent(message)}`;
}

export async function openWhatsApp(contextKey, formData = {}, options = {}) {
  const url = buildWhatsAppUrl(contextKey, formData);
  const fullMessage = decodeURIComponent(url.split('?text=')[1] || '');
  const popup = window.open(url, '_blank');
  if (popup) popup.opener = null;
  trackEvent('whatsapp_click', { context: contextKey, route: runtimeConfig.routeKey }, runtimeConfig.analytics);
  if (!popup) {
    await copyText(fullMessage);
    showToast(options.blockedMessage || runtimeConfig.forms.common.whatsappBlocked);
    return false;
  }
  return true;
}

export function initWhatsApp(config) {
  runtimeConfig = config;
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-whatsapp-context]');
    if (!link || link.hasAttribute('data-form-submit-owned') || link.hasAttribute('data-calculator-whatsapp')) return;
    event.preventDefault();
    const extra = link.dataset.extraMessage || '';
    openWhatsApp(link.dataset.whatsappContext, extra);
    const context = link.dataset.whatsappContext;
    if (context === 'institutional') trackEvent('institutional_quote', { route: config.routeKey }, config.analytics);
    if (context === 'monthlyPlan') trackEvent('monthly_plan_click', { route: config.routeKey }, config.analytics);
    if (context.startsWith('product')) trackEvent('product_click', { context, route: config.routeKey }, config.analytics);
  });
}
