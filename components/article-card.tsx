import Link from 'next/link';
import { Article } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'compact' | 'list';
}

export default function ArticleCard({ article, variant = 'compact' }: ArticleCardProps) {
  return (
    <article className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-soft dark:border-slate-800 dark:bg-slate-950 ${variant === 'list' ? 'p-6' : 'grid gap-4'}`}>
      <Link href={`/articles/${article.slug}`} className="group block">
        <img src={article.featuredImage} alt={article.title} className="h-48 w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="space-y-3 p-1 sm:p-0">
        <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.35em] text-slate-500">
          <span>{article.category}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        <Link href={`/articles/${article.slug}`} className="block">
          <h2 className="text-lg font-semibold text-slate-950 transition group-hover:text-accent dark:text-slate-100">{article.title}</h2>
        </Link>
        <p className="text-sm text-slate-600 dark:text-slate-300">{article.summary}</p>
      </div>
    </article>
  );
}
