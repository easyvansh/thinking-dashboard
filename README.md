# Thinking Studio v2: Real-Time Studio

A local-first Chrome new-tab extension for curating a personal intellectual reading studio. Browse 30+ RSS feeds across multiple knowledge shelves with a beautiful, Neubrutalist interface.

**No authentication. No backend. No tracking. Just you, your feed, and your studio.**

## Project Overview

Thinking Studio is a **Dynamic Studio Environment** for thinking, reading, creativity, AI learning, systems thinking, film/art inspiration, and deep work. It transforms your new tab into a personal bookshelf of curated sources and fresh ideas.

### Visual Direction

- Pop-art / sticker style
- Bold borders
- Slightly playful but polished
- Editorial magazine layout
- Creative technologist aesthetic
- Tactile buttons with hard shadows
- Modular "bookshelf" sections

## MVP Features

### Core Components

1. **Bookshelf View** - Curated sources as cards with:
   - Source name, category, URL, RSS feed
   - Color/accent styling
   - One-click visit and feed copying

2. **Fresh Ideas Feed** - Article cards from sample data with:
   - Title, source, category, excerpt
   - Visual gist patterns
   - Save/unsave to archive

3. **Cognitive Modes** - Three layout modes:
   - Deep Work: Spacious 2-column layout
   - Quick Scan: Compact 3-column layout
   - Creative Spark: Expressive layout with visual variation

4. **Add Source Modal** - User can add:
   - Source name, category, website URL, RSS feed URL
   - Form validation
   - Automatic localStorage persistence

5. **Studio Archive** - Shows saved articles with:
   - Persistent storage
   - Empty state messaging
   - Quick archive management

6. **Sidebar Control Panel** - Studio management with:
   - App title and stats
   - Add Source button
   - Category filters
   - System insights

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- JavaScript (not TypeScript)
- Chrome Extension Manifest V3
- localStorage for persistence

## Project Structure

```
src/
├── components/                    # React components
│   ├── App.jsx                   # Main app
│   ├── ArticleCard.jsx           # Article display
│   ├── Archive.jsx               # Saved articles
│   ├── AddSourceModal.jsx        # Add custom feed
│   ├── SearchBar.jsx             # Search UI
│   ├── RefreshButton.jsx         # Refresh feeds
│   ├── ModeSelector.jsx          # Cognitive modes
│   └── Sidebar.jsx               # Navigation
├── utils/                         # Business logic
│   ├── db.js                     # IndexedDB setup
│   ├── sourceRepository.js       # Sources CRUD
│   ├── articleRepository.js      # Articles CRUD + dedup
│   ├── archiveRepository.js      # Archive CRUD
│   ├── metadataRepository.js     # App state
│   ├── rssService.js             # RSS fetching
│   ├── refreshService.js         # Feed refresh logic
│   └── searchService.js          # Search/filter
├── data/
│   └── defaultSources.js         # 30+ default feeds
└── index.css                      # Tailwind styles
```

## Getting Started

### Getting Started

### Prerequisites

- Node.js 16+
- Chrome/Chromium browser
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/easyvansh/thinking-dashboard.git
cd thinking-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

### Loading the Extension in Chrome

1. Open **chrome://extensions/**
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `dist/` folder
5. Open a new tab - you should see your Thinking Studio

## How It Works

### 1. Initialization

On first load:
- Creates IndexedDB database
- Adds 30+ default RSS feeds
- Initializes app metadata

### 2. Refreshing Feeds

