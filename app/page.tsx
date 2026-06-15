export const dynamic = 'force-dynamic';

import { getHomePreviewData } from '@/lib/db/articles';
import ArticleCard from '@/components/article-card';
import Link from 'next/link';
import { format } from 'date-fns';

export default async function HomePage() {
  const { hero, topStories, trending, latest, categories } = await getHomePreviewData();

  return (
    <section className="space-y-10 py-8">
      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <article className="group relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-soft">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/10 to-slate-950" />
          <img src={hero.featuredImage} alt={hero.title} className="h-96 w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="mb-3 inline-flex rounded-full bg-accent px-4 py-2 text-xs uppercase tracking-[0.25em] text-white">Breaking</p>
            <h1 className="text-4xl font-semibold leading-tight">{hero.title}</h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-200">{hero.summary}</p>
            <div className="mt-8 flex flex-wrap gap-3 text-xs text-slate-300">
              <span>{hero.category}</span>
              <span>{format(new Date(hero.publishedAt), 'MMMM d, yyyy')}</span>
              <span>{hero.readingTime} min read</span>
            </div>
            <Link href={`/articles/${hero.slug}`} className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100">
              Read full story
            </Link>
          </div>
        </article>

        <div className="grid gap-6">
          {topStories.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </div>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Trending</p>
                <h2 className="mt-2 text-2xl font-semibold">What readers are following</h2>
              </div>
              <Link href="/search" className="text-sm font-medium text-accent hover:text-[#b5184d]">Explore all</Link>
            </div>
            <div className="mt-6 grid gap-4">
              {trending.map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-soft dark:bg-slate-900">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Latest News</p>
            <div className="mt-5 grid gap-5">
              {latest.map((article) => (
                <ArticleCard key={article.id} article={article} variant="list" />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {categories.map((category) => (
            <Link key={category.slug} href={`/${category.slug}`} className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{category.name}</p>
              <h3 className="mt-4 text-xl font-semibold">{category.name}</h3>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}
