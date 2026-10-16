import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArticleForm from '@/components/article-form';
import { getArticleById } from '@/lib/db/articles';
import { getAllCategories } from '@/lib/db/categories';

export const dynamic = 'force-dynamic';

interface AdminEditArticlePageProps {
  params: { id: string };
}

export default async function AdminEditArticlePage({ params }: AdminEditArticlePageProps) {
  const [article, categories] = await Promise.all([getArticleById(params.id), getAllCategories()]);
  if (!article) notFound();

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Edit article</p>
            <h1 className="mt-4 text-3xl font-semibold">{article.title}</h1>
          </div>
          <div className="flex gap-3">
            {article.status === 'published' ? (
              <Link href={`/articles/${article.slug}`} className="btn-secondary">View live</Link>
            ) : null}
            <Link href="/admin/articles" className="btn-secondary">
              Back to list
            </Link>
          </div>
        </div>
        <ArticleForm categories={categories} article={article} />
      </div>
    </section>
  );
}
