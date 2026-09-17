const cache = new Map();

function safeTitle(value) {
  return String(value || '').trim();
}

export async function resolveWikipediaImage(title) {
  const clean = safeTitle(title);
  if (!clean) return '';
  const key = `wiki:${clean}`;
  if (cache.has(key)) return cache.get(key);

  const candidates = [clean, clean.replace(/:/g, ' '), clean.replace(/\s*\([^)]*\)\s*/g, '').trim()];
  for (const candidate of [...new Set(candidates)]) {
    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(candidate.replace(/\s+/g, '_'))}`
      );
      if (!response.ok) continue;
      const data = await response.json();
      const image = data?.originalimage?.source || data?.thumbnail?.source;
      if (image) {
        cache.set(key, image);
        return image;
      }
    } catch {}
  }

  // Wikimedia Commons search catches titles whose Wikipedia page is missing.
  try {
    const response = await fetch(
      `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(clean + ' film poster')}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`
    );
    if (response.ok) {
      const data = await response.json();
      const pages = Object.values(data?.query?.pages || {});
      const image = pages.find((page) => page?.imageinfo?.[0]?.thumburl || page?.imageinfo?.[0]?.url);
      const url = image?.imageinfo?.[0]?.thumburl || image?.imageinfo?.[0]?.url || '';
      if (url) {
        cache.set(key, url);
        return url;
      }
    }
  } catch {}

  return '';
}

export function fallbackPoster(title, year = '') {
  const text = safeTitle(title) || 'Movie';
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#191326"/><stop offset="1" stop-color="#5a267d"/></linearGradient></defs><rect width="600" height="900" fill="url(#g)"/><circle cx="480" cy="130" r="180" fill="#ff4fd8" opacity=".18"/><circle cx="80" cy="760" r="240" fill="#8c5cff" opacity=".18"/><text x="48" y="720" fill="white" font-family="Arial,sans-serif" font-size="42" font-weight="700">${escaped}</text><text x="48" y="770" fill="#d9d2e3" font-family="Arial,sans-serif" font-size="24">${year || 'VibeVerse Cinema'}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function moviePosterUrl(title) {
  return resolveWikipediaImage(title);
}

export function artistImageUrl(name) {
  return resolveWikipediaImage(name);
}
