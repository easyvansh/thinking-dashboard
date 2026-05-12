// Article management repository with deduplication
import { initDB, STORE_NAMES } from './db';

/**
 * Generate article ID from articleUrl or fallback to title+source+date
 */
export const generateArticleId = (article) => {
  if (article.articleUrl) {
    return `article_${btoa(article.articleUrl).slice(0, 32)}`;
  }
  // Fallback: normalized title + sourceName + publishedAt
  const normalized = `${article.title}_${article.sourceName}_${article.publishedAt}`;
  return `article_${btoa(normalized).slice(0, 32)}`;
};

/**
 * Check if article exists (deduplication)
 */
export const articleExists = async (articleUrl) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const index = store.index('articleUrl');
    const request = index.get(articleUrl);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(!!request.result);
  });
};

/**
 * Add article (with deduplication check)
 */
export const addArticle = async (article) => {
  const db = await initDB();
  return new Promise(async (resolve, reject) => {
    try {
      // Check for duplicates if articleUrl exists
      if (article.articleUrl) {
        const exists = await articleExists(article.articleUrl);
        if (exists) {
          resolve(null); // Article already exists, return null
          return;
        }
      }

      const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readwrite');
      const store = transaction.objectStore(STORE_NAMES.ARTICLES);

      const articleWithMeta = {
        id: article.id || generateArticleId(article),
        ...article,
        fetchedAt: article.fetchedAt || new Date().toISOString(),
        saved: article.saved || false
      };

      const request = store.put(articleWithMeta);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(articleWithMeta);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Add multiple articles (with deduplication)
 */
export const addArticles = async (articles) => {
  const result = await addArticlesWithStats(articles);
  return result.articles;
};

/**
 * Add multiple articles and report how many were skipped as duplicates
 */
export const addArticlesWithStats = async (articles) => {
  await initDB();
  const savedArticles = [];
  let duplicates = 0;

  return new Promise(async (resolve, reject) => {
    if (articles.length === 0) {
      resolve({ articles: [], newArticles: 0, duplicates: 0 });
      return;
    }

    for (const article of articles) {
      try {
        const result = await addArticle(article);
        if (result) {
          savedArticles.push(result);
        } else {
          duplicates++;
        }
      } catch (error) {
        reject(error);
        return;
      }
    }

    resolve({
      articles: savedArticles,
      newArticles: savedArticles.length,
      duplicates
    });
  });
};

/**
 * Get all articles
 */
export const getAllArticles = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get articles by shelf
 */
export const getArticlesByShelf = async (shelf) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const index = store.index('shelf');
    const request = index.getAll(shelf);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get articles by source
 */
export const getArticlesBySource = async (sourceId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const index = store.index('sourceId');
    const request = index.getAll(sourceId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get article by ID
 */
export const getArticleById = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

/**
 * Delete article
 */
export const deleteArticle = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const request = store.delete(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(true);
  });
};

/**
 * Search articles by title and snippet
 */
export const searchArticles = async (query) => {
  const articles = await getAllArticles();
  const lowerQuery = query.toLowerCase();

  return articles.filter((article) => {
    return (
      (article.title && article.title.toLowerCase().includes(lowerQuery)) ||
      (article.snippet && article.snippet.toLowerCase().includes(lowerQuery)) ||
      (article.sourceName && article.sourceName.toLowerCase().includes(lowerQuery)) ||
      (article.shelf && article.shelf.toLowerCase().includes(lowerQuery))
    );
  });
};

/**
 * Clear all articles (useful for refresh)
 */
export const clearAllArticles = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(true);
  });
};

/**
 * Mark article as saved
 */
export const toggleArticleSaved = async (articleId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARTICLES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARTICLES);
    
    const getRequest = store.get(articleId);
    
    getRequest.onsuccess = () => {
      const article = getRequest.result;
      if (article) {
        article.saved = !article.saved;
        const updateRequest = store.put(article);
        updateRequest.onsuccess = () => resolve(article);
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error(`Article ${articleId} not found`));
      }
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
};
