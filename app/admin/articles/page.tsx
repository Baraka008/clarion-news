import Link from 'next/link';
import { getAllArticles } from '@/lib/db/articles';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

const statusStyles: Record<string, string> = {
  published: 'bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300',
  draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  scheduled: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
};

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Articles</p>
            <h1 className="mt-4 text-3xl font-semibold">Editorial workflow</h1>
            <p className="mt-2 text-sm text-slate-500">{articles.length} stories</p>
          </div>
          <Link href="/admin/articles/new" className="btn">
            New story
          </Link>
        </div>
        <div className="mt-8 overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700 dark:divide-slate-800 dark:text-slate-200">
            <thead className="bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Headline</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Published</th>
                <th className="px-4 py-3 text-right">Views</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {articles.map((article) => (
                <tr key={article.id}>
                  <td className="px-4 py-4 font-medium">{article.title}</td>
                  <td className="whitespace-nowrap px-4 py-4">{article.category}</td>
                  <td className="px-4 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyles[article.status] ?? statusStyles.draft}`}>{article.status}</span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">{formatDate(article.publishedAt)}</td>
                  <td className="px-4 py-4 text-right tabular-nums">{article.viewCount.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <Link href={`/admin/articles/edit/${article.id}`} className="text-accent hover:text-[#b5184d]">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
