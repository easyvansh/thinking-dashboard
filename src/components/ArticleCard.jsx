import { isArticleSaved, toggleArticleSaved } from '../utils/storage'

// Generate a simple visual gist pattern based on article data
function getGistPattern(title, source) {
  const chars = (title + source).toUpperCase()
  const patterns = [
    '⬜⬛⬜⬛⬜',
    '⬛⬜⬛⬜⬛',
    '🔷🔶🔷🔶🔷',
    '●○●○●',
    '▲▼▲▼▲',
    '■□■□■'
  ]
  const index = chars.charCodeAt(0) % patterns.length
  return patterns[index]
}

// ArticleCard component
export default function ArticleCard({ article, onSave }) {
  const isSaved = isArticleSaved(article.id)

  const handleSave = () => {
    toggleArticleSaved(article.id)
    onSave && onSave()
  }

  return (
    <div className="bg-white border-4 border-black rounded-lg p-5 shadow-hard hover:shadow-hard-hover transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 flex flex-col h-full">
      {/* Visual Gist */}
      <div className="mb-3 text-center text-xl font-bold tracking-wider">
        {getGistPattern(article.title, article.source)}
      </div>

      {/* Title */}
      <h3 className="font-bold text-base leading-tight mb-2 text-studio-text line-clamp-3">
        {article.title}
      </h3>

      {/* Source & Category */}
      <div className="flex gap-2 mb-3 flex-wrap">
        <span className="text-xs font-bold bg-black text-white px-2 py-1 rounded">
          {article.source}
        </span>
        <span className="text-xs font-bold bg-studio-50 border-2 border-black px-2 py-1 rounded">
          {article.category}
        </span>
      </div>

      {/* Excerpt */}
      <p className="text-xs text-studio-text mb-4 flex-1 line-clamp-2">
        {article.excerpt}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-black text-white px-3 py-2 font-bold rounded text-sm hover:bg-gray-800 transition-colors text-center"
        >
          Read
        </a>
        <button
          onClick={handleSave}
          className={`
            px-3 py-2 font-bold rounded text-sm transition-all border-2
            ${isSaved 
              ? 'bg-black text-white border-black' 
              : 'bg-white border-black hover:bg-studio-50'
            }
          `}
          title={isSaved ? 'Remove from archive' : 'Save to archive'}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>
    </div>
  )
}
