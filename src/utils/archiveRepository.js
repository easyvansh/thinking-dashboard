// Archive management repository
import { initDB, STORE_NAMES } from './db';

/**
 * Save article to archive
 */
export const saveToArchive = async (article) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);

    const archiveItem = {
      id: `archive_${article.id}`,
      articleId: article.id,
      title: article.title,
      sourceName: article.sourceName,
      articleUrl: article.articleUrl,
      snippet: article.snippet,
      shelf: article.shelf,
      publishedAt: article.publishedAt,
      savedAt: new Date().toISOString(),
      notes: article.notes || ''
    };

    const request = store.put(archiveItem);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(archiveItem);
  });
};

/**
 * Remove from archive
 */
export const removeFromArchive = async (articleId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);
    const archiveId = `archive_${articleId}`;
    const request = store.delete(archiveId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(true);
  });
};

/**
 * Get all archived articles
 */
export const getArchivedArticles = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Sort by savedAt descending
      const results = request.result.sort((a, b) => 
        new Date(b.savedAt) - new Date(a.savedAt)
      );
      resolve(results);
    };
  });
};

/**
 * Get archived article by ID
 */
export const getArchivedArticleById = async (articleId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);
    const archiveId = `archive_${articleId}`;
    const request = store.get(archiveId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

/**
 * Check if article is archived
 */
export const isArticleArchived = async (articleId) => {
  const archived = await getArchivedArticleById(articleId);
  return !!archived;
};

/**
 * Get archived articles by shelf
 */
export const getArchivedArticlesByShelf = async (shelf) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const results = request.result.filter(item => item.shelf === shelf);
      resolve(results.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)));
    };
  });
};

/**
 * Update archive notes
 */
export const updateArchiveNotes = async (articleId, notes) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.ARCHIVE], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.ARCHIVE);
    const archiveId = `archive_${articleId}`;
    
    const getRequest = store.get(archiveId);
    
    getRequest.onsuccess = () => {
      const item = getRequest.result;
      if (item) {
        item.notes = notes;
        const updateRequest = store.put(item);
        updateRequest.onsuccess = () => resolve(item);
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error(`Archived article ${articleId} not found`));
      }
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Search archived articles
 */
export const searchArchivedArticles = async (query) => {
  const archived = await getArchivedArticles();
  const lowerQuery = query.toLowerCase();

  return archived.filter((item) => {
    return (
      (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
      (item.snippet && item.snippet.toLowerCase().includes(lowerQuery)) ||
      (item.sourceName && item.sourceName.toLowerCase().includes(lowerQuery))
    );
  });
};
