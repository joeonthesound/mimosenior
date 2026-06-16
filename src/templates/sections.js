import { escapeHtml } from '../utils/html.js';
import { getImage, getRoute, getWhatsAppMessage } from '../utils/data.js';
import { renderFamilyForm, renderGuideWizard, renderInstitutionForm } from './forms.js';

function sectionHeader(section) {
  return `<div class="section-heading">${section.eyebrow ? `<p class="eyebrow">${escapeHtml(section.eyebrow)}</p>` : ''}<h2>${escapeHtml(section.title)}</h2>${section.intro ? `<p class="section-intro">${escapeHtml(section.intro)}</p>` : ''}</div>`;
}

function ctaHref(data, language, cta) {
  if (cta.context) {
    const message = getWhatsAppMessage(data, language, cta.context);
    return `https://wa.me/${data.business.whatsapp.number}?text=${encodeURIComponent(message)}`;
  }
  if (cta.route) return `${getRoute(data, cta.route, language)}${cta.anchor || ''}`;
  return cta.anchor || '#';
}

export function renderCta(data, language, cta, style = 'primary') {
  if (!cta) return '';
  const context = cta.context ? ` data-whatsapp-context="${escapeHtml(cta.context)}"` : '';
  return `<a class="button button-${style}" href="${ctaHref(data, language, cta)}"${context}>${escapeHtml(cta.label)}</a>`;
}

export function renderHero(data, language, page) {
  const image = getImage(data, page.imageKey);
  return `<section class="hero"><div class="container hero-grid"><div class="hero-copy"><p class="eyebrow">${escapeHtml(page.eyebrow)}</p><h1>${escapeHtml(page.title)}</h1><p class="hero-lead">${escapeHtml(page.lead)}</p>${page.updated ? `<p class="updated"><strong>${escapeHtml(data.content[language].global.updated)}:</strong> ${escapeHtml(page.updated)}</p>` : ''}<div class="hero-actions">${renderCta(data,language,page.primaryCta,'primary')}${renderCta(data,language,page.secondaryCta,'secondary')}</div><ul class="hero-trust"><li>${language === 'es' ? 'Orientación personalizada' : 'Personal guidance'}</li><li>${language === 'es' ? 'Cotización confirmada' : 'Confirmed quotation'}</li><li>${language === 'es' ? 'Atención en Panamá' : 'Support in Panama'}</li></ul></div><figure class="hero-media image-placeholder"><img src="${image}" width="720" height="600" alt="${escapeHtml(page.imageAlt)}" decoding="async" fetchpriority="high"><figcaption class="visually-hidden">${escapeHtml(page.imageAlt)}</figcaption></figure></div></section>`;
}

function renderGrid(data, language, section) {
  const cards = section.items.map((item,index) => {
    const link = item.route ? `<a class="card-link" href="${getRoute(data,item.route,language)}">${escapeHtml(data.content[language].global.readMore)} <span aria-hidden="true">→</span></a>` : '';
    return `<article class="card"><span class="card-number" aria-hidden="true">${String(index+1).padStart(2,'0')}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p>${link}</article>`;
  }).join('');
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<div class="card-grid">${cards}</div></div></section>`;
}

function renderNeedSelector(data, language, section) {
  const items = section.items.map(item => {
    const href = ctaHref(data,language,{context:item.context});
    return `<a class="need-card" href="${href}" data-whatsapp-context="${escapeHtml(item.context)}"><span class="need-icon" aria-hidden="true">✓</span><span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.text)}</small></span><span aria-hidden="true">→</span></a>`;
  }).join('');
  return `<section class="section section-soft" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<div class="need-grid">${items}</div></div></section>`;
}

function renderSplit(data, language, section) {
  const image = getImage(data, section.imageKey);
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container split-grid"><figure class="split-media image-placeholder"><img src="${image}" width="640" height="520" loading="lazy" decoding="async" alt="${escapeHtml(section.imageAlt)}"></figure><div class="split-copy">${sectionHeader(section)}<p>${escapeHtml(section.text)}</p>${section.bullets?.length ? `<ul class="check-list">${section.bullets.map(value=>`<li>${escapeHtml(value)}</li>`).join('')}</ul>`:''}${section.cta ? `<div class="section-actions">${renderCta(data,language,section.cta,'secondary')}</div>`:''}</div></div></section>`;
}

