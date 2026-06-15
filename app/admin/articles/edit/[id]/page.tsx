import Link from 'next/link';

interface AdminEditArticlePageProps {
  params: { id: string };
}

export default function AdminEditArticlePage({ params }: AdminEditArticlePageProps) {
  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Edit article</p>
            <h1 className="mt-4 text-3xl font-semibold">Update story details</h1>
          </div>
          <Link href="/admin/articles" className="btn-secondary">
            Back to list
          </Link>
        </div>
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-8 dark:border-slate-700 dark:bg-slate-950">
          <p className="text-sm text-slate-500">Editing article ID: {params.id}</p>
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">CMS integration is ready for edit mode and will load article fields for updates.</p>
        </div>
      </div>
    </section>
  );
}
