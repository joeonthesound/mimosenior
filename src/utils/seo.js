import { getImage, getRoute } from './data.js';

export function buildCanonical(data, routeKey, language) {
  return new URL(getRoute(data, routeKey, language), data.settings.siteUrl).toString();
}

export function buildSeo(data, routeKey, language, page) {
  const seo = data.seo[language][routeKey];
  const canonical = buildCanonical(data, routeKey, language);
  const image = new URL(getImage(data, page.imageKey || 'ogDefault'), data.settings.siteUrl).toString();
  return { ...seo, canonical, image };
}

export function buildSchemas(data, routeKey, language, page) {
  const siteUrl = data.settings.siteUrl;
  const canonical = buildCanonical(data, routeKey, language);
  const home = new URL(getRoute(data, 'home', language), siteUrl).toString();
  const labels = data.navigation.labels[language];
  const global = data.content[language].global;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': organizationId,
      name: data.business.name,
      url: siteUrl,
      foundingDate: String(data.business.foundedYear),
      areaServed: { '@type': 'Country', name: data.business.country },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: data.business.whatsapp.display,
        availableLanguage: ['Spanish', 'English']
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': websiteId,
      url: siteUrl,
      name: data.settings.siteName,
      publisher: { '@id': organizationId },
      inLanguage: language
    },
    {
      '@context': 'https://schema.org',
      '@type': page.type === 'privacy' ? 'WebPage' : 'WebPage',
      '@id': `${canonical}#webpage`,
      url: canonical,
      name: data.seo[language][routeKey].title,
      description: data.seo[language][routeKey].description,
      isPartOf: { '@id': websiteId },
      about: { '@id': organizationId },
      inLanguage: language
    }
  ];

  if (routeKey !== 'home') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: global.home, item: home },
        { '@type': 'ListItem', position: 2, name: labels[routeKey], item: canonical }
      ]
    });
  }

  const faqItems = page.faqGroups
    ? page.faqGroups.flatMap(group => group.items)
    : (page.faqs || []);
  if (faqItems.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a }
      }))
    });
  }

  if (routeKey === 'products') {
    const catalog = page.sections.find(section => section.kind === 'productCatalog');
    if (catalog) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: catalog.title,
        itemListElement: catalog.items.map((item, index) => ({
          '@type': 'OfferCatalog',
          position: index + 1,
          name: item.title,
          description: item.text
        }))
      });
    }
  }

  if (['diapers', 'guide'].includes(routeKey)) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: page.title,
      description: page.lead,
      dateModified: data.settings.buildDate,
      author: { '@id': organizationId },
      publisher: { '@id': organizationId },
      mainEntityOfPage: canonical,
      inLanguage: language
    });
  }

  return schemas;
}
