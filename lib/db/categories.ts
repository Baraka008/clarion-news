import { getAdminDb } from '@/lib/server/firebaseAdmin';
import { DEFAULT_CATEGORIES } from '@/lib/demo/articles';
import { Category } from '@/lib/types';

function mapCategoryDoc(doc: any): Category {
  const data = doc.data() as Omit<Category, 'id'>;
  return { id: doc.id, ...data };
}

/** Categories from Firestore, or the built-in list when the database is empty, missing or unreachable. */
export async function getAllCategories(): Promise<Category[]> {
  const db = getAdminDb();
  if (!db) return DEFAULT_CATEGORIES;
  try {
    const snapshot = await db.collection('Categories').orderBy('name', 'asc').get();
    return snapshot.empty ? DEFAULT_CATEGORIES : snapshot.docs.map(mapCategoryDoc);
  } catch (error) {
    console.error('Error fetching categories, using defaults:', error);
    return DEFAULT_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  return (await getAllCategories()).find((category) => category.slug === slug) ?? null;
}

export async function createDefaultCategories() {
  const existing = await getAllCategories();
  return existing.length ? existing : DEFAULT_CATEGORIES;
}
