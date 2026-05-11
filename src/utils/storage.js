import { starterSources } from '../data/starterSources'

// Storage keys
const STORAGE_KEYS = {
  SOURCES: 'thinking_studio_sources',
  ARTICLES: 'thinking_studio_articles',
  MODE: 'thinking_studio_mode',
  SAVED_ARTICLES: 'thinking_studio_saved_articles'
}

// Get stored sources, fallback to starter sources
export const getStoredSources = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOURCES)
    return stored ? JSON.parse(stored) : starterSources
  } catch (error) {
    console.error('Error reading sources from storage:', error)
    return starterSources
  }
}

// Save sources to storage
export const saveStoredSources = (sources) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SOURCES, JSON.stringify(sources))
    return true
  } catch (error) {
    console.error('Error saving sources to storage:', error)
    return false
  }
}

// Get stored articles
export const getSavedArticles = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SAVED_ARTICLES)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error reading saved articles from storage:', error)
    return []
  }
}

// Save articles to storage
export const saveSavedArticles = (articles) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_ARTICLES, JSON.stringify(articles))
    return true
  } catch (error) {
    console.error('Error saving articles to storage:', error)
    return false
  }
}

// Get stored cognitive mode
export const getStoredMode = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MODE)
    return stored || 'deep-work'
  } catch (error) {
    console.error('Error reading mode from storage:', error)
    return 'deep-work'
  }
}

// Save cognitive mode to storage
export const saveStoredMode = (mode) => {
  try {
    localStorage.setItem(STORAGE_KEYS.MODE, mode)
    return true
  } catch (error) {
    console.error('Error saving mode to storage:', error)
    return false
  }
}

// Toggle article saved state
export const toggleArticleSaved = (articleId) => {
  const saved = getSavedArticles()
  const index = saved.findIndex(a => a.id === articleId)
  if (index > -1) {
    saved.splice(index, 1)
  } else {
    saved.push({ id: articleId, savedAt: new Date().toISOString() })
  }
  saveSavedArticles(saved)
  return saved.map(a => a.id)
}

// Check if article is saved
export const isArticleSaved = (articleId) => {
  const saved = getSavedArticles()
  return saved.some(a => a.id === articleId)
}

// Clear all data (useful for resetting)
export const clearAllData = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SOURCES)
    localStorage.removeItem(STORAGE_KEYS.ARTICLES)
    localStorage.removeItem(STORAGE_KEYS.MODE)
    localStorage.removeItem(STORAGE_KEYS.SAVED_ARTICLES)
    return true
  } catch (error) {
    console.error('Error clearing storage:', error)
    return false
  }
}
