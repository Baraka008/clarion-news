'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebaseClient';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';

interface CommentsSectionProps {
  articleId: string;
}

type CommentItem = { id: string; content: string; displayName: string; createdAt: string };

const demoKey = (articleId: string) => `clarion-demo-comments:${articleId}`;

function readDemoComments(articleId: string): CommentItem[] {
  try {
    return JSON.parse(window.localStorage.getItem(demoKey(articleId)) || '[]');
  } catch {
    return [];
  }
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const demo = !firebaseDb || !firebaseAuth;
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<{ displayName: string | null; uid: string } | null>(null);

  useEffect(() => {
    if (!firebaseAuth) return;
    return firebaseAuth.onAuthStateChanged((currentUser) => {
      setUser(currentUser ? { displayName: currentUser.displayName, uid: currentUser.uid } : null);
    });
  }, []);

  useEffect(() => {
    if (demo) {
      setComments(readDemoComments(articleId));
      return;
    }
    const db = firebaseDb!;
    const loadComments = async () => {
      try {
        const commentsQuery = query(collection(db, 'Comments'), where('articleId', '==', articleId), where('approved', '==', true), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(commentsQuery);
        setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<CommentItem, 'id'>) })));
      } catch (error) {
        console.error('Failed to load comments', error);
      }
    };
    loadComments();
  }, [articleId, demo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!content.trim()) {
      setMessage('Write a comment before submitting.');
      return;
    }

    if (demo) {
      const next: CommentItem[] = [
        { id: `local-${Date.now()}`, content: content.trim(), displayName: name.trim() || 'Reader', createdAt: new Date().toISOString() },
        ...comments,
      ];
      setComments(next);
      try {
        window.localStorage.setItem(demoKey(articleId), JSON.stringify(next));
      } catch {
        // Storage can be blocked (private mode); the comment still shows for this visit.
      }
      setContent('');
      setMessage('Comment posted. In demo mode it is saved in this browser only.');
      return;
    }

    if (!user) {
      setMessage('Please sign in to comment.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await addDoc(collection(firebaseDb!, 'Comments'), {
        articleId,
        userId: user.uid,
        displayName: user.displayName || 'Reader',
        content: content.trim(),
        createdAt: new Date().toISOString(),
        approved: false,
      });
      setContent('');
      setMessage('Comment submitted for review.');
    } catch {
      setMessage('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100';

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <h2 className="text-2xl font-semibold">Comments</h2>
      <p className="mt-2 text-sm text-slate-500">
        {demo ? 'Demo mode: comments are saved in your browser so you can try the flow.' : 'Readers can add their perspective and submit comments for moderation.'}
      </p>
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
        {demo ? (
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Your name</span>
            <input id="comment-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Reader" className={inputClass} />
          </label>
        ) : null}
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Your comment</span>
          <textarea id="comment-body" value={content} onChange={(event) => setContent(event.target.value)} rows={4} className={inputClass} />
        </label>
        <button type="submit" disabled={loading} className="btn">
          {loading ? 'Posting…' : 'Post comment'}
        </button>
        {message ? <p className="text-sm text-accent">{message}</p> : null}
      </form>
    </section>
  );
}
