export const dynamic = 'force-dynamic';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllCategories } from '@/lib/db/categories';
import { searchArticles } from '@/lib/db/articles';

export default async function SearchPage() {
  const categories = await getAllCategories();

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">Search News</h1>
        <p className="mt-2 text-sm text-slate-500">Instant search across headlines, categories and recent coverage.</p>
        <form className="mt-6 grid gap-4 sm:grid-cols-3">
          <input type="search" name="q" placeholder="Search articles" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
          <select name="category" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>{category.name}</option>
            ))}
          </select>
          <button type="submit" className="btn">Search</button>
        </form>
      </div>
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <p className="text-sm text-slate-500">Search results will appear here once the form is submitted.</p>
      </div>
    </section>
  );
}
