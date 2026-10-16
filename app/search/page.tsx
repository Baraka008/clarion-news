export const dynamic = 'force-dynamic';

import { getAllCategories } from '@/lib/db/categories';
import SearchPanel from '@/components/search-panel';

export const metadata = { title: 'Search | Clarion Feature' };

export default async function SearchPage() {
  const categories = await getAllCategories();

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">Search News</h1>
        <p className="mt-2 text-sm text-slate-500">Instant search across headlines, summaries, tags and full stories. Filter by category or date.</p>
        <div className="mt-6">
          <SearchPanel categories={categories} />
        </div>
      </div>
    </section>
  );
}
