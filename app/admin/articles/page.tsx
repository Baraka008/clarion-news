import Link from 'next/link';

export default function AdminArticlesPage() {
  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Articles</p>
            <h1 className="mt-4 text-3xl font-semibold">Editorial workflow</h1>
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
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              <tr>
                <td className="whitespace-nowrap px-4 py-4">Africa technology rollout anticipates next generation of digital inclusion</td>
                <td className="px-4 py-4">Technology</td>
                <td className="px-4 py-4 text-slate-600 dark:text-slate-300">Draft</td>
                <td className="px-4 py-4">Scheduled</td>
                <td className="px-4 py-4">
                  <Link href="/admin/articles/edit/1" className="text-accent hover:text-[#b5184d]">Edit</Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
