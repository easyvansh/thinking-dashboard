# Thinking Studio

A Chrome new-tab extension for personal intellectual reading and thinking.

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
thinking-studio/
├── public/
│   └── manifest.json          # Chrome Extension config
├── src/
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # React entry point
│   ├── index.css              # Global styles
│   ├── data/
│   │   ├── starterSources.js  # 12 curated sources
│   │   └── sampleArticles.js  # Sample article data
│   ├── components/
│   │   ├── Sidebar.jsx        # Control panel
│   │   ├── SourceCard.jsx     # Source card component
│   │   ├── ArticleCard.jsx    # Article card with visual gist
│   │   ├── ModeSelector.jsx   # Cognitive mode selector
│   │   ├── AddSourceModal.jsx # Add source form
│   │   └── Archive.jsx        # Saved articles archive
│   └── utils/
│       └── storage.js         # localStorage utilities
├── index.html                 # HTML entry
├── package.json               # Dependencies
├── vite.config.js            # Vite config
├── tailwind.config.js        # Tailwind config
├── postcss.config.js         # PostCSS config
├── AGENTS.md                 # Agent instructions
└── README.md                 # This file
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens dev server at `http://localhost:5173`

### Build

```bash
npm run build
```

Creates optimized build in `dist/` folder.

### Chrome Extension Installation

1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode" (top right)
4. Click "Load unpacked"
5. Select the `dist/` folder
6. Open a new tab to see Thinking Studio

## Data Structure

### Source Object

```javascript
{
  id: 'uuid',
  name: 'The Marginalian',
  category: 'Philosophy & Art',
  url: 'https://www.themarginalian.org',
  feedUrl: 'https://www.themarginalian.org/feed',
  description: 'Exploring the intersection of science, art, and philosophy',
  accentClass: 'accent-philosophy'
}
```

### Article Object

```javascript
{
  id: '001',
  title: 'The Art of Attention',
  source: 'The Marginalian',
  sourceId: 'uuid',
  category: 'Philosophy & Art',
  excerpt: 'How consciousness shapes our perception of beauty and meaning',
  url: 'https://...',
  saved: false,
  gist: 'attention-art'
}
```

## Storage API

All functions in `src/utils/storage.js` with try/catch error handling:

- `getStoredSources()` - Get all sources (fallback to starter)
- `saveStoredSources(sources)` - Save sources
- `getSavedArticles()` - Get saved article IDs
- `saveSavedArticles(articles)` - Save articles
- `getStoredMode()` - Get cognitive mode
- `saveStoredMode(mode)` - Save mode
- `toggleArticleSaved(articleId)` - Toggle save state
- `isArticleSaved(articleId)` - Check if saved
- `clearAllData()` - Reset all storage

## Categories

1. Philosophy & Art
2. AI & Research
3. Creative Technology
4. Engineering
5. Design
6. Film & Culture
7. Systems Thinking

## Starter Sources

12 curated sources included:
- The Marginalian
- Aeon
- Nautilus
- Distill
- Creative Applications
- OpenAI Research
- Anthropic Research
- Figma Engineering
- Stripe Engineering
- MIT Media Lab
- Are.na
- This Is Colossal

## Design System

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
