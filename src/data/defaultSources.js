// Default feed manifest for Thinking Studio v2
// Organized by cognitive shelf/mode

export const DEFAULT_SOURCES = [
  // Philosophy Cafe
  {
    id: 'phil_themarginalian',
    name: 'The Marginalian',
    feedUrl: 'https://www.themarginalian.org/feed/',
    homepageUrl: 'https://www.themarginalian.org',
    shelf: 'Philosophy Cafe',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'phil_aeon',
    name: 'Aeon',
    feedUrl: 'https://aeon.co/feed.rss',
    homepageUrl: 'https://aeon.co',
    shelf: 'Philosophy Cafe',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'phil_psyche',
    name: 'Psyche',
    feedUrl: 'https://psyche.co/feed.rss',
    homepageUrl: 'https://psyche.co',
    shelf: 'Philosophy Cafe',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'phil_pointmag',
    name: 'The Point Magazine',
    feedUrl: 'https://thepointmag.com/feed',
    homepageUrl: 'https://thepointmag.com',
    shelf: 'Philosophy Cafe',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'phil_3qd',
    name: '3 Quarks Daily',
    feedUrl: 'https://3quarksdaily.com/feed/',
    homepageUrl: 'https://3quarksdaily.com',
    shelf: 'Philosophy Cafe',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },

  // AI Lab
  {
    id: 'ai_distill',
    name: 'Distill',
    feedUrl: 'https://distill.pub/rss.xml',
    homepageUrl: 'https://distill.pub',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_lesswrong',
    name: 'LessWrong Frontpage',
    feedUrl: 'https://www.lesswrong.com/feed.xml?view=frontpage',
    homepageUrl: 'https://www.lesswrong.com',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_alignmentforum',
    name: 'Alignment Forum',
    feedUrl: 'https://www.alignmentforum.org/feed.xml',
    homepageUrl: 'https://www.alignmentforum.org',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_openai',
    name: 'OpenAI News',
    feedUrl: 'https://openai.com/news/rss.xml',
    homepageUrl: 'https://openai.com',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_anthropic',
    name: 'Anthropic News',
    feedUrl: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/refs/heads/main/feeds/feed_anthropic_news.xml',
    homepageUrl: 'https://www.anthropic.com',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_huggingface',
    name: 'Hugging Face Blog',
    feedUrl: 'https://huggingface.co/blog/feed.xml',
    homepageUrl: 'https://huggingface.co/blog',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'ai_deepmind',
    name: 'Google DeepMind Blog',
    feedUrl: 'https://deepmind.google/blog/rss.xml',
    homepageUrl: 'https://deepmind.google',
    shelf: 'AI Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },

  // Science Cabinet
  {
    id: 'science_nautilus',
    name: 'Nautilus',
    feedUrl: 'https://nautil.us/feed',
    homepageUrl: 'https://nautil.us',
    shelf: 'Science Cabinet',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },

  // Systems Lab
  {
    id: 'systems_stripe',
    name: 'Stripe Blog',
    feedUrl: 'https://stripe.com/blog/feed.rss',
    homepageUrl: 'https://stripe.com/blog',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'systems_netflix',
    name: 'Netflix Tech Blog',
    feedUrl: 'https://netflixtechblog.com/feed',
    homepageUrl: 'https://netflixtechblog.com',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'systems_github',
    name: 'GitHub Blog',
    feedUrl: 'https://github.blog/feed/',
    homepageUrl: 'https://github.blog',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'systems_cloudflare',
    name: 'Cloudflare Blog',
    feedUrl: 'https://blog.cloudflare.com/rss/',
    homepageUrl: 'https://blog.cloudflare.com',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'systems_martinfowler',
    name: 'Martin Fowler',
    feedUrl: 'https://martinfowler.com/feed.atom',
    homepageUrl: 'https://martinfowler.com',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'systems_simonwillison',
    name: 'Simon Willison',
    feedUrl: 'https://simonwillison.net/atom/everything/',
    homepageUrl: 'https://simonwillison.net',
    shelf: 'Systems Lab',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },

  // Cinema Room
  {
    id: 'film_sensesofcinema',
    name: 'Senses of Cinema',
    feedUrl: 'https://www.sensesofcinema.com/feed/',
    homepageUrl: 'https://www.sensesofcinema.com',
    shelf: 'Cinema Room',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'film_filmcomment',
    name: 'Film Comment',
    feedUrl: 'https://www.filmcomment.com/feed/',
    homepageUrl: 'https://www.filmcomment.com',
    shelf: 'Cinema Room',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'film_lwlies',
    name: 'Little White Lies',
    feedUrl: 'https://lwlies.com/feed/',
    homepageUrl: 'https://lwlies.com',
    shelf: 'Cinema Room',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 'film_mubi_notebook',
    name: 'MUBI Notebook',
    feedUrl: 'https://mubi.com/notebook/posts.rss',
    homepageUrl: 'https://mubi.com/notebook',
    shelf: 'Cinema Room',
    status: 'pending',
    lastFetchedAt: null,
    lastError: null,
    createdAt: new Date().toISOString()
  }
];
