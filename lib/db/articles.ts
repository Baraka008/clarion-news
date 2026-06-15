import { adminDb } from '@/lib/server/firebaseAdmin';
import { Article } from '@/lib/types';

type HomeCategoryPreview = {
  id: string;
  name: string;
  slug: string;
  title: string;
  description: string;
  createdAt: string;
};

type HomePreviewData = {
  hero: Article;
  topStories: Article[];
  trending: Article[];
  latest: Article[];
  categories: HomeCategoryPreview[];
};

const articlesCollection = () => adminDb.collection('Articles');

function mapArticleDoc(doc: any): Article {
  const data = doc.data() as Omit<Article, 'id'>;
  return { id: doc.id, ...data };
}

export async function getHomePreviewData(): Promise<HomePreviewData> {
  try {
    const heroQuery = articlesCollection().where('status', '==', 'published').orderBy('publishedAt', 'desc').limit(1);
    const topStoriesQuery = articlesCollection().where('status', '==', 'published').orderBy('viewCount', 'desc').limit(4);
    const trendingQuery = articlesCollection().where('status', '==', 'published').orderBy('updatedAt', 'desc').limit(4);
    const latestQuery = articlesCollection().where('status', '==', 'published').orderBy('publishedAt', 'desc').limit(5);

    const [heroSnap, topSnap, trendingSnap, latestSnap] = await Promise.all([
      heroQuery.get(),
      topStoriesQuery.get(),
      trendingQuery.get(),
      latestQuery.get(),
    ]);

    const hero = heroSnap.docs[0] ? mapArticleDoc(heroSnap.docs[0]) : null;
    const topStories: Article[] = topSnap.docs.map(mapArticleDoc);
    const trending: Article[] = trendingSnap.docs.map(mapArticleDoc);
    const latest: Article[] = latestSnap.docs.map(mapArticleDoc);

    const categories: HomeCategoryPreview[] = [
      { id: 'technology', name: 'Technology', slug: 'technology', title: 'Technology', description: 'Innovation, startups, and market-moving product news.', createdAt: new Date().toISOString() },
      { id: 'business', name: 'Business', slug: 'business', title: 'Business', description: 'Markets, finance, and the global economy.', createdAt: new Date().toISOString() },
      { id: 'world', name: 'World', slug: 'world', title: 'World', description: 'International coverage and major diplomatic stories.', createdAt: new Date().toISOString() },
    ];

    return {
      hero: hero || {
        id: 'hero-fallback',
        title: 'Clarion Feature launches a new era of global reporting',
        slug: 'clarion-feature-launch',
        content: '',
        summary: 'A premium news platform that combines breaking updates with deep analysis and verified reporting from around the world.',
        featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        author: 'Editorial Team',
        category: 'Breaking News',
        tags: ['launch', 'news'],
        status: 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 2100,
        seoTitle: 'Clarion Feature site launch',
        seoDescription: 'Clarion Feature launches with global reporting, breaking coverage, and premium editorial workflow.',
        readingTime: 4,
      },
      topStories,
      trending,
      latest,
      categories,
    };
  } catch (error) {
    console.error('Error fetching home preview data:', error);
    // Return fallback data when Firestore is unavailable or empty
    return {
      hero: {
        id: 'hero-fallback',
        title: 'Clarion Feature launches a new era of global reporting',
        slug: 'clarion-feature-launch',
        content: '',
        summary: 'A premium news platform that combines breaking updates with deep analysis and verified reporting from around the world.',
        featuredImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
        author: 'Editorial Team',
        category: 'Breaking News',
        tags: ['launch', 'news'],
        status: 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 2100,
        seoTitle: 'Clarion Feature site launch',
        seoDescription: 'Clarion Feature launches with global reporting, breaking coverage, and premium editorial workflow.',
        readingTime: 4,
      },
      topStories: [],
      trending: [],
      latest: [],
      categories: [
        { id: 'technology', name: 'Technology', slug: 'technology', title: 'Technology', description: 'Innovation, startups, and market-moving product news.', createdAt: new Date().toISOString() },
        { id: 'business', name: 'Business', slug: 'business', title: 'Business', description: 'Markets, finance, and the global economy.', createdAt: new Date().toISOString() },
        { id: 'world', name: 'World', slug: 'world', title: 'World', description: 'International coverage and major diplomatic stories.', createdAt: new Date().toISOString() },
      ],
    };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const snapshot = await articlesCollection().where('slug', '==', slug).limit(1).get();
  const doc = snapshot.docs[0];
  if (!doc) return null;
  return mapArticleDoc(doc);
}

export async function getRelatedArticles(category: string, articleId: string): Promise<Article[]> {
  const snapshot = await articlesCollection()
    .where('category', '==', category)
    .where('status', '==', 'published')
    .orderBy('publishedAt', 'desc')
    .limit(4)
    .get();
  return snapshot.docs
    .map(mapArticleDoc)
    .filter((item) => item.id !== articleId)
    .slice(0, 3);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  try {
    const snapshot = await articlesCollection()
      .where('category', '==', category)
      .where('status', '==', 'published')
      .orderBy('publishedAt', 'desc')
      .get();
    return snapshot.docs.map(mapArticleDoc);
  } catch (error) {
    console.error(`Error fetching articles for category ${category}:`, error);
    return [];
  }
}

export async function getAllArticleSlugs() {
  const snapshot = await articlesCollection().orderBy('publishedAt', 'desc').get();
  return snapshot.docs.map((doc: any) => ({ slug: (doc.data() as Article).slug }));
}

export async function searchArticles(queryText: string, category?: string, fromDate?: string, toDate?: string) {
  const snapshot = await articlesCollection().where('status', '==', 'published').orderBy('publishedAt', 'desc').get();
  const normalizedQuery = queryText.toLowerCase();
  return snapshot.docs
    .map((doc: any) => mapArticleDoc(doc))
    .filter((article) => {
      const matchesText = [article.title, article.summary, article.content, ...(article.tags ?? [])].some((field) => field?.toLowerCase().includes(normalizedQuery));
      const matchesCategory = category ? article.category.toLowerCase() === category.toLowerCase() : true;
      const matchesDate = (() => {
        if (!fromDate && !toDate) return true;
        const published = new Date(article.publishedAt).getTime();
        if (fromDate && published < new Date(fromDate).getTime()) return false;
        if (toDate && published > new Date(toDate).getTime()) return false;
        return true;
      })();
      return matchesText && matchesCategory && matchesDate;
    });
}
