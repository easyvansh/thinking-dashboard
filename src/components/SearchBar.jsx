import { useState, useEffect } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search...' }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 250)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="mb-5">
      <div className="studio-panel flex gap-3 p-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="font-ui w-full border-2 border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 pr-10 text-sm font-bold outline-none placeholder:text-[var(--text-secondary)] focus:bg-[var(--bg-card)]"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="font-ui absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold opacity-60 hover:opacity-100"
              title="Clear search"
            >
              X
            </button>
          )}
        </div>
        <button type="submit" className="studio-button studio-button-accent px-5 py-3 text-xs" title="Search">
          Search
        </button>
      </div>
    </form>
  )
}
