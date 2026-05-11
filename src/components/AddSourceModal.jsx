import { useState } from 'react'
import { addSource } from '../utils/sourceRepository'

const FALLBACK_SHELVES = [
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

export default function AddSourceModal({ isOpen, onClose, onSourceAdded, shelves = FALLBACK_SHELVES }) {
  const [formData, setFormData] = useState({
    name: '',
    shelf: shelves[0] || 'AI Lab',
    feedUrl: '',
    homepageUrl: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Source name is required'
    if (!formData.feedUrl.trim()) {
      newErrors.feedUrl = 'RSS feed URL is required'
    } else if (!formData.feedUrl.startsWith('http')) {
      newErrors.feedUrl = 'URL must start with http:// or https://'
    }
    if (formData.homepageUrl && !formData.homepageUrl.startsWith('http')) {
      newErrors.homepageUrl = 'URL must start with http:// or https://'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    try {
      const newSource = {
        id: `custom_${Date.now()}`,
        name: formData.name.trim(),
        shelf: formData.shelf,
        feedUrl: formData.feedUrl.trim(),
        homepageUrl: formData.homepageUrl.trim() || formData.feedUrl.trim(),
        status: 'pending',
        lastFetchedAt: null,
        lastError: null,
        createdAt: new Date().toISOString()
      }

      await addSource(newSource)

      setFormData({
        name: '',
        shelf: shelves[0] || 'AI Lab',
        feedUrl: '',
        homepageUrl: ''
      })
      setErrors({})

      onSourceAdded && onSourceAdded(newSource)
      onClose()
    } catch (error) {
      console.error('Error adding source:', error)
      setErrors({ submit: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="studio-panel max-h-[92vh] w-full max-w-lg overflow-y-auto">
        <div className="border-b-4 border-[var(--border)] p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="h-4 w-4 rotate-45 border-2 border-[var(--border)] bg-[var(--accent)]" />
            <p className="font-ui text-[10px] font-bold uppercase tracking-[0.3em] opacity-50">New Signal</p>
          </div>
          <h2 className="font-header text-4xl font-black italic">Add Source</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {errors.submit && (
            <div className="gist-block p-4">
              <div className="gist-label">Error</div>
              <p className="font-ui text-sm font-bold text-[var(--accent)]">{errors.submit}</p>
            </div>
          )}

          <div>
            <label className="font-ui mb-2 block text-xs font-bold uppercase tracking-widest">Source Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="The Marginalian"
              className="font-ui w-full border-2 border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm font-bold outline-none"
            />
            {errors.name && <p className="font-ui mt-1 text-xs font-bold text-[var(--accent)]">{errors.name}</p>}
          </div>

          <div>
            <label className="font-ui mb-2 block text-xs font-bold uppercase tracking-widest">Shelf</label>
            <select
              value={formData.shelf}
              onChange={(e) => setFormData({ ...formData, shelf: e.target.value })}
              className="font-ui w-full border-2 border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm font-bold outline-none"
            >
              {shelves.map((shelf) => (
                <option key={shelf} value={shelf}>
                  {displayShelfName(shelf)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-ui mb-2 block text-xs font-bold uppercase tracking-widest">RSS Feed URL</label>
            <input
              type="url"
              value={formData.feedUrl}
              onChange={(e) => setFormData({ ...formData, feedUrl: e.target.value })}
              placeholder="https://example.com/feed.xml"
              className="font-ui w-full border-2 border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm font-bold outline-none"
            />
            {errors.feedUrl && <p className="font-ui mt-1 text-xs font-bold text-[var(--accent)]">{errors.feedUrl}</p>}
          </div>

          <div>
            <label className="font-ui mb-2 block text-xs font-bold uppercase tracking-widest">Homepage URL</label>
            <input
              type="url"
              value={formData.homepageUrl}
              onChange={(e) => setFormData({ ...formData, homepageUrl: e.target.value })}
              placeholder="https://example.com"
              className="font-ui w-full border-2 border-[var(--border)] bg-[var(--bg-page)] px-4 py-3 text-sm font-bold outline-none"
            />
            {errors.homepageUrl && <p className="font-ui mt-1 text-xs font-bold text-[var(--accent)]">{errors.homepageUrl}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} disabled={isLoading} className="studio-button bg-[var(--bg-card)] px-4 py-3 text-xs text-[var(--text-primary)]">
              Cancel
            </button>
            <button type="submit" disabled={isLoading} className="studio-button studio-button-accent px-4 py-3 text-xs disabled:opacity-50">
              {isLoading ? 'Adding' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
