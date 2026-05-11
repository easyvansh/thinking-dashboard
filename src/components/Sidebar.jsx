import { useState, useMemo } from 'react'
import SourceCard from './SourceCard'

// Sidebar / Studio Control Panel
export default function Sidebar({ sources, onAddSource, onFilterChange, currentMode }) {
  const [selectedCategory, setSelectedCategory] = useState(null)

  const categories = useMemo(() => {
    const cats = new Set(sources.map(s => s.category))
    return Array.from(cats).sort()
  }, [sources])

  const handleCategoryClick = (category) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    onFilterChange(newCategory)
  }

  const stats = useMemo(() => ({
    totalSources: sources.length,
    categories: categories.length
  }), [sources, categories])

  return (
    <aside className="bg-studio-bg border-r-4 border-black min-h-screen p-4 sm:p-6 flex flex-col w-full md:w-80 overflow-y-auto">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-studio-text mb-1">
          Thinking Studio
        </h1>
        <p className="text-xs text-gray-600 font-bold uppercase tracking-wider">
          Personal Intellectual Hub
        </p>
      </div>

      {/* System Insights */}
      <div className="bg-white border-4 border-black rounded-lg p-4 mb-6 shadow-hard">
        <h3 className="font-bold text-xs uppercase text-studio-text mb-3">Studio Stats</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-bold">Sources:</span>
            <span className="font-mono">{stats.totalSources}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Categories:</span>
            <span className="font-mono">{stats.categories}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-bold">Mode:</span>
            <span className="font-mono capitalize">{currentMode.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Add Source Button */}
      <button
        onClick={onAddSource}
        className="w-full bg-black text-white border-4 border-black rounded-lg px-4 py-3 font-bold mb-6 hover:shadow-hard transition-shadow active:translate-y-1"
      >
        + Add Source
      </button>

      {/* Category Filters */}
      <div className="mb-6">
        <h3 className="font-bold text-xs uppercase text-studio-text mb-3 px-1">
          Filter by Category
        </h3>
        <div className="space-y-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`
                w-full text-left px-3 py-2 rounded-lg font-bold text-sm transition-all border-2
                ${selectedCategory === category
                  ? 'bg-black text-white border-black shadow-hard'
                  : 'bg-white border-black hover:bg-studio-50'
                }
              `}
            >
              {category}
            </button>
          ))}
          {selectedCategory && (
            <button
              onClick={() => handleCategoryClick(null)}
              className="w-full text-left px-3 py-2 rounded-lg font-bold text-sm text-gray-600 hover:text-black transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
