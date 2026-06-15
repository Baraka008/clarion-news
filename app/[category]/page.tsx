import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/lib/db/categories';
import { getArticlesByCategory } from '@/lib/db/articles';
import ArticleCard from '@/components/article-card';

interface CategoryPageProps {
  params: { category: string };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) return { title: 'Category not found' };

  return {
    title: `${category.name} | Clarion Feature`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Clarion Feature`,
      description: category.description,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await getCategoryBySlug(params.category);
  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(category.name);

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <p className="text-sm uppercase tracking-[0.3em] text-accent">{category.name}</p>
        <h1 className="mt-3 text-4xl font-semibold">{category.name}</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-300">{category.description}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
