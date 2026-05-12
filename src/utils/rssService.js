// RSS/Atom feed fetching and normalization service.
// In local Vite dev, feeds go through the dev-only /rss-proxy endpoint.
// In the packaged Chrome extension, host_permissions allow direct feed fetches.

const RSS_PROXY_URLS = [
  'https://api.allorigins.win/get?disableCache=true&url='
];

const isChromeExtension = () => window.location.protocol === 'chrome-extension:';

const canUseLocalProxy = () => (
  import.meta.env.DEV &&
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
);

const fetchWithTimeout = async (url, options = {}, timeoutMs = 20000) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal
    });
  } finally {
    window.clearTimeout(timeout);
  }
};

const parseXmlString = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
};

const resolveUrl = (url, baseUrl) => {
  if (!url) return '';
  try {
    return new URL(url.trim(), baseUrl).toString();
  } catch (error) {
    return url.trim();
  }
};

const getFirstText = (node, selectors) => {
  if (!node) return '';
  for (const selector of selectors) {
    let el = null;

    if (selector.includes(':') && !selector.includes(' ')) {
      el = node.getElementsByTagName(selector)[0];
    } else {
      try {
        el = node.querySelector(selector);
      } catch (error) {
        el = node.getElementsByTagName(selector)[0];
      }
    }

    if (el?.textContent?.trim()) {
      return el.textContent.trim();
    }
  }
  return '';
};

const getLinkHref = (item, feedUrl) => {
  if (!item) return '';
  const alternate = item.querySelector('link[rel="alternate"]');
  const href = alternate?.getAttribute('href') || item.querySelector('link')?.getAttribute('href');
  if (href) return resolveUrl(href, feedUrl);

  const textLink = item.querySelector('link')?.textContent;
  if (textLink) return resolveUrl(textLink, feedUrl);

  return resolveUrl(item.querySelector('guid')?.textContent?.trim() || '', feedUrl);
};

const getMediaUrl = (item, feedUrl) => {
  if (!item) return '';

  const candidates = [
    item.querySelector('enclosure[type^="image"]')?.getAttribute('url'),
    item.getElementsByTagName('media:content')[0]?.getAttribute('url'),
    item.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url'),
    item.querySelector('image')?.getAttribute('href'),
    item.querySelector('image')?.textContent
  ];

  const imageUrl = candidates.find(Boolean);
  return imageUrl ? resolveUrl(imageUrl, feedUrl) : '';
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.substring(0, 300).trim();
};

const extractImageUrl = (html, feedUrl) => {
  if (!html) return '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? resolveUrl(imgMatch[1], feedUrl) : '';
};

const getPublishedDate = (item) => {
  const raw = getFirstText(item, ['pubDate', 'published', 'updated', 'dc:date']);
  const parsed = raw ? new Date(raw) : new Date();
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};

const getCategories = (item) => {
  const categoryNodes = Array.from(item.querySelectorAll('category')) || [];
  return categoryNodes
    .map((category) => category.textContent?.trim())
    .filter(Boolean);
};

const normalizeArticle = (item, sourceId, sourceName, shelf, feedUrl) => {
  const title = getFirstText(item, ['title']) || 'Untitled';
  const articleUrl = getLinkHref(item, feedUrl);
  const description = getFirstText(item, ['description', 'summary', 'content', 'content:encoded']);
  const publishedAt = getPublishedDate(item).toISOString();
  const author = getFirstText(item, ['author', 'dc:creator', 'creator']);
  const categories = getCategories(item);
  const imageUrl = extractImageUrl(description, feedUrl) || getMediaUrl(item, feedUrl);

  return {
    sourceId,
    sourceName,
    shelf,
    sourceStatus: 'active',
    title,
    articleUrl,
    snippet: stripHtml(description),
    content: description,
    publishedAt,
    author,
    categories,
    imageUrl
  };
};

const fetchFeedContent = async (feedUrl) => {
  const encoded = encodeURIComponent(feedUrl);
  let lastError = null;

  if (canUseLocalProxy()) {
    try {
      const response = await fetchWithTimeout(`/rss-proxy?url=${encoded}`);
      if (!response.ok) {
        throw new Error(`Local RSS proxy returned ${response.status}`);
      }
      const contents = await response.text();
      return { success: true, contents };
    } catch (error) {
      lastError = error;
      console.warn('Local RSS proxy failed:', error.message);
    }
  }

  if (isChromeExtension()) {
    try {
      const response = await fetchWithTimeout(feedUrl, {
        headers: {
          accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
        }
      });
      if (!response.ok) {
        throw new Error(`Fetch returned ${response.status}`);
      }
      const contents = await response.text();
      return { success: true, contents };
    } catch (error) {
      lastError = error;
    }
  }

  for (const proxy of RSS_PROXY_URLS) {
    try {
      const response = await fetchWithTimeout(`${proxy}${encoded}`);
      if (!response.ok) {
        throw new Error(`Proxy returned ${response.status}`);
      }
      const data = await response.json();
      if (data?.contents) {
        return { success: true, contents: data.contents };
      }
      throw new Error('Proxy returned no feed contents');
    } catch (error) {
      lastError = error;
      console.warn('Public RSS proxy failed:', error.message);
    }
  }

  return {
    success: false,
    error: lastError?.message || 'Unable to fetch feed content'
  };
};

const parseFeedDocument = (xmlString) => {
  if (!xmlString?.trim()) {
    throw new Error('Feed returned an empty response');
  }

  const doc = parseXmlString(xmlString);
  if (doc.querySelector('parsererror')) {
    throw new Error('Feed XML could not be parsed');
  }
  return doc;
};

export const fetchFeed = async (feedUrl, sourceId, sourceName, shelf) => {
  try {
    const response = await fetchFeedContent(feedUrl);
    if (!response.success) {
      throw new Error(response.error);
    }

    const doc = parseFeedDocument(response.contents);
    const feedTitle = getFirstText(doc, ['channel > title', 'feed > title']) || sourceName;
    const items = Array.from(doc.querySelectorAll('item'));
    const entries = items.length ? items : Array.from(doc.querySelectorAll('entry'));

    if (entries.length === 0) {
      throw new Error('Feed contains no RSS items or Atom entries');
    }

    const articles = entries
      .map((item) => normalizeArticle(item, sourceId, sourceName, shelf, feedUrl))
      .filter((article) => article.articleUrl)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    if (articles.length === 0) {
      throw new Error('Feed entries did not include usable article links');
    }

    return {
      success: true,
      articles,
      feedTitle,
      itemCount: articles.length
    };
  } catch (error) {
    console.error(`Error fetching feed ${feedUrl}:`, error);
    return {
      success: false,
      articles: [],
      error: error.message,
      feedTitle: sourceName
    };
  }
};

export const fetchMultipleFeeds = async (sources) => {
  const results = [];
  const queue = [...sources];
  const workerCount = Math.min(4, queue.length);

  const runWorker = async () => {
    while (queue.length > 0) {
      const source = queue.shift();
      try {
        const result = await fetchFeed(source.feedUrl, source.id, source.name, source.shelf);
        results.push({
          ...result,
          sourceId: source.id,
          sourceName: source.name,
          shelf: source.shelf
        });
      } catch (error) {
        results.push({
          success: false,
          articles: [],
          error: error.message,
          sourceId: source.id,
          sourceName: source.name,
          shelf: source.shelf
        });
      }
    }
  };

  await Promise.all(Array.from({ length: workerCount }, runWorker));
  return results;
};

export const testFeed = async (feedUrl) => {
  const response = await fetchFeedContent(feedUrl);
  return response.success;
};
