'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { firebaseDb } from '@/lib/firebaseClient';
import { Article, Category } from '@/lib/types';
import { estimateReadingTime } from '@/lib/utils';

interface ArticleFormProps {
  categories: Category[];
  article?: Article;
}

const inputClass = 'mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export default function ArticleForm({ categories, article }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(article?.title ?? '');
  const [category, setCategory] = useState(article?.category ?? categories[0]?.name ?? 'World');
  const [summary, setSummary] = useState(article?.summary ?? '');
  const [content, setContent] = useState(article?.content ?? '');
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage ?? '');
  const [status, setStatus] = useState<Article['status']>(article?.status ?? 'draft');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      setMessage('Add a headline and the article text before saving.');
      return;
    }
    if (!firebaseDb) {
      setMessage('Demo mode: the form works, but saving needs Firebase. Add your keys to .env.local to publish.');
      return;
    }

    const now = new Date().toISOString();
    const data = {
      title: title.trim(),
      slug: article?.slug ?? slugify(title),
      category,
      summary: summary.trim(),
      content: content.trim(),
      featuredImage: featuredImage.trim() || `/demo/${category.toLowerCase()}.svg`,
      status,
      updatedAt: now,
      publishedAt: article?.publishedAt ?? now,
      readingTime: estimateReadingTime(content),
      seoTitle: title.trim(),
      seoDescription: summary.trim(),
    };

    setSaving(true);
    setMessage('');
    try {
      if (article) {
        await updateDoc(doc(firebaseDb, 'Articles', article.id), data);
      } else {
        await addDoc(collection(firebaseDb, 'Articles'), {
          ...data,
          author: 'Clarion Newsroom',
          tags: [],
          viewCount: 0,
          createdAt: now,
        });
      }
      setMessage('Saved.');
      router.push('/admin/articles');
      router.refresh();
    } catch (error) {
      console.error(error);
      setMessage('Saving failed. Check that your account has the admin or editor role.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Headline</span>
          <input id="article-title" value={title} onChange={(e) => setTitle(e.target.value)} type="text" className={inputClass} placeholder="Enter the article headline" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
          <select id="article-category" value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
            {categories.map((item) => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Summary</span>
        <textarea id="article-summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className={inputClass} placeholder="Write a short editorial summary" />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Content</span>
        <textarea id="article-content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} className={inputClass} placeholder="Compose the full article. Leave a blank line between paragraphs." />
        <span className="mt-2 block text-xs text-slate-500">About {content.trim() ? estimateReadingTime(content) : 0} min read</span>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Featured image URL</span>
          <input id="article-image" value={featuredImage} onChange={(e) => setFeaturedImage(e.target.value)} type="text" className={inputClass} placeholder="Leave empty to use the category cover" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Publish status</span>
          <select id="article-status" value={status} onChange={(e) => setStatus(e.target.value as Article['status'])} className={inputClass}>
            <option value="draft">Draft</option>
            <option value="published">Publish now</option>
            <option value="scheduled">Schedule</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="btn">
          {saving ? 'Saving…' : article ? 'Save changes' : status === 'published' ? 'Publish story' : 'Save draft'}
        </button>
        {message ? <p className="text-sm text-accent">{message}</p> : null}
      </div>
    </form>
  );
}
