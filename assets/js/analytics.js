export function trackEvent(eventName, eventData = {}, config = {}) {
  const payload = {
    event: eventName,
    ...eventData,
    timestamp: new Date().toISOString()
  };
  window.mimoEvents = window.mimoEvents || [];
  window.mimoEvents.push(payload);
  if (config?.enabled) {
    const layerName = config.dataLayerName || 'dataLayer';
    window[layerName] = window[layerName] || [];
    window[layerName].push(payload);
  }
}
