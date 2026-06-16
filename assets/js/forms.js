import { copyText, openWhatsApp } from './whatsapp.js';
import { trackEvent } from './analytics.js';

function cleanLabel(value = '') {
  return value.replace(/\s*\*\s*$/, '').trim();
}

function controlLabel(form, control) {
  if (control.id) {
    const label = form.querySelector(`label[for="${CSS.escape(control.id)}"]`);
    if (label) return cleanLabel(label.textContent);
  }
  const group = control.closest('fieldset.choice-group');
  const legend = group?.querySelector('legend');
  return cleanLabel(legend?.textContent || control.name);
}

function collectValues(form) {
  const rows = [];
  const handledGroups = new Set();
  [...form.elements].forEach(control => {
    if (!control.name || control.name === 'website' || control.name === 'consent' || control.disabled || ['button','submit'].includes(control.type)) return;
    if (control.type === 'checkbox') {
      if (handledGroups.has(control.name)) return;
      handledGroups.add(control.name);
      const checked = [...form.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(control.name)}"]:checked`)].map(item => item.value);
      if (checked.length) rows.push([controlLabel(form, control), checked.join(', ')]);
      return;
    }
    if (control.type === 'radio') {
      if (handledGroups.has(control.name)) return;
      handledGroups.add(control.name);
      const checked = form.querySelector(`input[type="radio"][name="${CSS.escape(control.name)}"]:checked`);
      if (checked) rows.push([controlLabel(form, checked), checked.value]);
      return;
    }
    const value = control.value.trim();
    if (value) rows.push([controlLabel(form, control), value]);
  });
  return rows;
}

function formDataForStorage(form) {
  const values = {};
  [...form.elements].forEach(control => {
    if (!control.name || control.name === 'website' || ['button','submit'].includes(control.type)) return;
    if (control.type === 'checkbox' || control.type === 'radio') {
      if (!values[control.name]) values[control.name] = [];
      if (control.checked) values[control.name].push(control.value || 'on');
    } else {
      values[control.name] = control.value;
    }
  });
  return values;
}

function restoreStoredValues(form, values) {
  Object.entries(values || {}).forEach(([name,value]) => {
    const controls = [...form.querySelectorAll(`[name="${CSS.escape(name)}"]`)];
    controls.forEach(control => {
      if (control.type === 'checkbox' || control.type === 'radio') {
        control.checked = Array.isArray(value) && value.includes(control.value || 'on');
      } else {
        control.value = value ?? '';
      }
    });
  });
}

function setFieldError(control, message = '') {
  control.setCustomValidity(message);
  control.setAttribute('aria-invalid', message ? 'true' : 'false');
  const error = control.id ? document.getElementById(`${control.id}-error`) : null;
  if (error) error.textContent = message;
  if (control.id && error) control.setAttribute('aria-describedby', error.id);
}

function validateControl(control, config) {
  if (control.disabled || control.offsetParent === null) return true;
  let message = '';
  const value = control.type === 'checkbox' ? control.checked : control.value.trim();
  if (control.required && !value) message = config.forms.common.required;
  if (!message && control.type === 'email' && value && !control.validity.valid) message = config.forms.common.invalidEmail;
  if (!message && control.type === 'tel' && value) {
    const digits = control.value.replace(/\D/g, '');
    if (digits.length < 7) message = config.forms.common.invalidPhone;
  }
  if (!message && ['number'].includes(control.type) && value && !control.validity.valid) message = config.forms.common.required;
  setFieldError(control, message);
  return !message;
}

