import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { DEFAULT_CATEGORIES, DEMO_ARTICLES } from '@/lib/demo/articles';
import { Article, Category } from '@/lib/types';

type HomePreviewData = {
  hero: Article;
  topStories: Article[];
  trending: Article[];
  latest: Article[];
  categories: Category[];
};

function mapArticleDoc(doc: any): Article {
  const data = doc.data() as Omit<Article, 'id'>;
  return { id: doc.id, ...data };
}

const byPublished = (a: Article, b: Article) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
const byViews = (a: Article, b: Article) => b.viewCount - a.viewCount;

/** Every article, newest first. Falls back to the demo stories when Firestore is missing or unreachable. */
export async function getAllArticles(): Promise<Article[]> {
  const db = getAdminDb();
  if (!db) return [...DEMO_ARTICLES].sort(byPublished);
  try {
    const snapshot = await db.collection('Articles').orderBy('publishedAt', 'desc').get();
    return snapshot.docs.map(mapArticleDoc);
  } catch (error) {
    console.error('Error fetching articles, showing demo stories instead:', error);
    return [...DEMO_ARTICLES].sort(byPublished);
  }
}

export async function getPublishedArticles(): Promise<Article[]> {
  return (await getAllArticles()).filter((article) => article.status === 'published');
}

export async function getHomePreviewData(): Promise<HomePreviewData> {
  const published = await getPublishedArticles();
  const sorted = [...published].sort(byPublished);
  const [hero, ...rest] = sorted;
  const fallbackHero = [...DEMO_ARTICLES].sort(byPublished)[0];

  return {
    hero: hero ?? fallbackHero,
    topStories: [...rest].sort(byViews).slice(0, 3),
    // The next most-read stories after the top three, so the two lists never repeat.
    trending: [...rest].sort(byViews).slice(3, 7),
    latest: rest.slice(0, 5),
    categories: DEFAULT_CATEGORIES.slice(0, 4),
  };
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return (await getAllArticles()).find((article) => article.slug === slug) ?? null;
}

export async function getArticleById(id: string): Promise<Article | null> {
  return (await getAllArticles()).find((article) => article.id === id) ?? null;
}

export async function getRelatedArticles(category: string, articleId: string): Promise<Article[]> {
  return (await getPublishedArticles())
    .filter((item) => item.category === category && item.id !== articleId)
    .slice(0, 3);
}

export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return (await getPublishedArticles()).filter((article) => article.category.toLowerCase() === category.toLowerCase());
}

export async function getAllArticleSlugs() {
  return (await getAllArticles()).map((article) => ({ slug: article.slug }));
}

export async function searchArticles(queryText: string, category?: string, fromDate?: string, toDate?: string) {
  const normalizedQuery = queryText.trim().toLowerCase();
  return (await getPublishedArticles()).filter((article) => {
    const matchesText = !normalizedQuery
      || [article.title, article.summary, article.content, ...(article.tags ?? [])].some((field) => field?.toLowerCase().includes(normalizedQuery));
    const matchesCategory = category ? article.category.toLowerCase() === category.toLowerCase() : true;
    const published = Date.parse(article.publishedAt);
    const matchesFrom = fromDate ? published >= Date.parse(fromDate) : true;
    // Include the whole "to" day, not just its first millisecond.
    const matchesTo = toDate ? published < Date.parse(toDate) + 86400000 : true;
    return matchesText && matchesCategory && matchesFrom && matchesTo;
  });
}