Click **🔄 Refresh** to:
- Fetch all RSS feeds via [RSS2JSON API](https://rss2json.com)
- Normalize articles to common format
- Deduplicate using `articleUrl`
- Update source health status
- Store new articles in IndexedDB

### 3. Browsing Articles

- **Shelf Filters**: Click tabs to filter articles
- **Search**: Type to find articles or sources
- **Modes**: Switch layouts (Deep Work, Quick Scan, Creative Spark)
- **Open Source**: Click card to visit original article
- **Save**: Star to archive for later

### 4. Archive

Save articles by starring:
- Persists in IndexedDB
- Works offline
- Allows notes/annotations
- Never synced to cloud

## Data Model

### Source

```javascript
{
  id: string                    // Unique ID
  name: string                  // Feed name
  feedUrl: string              // RSS/Atom URL
  homepageUrl: string          // Homepage link
  shelf: string                // Category (Philosophy Café, AI Lab, etc)
  status: 'active'|'broken'|'pending'
  lastFetchedAt: ISO string    // Last successful fetch
  lastError: string            // Error message if broken
  createdAt: ISO string        // When added
}
```

### Article

```javascript
{
  id: string                    // Generated from URL or title
  sourceId: string             // Reference to source
  sourceName: string           // Feed name for display
  shelf: string                // Inherited from source
  title: string                // Article title
  articleUrl: string           // Original article URL
  snippet: string              // Preview text (300 chars)
  content: string              // Full HTML content
  publishedAt: ISO string      // Publication date
  author: string               // Article author
  categories: array            // Tags/categories
  imageUrl: string             // Featured image
  fetchedAt: ISO string        // When fetched
  saved: boolean               // Archive flag
}
```

### Archived Article

```javascript
{
  id: string                    // archive_{articleId}
  articleId: string            // Reference to original
  title: string                // Article title
  sourceName: string           // Feed name
  articleUrl: string           // Original URL
  snippet: string              // Preview text
  shelf: string                // Category
  publishedAt: ISO string      // Publication date
  savedAt: ISO string          // When archived
  notes: string                // User notes
}
```

## Adding Custom Feeds

1. Click **+ Add Source**
2. Enter feed name
3. Select shelf
4. Paste RSS feed URL
5. Click **Add**
6. Click **🔄 Refresh** to fetch articles

**Finding RSS feeds:**
- Look for `/feed`, `/feed.xml`, `/rss.xml`, `/atom.xml` URLs
- Many sites expose feeds in `<head>` via `<link rel="alternate">`
- Use [Find RSS Feeds](https://findrssfeed.com) as backup

## Architecture Decisions

### IndexedDB over localStorage
- **Scalability**: Can store 100k+ articles vs 5-10MB limit
- **Performance**: Async operations don't block UI
- **Complex queries**: Index articles by date, shelf, source
- **Offline**: Full app works completely offline

### RSS2JSON API vs Direct RSS Parsing
- **CORS**: Browsers can't fetch cross-origin RSS directly
- **Normalization**: Converts RSS, Atom, RDF to consistent format
- **Reliability**: Fallback if proxies fail gracefully
- **Privacy**: No data leaves your browser except RSS URLs

### Deduplication Strategy
- **Primary key**: `articleUrl` (most reliable)
- **Fallback**: `title + sourceName + publishedAt` (normalized)
- **Check before insert**: Prevents duplicates in archive

### Error Handling
- **Per-feed**: One broken feed doesn't crash app
- **Source health**: Status tracked (active/broken/pending)
- **User feedback**: Errors shown in UI without blocking

## Privacy & Data

- **All local**: No data sent to backend servers
- **No tracking**: No analytics, no ads, no profiling
- **Portable**: IndexedDB stored locally, easily exported
- **Open source**: Full transparency on what the app does

## Troubleshooting

### Extension won't load
- Check `manifest.json` exists in `dist/`
- Ensure file paths are correct
- Look at Chrome DevTools for errors

### Feeds not updating
- Click **🔄 Refresh** manually
- Check feed status indicators in Sidebar
- Some feeds may be CORS-blocked

### Articles not appearing
- Click **🔄 Refresh** to fetch from feeds
- Check IndexedDB storage via DevTools → Application → IndexedDB
- Try searching for known article titles

### Storage full
- IndexedDB limit is typically 50MB+
- Archive old articles to free space
- Check browser quota: `navigator.storage.estimate()`

## Future Enhancements (v3+)

- [ ] AI-powered article summaries (optional)
- [ ] Keyboard shortcuts (j/k to navigate, s to save)
- [ ] Reading time estimates
- [ ] Dark mode toggle
- [ ] Export articles as PDF
- [ ] Sync to optional backend (Firebase)
- [ ] Topic clustering
- [ ] Reading statistics
- [ ] Collections/playlists
- [ ] Social sharing (without tracking)

## License

MIT - Use, modify, share freely

## Contributing

Contributions welcome! Please:
1. Fork the repo
2. Create feature branch (`git checkout -b feature/xyz`)
3. Make changes
4. Test locally
5. Submit pull request

## Support

- 📝 [GitHub Issues](https://github.com/easyvansh/thinking-dashboard/issues)
- 💬 [Discussions](https://github.com/easyvansh/thinking-dashboard/discussions)

---

**Built for creative technologists, writers, researchers, and lifelong learners.**

*Version 2.0 - Real-Time Studio*

### Colors

- **Background**: `#faf8f3` (warm off-white)
- **Text**: `#1a1a1a` (almost black)
- **Border**: `#000` (pure black)
- **Accents**: Category-specific colors

### Shadows

- **hard**: `4px 4px 0px rgba(0, 0, 0, 0.15)`
- **hard-lg**: `6px 6px 0px rgba(0, 0, 0, 0.15)`
- **hard-hover**: `2px 2px 0px rgba(0, 0, 0, 0.1)`

### Typography

- Display: system-ui sans-serif
- Body: system-ui sans-serif
- Large, bold headings
- Monospace for certain UI elements

## MVP Acceptance Criteria

✓ `npm install` works  
✓ `npm run dev` works  
✓ `npm run build` works  
✓ Chrome extension loads from dist folder  
✓ New tab page displays dashboard  
✓ Sources render correctly  
✓ Articles render correctly  
✓ Mode selector changes layout  
✓ Add Source modal works  
✓ Saved articles persist after refresh  
✓ UI is visually expressive, not plain  

## Future Phases

### Phase 2: RSS Integration
- Backend RSS proxy/parser
- Real feed ingestion
- Article updates

### Phase 3: AI Enhancements
- AI-generated summaries
- Semantic tagging
- Smart recommendations

### Phase 4: Knowledge Graph
- Relationship mapping
- Semantic search
- Cross-source connections

### Phase 5: Chrome Sync
- Cross-device sync
- Import/export libraries
- Source sharing

### Phase 6: Reading Rituals
- Daily digest modes
- Reading streaks
- Focus sessions

## Important Notes

- This MVP uses **mock data only**. No backend RSS fetching yet.
- All data persists via **localStorage**. Architecture is ready for IndexedDB/chrome.storage migration.
- **No TypeScript** in MVP for faster development.
- **No external UI libraries** - built with Tailwind only.
- No authentication, backend, AI APIs, or real RSS parsing yet.

## Development Principles

1. **Start visible** - Build what's touchable first
2. **Local-first** - All data persists locally
3. **Simple state** - React hooks + localStorage only
4. **Visual first** - Design matters as much as functionality
5. **MVP velocity** - Ship beautiful basics before features
6. **Modular components** - Each feature is self-contained
7. **Tactical builds** - Skip backend scaffolding

## License

MIT