function renderSteps(section) {
  const items = section.items.map((item,index)=>`<li><span class="step-index">${index+1}</span><div><h3>${escapeHtml(item.title.replace(/^\d+\.\s*/,''))}</h3><p>${escapeHtml(item.text)}</p></div></li>`).join('');
  return `<section class="section section-soft" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<ol class="process-list">${items}</ol></div></section>`;
}

function renderHighlight(data, language, section) {
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container"><div class="highlight"><div><p class="eyebrow">${escapeHtml(section.eyebrow || '')}</p><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></div>${renderCta(data,language,section.cta,'light')}</div></div></section>`;
}

function renderComparison(section) {
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<div class="table-wrap"><table><thead><tr>${section.headers.map(h=>`<th scope="col">${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${section.rows.map(row=>`<tr>${row.map((cell,index)=>index===0?`<th scope="row">${escapeHtml(cell)}</th>`:`<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div><p class="table-note">${escapeHtml(section.note)}</p></div></section>`;
}

function renderMeasurement(section) {
  return `<section class="section section-soft" id="${escapeHtml(section.id)}"><div class="container narrow">${sectionHeader(section)}<p>${escapeHtml(section.text)}</p><ol class="measurement-steps">${section.steps.map((s,i)=>`<li><span>${i+1}</span>${escapeHtml(s)}</li>`).join('')}</ol><div class="notice warning"><strong>${escapeHtml(section.warning)}</strong></div></div></section>`;
}

function renderCalculator(data, language, section) {
  const l = data.content[language].global.calculatorLabels;
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<form class="calculator" data-calculator novalidate><div class="form-grid three-columns"><div class="form-field"><label for="${section.id}-per-day">${escapeHtml(l.perDay)}</label><input id="${section.id}-per-day" name="perDay" type="number" min="0" max="30" step="1" value="4" inputmode="numeric" required></div><div class="form-field"><label for="${section.id}-patients">${escapeHtml(l.patients)}</label><input id="${section.id}-patients" name="patients" type="number" min="1" max="500" step="1" value="1" inputmode="numeric" required></div><div class="form-field"><label for="${section.id}-days">${escapeHtml(l.days)}</label><input id="${section.id}-days" name="days" type="number" min="1" max="365" step="1" value="30" inputmode="numeric" required></div></div><button class="button button-secondary" type="submit">${escapeHtml(l.calculate)}</button><div class="calculator-results" data-calculator-results aria-live="polite"><div><span>${escapeHtml(l.weekly)}</span><strong data-result-weekly>28</strong></div><div><span>${escapeHtml(l.fortnight)}</span><strong data-result-fortnight>60</strong></div><div><span>${escapeHtml(l.monthly)}</span><strong data-result-monthly>120</strong></div><div><span>${escapeHtml(l.period)}</span><strong data-result-period>120</strong></div></div><p class="calculator-note">${escapeHtml(l.disclaimer)}</p><a class="button button-primary" href="https://wa.me/${data.business.whatsapp.number}" data-calculator-whatsapp data-whatsapp-context="calculator">${escapeHtml(l.cta)}</a></form></div></section>`;
}

function renderNotice(section) {
  return `<section class="section compact-section" id="${escapeHtml(section.id)}"><div class="container"><div class="notice"><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></div></div></section>`;
}

function renderProductCatalog(data, language, section) {
  const labels = data.content[language].global.productLabels;
  return `<section class="section" id="${escapeHtml(section.id)}"><div class="container">${sectionHeader(section)}<div class="product-grid">${section.items.map(item=>`<article class="product-card"><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p><dl><div><dt>${escapeHtml(labels.uses)}</dt><dd>${escapeHtml(item.uses)}</dd></div><div><dt>${escapeHtml(labels.presentations)}</dt><dd>${escapeHtml(item.presentations)}</dd></div><div><dt>${escapeHtml(labels.related)}</dt><dd>${escapeHtml(item.related)}</dd></div></dl><p class="availability">${escapeHtml(labels.availability)}</p><a class="button button-secondary" href="${ctaHref(data,language,{context:item.context})}" data-whatsapp-context="${escapeHtml(item.context)}">${escapeHtml(labels.quote)}</a></article>`).join('')}</div></div></section>`;
}

function renderContactCard(data, language, section) {
  return `<section class="section compact-section" id="${escapeHtml(section.id)}"><div class="container"><div class="contact-card"><div><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p><strong>${escapeHtml(data.business.whatsapp.display)}</strong></div><a class="button button-primary" href="${ctaHref(data,language,{context:section.context})}" data-whatsapp-context="${escapeHtml(section.context)}">${escapeHtml(data.content[language].global.whatsapp)}</a></div></div></section>`;
}

function renderLegal(section) {
  return `<section class="legal-section" id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map(p=>`<p>${escapeHtml(p)}</p>`).join('')}</section>`;
}

export function renderSection(data, language, section) {
  switch(section.kind) {
    case 'grid': return renderGrid(data,language,section);
    case 'needSelector': return renderNeedSelector(data,language,section);
    case 'split': return renderSplit(data,language,section);
    case 'steps': return renderSteps(section);
    case 'highlight': return renderHighlight(data,language,section);
    case 'comparison': return renderComparison(section);
    case 'measurement': return renderMeasurement(section);
    case 'calculator': return renderCalculator(data,language,section);
    case 'notice': return renderNotice(section);
    case 'productCatalog': return renderProductCatalog(data,language,section);
    case 'wizard': return `<section class="section" id="${escapeHtml(section.id)}"><div class="container form-container">${sectionHeader(section)}${renderGuideWizard(data,language)}</div></section>`;
    case 'institutionForm': return `<section class="section" id="${escapeHtml(section.id)}"><div class="container form-container">${sectionHeader(section)}${renderInstitutionForm(data,language)}</div></section>`;
    case 'familyForm': return `<section class="section" id="${escapeHtml(section.id)}"><div class="container form-container">${sectionHeader(section)}${renderFamilyForm(data,language)}</div></section>`;
    case 'contactCard': return renderContactCard(data,language,section);
    case 'legal': return renderLegal(section);
    default: return '';
  }
}

export function renderFaq(data, language, page) {
  const global = data.content[language].global;
  if (page.faqGroups?.length) {
    return `<section class="section" id="faq"><div class="container"><div class="section-heading"><p class="eyebrow">FAQ</p><h2>${escapeHtml(global.faqTitle)}</h2></div><div class="faq-groups">${page.faqGroups.map(group=>`<section><h3>${escapeHtml(group.title)}</h3><div class="faq-list">${group.items.map(item=>`<details><summary>${escapeHtml(item.q)}</summary><div><p>${escapeHtml(item.a)}</p></div></details>`).join('')}</div></section>`).join('')}</div></div></section>`;
  }
  if (!page.faqs?.length) return '';
  return `<section class="section section-soft" id="faq"><div class="container narrow"><div class="section-heading"><p class="eyebrow">FAQ</p><h2>${escapeHtml(global.faqTitle)}</h2></div><div class="faq-list">${page.faqs.map(item=>`<details><summary>${escapeHtml(item.q)}</summary><div><p>${escapeHtml(item.a)}</p></div></details>`).join('')}</div></div></section>`;
}

export function renderFinalCta(data, language, routeKey) {
  if (routeKey === 'privacy') return '';
  const global = data.content[language].global;
  return `<section class="section final-cta"><div class="container"><div><h2>${escapeHtml(global.finalCtaTitle)}</h2><p>${escapeHtml(global.finalCtaText)}</p></div><a class="button button-light" href="${ctaHref(data,language,{context:'contact'})}" data-whatsapp-context="contact">${escapeHtml(global.finalCtaButton)}</a></div></section>`;
}
