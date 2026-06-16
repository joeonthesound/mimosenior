import { escapeHtml } from '../utils/html.js';
import { getRoute, getWhatsAppMessage } from '../utils/data.js';

export function renderFooter(data, language) {
  const global = data.content[language].global;
  const labels = data.navigation.labels[language];
  const year = new Date().getUTCFullYear();
  const contactUrl = `https://wa.me/${data.business.whatsapp.number}?text=${encodeURIComponent(getWhatsAppMessage(data, language, 'contact'))}`;
  return `
<footer class="site-footer">
  <div class="container footer-grid">
    <div>
      <a class="brand brand-footer" href="${getRoute(data, 'home', language)}"><span class="brand-mark" aria-hidden="true"><svg viewBox="0 0 44 44"><path d="M22 38C12 31 6 25 6 17a9 9 0 0 1 16-5 9 9 0 0 1 16 5c0 8-6 14-16 21Z"/><path d="M22 12v18M13 21h18"/></svg></span><span><strong>Mimo</strong><small>Senior</small></span></a>
      <p>${escapeHtml(global.footerSummary)}</p>
      <a class="footer-whatsapp" href="${contactUrl}" data-whatsapp-context="contact">${escapeHtml(data.business.whatsapp.display)}</a>
    </div>
    <div>
      <h2>${language === 'es' ? 'Explora' : 'Explore'}</h2>
      <ul class="footer-links">
        ${['diapers','products','guide','monthly','institutions'].map(key => `<li><a href="${getRoute(data,key,language)}">${escapeHtml(labels[key])}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <h2>${language === 'es' ? 'Información' : 'Information'}</h2>
      <ul class="footer-links">
        ${['about','faq','contact','privacy'].map(key => `<li><a href="${getRoute(data,key,language)}">${escapeHtml(labels[key])}</a></li>`).join('')}
      </ul>
    </div>
  </div>
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
</footer>`;
}
