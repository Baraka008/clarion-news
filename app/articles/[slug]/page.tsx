import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getRelatedArticles } from '@/lib/db/articles';
import { formatDate } from '@/lib/utils';
import CommentsSection from '@/components/comments-section';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Article not found' };

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      type: 'article',
      images: [{ url: article.featuredImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      images: [article.featuredImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }
  const related = (await getRelatedArticles(article.category, article.id)) as Array<{
    id: string;
    slug: string;
    category: string;
    title: string;
  }>;

  return (
    <section className="space-y-10 py-10">
      <article className="space-y-8 rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-accent">{article.category}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight">{article.title}</h1>
          </div>
          <div className="space-y-2 text-right text-sm text-slate-500 dark:text-slate-400">
            <p>{article.author}</p>
            <p>{formatDate(article.publishedAt)} · {article.readingTime} min read</p>
          </div>
        </div>
        <img src={article.featuredImage} alt={article.title} className="h-[28rem] w-full rounded-3xl object-cover" />
        <div className="prose max-w-none dark:prose-invert">{article.content}</div>
      </article>

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <CommentsSection articleId={article.id} />
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Share this story</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://clarionfeature.example.com/articles/${article.slug}`)}`} className="btn-secondary">Twitter</Link>
              <Link href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://clarionfeature.example.com/articles/${article.slug}`)}`} className="btn-secondary">Facebook</Link>
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Related articles</p>
            <div className="mt-4 space-y-4">
              {related.map((item) => (
                <Link key={item.id} href={`/articles/${item.slug}`} className="block rounded-3xl border border-slate-200 p-4 transition hover:border-accent dark:border-slate-800">
                  <p className="text-sm text-slate-500">{item.category}</p>
                  <p className="mt-2 text-base font-semibold text-slate-950 dark:text-slate-100">{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
