import { useState, useEffect } from 'react'
import { toggleArticleSaved } from '../utils/articleRepository'
import { saveToArchive, removeFromArchive, isArticleArchived } from '../utils/archiveRepository'

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?auto=format&fit=crop&q=80&w=1200'
]

function displayShelfName(shelf) {
  return shelf?.replace(/Caf.+$/, 'Cafe') || 'Unsorted'
}

export default function ArticleCard({ article, index = 0, onSave }) {
  const [isSaved, setIsSaved] = useState(article.saved || false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadSavedState = async () => {
      if (!article?.id) return
      try {
        const archived = await isArticleArchived(article.id)
        if (mounted) {
          setIsSaved(archived || !!article.saved)
        }
      } catch (err) {
        console.error('Error loading saved state:', err)
      }
    }

    loadSavedState()

    return () => {
      mounted = false
    }
  }, [article.id, article.saved])

  const formatDate = (isoString) => {
    if (!isoString) return 'undated'

    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return 'undated'

    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

    return date.toLocaleDateString()
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (isSaved) {
        await removeFromArchive(article.id)
        await toggleArticleSaved(article.id)
      } else {
        await saveToArchive(article)
        await toggleArticleSaved(article.id)
      }
      setIsSaved(!isSaved)
      onSave && onSave()
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sourceStatus = article.sourceStatus || 'active'
  const heroImage = article.imageUrl || HERO_IMAGES[index % HERO_IMAGES.length]
  const preview = article.snippet || article.content || article.excerpt || '(no preview)'

  return (
    <article className="nb-card group overflow-hidden p-8">
      <div className="nautilus-hero">
        <img
          src={heroImage}
          className="h-full w-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
          alt=""
        />
        <div className="hero-overlay" />
        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between gap-4 text-white">
          <span className="font-ui border-2 border-black bg-[var(--accent)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            {displayShelfName(article.shelf)}
          </span>
          <span className="font-ui border-2 border-white bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
            {sourceStatus === 'broken' ? 'Check Feed' : 'Live Signal'}
          </span>
        </div>
      </div>

      <div className="font-ui mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-widest">{article.sourceName || article.source || 'Unknown Source'}</div>
        <div className="text-xs font-bold uppercase opacity-40">{formatDate(article.publishedAt)}</div>
      </div>

      <h3 className="font-header mb-8 text-4xl font-black leading-none tracking-tight md:text-5xl">
        {article.title}
      </h3>

      <div className="gist-block mb-10 p-6 md:p-8">
        <div className="gist-label">Gist / Marginalia</div>
        <p className="line-clamp-4 text-lg italic leading-relaxed opacity-90 md:text-xl">
          {preview}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          <div className="h-3 w-3 border border-[var(--border)] bg-[var(--text-primary)]" />
          <div className="h-3 w-3 border border-[var(--border)] bg-[var(--text-primary)] opacity-30" />
          <div className="h-3 w-3 border border-[var(--border)] bg-[var(--text-primary)] opacity-30" />
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`studio-button px-5 py-3 text-xs ${isSaved ? '' : 'bg-[var(--bg-card)] text-[var(--text-primary)]'}`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
          <a
            href={article.articleUrl || article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-button studio-button-accent px-5 py-3 text-center text-xs"
          >
            Enter Narrative
          </a>
        </div>
      </div>
    </article>
  )
}
