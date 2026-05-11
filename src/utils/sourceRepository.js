// Source management repository
import { initDB, STORE_NAMES } from './db';

/**
 * Add or update a source
 */
export const addSource = async (source) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);

    const sourceWithTimestamp = {
      ...source,
      createdAt: source.createdAt || new Date().toISOString(),
      lastFetchedAt: source.lastFetchedAt || null,
      lastError: source.lastError || null,
      status: source.status || 'pending'
    };

    const request = store.put(sourceWithTimestamp);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(sourceWithTimestamp);
  });
};

/**
 * Add multiple sources
 */
export const addSources = async (sources) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);

    const results = [];
    let completed = 0;

    sources.forEach((source) => {
      const sourceWithTimestamp = {
        ...source,
        createdAt: source.createdAt || new Date().toISOString(),
        lastFetchedAt: source.lastFetchedAt || null,
        lastError: source.lastError || null,
        status: source.status || 'pending'
      };

      const request = store.put(sourceWithTimestamp);
      request.onsuccess = () => {
        results.push(sourceWithTimestamp);
        completed++;
        if (completed === sources.length) {
          resolve(results);
        }
      };
      request.onerror = () => reject(request.error);
    });

    if (sources.length === 0) resolve([]);
  });
};

/**
 * Get all sources
 */
export const getAllSources = async () => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get sources by shelf
 */
export const getSourcesByShelf = async (shelf) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    const index = store.index('shelf');
    const request = index.getAll(shelf);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Get source by ID
 */
export const getSourceById = async (id) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    const request = store.get(id);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result || null);
  });
};

/**
 * Update source health status
 */
export const updateSourceHealth = async (sourceId, status, lastError = null) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    
    const getRequest = store.get(sourceId);
    
    getRequest.onsuccess = () => {
      const source = getRequest.result;
      if (source) {
        source.status = status;
        source.lastFetchedAt = new Date().toISOString();
        if (lastError) {
          source.lastError = lastError;
        } else if (status === 'active') {
          source.lastError = null;
        }

        const updateRequest = store.put(source);
        updateRequest.onsuccess = () => resolve(source);
        updateRequest.onerror = () => reject(updateRequest.error);
      } else {
        reject(new Error(`Source ${sourceId} not found`));
      }
    };
    
    getRequest.onerror = () => reject(getRequest.error);
  });
};

/**
 * Delete source
 */
export const deleteSource = async (sourceId) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    const request = store.delete(sourceId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(true);
  });
};

/**
 * Get sources by status
 */
export const getSourcesByStatus = async (status) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.SOURCES], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.SOURCES);
    const index = store.index('status');
    const request = index.getAll(status);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};
