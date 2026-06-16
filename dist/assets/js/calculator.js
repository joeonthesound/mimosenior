import { openWhatsApp } from './whatsapp.js';
import { trackEvent } from './analytics.js';

export function initCalculators(config) {
  document.querySelectorAll('[data-calculator]').forEach(calculator => {
    const fields = {
      perDay: calculator.elements.perDay,
      patients: calculator.elements.patients,
      days: calculator.elements.days
    };
    const result = {
      weekly: calculator.querySelector('[data-result-weekly]'),
      fortnight: calculator.querySelector('[data-result-fortnight]'),
      monthly: calculator.querySelector('[data-result-monthly]'),
      period: calculator.querySelector('[data-result-period]')
    };
    const cta = calculator.querySelector('[data-calculator-whatsapp]');

    function calculate(track = false) {
      const perDay = Math.max(0, Number(fields.perDay.value) || 0);
      const patients = Math.max(1, Number(fields.patients.value) || 1);
      const days = Math.max(1, Number(fields.days.value) || 1);
      const values = {
        weekly: Math.ceil(perDay * patients * 7),
        fortnight: Math.ceil(perDay * patients * 15),
        monthly: Math.ceil(perDay * patients * 30),
        period: Math.ceil(perDay * patients * days)
      };
      Object.entries(values).forEach(([key,value]) => result[key].textContent = String(value));
      const labels = config.calculatorLabels;
      cta.dataset.extraMessage = [
        `${labels.perDay}: ${perDay}`,
        `${labels.patients}: ${patients}`,
        `${labels.days}: ${days}`,
        `${labels.weekly}: ${values.weekly}`,
        `${labels.fortnight}: ${values.fortnight}`,
        `${labels.monthly}: ${values.monthly}`,
        `${labels.period}: ${values.period}`
      ].join('\n');
      if (track) trackEvent('calculator_used', { perDay, patients, days, result: values.period, route: config.routeKey }, config.analytics);
      return values;
    }

    calculator.addEventListener('submit', event => {
      event.preventDefault();
      if (!calculator.reportValidity()) return;
      calculate(true);
    });
    Object.values(fields).forEach(field => field.addEventListener('input', () => calculate(false)));
    cta.addEventListener('click', event => {
      event.preventDefault();
      calculate(true);
      openWhatsApp('calculator', cta.dataset.extraMessage);
    });
    calculate(false);
  });
}
