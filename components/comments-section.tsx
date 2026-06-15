'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

interface CommentsSectionProps {
  articleId: string;
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Array<{ id: string; content: string; displayName: string; createdAt: string }>>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ displayName: string | null; uid: string } | null>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? { displayName: currentUser.displayName, uid: currentUser.uid } : null);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const loadComments = async () => {
      const commentsQuery = query(collection(firebaseDb, 'Comments'), where('articleId', '==', articleId), where('approved', '==', true), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(commentsQuery);
      setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) })));
    };
    loadComments();
  }, [articleId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setError('Please sign in to comment.');
      return;
    }
    if (!content.trim()) {
      setError('Write a comment before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await addDoc(collection(firebaseDb, 'Comments'), {
        articleId,
        userId: user.uid,
        displayName: user.displayName || 'Reader',
        content: content.trim(),
        createdAt: new Date().toISOString(),
        approved: false,
      });
      setContent('');
      setError('Comment submitted for review.');
    } catch (err) {
      setError('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-2xl font-semibold">Comments</h2>
      <p className="mt-2 text-sm text-slate-500">Readers can add their perspective and submit comments for moderation.</p>
      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="text-sm text-slate-500">No comments yet. Be the first to share your thoughts.</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{comment.displayName}</p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
              <p className="mt-3 text-xs text-slate-500">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Your comment</span>
          <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={4} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
        </label>
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Posting…' : 'Post comment'}
        </button>
        {error ? <p className="text-sm text-accent">{error}</p> : null}
      </form>
    </section>
  );
}
