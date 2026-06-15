import Link from 'next/link';

export default function AdminDashboardPage() {
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
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
            <p className="text-sm text-slate-500">Published articles</p>
            <p className="mt-4 text-4xl font-semibold">42</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
            <p className="text-sm text-slate-500">Live comments</p>
            <p className="mt-4 text-4xl font-semibold">137</p>
          </div>
          <div className="rounded-3xl border border-slate-200 p-6 shadow-sm dark:border-slate-800">
            <p className="text-sm text-slate-500">Outgoing drafts</p>
            <p className="mt-4 text-4xl font-semibold">8</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Recent article drafts</h2>
              <p className="mt-2 text-sm text-slate-500">Manage drafts, schedule publication, and track content readiness.</p>
            </div>
            <Link href="/admin/articles" className="text-sm font-medium text-accent hover:text-[#b5184d]">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            <article className="rounded-3xl border border-slate-200 p-5 dark:border-slate-800">
              <p className="text-sm text-slate-500">Business · Scheduled</p>
              <h3 className="mt-2 text-lg font-semibold">Policymakers navigate market pressure ahead of fall data</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Draft for review, recommended category changes, and publish window set for tomorrow.</p>
            </article>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
          <h2 className="text-xl font-semibold">AI News Assistant</h2>
          <p className="mt-2 text-sm text-slate-500">Use AI to summarize text, suggest headlines, or review claim checks before publishing.</p>
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
