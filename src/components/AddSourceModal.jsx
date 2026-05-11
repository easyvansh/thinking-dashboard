import { useState } from 'react'
import { getStoredSources, saveStoredSources } from '../utils/storage'

// AddSourceModal component
export default function AddSourceModal({ isOpen, onClose, onSourceAdded }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    url: '',
    feedUrl: '',
    description: ''
  })

  const [errors, setErrors] = useState({})

  const categories = [
    'Philosophy & Art',
    'AI & Research',
    'Creative Technology',
    'Engineering',
    'Design',
    'Film & Culture',
    'Systems Thinking'
  ]

  const accentColors = {
    'Philosophy & Art': 'accent-philosophy',
    'AI & Research': 'accent-ai',
    'Creative Technology': 'accent-creative',
    'Engineering': 'accent-engineering',
    'Design': 'accent-design',
    'Film & Culture': 'accent-film',
    'Systems Thinking': 'accent-systems'
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.url.trim()) newErrors.url = 'URL is required'
    if (formData.url && !formData.url.startsWith('http')) {
      newErrors.url = 'URL must start with http:// or https://'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const newSource = {
      id: crypto.randomUUID(),
      name: formData.name.trim(),
      category: formData.category || 'Creative Technology',
      url: formData.url.trim(),
      feedUrl: formData.feedUrl.trim() || '',
      description: formData.description.trim(),
      accentClass: accentColors[formData.category] || 'accent-creative'
    }

    // Save to storage
    const sources = getStoredSources()
    sources.push(newSource)
    saveStoredSources(sources)

    // Reset form
    setFormData({
      name: '',
      category: '',
      url: '',
      feedUrl: '',
      description: ''
    })
    setErrors({})

    // Notify parent
    onSourceAdded && onSourceAdded(newSource)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white border-6 border-black rounded-lg max-w-md w-full shadow-hard-lg">
        <div className="border-b-4 border-black p-4 sm:p-6">
          <h2 className="text-2xl font-bold text-studio-text">Add Source</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block font-bold text-sm mb-2">Source Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., The Marginalian"
              className="w-full border-3 border-black rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            />
            {errors.name && <p className="text-red-600 text-xs mt-1 font-bold">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block font-bold text-sm mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border-3 border-black rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* URL */}
          <div>
            <label className="block font-bold text-sm mb-2">Website URL *</label>
            <input
              type="text"
              value={formData.url}
              onChange={(e) => setFormData({...formData, url: e.target.value})}
              placeholder="https://example.com"
              className="w-full border-3 border-black rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            />
            {errors.url && <p className="text-red-600 text-xs mt-1 font-bold">{errors.url}</p>}
          </div>

          {/* Feed URL */}
          <div>
            <label className="block font-bold text-sm mb-2">RSS Feed URL (optional)</label>
            <input
              type="text"
              value={formData.feedUrl}
              onChange={(e) => setFormData({...formData, feedUrl: e.target.value})}
              placeholder="https://example.com/feed"
              className="w-full border-3 border-black rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-sm mb-2">Description (optional)</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What makes this source special?"
              rows="2"
              className="w-full border-3 border-black rounded px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-offset-0"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-3 border-black px-4 py-2 font-bold rounded hover:bg-studio-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white border-3 border-black px-4 py-2 font-bold rounded hover:bg-gray-800 transition-colors"
            >
              Add Source
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
