// RSS/Atom feed fetching and normalization service.
// In local Vite dev, feeds go through the dev-only /rss-proxy endpoint.
// In the packaged Chrome extension, host_permissions allow direct feed fetches.

const RSS_PROXY_URLS = [
  'https://api.allorigins.win/get?disableCache=true&url='
];

const parseXmlString = (xmlString) => {
  const parser = new DOMParser();
  return parser.parseFromString(xmlString, 'application/xml');
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

const getLinkHref = (item) => {
  if (!item) return '';
  const alternate = item.querySelector('link[rel="alternate"]');
  const href = alternate?.getAttribute('href') || item.querySelector('link')?.getAttribute('href');
  if (href) return href.trim();

  const textLink = item.querySelector('link')?.textContent;
  if (textLink) return textLink.trim();

  return item.querySelector('guid')?.textContent?.trim() || '';
};

const stripHtml = (html) => {
  if (!html) return '';
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  const text = tmp.textContent || tmp.innerText || '';
  return text.substring(0, 300).trim();
};

const extractImageUrl = (html) => {
  if (!html) return '';
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return imgMatch ? imgMatch[1] : '';
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

const normalizeArticle = (item, sourceId, sourceName, shelf) => {
  const title = getFirstText(item, ['title']) || 'Untitled';
  const articleUrl = getLinkHref(item);
  const description = getFirstText(item, ['description', 'summary', 'content', 'content:encoded']);
  const publishedAt = getPublishedDate(item).toISOString();
  const author = getFirstText(item, ['author', 'dc:creator', 'creator']);
  const categories = getCategories(item);
  const imageUrl = extractImageUrl(description);

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

  if (import.meta.env.DEV) {
    try {
      const response = await fetch(`/rss-proxy?url=${encoded}`);
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

  try {
    const response = await fetch(feedUrl);
    if (!response.ok) {
      throw new Error(`Fetch returned ${response.status}`);
    }
    const contents = await response.text();
    return { success: true, contents };
  } catch (error) {
    lastError = error;
  }

  for (const proxy of RSS_PROXY_URLS) {
    try {
      const response = await fetch(`${proxy}${encoded}`);
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
  const doc = parseXmlString(xmlString);
  if (doc.querySelector('parsererror')) {
    throw new Error('Feed parse error');
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

    const articles = entries
      .map((item) => normalizeArticle(item, sourceId, sourceName, shelf))
      .filter((article) => article.articleUrl)
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

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
  const promises = sources.map((source) =>
    fetchFeed(source.feedUrl, source.id, source.name, source.shelf)
      .then((result) => ({
        ...result,
        sourceId: source.id,
        sourceName: source.name,
        shelf: source.shelf
      }))
      .catch((error) => ({
        success: false,
        articles: [],
        error: error.message,
        sourceId: source.id,
        sourceName: source.name,
        shelf: source.shelf
      }))
  );

  return Promise.all(promises);
};

export const testFeed = async (feedUrl) => {
  const response = await fetchFeedContent(feedUrl);
  return response.success;
};
