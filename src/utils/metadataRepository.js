// Metadata management for app state (mode, last refresh, etc)
import { initDB, STORE_NAMES } from './db';

export const METADATA_KEYS = {
  LAST_REFRESH: 'lastRefresh',
  LAST_REFRESH_TIME: 'lastRefreshTime',
  SELECTED_MODE: 'selectedMode',
  SELECTED_SHELF_FILTER: 'selectedShelfFilter'
};

/**
 * Get metadata value
 */
export const getMetadata = async (key) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.METADATA], 'readonly');
    const store = transaction.objectStore(STORE_NAMES.METADATA);
    const request = store.get(key);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const result = request.result;
      resolve(result ? result.value : null);
    };
  });
};

/**
 * Set metadata value
 */
export const setMetadata = async (key, value) => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAMES.METADATA], 'readwrite');
    const store = transaction.objectStore(STORE_NAMES.METADATA);
    const request = store.put({ key, value });

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(value);
  });
};

/**
 * Get last refresh timestamp
 */
export const getLastRefresh = async () => {
  return getMetadata(METADATA_KEYS.LAST_REFRESH_TIME);
};

/**
 * Set last refresh timestamp
 */
export const setLastRefresh = async () => {
  return setMetadata(METADATA_KEYS.LAST_REFRESH_TIME, new Date().toISOString());
};

/**
 * Get selected cognitive mode
 */
export const getSelectedMode = async () => {
  const mode = await getMetadata(METADATA_KEYS.SELECTED_MODE);
  return mode || 'deep-work';
};

/**
 * Set selected cognitive mode
 */
export const setSelectedMode = async (mode) => {
  return setMetadata(METADATA_KEYS.SELECTED_MODE, mode);
};

/**
 * Get selected shelf filter
 */
export const getSelectedShelfFilter = async () => {
  const shelf = await getMetadata(METADATA_KEYS.SELECTED_SHELF_FILTER);
  return shelf || 'all';
};

/**
 * Set selected shelf filter
 */
export const setSelectedShelfFilter = async (shelf) => {
  return setMetadata(METADATA_KEYS.SELECTED_SHELF_FILTER, shelf);
};
