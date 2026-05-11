import { useState, useEffect } from 'react'
import { getArchivedArticles } from '../utils/archiveRepository'

function displayShelfName(shelf) {
  return shelf?.replace('CafÃ©', 'Cafe') || 'Unsorted'
}

export default function Archive({ isOpen, onClose, onRefresh }) {
  const [archived, setArchived] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadArchived()
    }
  }, [isOpen])

  const loadArchived = async () => {
    setIsLoading(true)
    try {
      setArchived(await getArchivedArticles())
    } catch (error) {
      console.error('Error loading archived articles:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    await loadArchived()
    onRefresh && onRefresh()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4">
      <div className="studio-panel flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden">
        <div className="flex items-start justify-between gap-4 border-b-4 border-[var(--border)] p-6">
          <div>
            <p className="font-ui mb-2 text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">Saved Texts</p>
            <h2 className="font-header text-4xl font-black italic">Studio Archive</h2>
            <p className="font-ui mt-2 text-xs font-bold uppercase opacity-50">{archived.length} articles captured</p>
          </div>
          <button onClick={onClose} className="studio-button bg-[var(--bg-card)] px-4 py-2 text-xs text-[var(--text-primary)]" title="Close">
            Close
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="p-12 text-center">
              <p className="font-header text-3xl font-black italic">Loading archive...</p>
            </div>
          ) : archived.length === 0 ? (
            <div className="p-12 text-center">
              <h3 className="font-header mb-3 text-4xl font-black">Archive Empty</h3>
              <p className="text-[var(--text-secondary)]">Save articles from feeds to build your reading collection.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {archived.map((item) => (
                <article key={item.id} className="border-4 border-[var(--border)] bg-[var(--bg-card)] p-5">
                  <p className="font-ui mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                    {displayShelfName(item.shelf)}
                  </p>
                  <h4 className="font-header mb-4 line-clamp-3 text-2xl font-black leading-none">{item.title}</h4>
                  <p className="font-ui mb-3 text-xs font-bold uppercase opacity-60">{item.sourceName}</p>
                  <p className="mb-5 line-clamp-3 text-sm italic text-[var(--text-secondary)]">{item.snippet || '(no preview)'}</p>
                  {item.notes && (
                    <div className="gist-block mb-5 p-4">
                      <div className="gist-label">Notes</div>
                      <p className="text-sm italic">{item.notes}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-ui text-[10px] font-bold uppercase opacity-50">
                      {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'Saved'}
                    </p>
                    <a
                      href={item.articleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-button studio-button-accent px-4 py-2 text-[10px]"
                    >
                      Open
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t-4 border-[var(--border)] bg-[var(--bg-page)] p-4">
          <button onClick={handleRefresh} disabled={isLoading} className="studio-button studio-button-accent px-4 py-3 text-xs">
            Refresh
          </button>
          <button onClick={onClose} className="studio-button bg-[var(--bg-card)] px-4 py-3 text-xs text-[var(--text-primary)]">
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
