export function getContent(data, language, path) {
  const parts = path.split('.').filter(Boolean);
  let current = data.content[language];
  for (const part of parts) {
    if (current == null || !(part in current)) return undefined;
    current = current[part];
  }
  return current;
}

export function getImage(data, imageKey) {
  const value = data.assets?.images?.[imageKey];
  if (!value) return '';
  return `/${value.replace(/^\//, '')}`;
}

export function getRoute(data, routeKey, language) {
  return data.routes?.[routeKey]?.[language] || '/';
}

export function getWhatsAppMessage(data, language, contextKey) {
  return data.whatsappMessages?.[language]?.[contextKey]
    || data.whatsappMessages?.[language]?.contact
    || '';
}

export function getEquivalentRoute(data, routeKey, language) {
  const alternate = language === 'es' ? 'en' : 'es';
  return getRoute(data, routeKey, alternate);
}
