'use client';

import { useEffect, useMemo, useState } from 'react';
import { Article } from '@/lib/types';
import ArticleCard from './article-card';

export default function SearchPanel({ categories }: { categories: Array<{ id: string; name: string; slug: string }> }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    const searchParams = new URLSearchParams();
    if (query) searchParams.set('q', query);
    if (category) searchParams.set('category', category);
    if (fromDate) searchParams.set('from', fromDate);
    if (toDate) searchParams.set('to', toDate);
    try {
      const response = await fetch(`/api/search?${searchParams.toString()}`);
      const data = await response.json();
      setResults(data.results || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query.length >= 2 || category || fromDate || toDate) {
      const timeout = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(timeout);
    }
    setResults([]);
  }, [query, category, fromDate, toDate]);

  const resultsLabel = useMemo(() => {
    if (loading) return 'Searching…';
    if (!query && !category && !fromDate && !toDate) return 'Start typing to search articles.';
    return `${results.length} result${results.length === 1 ? '' : 's'} found`;
  }, [loading, query, category, fromDate, toDate, results.length]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100">
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>{item.name}</option>
          ))}
        </select>
        <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
      </div>
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
        <p className="text-sm text-slate-500">{resultsLabel}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {results.map((article) => (
          <ArticleCard key={article.id} article={article} variant="list" />
        ))}
      </div>
    </div>
  );
}
