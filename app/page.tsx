export const dynamic = 'force-dynamic';

import { getHomePreviewData } from '@/lib/db/articles';
import ArticleCard from '@/components/article-card';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function HomePage() {
  const { hero, topStories, trending, latest, categories } = await getHomePreviewData();

  return (
    <div className="space-y-12 pb-12 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-slate-200 py-3 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#d51f45] px-3 py-1 text-[10px] font-black uppercase tracking-[.2em] text-white">Live desk</span>
          <span className="text-xs font-medium text-slate-500">The stories shaping today</span>
        </div>
        <span className="text-xs font-semibold text-slate-500">{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
      </div>

      <section className="grid gap-7 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,.8fr)]">
        <article className="group relative isolate min-h-[480px] overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-2xl shadow-slate-900/10">
          <img src={hero.featuredImage} alt={hero.title} className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/65 to-slate-950/5" />
          <div className="flex min-h-[480px] flex-col justify-end p-7 sm:p-10">
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#d51f45] px-3 py-1.5 text-[10px] font-black uppercase tracking-[.2em]">Top story</span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/75">{hero.category}</span>
            </div>
            <h1 className="max-w-4xl text-3xl font-black leading-[1.08] tracking-tight sm:text-5xl">{hero.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-200 sm:text-base">{hero.summary}</p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span>By {hero.author}</span><span>{format(new Date(hero.publishedAt), 'MMM d, yyyy')}</span><span>{hero.readingTime} min read</span>
            </div>
            <Link href={`/articles/${hero.slug}`} className="mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-rose-50">
              Read the full story <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </article>

        <aside className="space-y-4">
          <div className="flex items-end justify-between border-b border-slate-200 pb-3 dark:border-slate-800">
            <div><p className="eyebrow">Editor&apos;s selection</p><h2 className="mt-1 text-xl font-black tracking-tight">Top stories</h2></div>
            <span className="text-xs font-semibold text-slate-400">01 — 04</span>
          </div>
          {topStories.length ? topStories.map((article, index) => (
            <Link key={article.id} href={`/articles/${article.slug}`} className="group flex gap-4 border-b border-slate-200 pb-4 last:border-0 dark:border-slate-800">
              <span className="pt-1 text-2xl font-black text-slate-200 transition group-hover:text-[#d51f45] dark:text-slate-700">0{index + 1}</span>
              <span className="min-w-0">
                <span className="eyebrow text-[#d51f45]">{article.category}</span>
                <span className="mt-1 block font-bold leading-snug text-slate-900 transition group-hover:text-[#d51f45] dark:text-white">{article.title}</span>
                <span className="mt-2 block text-xs text-slate-500">{article.readingTime} min read</span>
              </span>
            </Link>
          )) : <p className="rounded-2xl bg-white p-5 text-sm text-slate-500 dark:bg-slate-900">New top stories will appear here as articles are published.</p>}
        </aside>
      </section>

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">The pulse</p><h2 className="section-heading mt-1">Trending now</h2></div>
            <Link href="/search" className="text-sm font-bold text-[#d51f45] hover:underline">Explore all stories ↗</Link>
          </div>
          {trending.length ? <div className="grid gap-5 md:grid-cols-2">{trending.map(article => <ArticleCard key={article.id} article={article} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-sm text-slate-500 dark:border-slate-700">Trending stories will appear here when the newsroom publishes content.</div>}

          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-3 dark:border-slate-800">
            <div><p className="eyebrow">Fresh from the newsroom</p><h2 className="section-heading mt-1">Latest reporting</h2></div>
          </div>
          {latest.length ? <div className="space-y-4">{latest.map(article => <ArticleCard key={article.id} article={article} variant="list" />)}</div> : <p className="text-sm text-slate-500">The latest published articles will appear here.</p>}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10">
            <p className="text-[10px] font-black uppercase tracking-[.25em] text-rose-400">Stay informed</p>
            <h2 className="mt-3 text-2xl font-black leading-tight">Clarity in a noisy world.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">Independent perspectives, useful context, and the stories that matter.</p>
            <Link href="/search" className="mt-6 inline-flex rounded-full bg-[#d51f45] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-rose-700">Discover coverage ↗</Link>
          </div>
          <div>
            <p className="eyebrow mb-4">Explore the newsroom</p>
            <div className="space-y-3">
              {categories.map(category => (
                <Link key={category.slug} href={`/${category.slug}`} className="group block rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-900/5 dark:border-slate-800 dark:bg-slate-900">
                  <span className="flex items-center justify-between font-bold text-slate-900 dark:text-white"><span>{category.name}</span><span className="text-[#d51f45] transition group-hover:translate-x-1">↗</span></span>
                  <span className="mt-2 block text-xs leading-5 text-slate-500">{category.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
