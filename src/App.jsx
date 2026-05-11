import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import SourceCard from './components/SourceCard'
import ArticleCard from './components/ArticleCard'
import ModeSelector from './components/ModeSelector'
import AddSourceModal from './components/AddSourceModal'
import Archive from './components/Archive'
import { getStoredSources, getStoredMode, getSavedArticles } from './utils/storage'
import { sampleArticles } from './data/sampleArticles'

export default function App() {
  const [sources, setSources] = useState([])
  const [currentMode, setCurrentMode] = useState('deep-work')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isArchiveOpen, setIsArchiveOpen] = useState(false)
  const [filteredCategory, setFilteredCategory] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  // Load initial data
  useEffect(() => {
    setSources(getStoredSources())
    setCurrentMode(getStoredMode())
  }, [])

  // Get filtered sources
  const filteredSources = filteredCategory 
    ? sources.filter(s => s.category === filteredCategory)
    : sources

  // Get saved article count
  const savedCount = getSavedArticles().length

  // Layout grid classes based on mode
  const getGridClass = () => {
    switch(currentMode) {
      case 'deep-work':
        return 'grid-cols-1 md:grid-cols-2'
      case 'quick-scan':
        return 'grid-cols-1 md:grid-cols-3'
      case 'creative-spark':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      default:
        return 'grid-cols-1 md:grid-cols-2'
    }
  }

  const handleSourceAdded = () => {
    setSources(getStoredSources())
    setRefreshKey(k => k + 1)
  }

  const handleModeChange = (mode) => {
    setCurrentMode(mode)
  }

  const handleRefresh = () => {
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="bg-studio-bg text-studio-text">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Sidebar */}
        <Sidebar 
          sources={sources}
          onAddSource={() => setIsModalOpen(true)}
          onFilterChange={setFilteredCategory}
          currentMode={currentMode}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Header with Archive button */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">Bookshelf</h2>
              <p className="text-xs text-gray-600 font-bold uppercase mt-1">
                {filteredCategory && `${filteredCategory} •`} {filteredSources.length} sources
              </p>
            </div>
            <button
              onClick={() => setIsArchiveOpen(true)}
              className="bg-black text-white border-4 border-black rounded-lg px-4 py-2 font-bold text-sm hover:shadow-hard transition-shadow relative"
            >
              📚 Archive
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">
                  {savedCount}
                </span>
              )}
            </button>
          </div>

          {/* Cognitive Mode Selector */}
          <ModeSelector 
            currentMode={currentMode}
            onModeChange={handleModeChange}
          />

          {/* Bookshelf Grid */}
          <section className="mb-12">
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-4">Your Sources</h3>
            {filteredSources.length === 0 ? (
              <div className="text-center py-12 bg-white border-4 border-black rounded-lg">
                <p className="text-gray-600">No sources in this category yet.</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${getGridClass()}`} key={`sources-${refreshKey}`}>
                {filteredSources.map(source => (
                  <SourceCard 
                    key={source.id} 
                    source={source}
                    onClick={() => window.open(source.url, '_blank')}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Fresh Ideas Feed */}
          <section>
            <h3 className="font-bold text-xs uppercase text-gray-600 mb-4">Fresh Ideas Feed</h3>
            <div className={`grid gap-4 ${getGridClass()}`} key={`articles-${refreshKey}`}>
              {sampleArticles.map(article => (
                <ArticleCard 
                  key={article.id}
                  article={article}
                  onSave={handleRefresh}
                />
              ))}
            </div>
          </section>

          {/* Footer spacing */}
          <div className="h-12" />
        </main>
      </div>

      {/* Modals */}
      <AddSourceModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSourceAdded={handleSourceAdded}
      />

      <Archive 
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        onRefresh={handleRefresh}
      />
    </div>
  )
}
