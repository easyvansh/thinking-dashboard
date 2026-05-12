// Sample articles for the Thinking Studio
export const sampleArticles = [
  {
    id: '001',
    title: 'The Art of Attention',
    source: 'The Marginalian',
    sourceId: '550e8400-e29b-41d4-a716-446655440001',
    category: 'Philosophy & Art',
    excerpt: 'How consciousness shapes our perception of beauty and meaning',
    url: 'https://www.themarginalian.org/sample',
    saved: false,
    gist: 'attention-art'
  },
  {
    id: '002',
    title: 'The Future of Understanding',
    source: 'Aeon',
    sourceId: '550e8400-e29b-41d4-a716-446655440002',
    category: 'Philosophy & Art',
    excerpt: 'What it means to think deeply in an age of distraction',
    url: 'https://aeon.co/sample',
    saved: false,
    gist: 'thinking-future'
  },
  {
    id: '003',
    title: 'Neural Networks and Emergence',
    source: 'Distill',
    sourceId: '550e8400-e29b-41d4-a716-446655440004',
    category: 'AI & Research',
    excerpt: 'Understanding how complexity arises from simple rules',
    url: 'https://distill.pub/sample',
    saved: false,
    gist: 'neural-emergence'
  },
  {
    id: '004',
    title: 'Generative Art and Technology',
    source: 'Creative Applications',
    sourceId: '550e8400-e29b-41d4-a716-446655440005',
    category: 'Creative Technology',
    excerpt: 'Artists pushing the boundaries of computational creativity',
    url: 'https://www.creativeapplications.net/sample',
    saved: false,
    gist: 'art-tech'
  },
  {
    id: '005',
    title: 'Safety in AI Systems',
    source: 'Anthropic Research',
    sourceId: '550e8400-e29b-41d4-a716-446655440007',
    category: 'AI & Research',
    excerpt: 'Constitutional approaches to safe and reliable AI',
    url: 'https://www.anthropic.com/research/sample',
    saved: false,
    gist: 'ai-safety'
  },
  {
    id: '006',
    title: 'Design Systems at Scale',
    source: 'Figma Engineering',
    sourceId: '550e8400-e29b-41d4-a716-446655440008',
    category: 'Design',
    excerpt: 'Building collaborative tools for design teams worldwide',
    url: 'https://www.figma.com/blog/sample',
    saved: false,
    gist: 'design-systems'
  },
  {
    id: '007',
    title: 'Building Global Infrastructure',
    source: 'Stripe Engineering',
    sourceId: '550e8400-e29b-41d4-a716-446655440009',
    category: 'Engineering',
    excerpt: 'Lessons from scaling payments across continents',
    url: 'https://stripe.com/blog/sample',
    saved: false,
    gist: 'infra-scale'
  },
  {
    id: '008',
    title: 'Tangible Media Lab',
    source: 'MIT Media Lab',
    sourceId: '550e8400-e29b-41d4-a716-446655440010',
    category: 'Creative Technology',
    excerpt: 'Making digital information tangible and embodied',
    url: 'https://www.media.mit.edu/sample',
    saved: false,
    gist: 'tangible-media'
  },
  {
    id: '009',
    title: 'Visual Culture in the Digital Age',
    source: 'This Is Colossal',
    sourceId: '550e8400-e29b-41d4-a716-446655440012',
    category: 'Film & Culture',
    excerpt: 'New frontiers in contemporary art and design',
    url: 'https://www.thisiscolossal.com/sample',
    saved: false,
    gist: 'visual-culture'
  },
  {
    id: '010',
    title: 'Collaborative Research Platforms',
    source: 'Are.na',
    sourceId: '550e8400-e29b-41d4-a716-446655440011',
    category: 'Creative Technology',
    excerpt: 'New models for distributed creative work',
    url: 'https://www.are.na/sample',
    saved: false,
    gist: 'collab-research'
  }
]

export const starterArticles = sampleArticles.map((article, index) => {
  const shelfByCategory = {
    'Philosophy & Art': 'Philosophy Cafe',
    'AI & Research': 'AI Lab',
    'Creative Technology': 'Creative Spark',
    Engineering: 'Systems Lab',
    Design: 'Creative Spark',
    'Film & Culture': 'Cinema Room'
  }

  return {
    id: `starter_${article.id}`,
    sourceId: article.sourceId,
    sourceName: article.source,
    shelf: shelfByCategory[article.category] || 'Creative Spark',
    sourceStatus: 'active',
    title: article.title,
    articleUrl: article.url,
    snippet: article.excerpt,
    content: article.excerpt,
    publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
    author: article.source,
    categories: [article.category],
    imageUrl: '',
    fetchedAt: new Date().toISOString(),
    saved: false,
    isStarter: true
  }
})
