// Search and filtering service
import { getAllArticles, searchArticles } from './articleRepository';
import { getArchivedArticles, searchArchivedArticles } from './archiveRepository';

export const SHELVES = [
  'Philosophy Cafe',
  'AI Lab',
  'Science Cabinet',
  'Systems Lab',
  'Cinema Room',
  'Creative Spark',
  'Archived'
];

const normalizeShelf = (shelf) => shelf?.replace(/Caf.+$/, 'Cafe') || shelf;

export const getFilteredArticles = async (options = {}) => {
  const {
    shelf = null,
    searchQuery = '',
    limit = null,
    offset = 0,
    sortBy = 'publishedAt',
    sortOrder = 'desc'
  } = options;

  let articles = [];

  if (shelf === 'Archived') {
    articles = await getArchivedArticles();
  } else if (searchQuery) {
    articles = await searchArticles(searchQuery);
  } else {
    articles = await getAllArticles();
  }

  if (shelf && shelf !== 'Archived') {
    articles = articles.filter((article) => normalizeShelf(article.shelf) === normalizeShelf(shelf));
  }

  articles.sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    if (sortBy === 'publishedAt' || sortBy === 'fetchedAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    }

    return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
  });

  if (limit) {
    articles = articles.slice(offset, offset + limit);
  }

  return articles;
};

export const quickSearch = async (query) => {
  if (!query || query.length < 2) {
    return [];
  }

  const [regular, archived] = await Promise.all([
    searchArticles(query),
    searchArchivedArticles(query)
  ]);

  return [...regular, ...archived];
};

export const getArticlesByShelf = async (shelf) => {
  if (shelf === 'Archived') {
    return getArchivedArticles();
  }

  const articles = await getAllArticles();
  return articles.filter((article) => normalizeShelf(article.shelf) === normalizeShelf(shelf));
};

export const getArticleStats = async () => {
  const articles = await getAllArticles();
  const archived = await getArchivedArticles();

  const statsByShelf = {};
  SHELVES.forEach((shelf) => {
    if (shelf === 'Archived') {
      statsByShelf[shelf] = archived.length;
    } else {
      statsByShelf[shelf] = articles.filter((article) => normalizeShelf(article.shelf) === shelf).length;
    }
  });

  return {
    total: articles.length,
    archived: archived.length,
    byShelf: statsByShelf
  };
};

export const getTrendingTopics = async (days = 7) => {
  const articles = await getAllArticles();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const topics = {};
  articles
    .filter((article) => new Date(article.publishedAt) > cutoff)
    .forEach((article) => {
      article.title
        .split(/\s+/)
        .filter((word) => word.length > 4)
        .forEach((word) => {
          const key = word.toLowerCase();
          topics[key] = (topics[key] || 0) + 1;
        });
    });

  return Object.entries(topics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));
};

export const getRandomArticles = async (count = 10) => {
  const articles = await getAllArticles();
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const getRandomArticlesByShelf = async (shelf, count = 5) => {
  const articles = await getFilteredArticles({ shelf });
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
