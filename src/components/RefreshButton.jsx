export default function RefreshButton({ isRefreshing, onRefresh, lastRefresh }) {
  const formatTime = (isoString) => {
    if (!isoString) return 'never'

    const date = new Date(isoString)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

    return date.toLocaleDateString()
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={onRefresh}
        disabled={isRefreshing}
        className={`studio-button px-4 py-2 text-[10px] ${
          isRefreshing ? 'cursor-not-allowed opacity-60' : 'bg-[var(--bg-card)] text-[var(--text-primary)]'
        }`}
        title="Refresh all feeds"
      >
        {isRefreshing ? 'Fetching' : 'Refresh'}
      </button>
      <p className="font-ui text-[10px] font-bold uppercase opacity-50">{formatTime(lastRefresh)}</p>
    </div>
  )
}
