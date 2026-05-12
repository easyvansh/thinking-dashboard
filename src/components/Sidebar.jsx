import { useMemo, useState } from 'react'

function displayShelfName(shelf) {
  return shelf?.replace(/Caf.+$/, 'Cafe') || 'Unsorted'
}

function formatRefresh(isoString) {
  if (!isoString) return 'Never'
  return new Date(isoString).toLocaleString([], {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function Sidebar({
  sources,
  shelves = [],
  onAddSource,
  onShelfChange,
  currentShelf,
  currentMode,
  stats,
  isDark,
  onToggleTheme,
  lastRefresh
}) {
  const [expandedShelf, setExpandedShelf] = useState(null)

  const sourcesByShelf = useMemo(() => {
    return sources.reduce((grouped, source) => {
      const shelf = source.shelf || 'Unsorted'
      grouped[shelf] = grouped[shelf] || []
      grouped[shelf].push(source)
      return grouped
    }, {})
  }, [sources])

  const activeSources = sources.filter((source) => source.status === 'active').length

  return (
    <aside className="no-scrollbar z-20 flex h-auto w-full flex-col overflow-y-auto border-b-4 border-[var(--border)] bg-[var(--sidebar-bg)] md:h-full md:w-80 md:border-b-0 md:border-r-4">
      <div className="border-b-4 border-[var(--border)] p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 rotate-45 border-2 border-[var(--border)] bg-[var(--accent)]" />
            <h1 className="font-ui text-xs font-bold uppercase opacity-50 tracking-encyclopedic">Ingest Studio</h1>
          </div>
          <span className="font-header text-3xl font-black italic leading-none">
            The Narrative
            <br />
            Observer
          </span>
        </div>

        <button onClick={onToggleTheme} className="studio-button w-full px-4 py-4 text-[10px]">
          {isDark ? 'Enter the Day' : 'Enter the Night'}
        </button>
      </div>

      <div className="no-scrollbar flex-grow overflow-y-auto p-6 md:p-8">
        <div className="mb-8 grid grid-cols-3 gap-2">
          <div className="border-2 border-[var(--border)] bg-[var(--bg-page)] p-3">
            <p className="font-header text-2xl font-black">{stats.total || 0}</p>
            <p className="font-ui text-[9px] font-bold uppercase opacity-50">Texts</p>
          </div>
          <div className="border-2 border-[var(--border)] bg-[var(--bg-page)] p-3">
            <p className="font-header text-2xl font-black">{stats.archived || 0}</p>
            <p className="font-ui text-[9px] font-bold uppercase opacity-50">Saved</p>
          </div>
          <div className="border-2 border-[var(--border)] bg-[var(--bg-page)] p-3">
            <p className="font-header text-2xl font-black">{activeSources}</p>
            <p className="font-ui text-[9px] font-bold uppercase opacity-50">Live</p>
          </div>
        </div>

        <nav className="mb-10 font-ui">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Shelves</p>
          <div className="space-y-2">
            {shelves.map((shelf) => {
              const shelfSources = sourcesByShelf[shelf] || []
              const isExpanded = expandedShelf === shelf
              const isCurrent = currentShelf === shelf

              return (
                <div key={shelf} className="border-2 border-transparent">
                  <button
                    onClick={() => {
                      setExpandedShelf(isExpanded ? null : shelf)
                      onShelfChange(shelf)
                    }}
                    className={`flex w-full items-center justify-between border-2 p-2 text-left text-sm font-bold transition-all ${
                      isCurrent
                        ? 'border-[var(--border)] bg-[var(--accent)] text-white'
                        : 'border-transparent hover:border-[var(--border)] hover:bg-[var(--accent)] hover:text-white'
                    }`}
                  >
                    <span>{displayShelfName(shelf)}</span>
                    <span>({stats.byShelf?.[shelf] || shelfSources.length})</span>
                  </button>

                  {isExpanded && shelfSources.length > 0 && (
                    <div className="mt-2 space-y-2 border-2 border-[var(--border)] bg-[var(--bg-page)] p-2">
                      {shelfSources.map((source) => (
                        <div key={source.id} className="flex items-center justify-between gap-2 text-[10px] font-bold uppercase">
                          <span className="truncate">{source.name}</span>
                          <span className={`h-2 w-2 shrink-0 border border-[var(--border)] ${source.status === 'broken' ? 'bg-[var(--accent)]' : 'bg-green-500'}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </nav>

        <div className="mb-8 font-ui">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">Signal Health</p>
          <div className="space-y-3 text-[10px] font-bold uppercase">
            {sources.slice(0, 5).map((source) => (
              <div key={source.id} className="flex items-center justify-between gap-3">
                <span className="truncate">{source.name}</span>
                <span className={`h-2 w-2 shrink-0 border border-[var(--border)] ${source.status === 'broken' ? 'bg-[var(--accent)]' : 'bg-green-500'}`} />
              </div>
            ))}
          </div>
        </div>

        <button onClick={onAddSource} className="studio-button studio-button-accent w-full px-4 py-3 text-xs">
          Add Source
        </button>
      </div>

      <div className="border-t-4 border-[var(--border)] p-6 md:p-8">
        <div className="border-2 border-[var(--border)] bg-[var(--bg-page)] p-4">
          <p className="font-ui mb-1 text-[9px] font-bold uppercase opacity-50">Last Synchronized</p>
          <p className="font-ui text-xs font-bold uppercase">{formatRefresh(lastRefresh)}</p>
          <p className="font-ui mt-3 text-[9px] font-bold uppercase opacity-50">Mode: {currentMode.replace('-', ' ')}</p>
        </div>
      </div>
    </aside>
  )
}
