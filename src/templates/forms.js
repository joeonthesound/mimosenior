import { escapeHtml } from '../utils/html.js';

function optionList(values, placeholder) {
  return `<option value="">${escapeHtml(placeholder)}</option>${values.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join('')}`;
}

function field({ id, label, type = 'text', required = false, autocomplete = '', inputmode = '', placeholder = '', min, max, step }) {
  const requiredMark = required ? ' <span aria-hidden="true">*</span>' : '';
  return `<div class="form-field"><label for="${id}">${escapeHtml(label)}${requiredMark}</label><input id="${id}" name="${id}" type="${type}" ${required ? 'required' : ''} ${autocomplete ? `autocomplete="${autocomplete}"` : ''} ${inputmode ? `inputmode="${inputmode}"` : ''} ${placeholder ? `placeholder="${escapeHtml(placeholder)}"` : ''} ${min !== undefined ? `min="${min}"` : ''} ${max !== undefined ? `max="${max}"` : ''} ${step !== undefined ? `step="${step}"` : ''}><p class="field-error" id="${id}-error"></p></div>`;
}

function select({ id, label, values, required = false, placeholder }) {
  return `<div class="form-field"><label for="${id}">${escapeHtml(label)}${required ? ' <span aria-hidden="true">*</span>' : ''}</label><select id="${id}" name="${id}" ${required ? 'required' : ''}>${optionList(values, placeholder)}</select><p class="field-error" id="${id}-error"></p></div>`;
}

function checkboxes({ name, legend, values }) {
  return `<fieldset class="choice-group"><legend>${escapeHtml(legend)}</legend><div class="choice-grid">${values.map((value, index) => `<label class="choice"><input type="checkbox" name="${name}" value="${escapeHtml(value)}"><span>${escapeHtml(value)}</span></label>`).join('')}</div></fieldset>`;
}

function formShell({ id, variant, language, form, steps, body }) {
  const common = form.common;
  return `<form class="progressive-form" id="${id}" data-progressive-form data-form-variant="${variant}" data-language="${language}" novalidate>
    <div class="form-progress" aria-hidden="true"><span data-progress-bar></span></div>
    <p class="progress-text" data-progress-text>${escapeHtml(common.progress.replace('{current}','1').replace('{total}',String(steps.length)))}</p>
    <ol class="step-labels" aria-hidden="true">${steps.map((step,index) => `<li data-step-label="${index}">${escapeHtml(step)}</li>`).join('')}</ol>
    <div class="form-status" data-form-status aria-live="polite"></div>
    ${body}
    <div class="honeypot" aria-hidden="true"><label for="${id}-website">${escapeHtml(form.labels.honeypot)}</label><input id="${id}-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
  </form>`;
}

function buttons(form, isFirst = false, isLast = false) {
  return `<div class="form-actions">${!isFirst ? `<button class="button button-secondary" type="button" data-form-back>${escapeHtml(form.common.back)}</button>` : '<span></span>'}${isLast ? `<button class="button button-primary" type="submit">${escapeHtml(form.common.send)}</button>` : `<button class="button button-primary" type="button" data-form-next>${escapeHtml(form.common.next)}</button>`}</div>`;
}

