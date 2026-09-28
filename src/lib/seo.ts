// Builds the Yoast-style <head> tags for generated pages (posts and archives).
const SITE = 'https://riscstar.com';
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const ROBOTS = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const mime = (src: string) => ({ png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', webp: 'image/webp', avif: 'image/avif', svg: 'image/svg+xml' } as Record<string, string>)[src.split('.').pop()!.toLowerCase()] ?? '';

export function postHead(o: {
  url: string; title: string; description?: string; published: Date; modified?: Date;
  image?: string; imageWidth?: number; imageHeight?: number; author: string; readingMinutes: number;
}) {
  const abs = SITE + o.url;
  const img = o.image ? SITE + o.image : '';
  const tags = [
    `<meta name="robots" content="${ROBOTS}">`,
    o.description && `<meta name="description" content="${esc(o.description)}">`,
    `<link rel="canonical" href="${abs}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${esc(o.title)}">`,
    o.description && `<meta property="og:description" content="${esc(o.description)}">`,
    `<meta property="og:url" content="${abs}">`,
    `<meta property="og:site_name" content="RISCstar">`,
    `<meta property="article:publisher" content="https://www.linkedin.com/company/riscstar-solutions/">`,
    `<meta property="article:published_time" content="${o.published.toISOString().replace('.000Z', '+00:00')}">`,
    o.modified && `<meta property="article:modified_time" content="${o.modified.toISOString().replace('.000Z', '+00:00')}">`,
    img && `<meta property="og:image" content="${img}">`,
    img && o.imageWidth && `<meta property="og:image:width" content="${o.imageWidth}">`,
    img && o.imageHeight && `<meta property="og:image:height" content="${o.imageHeight}">`,
    img && mime(img) && `<meta property="og:image:type" content="${mime(img)}">`,
    `<meta name="author" content="${esc(o.author)}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:creator" content="@riscstar30536">`,
    `<meta name="twitter:site" content="@riscstar30536">`,
    `<meta name="twitter:label1" content="Written by">`,
    `<meta name="twitter:data1" content="${esc(o.author)}">`,
    `<meta name="twitter:label2" content="Est. reading time">`,
    `<meta name="twitter:data2" content="${o.readingMinutes} minute${o.readingMinutes === 1 ? '' : 's'}">`,
  ];
  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article', '@id': abs + '#article', isPartOf: { '@id': abs },
        author: { name: o.author, '@type': 'Person' }, headline: o.title.replace(/ - RISCstar$/, ''),
        datePublished: o.published.toISOString(), dateModified: (o.modified ?? o.published).toISOString(),
        mainEntityOfPage: { '@id': abs }, publisher: { '@id': SITE + '/#organization' },
        ...(img ? { image: { '@id': abs + '#primaryimage' }, thumbnailUrl: img } : {}), inLanguage: 'en-US',
      },
      { '@type': 'WebPage', '@id': abs, url: abs, name: o.title, isPartOf: { '@id': SITE + '/#website' }, datePublished: o.published.toISOString(), description: o.description, inLanguage: 'en-US' },
      ...(img ? [{ '@type': 'ImageObject', '@id': abs + '#primaryimage', url: img, contentUrl: img, width: o.imageWidth, height: o.imageHeight }] : []),
      { '@type': 'WebSite', '@id': SITE + '/#website', url: SITE + '/', name: 'RISCstar', publisher: { '@id': SITE + '/#organization' }, inLanguage: 'en-US' },
      { '@type': 'Organization', '@id': SITE + '/#organization', name: 'RISCstar', url: SITE + '/', sameAs: ['https://www.linkedin.com/company/riscstar-solutions/', 'https://x.com/riscstar30536'] },
    ],
  };
  tags.push(`<script type="application/ld+json" class="yoast-schema-graph">${JSON.stringify(ld)}</script>`);
  return tags.filter(Boolean).join('\n');
}

export function archiveHead(o: { url: string; firstUrl: string; title: string; prev?: string; next?: string }) {
  const abs = SITE + o.url;
  return [
    `<meta name="robots" content="${ROBOTS}">`,
    `<link rel="canonical" href="${abs}">`,
    o.prev && `<link rel="prev" href="${SITE + o.prev}">`,
    o.next && `<link rel="next" href="${SITE + o.next}">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta property="og:type" content="article">`,
    `<meta property="og:title" content="${esc(o.title)}">`,
    `<meta property="og:url" content="${SITE + o.firstUrl}">`,
    `<meta property="og:site_name" content="RISCstar">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:site" content="@riscstar30536">`,
  ].filter(Boolean).join('\n');
}

export const readingMinutes = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 200));
