import { useState, useEffect, useMemo } from 'react'
import Sidebar from './components/Sidebar'
import ArticleCard from './components/ArticleCard'
import ModeSelector from './components/ModeSelector'
import AddSourceModal from './components/AddSourceModal'
import Archive from './components/Archive'
import SearchBar from './components/SearchBar'
import RefreshButton from './components/RefreshButton'
import { initDB } from './utils/db'
import { getAllSources, addSources } from './utils/sourceRepository'
import { getAllArticles } from './utils/articleRepository'
import {
  getSelectedMode,
  setSelectedMode,
  getLastRefresh,
  getSelectedShelfFilter,
  setSelectedShelfFilter
} from './utils/metadataRepository'
import { getFilteredArticles, getArticleStats } from './utils/searchService'
import { DEFAULT_SOURCES } from './data/defaultSources'

const DEFAULT_SHELVES = [
  'Philosophy Cafe',
  'AI Lab',
  'Science Cabinet',
  'Systems Lab',
  'Cinema Room',
  'Creative Spark'
]

function displayShelfName(shelf) {
  return shelf?.replace('CafÃ©', 'Cafe') || 'Unsorted'
}

export default function App() {
  const [sources, setSources] = useState([])
  const [articles, setArticles] = useState([])
  const [currentMode, setCurrentMode] = useState('deep-work')
  const [selectedShelf, setSelectedShelf] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefreshTime] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [refreshMessage, setRefreshMessage] = useState('')
  const [stats, setStats] = useState({})
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('thinking-studio-theme')
    if (saved) return saved === 'dark'
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false
  })

  useEffect(() => {
    localStorage.setItem('thinking-studio-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true)
        await initDB()

        let storedSources = await getAllSources()
        if (storedSources.length === 0) {
          await addSources(DEFAULT_SOURCES)
          storedSources = DEFAULT_SOURCES
        }

        setSources(storedSources)
        setArticles(await getAllArticles())
        setCurrentMode(await getSelectedMode())
        setSelectedShelf(await getSelectedShelfFilter())
        setLastRefreshTime(await getLastRefresh())
        setStats(await getArticleStats())
        setError(null)
      } catch (err) {
        console.error('Error initializing app:', err)
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const shelves = useMemo(() => {
    const sourceShelves = sources.map((source) => source.shelf).filter(Boolean)
    return Array.from(new Set([...sourceShelves, ...DEFAULT_SHELVES]))
  }, [sources])

  const getDisplayArticles = async () => {
    try {
      const filtered = await getFilteredArticles({
        shelf: selectedShelf === 'all' ? null : selectedShelf,
        searchQuery
      })
      setArticles(filtered)
    } catch (err) {
      console.error('Error filtering articles:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    getDisplayArticles()
  }, [selectedShelf, searchQuery])

  const handleModeChange = async (mode) => {
    setCurrentMode(mode)
    await setSelectedMode(mode)
  }

  const handleShelfChange = async (shelf) => {
    setSelectedShelf(shelf)
    await setSelectedShelfFilter(shelf)
  }

  const handleSourceAdded = async () => {
    try {
      setSources(await getAllSources())
      await getDisplayArticles()
    } catch (err) {
      console.error('Error reloading sources:', err)
      setError(err.message)
    }
  }

  const handleArticleSaved = async () => {
    try {
      await getDisplayArticles()
      setStats(await getArticleStats())
    } catch (err) {
      console.error('Error updating saved state:', err)
    }
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      setRefreshMessage('Preparing refresh...')
      const { refreshAllFeeds } = await import('./utils/refreshService')

      const result = await refreshAllFeeds((progress) => {
        setRefreshMessage(progress.message)
      })

      setSources(await getAllSources())
      await getDisplayArticles()
      setLastRefreshTime(await getLastRefresh())
      setStats(await getArticleStats())

      if (result.status === 'complete') {
        setError(null)
        setRefreshMessage(result.message)
      } else {
        setError(result.message)
        setRefreshMessage(`Refresh failed: ${result.message}`)
      }
    } catch (err) {
      console.error('Error during refresh:', err)
      setError(err.message)
      setRefreshMessage(`Refresh failed: ${err.message}`)
    } finally {
      setRefreshing(false)
    }
  }

  const getGridClass = () => {
    switch (currentMode) {
      case 'deep-work':
        return 'grid-cols-1'
      case 'quick-scan':
        return 'grid-cols-1 lg:grid-cols-2'
      case 'creative-spark':
        return 'grid-cols-1 md:grid-cols-2'
      default:
        return 'grid-cols-1'
    }
  }

  const brokenSources = sources.filter((source) => source.status === 'broken')
  const activeSources = sources.filter((source) => source.status === 'active').length
  const archivedCount = stats.archived || 0

  return (
    <div className={`${isDark ? 'theme-dark' : ''} h-screen overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]`}>
      <div className="flex h-screen flex-col overflow-hidden md:flex-row">
        <Sidebar
          sources={sources}
          shelves={shelves}
          currentShelf={selectedShelf}
          onShelfChange={handleShelfChange}
          onAddSource={() => setIsModalOpen(true)}
          currentMode={currentMode}
          stats={stats}
          isDark={isDark}
          onToggleTheme={() => setIsDark((value) => !value)}
          lastRefresh={lastRefresh}
        />

        <main className="no-scrollbar flex-1 overflow-y-auto p-6 pb-40 md:p-12 lg:p-20">
          <header className="mx-auto mb-14 max-w-5xl">
            <div className="font-ui mb-5 text-[10px] font-bold uppercase tracking-[0.5em] text-[var(--accent)]">
              Studio V2 // Release
            </div>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="font-header mb-6 text-6xl font-black leading-[0.82] tracking-tight sm:text-7xl lg:text-8xl">
                  Readings in
                  <br />
                  <span className="italic text-transparent [-webkit-text-stroke:2px_var(--border)]">Atmosphere</span>
                </h1>
                <p className="max-w-2xl text-xl italic leading-relaxed text-[var(--text-secondary)]">
                  A local-first reading studio for long-form synthesis, shelf logic, and slow observation.
                </p>
              </div>

              <div className="studio-panel w-full p-5 lg:w-72">
                <p className="font-ui mb-4 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">
                  Studio Index
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="font-header text-3xl font-black">{stats.total || 0}</p>
                    <p className="font-ui text-[10px] font-bold uppercase opacity-50">Articles</p>
                  </div>
                  <div>
                    <p className="font-header text-3xl font-black">{archivedCount}</p>
                    <p className="font-ui text-[10px] font-bold uppercase opacity-50">Saved</p>
                  </div>
                  <div>
                    <p className="font-header text-3xl font-black">{activeSources}</p>
                    <p className="font-ui text-[10px] font-bold uppercase opacity-50">Live</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <section className="mx-auto mb-8 grid max-w-5xl gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <ModeSelector currentMode={currentMode} onModeChange={handleModeChange} />
            <div className="studio-panel p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Control Room</p>
                  <p className="font-header mt-1 text-2xl font-black italic">
                    {selectedShelf === 'all' ? 'All shelves' : displayShelfName(selectedShelf)}
                  </p>
                </div>
                <RefreshButton isRefreshing={refreshing} onRefresh={handleRefresh} lastRefresh={lastRefresh} />
              </div>
              <button
                onClick={() => setIsArchiveOpen(true)}
                className="studio-button studio-button-accent w-full px-5 py-3 text-xs"
              >
                Open Archive
              </button>
            </div>
          </section>

          <section className="mx-auto mb-8 max-w-5xl">
            <SearchBar onSearch={setSearchQuery} placeholder="Search the shelves, sources, and marginalia..." />

            <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
              <button
                onClick={() => handleShelfChange('all')}
                className={`font-ui shrink-0 border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  selectedShelf === 'all'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                    : 'bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white'
                }`}
              >
                All ({stats.total || 0})
              </button>
              {shelves.map((shelf) => (
                <button
                  key={shelf}
                  onClick={() => handleShelfChange(shelf)}
                  className={`font-ui shrink-0 border-2 border-[var(--border)] px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                    selectedShelf === shelf
                      ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                      : 'bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white'
                  }`}
                >
                  {displayShelfName(shelf)} ({stats.byShelf?.[shelf] || 0})
                </button>
              ))}
            </div>
          </section>

          <section className="mx-auto max-w-5xl">
            {error && (
              <div className="gist-block mb-8 p-6">
                <div className="gist-label">Signal Fault</div>
                <p className="font-ui text-sm font-bold text-[var(--accent)]">{error}</p>
              </div>
            )}

            {refreshMessage && (
              <div className="gist-block mb-8 p-6">
                <div className="gist-label">Refresh Log</div>
                <p className="font-ui text-sm font-bold">{refreshMessage}</p>
              </div>
            )}

            {brokenSources.length > 0 && (
              <div className="gist-block mb-8 p-6">
                <div className="gist-label">Feed Attention</div>
                <div className="space-y-2">
                  {brokenSources.map((source) => (
                    <p key={source.id} className="font-ui text-xs font-bold uppercase tracking-wider">
                      {source.name}: {source.lastError || 'Unknown error'}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {isLoading ? (
              <div className="studio-panel p-12 text-center">
                <p className="font-header text-3xl font-black italic">Loading studio...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="studio-panel p-12 text-center">
                <p className="font-header mb-4 text-4xl font-black">The shelf is quiet.</p>
                <p className="mb-6 text-[var(--text-secondary)]">Refresh your feeds to gather new readings.</p>
                <button onClick={handleRefresh} className="studio-button studio-button-accent px-8 py-3 text-xs">
                  Refresh Feeds
                </button>
              </div>
            ) : (
              <div className={`grid gap-10 ${getGridClass()}`}>
                {articles.map((article, index) => (
                  <ArticleCard key={article.id} article={article} index={index} onSave={handleArticleSaved} />
                ))}
              </div>
            )}
          </section>
        </main>

        <div className="fixed bottom-6 left-1/2 z-30 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 md:bottom-10">
          <div className="studio-panel flex items-center justify-between gap-4 px-5 py-4">
            <div>
              <span className="font-ui block text-[10px] font-bold uppercase tracking-widest opacity-50">Archive Buffer</span>
              <span className="font-header text-lg font-bold italic">{archivedCount} Captures</span>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="studio-button studio-button-accent px-5 py-3 text-xs">
              Add Source
            </button>
          </div>
        </div>
      </div>

      <AddSourceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSourceAdded={handleSourceAdded} shelves={shelves} />
      <Archive isOpen={isArchiveOpen} onClose={() => setIsArchiveOpen(false)} onRefresh={handleRefresh} />
    </div>
  )
}
