import { adminDb } from '@/lib/server/firebaseAdmin';
import { Category } from '@/lib/types';

const categoriesCollection = () => adminDb.collection('Categories');

function mapCategoryDoc(doc: any): Category {
  const data = doc.data() as Omit<Category, 'id'>;
  return { id: doc.id, ...data };
}

export async function getAllCategories(): Promise<Category[]> {
  const snapshot = await categoriesCollection().orderBy('name', 'asc').get();
  return snapshot.docs.map(mapCategoryDoc);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const snapshot = await categoriesCollection().where('slug', '==', slug).limit(1).get();
    const doc = snapshot.docs[0];
    if (!doc) return null;
    return mapCategoryDoc(doc);
  } catch (error) {
    console.error(`Error fetching category ${slug}:`, error);
    // Return fallback category data
    const categoryFallback: { [key: string]: Category } = {
      technology: { id: 'technology', name: 'Technology', slug: 'technology', description: 'Innovation, AI, and product launches shaping the world.', createdAt: new Date().toISOString() },
      business: { id: 'business', name: 'Business', slug: 'business', description: 'Markets, finance, and corporate strategy coverage.', createdAt: new Date().toISOString() },
      world: { id: 'world', name: 'World', slug: 'world', description: 'International stories and diplomatic affairs.', createdAt: new Date().toISOString() },
      sports: { id: 'sports', name: 'Sports', slug: 'sports', description: 'Live results, analysis, and feature coverage from global sports.', createdAt: new Date().toISOString() },
      entertainment: { id: 'entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Film, television, culture, and media news.', createdAt: new Date().toISOString() },
      africa: { id: 'africa', name: 'Africa', slug: 'africa', description: 'Stories and insights from across the African continent.', createdAt: new Date().toISOString() },
    };
    return categoryFallback[slug] || null;
  }
}

export async function createDefaultCategories() {
  const existing = await getAllCategories();
  if (existing.length) return existing;
  const defaultCategories: Category[] = [
    { id: 'technology', name: 'Technology', slug: 'technology', description: 'Innovation, AI, and product launches shaping the world.', createdAt: new Date().toISOString() },
    { id: 'business', name: 'Business', slug: 'business', description: 'Markets, finance, and corporate strategy coverage.', createdAt: new Date().toISOString() },
    { id: 'world', name: 'World', slug: 'world', description: 'International stories and diplomatic affairs.', createdAt: new Date().toISOString() },
    { id: 'sports', name: 'Sports', slug: 'sports', description: 'Live results, analysis, and feature coverage from global sports.', createdAt: new Date().toISOString() },
    { id: 'entertainment', name: 'Entertainment', slug: 'entertainment', description: 'Film, television, culture, and media news.', createdAt: new Date().toISOString() },
    { id: 'africa', name: 'Africa', slug: 'africa', description: 'Stories and insights from across the African continent.', createdAt: new Date().toISOString() },
  ];
  return defaultCategories;
}