export function renderFamilyForm(data, language, id = 'family-quote-form') {
  const form = data.forms[language];
  const l = form.labels;
  const o = form.options;
  const body = `
  <fieldset class="form-step" data-form-step>
    <legend>${escapeHtml(form.steps[0])}</legend>
    <div class="form-grid two-columns">
      ${field({ id:`${id}-name`, label:l.name, required:true, autocomplete:'name' })}
      ${field({ id:`${id}-phone`, label:l.phone, type:'tel', required:true, autocomplete:'tel', inputmode:'tel' })}
      ${field({ id:`${id}-email`, label:l.email, type:'email', autocomplete:'email' })}
      ${select({ id:`${id}-relationship`, label:l.relationship, values:o.relationship, required:true, placeholder:'—' })}
      ${field({ id:`${id}-deliveryArea`, label:l.deliveryArea, required:true, autocomplete:'address-level2' })}
    </div>
    <div class="conditional-fields" data-institution-fields hidden>
      <h3>${language === 'es' ? 'Datos del centro' : 'Facility details'}</h3>
      <div class="form-grid two-columns">
        ${field({ id:`${id}-facilityName`, label:l.facilityName })}
        ${field({ id:`${id}-role`, label:l.role })}
        ${field({ id:`${id}-patients`, label:l.patients, type:'number', inputmode:'numeric', min:1 })}
      </div>
    </div>
    ${buttons(form,true,false)}
  </fieldset>
  <fieldset class="form-step" data-form-step hidden>
    <legend>${escapeHtml(form.steps[1])}</legend>
    <div class="form-grid two-columns">
      ${select({ id:`${id}-mobility`, label:l.mobility, values:o.mobility, required:true, placeholder:'—' })}
      ${select({ id:`${id}-diaperType`, label:l.diaperType, values:o.diaperType, required:true, placeholder:'—' })}
      ${select({ id:`${id}-size`, label:l.size, values:o.size, required:true, placeholder:'—' })}
      ${field({ id:`${id}-dailyUse`, label:l.dailyUse, type:'number', inputmode:'numeric', min:0, max:30, step:1 })}
    </div>
    <div class="inline-notice" data-unknown-size-help hidden>${escapeHtml(form.common.unknownSizeHelp)}</div>
    ${checkboxes({ name:`${id}-additionalProducts`, legend:l.additionalProducts, values:o.products })}
    ${buttons(form,false,false)}
  </fieldset>
  <fieldset class="form-step" data-form-step hidden>
    <legend>${escapeHtml(form.steps[2])}</legend>
    <div class="form-grid two-columns">
      ${select({ id:`${id}-frequency`, label:l.frequency, values:o.frequency, required:true, placeholder:'—' })}
      <div class="form-field full-width"><label for="${id}-message">${escapeHtml(l.message)}</label><textarea id="${id}-message" name="${id}-message" rows="4"></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required><span>${escapeHtml(form.common.privacy)}</span></label>
    <div class="summary-box"><h3>${escapeHtml(form.common.summaryTitle)}</h3><p>${escapeHtml(form.common.edit)}</p><pre data-form-summary tabindex="0"></pre><button class="button button-quiet" type="button" data-copy-summary>${escapeHtml(form.common.copy)}</button></div>
    ${buttons(form,false,true)}
  </fieldset>`;
  return formShell({ id, variant:'family', language, form, steps:form.steps, body });
}

export function renderInstitutionForm(data, language, id = 'institution-quote-form') {
  const form = data.forms[language];
  const l = form.labels;
  const o = form.options;
  const body = `
  <fieldset class="form-step" data-form-step>
    <legend>${escapeHtml(form.institutionSteps[0])}</legend>
    <div class="form-grid two-columns">
      ${field({ id:`${id}-facilityName`, label:l.facilityName, required:true, autocomplete:'organization' })}
      ${field({ id:`${id}-name`, label:l.name, required:true, autocomplete:'name' })}
      ${field({ id:`${id}-role`, label:l.role, required:true, autocomplete:'organization-title' })}
      ${field({ id:`${id}-phone`, label:l.phone, type:'tel', required:true, autocomplete:'tel', inputmode:'tel' })}
      ${field({ id:`${id}-email`, label:l.email, type:'email', autocomplete:'email' })}
      ${field({ id:`${id}-patients`, label:l.patients, type:'number', inputmode:'numeric', min:1, required:true })}
    </div>${buttons(form,true,false)}
  </fieldset>
  <fieldset class="form-step" data-form-step hidden>
    <legend>${escapeHtml(form.institutionSteps[1])}</legend>
    <div class="form-grid two-columns">
      ${field({ id:`${id}-sizes`, label:l.sizes, required:true })}
      ${field({ id:`${id}-monthlyUse`, label:l.monthlyUse, type:'number', inputmode:'numeric', min:0 })}
      ${field({ id:`${id}-deliveryArea`, label:l.deliveryArea, required:true, autocomplete:'address-level2' })}
    </div>
    ${checkboxes({ name:`${id}-products`, legend:l.products, values:[language === 'es' ? 'Pañales con adhesivos' : 'Tab-style diapers', language === 'es' ? 'Pañales tipo pants' : 'Pull-up diapers', ...o.products] })}
    ${buttons(form,false,false)}
  </fieldset>
  <fieldset class="form-step" data-form-step hidden>
    <legend>${escapeHtml(form.institutionSteps[2])}</legend>
    <div class="form-grid two-columns">
      ${select({ id:`${id}-frequency`, label:l.frequency, values:o.frequency, required:true, placeholder:'—' })}
      <div class="form-field full-width"><label for="${id}-message">${escapeHtml(l.message)}</label><textarea id="${id}-message" name="${id}-message" rows="4"></textarea></div>
    </div>
    <label class="consent"><input type="checkbox" name="consent" required><span>${escapeHtml(form.common.privacy)}</span></label>
    <div class="summary-box"><h3>${escapeHtml(form.common.summaryTitle)}</h3><p>${escapeHtml(form.common.edit)}</p><pre data-form-summary tabindex="0"></pre><button class="button button-quiet" type="button" data-copy-summary>${escapeHtml(form.common.copy)}</button></div>
    ${buttons(form,false,true)}
  </fieldset>`;
  return formShell({ id, variant:'institution', language, form, steps:form.institutionSteps, body });
}

