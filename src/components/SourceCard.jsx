// SourceCard component - displays a single source
export default function SourceCard({ source, onClick }) {
  return (
    <div
      className={`
        bg-white border-4 border-black rounded-lg p-6 
        ${source.accentClass} 
        shadow-hard hover:shadow-hard-hover 
        transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5
        cursor-pointer group
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-studio-text flex-1 group-hover:scale-105 transition-transform">
          {source.name}
        </h3>
      </div>
      
      <div className="mb-2">
        <span className="inline-block bg-black text-white px-2 py-1 text-xs font-bold rounded">
          {source.category}
        </span>
      </div>

      <p className="text-sm text-studio-text mb-4 leading-snug">
        {source.description}
      </p>

      <div className="flex gap-2 text-xs">
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-black text-white px-3 py-2 font-bold rounded hover:bg-gray-800 transition-colors text-center"
          onClick={(e) => e.stopPropagation()}
        >
          Visit
        </a>
        {source.feedUrl && (
          <button
            className="flex-1 border-2 border-black px-3 py-2 font-bold rounded hover:bg-studio-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              navigator.clipboard.writeText(source.feedUrl)
            }}
            title="Copy feed URL"
          >
            📡
          </button>
        )}
      </div>
    </div>
  )
}
