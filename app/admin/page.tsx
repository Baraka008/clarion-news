import Link from 'next/link';
import { getAllArticles } from '@/lib/db/articles';
import { getAllCategories } from '@/lib/db/categories';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [articles, categories] = await Promise.all([getAllArticles(), getAllCategories()]);
  const published = articles.filter((a) => a.status === 'published');
  const drafts = articles.filter((a) => a.status !== 'published');
  const totalViews = published.reduce((sum, a) => sum + (a.viewCount || 0), 0);

  const stats = [
    { label: 'Published articles', value: published.length },
    { label: 'Drafts and scheduled', value: drafts.length },
    { label: 'Total views', value: totalViews.toLocaleString() },
    { label: 'Categories', value: categories.length },
  ];

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Admin Dashboard</p>
            <h1 className="mt-4 text-3xl font-semibold">Editorial control center</h1>
          </div>
          <Link href="/admin/articles/new" className="btn">
            Create article
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold tabular-nums">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Drafts waiting for review</h2>
              <p className="mt-2 text-sm text-slate-500">Open a draft to finish it, schedule it or publish it.</p>
            </div>
            <Link href="/admin/articles" className="text-sm font-medium text-accent hover:text-[#b5184d]">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {drafts.length === 0 ? (
              <p className="text-sm text-slate-500">No drafts. Everything is published.</p>
            ) : (
              drafts.slice(0, 5).map((draft) => (
                <Link key={draft.id} href={`/admin/articles/edit/${draft.id}`} className="block rounded-3xl border border-slate-200 p-5 transition hover:border-accent dark:border-slate-800">
                  <p className="text-sm capitalize text-slate-500">{draft.category} · {draft.status}</p>
                  <h3 className="mt-2 text-lg font-semibold">{draft.title}</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{draft.summary}</p>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold">AI News Assistant</h2>
          <p className="mt-2 text-sm text-slate-500">Summarize text, suggest headlines, or list claims to check before publishing.</p>
          <div className="mt-6 grid gap-3">
            <Link href="/admin/assistant" className="btn">
              Open assistant
            </Link>
            <Link href="/admin/media" className="btn-secondary">
              Media library
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