function validateStep(step, config) {
  const controls = [...step.querySelectorAll('input,select,textarea')].filter(control => control.name !== 'website');
  let firstInvalid = null;
  controls.forEach(control => {
    if (!validateControl(control, config) && !firstInvalid) firstInvalid = control;
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function updateConditionalFields(form) {
  const relationship = form.querySelector('[id$="-relationship"]');
  const mobility = form.querySelector('[id$="-mobility"]');
  const institutionFields = form.querySelector('[data-institution-fields]');
  if (institutionFields) {
    const institutionSelected = /Geriátrico|centro de cuidado|Care home|facility/i.test(relationship?.value || '')
      || /varios pacientes|several patients/i.test(mobility?.value || '');
    institutionFields.hidden = !institutionSelected;
    institutionFields.querySelectorAll('input').forEach(input => {
      input.disabled = !institutionSelected;
      input.required = institutionSelected && /facilityName|patients/.test(input.id);
    });
  }
  const size = form.querySelector('[id$="-size"]');
  const help = form.querySelector('[data-unknown-size-help]');
  if (size && help) help.hidden = !/No la conozco|Unknown/i.test(size.value);
}

export function initForms(config) {
  document.querySelectorAll('[data-progressive-form]').forEach(form => {
    const steps = [...form.querySelectorAll('[data-form-step]')];
    const labels = [...form.querySelectorAll('[data-step-label]')];
    const progressBar = form.querySelector('[data-progress-bar]');
    const progressText = form.querySelector('[data-progress-text]');
    const status = form.querySelector('[data-form-status]');
    const summary = form.querySelector('[data-form-summary]');
    const copyButton = form.querySelector('[data-copy-summary]');
    const key = `mimo-form-draft:${form.id}`;
    let current = 0;
    let touched = false;
    let completed = false;

    form.style.setProperty('--step-count', String(steps.length));

    function setStatus(message = '') {
      if (status) status.textContent = message;
    }

    function updateSummary() {
      if (!summary) return '';
      const text = collectValues(form).map(([label,value]) => `${label}: ${value}`).join('\n');
      summary.textContent = text || '—';
      return text;
    }

    function showStep(index, focus = true) {
      current = Math.max(0, Math.min(index, steps.length - 1));
      steps.forEach((step, stepIndex) => step.hidden = stepIndex !== current);
      labels.forEach((label, labelIndex) => label.classList.toggle('is-current', labelIndex === current));
      const percent = ((current + 1) / steps.length) * 100;
      progressBar.style.width = `${percent}%`;
      progressText.textContent = config.forms.common.progress
        .replace('{current}', String(current + 1))
        .replace('{total}', String(steps.length));
      if (current === steps.length - 1) updateSummary();
      updateConditionalFields(form);
      if (focus) {
        const first = steps[current].querySelector('input:not([type="hidden"]):not([disabled]),select:not([disabled]),textarea:not([disabled]),button');
        first?.focus();
      }
    }

    function saveDraft() {
      try { sessionStorage.setItem(key, JSON.stringify(formDataForStorage(form))); } catch { /* storage may be unavailable */ }
    }

    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        restoreStoredValues(form, JSON.parse(stored));
        setStatus(config.forms.common.draftRestored);
      }
    } catch { /* ignore invalid or unavailable storage */ }
    updateConditionalFields(form);
    showStep(0, false);

    form.addEventListener('input', event => {
      if (!touched) {
        touched = true;
        trackEvent('quote_started', { variant: form.dataset.formVariant, route: config.routeKey }, config.analytics);
      }
      if (event.target.matches('input,select,textarea')) setFieldError(event.target, '');
      updateConditionalFields(form);
      saveDraft();
      if (current === steps.length - 1) updateSummary();
    });
    form.addEventListener('change', () => {
      updateConditionalFields(form);
      saveDraft();
      if (current === steps.length - 1) updateSummary();
    });

    form.addEventListener('click', async event => {
      const next = event.target.closest('[data-form-next]');
      const back = event.target.closest('[data-form-back]');
      const copy = event.target.closest('[data-copy-summary]');
      if (next) {
        if (!validateStep(steps[current], config)) return;
        trackEvent('form_step_completed', { variant: form.dataset.formVariant, step: current + 1, route: config.routeKey }, config.analytics);
        showStep(current + 1);
      }
      if (back) showStep(current - 1);
      if (copy) {
        const copied = await copyText(updateSummary());
        if (copied) setStatus(config.forms.common.copied);
      }
    });

    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (!validateStep(steps[current], config)) return;
      const honeypot = form.elements.website;
      if (honeypot?.value) {
        form.reset();
        sessionStorage.removeItem(key);
        return;
      }
      const text = updateSummary();
      const context = form.dataset.formVariant === 'institution'
        ? 'formInstitution'
        : form.dataset.formVariant === 'guide' ? 'guideResult' : 'formFamily';
      const opened = await openWhatsApp(context, text, { blockedMessage: config.forms.common.whatsappBlocked });
      completed = true;
      trackEvent('form_completed', { variant: form.dataset.formVariant, route: config.routeKey, opened }, config.analytics);
      try { sessionStorage.removeItem(key); } catch { /* ignore */ }
    });

    window.addEventListener('beforeunload', () => {
      if (touched && !completed) trackEvent('form_abandoned', { variant: form.dataset.formVariant, step: current + 1, route: config.routeKey }, config.analytics);
    });
  });
}
