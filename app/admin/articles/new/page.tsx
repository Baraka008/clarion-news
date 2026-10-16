import Link from 'next/link';
import ArticleForm from '@/components/article-form';
import { getAllCategories } from '@/lib/db/categories';

export const dynamic = 'force-dynamic';

export default async function AdminNewArticlePage() {
  const categories = await getAllCategories();

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">New article</p>
            <h1 className="mt-4 text-3xl font-semibold">Publish a new story</h1>
          </div>
          <Link href="/admin/articles" className="btn-secondary">
            Back to list
          </Link>
        </div>
        <ArticleForm categories={categories} />
      </div>
    </section>
  );
}
