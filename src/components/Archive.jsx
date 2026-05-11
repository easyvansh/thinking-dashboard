import ArticleCard from './ArticleCard'
import { getSavedArticles } from '../utils/storage'
import { sampleArticles } from '../data/sampleArticles'

// Archive component - shows saved articles
export default function Archive({ isOpen, onClose, onRefresh }) {
  const savedArticleIds = getSavedArticles().map(a => a.id)
  const savedArticles = sampleArticles.filter(a => savedArticleIds.includes(a.id))

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40
      ${isOpen ? 'block' : 'hidden'}
    `}>
      <div className="bg-white border-6 border-black rounded-lg max-w-4xl w-full max-h-[90vh] shadow-hard-lg flex flex-col mx-4">
        {/* Header */}
        <div className="border-b-4 border-black p-4 sm:p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-studio-text">Studio Archive</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {savedArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-studio-text mb-2">Your Archive is Empty</h3>
              <p className="text-gray-600">
                Save articles from the feed to build your personal reading collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article}
                  onSave={onRefresh}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t-4 border-black p-4 bg-studio-50">
          <button
            onClick={onClose}
            className="w-full bg-black text-white px-4 py-2 font-bold rounded hover:bg-gray-800 transition-colors"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  )
}
