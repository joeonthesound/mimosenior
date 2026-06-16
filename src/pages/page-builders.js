import { renderFamilyForm } from '../templates/forms.js';
import { renderFaq, renderFinalCta, renderHero, renderSection } from '../templates/sections.js';

export function buildPageBody(data, language, routeKey) {
  const page = data.content[language].pages[routeKey];
  let content = renderHero(data, language, page);

  if (routeKey === 'privacy') {
    content += `<div class="container legal-layout">${page.sections.map(section => renderSection(data,language,section)).join('')}</div>`;
  } else {
    content += (page.sections || []).map(section => renderSection(data,language,section)).join('');
  }

  const alreadyHasFamilyForm = (page.sections || []).some(section => section.kind === 'familyForm');
  if (page.formVariant === 'family' && !alreadyHasFamilyForm) {
    const title = language === 'es' ? 'Prepara tu solicitud de cotización' : 'Prepare your quotation request';
    const eyebrow = language === 'es' ? 'Formulario por pasos' : 'Step-by-step form';
    content += `<section class="section" id="formulario"><div class="container form-container"><div class="section-heading"><p class="eyebrow">${eyebrow}</p><h2>${title}</h2></div>${renderFamilyForm(data,language,`${routeKey}-family-form`)}</div></section>`;
  }
  content += renderFaq(data,language,page);
  content += renderFinalCta(data,language,routeKey);
  return content;
}