export function renderGuideWizard(data, language, id = 'choosing-guide') {
  const form = data.forms[language];
  const l = form.labels;
  const o = form.options;
  const currentNeed = language === 'es'
    ? ['Primera compra','Quiero cambiar el formato','La talla actual no ajusta bien','Quiero organizar el consumo','Otra necesidad']
    : ['First purchase','I want to change format','The current size does not fit well','I want to organise usage','Another need'];
  const who = language === 'es'
    ? ['Un familiar','Una persona a mi cuidado','Para mí','Varios pacientes','Un centro de cuidado']
    : ['A family member','Someone I care for','Myself','Several patients','A care facility'];
  const step = (index, content) => `<fieldset class="form-step" data-form-step ${index ? 'hidden' : ''}><legend>${escapeHtml(form.wizardSteps[index])}</legend>${content}${buttons(form,index===0,index===form.wizardSteps.length-1)}</fieldset>`;
  const body = [
    step(0, select({id:`${id}-who`,label:form.wizardSteps[0],values:who,required:true,placeholder:'—'})),
    step(1, select({id:`${id}-mobility`,label:l.mobility,values:o.mobility,required:true,placeholder:'—'})),
    step(2, select({id:`${id}-need`,label:form.wizardSteps[2],values:currentNeed,required:true,placeholder:'—'})),
    step(3, select({id:`${id}-diaperType`,label:l.diaperType,values:o.diaperType,required:true,placeholder:'—'})),
    step(4, `${select({id:`${id}-size`,label:l.size,values:o.size,required:true,placeholder:'—'})}<div class="inline-notice" data-unknown-size-help hidden>${escapeHtml(form.common.unknownSizeHelp)}</div>`),
    step(5, field({id:`${id}-dailyUse`,label:l.dailyUse,type:'number',inputmode:'numeric',min:0,max:30,step:1})),
    step(6, field({id:`${id}-deliveryArea`,label:l.deliveryArea,required:true,autocomplete:'address-level2'})),
    step(7, `<div class="form-grid two-columns">${field({id:`${id}-name`,label:l.name,required:true,autocomplete:'name'})}${field({id:`${id}-phone`,label:l.phone,type:'tel',required:true,autocomplete:'tel',inputmode:'tel'})}</div>`),
    step(8, `<label class="consent"><input type="checkbox" name="consent" required><span>${escapeHtml(form.common.privacy)}</span></label><div class="summary-box"><h3>${escapeHtml(form.common.summaryTitle)}</h3><p>${escapeHtml(form.common.edit)}</p><pre data-form-summary tabindex="0"></pre><button class="button button-quiet" type="button" data-copy-summary>${escapeHtml(form.common.copy)}</button></div>`)
  ].join('');
  return formShell({ id, variant:'guide', language, form, steps:form.wizardSteps, body });
}
