'use client';

import { useState } from 'react';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (response.ok) {
      setStatus('success');
      setEmail('');
    } else {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Newsletter</p>
      <h2 className="mt-4 text-2xl font-semibold">Subscribe for daily headlines</h2>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Receive curated updates from Clarion Feature directly in your inbox.</p>
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email address" className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
        <button type="submit" className="btn">Subscribe</button>
      </div>
      {status === 'success' && <p className="mt-4 text-sm text-green-600 dark:text-green-400">Subscribed successfully.</p>}
      {status === 'error' && <p className="mt-4 text-sm text-accent">Subscription failed. Try again later.</p>}
    </form>
  );
}
