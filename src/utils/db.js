// IndexedDB initialization and management for Thinking Studio

const DB_NAME = 'ThinkingStudio';
const DB_VERSION = 1;

// Object stores configuration
const STORES = {
  SOURCES: 'sources',
  ARTICLES: 'articles',
  ARCHIVE: 'archive',
  METADATA: 'metadata'
};

let db = null;

/**
 * Initialize IndexedDB connection
 */
export const initDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('IndexedDB open error:', request.error);
      reject(request.error);
    };

    request.onupgradeneeded = (event) => {
      const database = event.target.result;

      // Sources store
      if (!database.objectStoreNames.contains(STORES.SOURCES)) {
        const sourceStore = database.createObjectStore(STORES.SOURCES, { keyPath: 'id' });
        sourceStore.createIndex('shelf', 'shelf', { unique: false });
        sourceStore.createIndex('status', 'status', { unique: false });
        sourceStore.createIndex('feedUrl', 'feedUrl', { unique: true });
      }

      // Articles store
      if (!database.objectStoreNames.contains(STORES.ARTICLES)) {
        const articleStore = database.createObjectStore(STORES.ARTICLES, { keyPath: 'id' });
        articleStore.createIndex('sourceId', 'sourceId', { unique: false });
        articleStore.createIndex('shelf', 'shelf', { unique: false });
        articleStore.createIndex('articleUrl', 'articleUrl', { unique: true });
        articleStore.createIndex('publishedAt', 'publishedAt', { unique: false });
        articleStore.createIndex('title', 'title', { unique: false });
      }

      // Archive store
      if (!database.objectStoreNames.contains(STORES.ARCHIVE)) {
        const archiveStore = database.createObjectStore(STORES.ARCHIVE, { keyPath: 'id' });
        archiveStore.createIndex('articleId', 'articleId', { unique: false });
        archiveStore.createIndex('savedAt', 'savedAt', { unique: false });
      }

      // Metadata store (for mode, last refresh, etc)
      if (!database.objectStoreNames.contains(STORES.METADATA)) {
        database.createObjectStore(STORES.METADATA, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
  });
};

/**
 * Get transaction for store(s)
 */
export const getTransaction = (storeNames, mode = 'readonly') => {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db.transaction(storeNames, mode);
};

/**
 * Get object store
 */
export const getStore = (storeName, mode = 'readonly') => {
  const transaction = getTransaction(storeName, mode);
  return transaction.objectStore(storeName);
};

/**
 * Close database connection
 */
export const closeDB = () => {
  if (db) {
    db.close();
    db = null;
  }
};

export const STORE_NAMES = STORES;
