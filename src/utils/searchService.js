// Search and filtering service
import { getAllArticles, searchArticles } from './articleRepository';
import { getSourcesByShelf } from './sourceRepository';
import { getArchivedArticles, searchArchivedArticles } from './archiveRepository';

export const SHELVES = [
  'Philosophy Café',
  'AI Lab',
  'Science Cabinet',
  'Systems Lab',
  'Cinema Room',
  'Creative Spark',
  'Archived'
];

/**
 * Get all articles with optional filtering
 */
export const getFilteredArticles = async (options = {}) => {
  const {
    shelf = null,
    searchQuery = '',
    limit = null,
    offset = 0,
    sortBy = 'publishedAt', // publishedAt, title, sourceName
    sortOrder = 'desc' // asc, desc
  } = options;

  let articles = [];

  // Handle archived shelf separately
  if (shelf === 'Archived') {
    articles = await getArchivedArticles();
  } else if (searchQuery) {
    articles = await searchArticles(searchQuery);
  } else {
    articles = await getAllArticles();
  }

  // Filter by shelf if specified
  if (shelf && shelf !== 'Archived') {
    articles = articles.filter((a) => a.shelf === shelf);
  }

  // Sort
  articles.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'publishedAt' || sortBy === 'fetchedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  // Pagination
  if (limit) {
    articles = articles.slice(offset, offset + limit);
  }

  return articles;
};

/**
 * Search articles by query
 */
export const quickSearch = async (query) => {
  if (!query || query.length < 2) {
    return [];
  }

  const normalQuery = query.toLowerCase();

  // Search both regular and archived articles
  const [regular, archived] = await Promise.all([
    searchArticles(query),
    searchArchivedArticles(query)
  ]);

  return [...regular, ...archived];
};

/**
 * Get articles by shelf
 */
export const getArticlesByShelf = async (shelf) => {
  if (shelf === 'Archived') {
    return getArchivedArticles();
  }

  const articles = await getAllArticles();
  return articles.filter((a) => a.shelf === shelf);
};

/**
 * Get articles statistics
 */
export const getArticleStats = async () => {
  const articles = await getAllArticles();
  const archived = await getArchivedArticles();

  const statsByShelf = {};
  SHELVES.forEach((shelf) => {
    if (shelf === 'Archived') {
      statsByShelf[shelf] = archived.length;
    } else {
      statsByShelf[shelf] = articles.filter((a) => a.shelf === shelf).length;
    }
  });

  return {
    total: articles.length,
    archived: archived.length,
    byShelf: statsByShelf
  };
};

/**
 * Get trending topics (most mentioned in recent articles)
 */
export const getTrendingTopics = async (days = 7) => {
  const articles = await getAllArticles();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recent = articles.filter((a) => new Date(a.publishedAt) > cutoff);

  const topics = {};
  recent.forEach((article) => {
    const words = article.title.split(/\s+/).filter((w) => w.length > 4);
    words.forEach((word) => {
      const key = word.toLowerCase();
      topics[key] = (topics[key] || 0) + 1;
    });
  });

  return Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));
};

/**
 * Randomized articles (for Creative Spark mode)
 */
export const getRandomArticles = async (count = 10) => {
  const articles = await getAllArticles();
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

/**
 * Get random articles by shelf
 */
export const getRandomArticlesByShelf = async (shelf, count = 5) => {
  const articles = await getFilteredArticles({ shelf });
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
