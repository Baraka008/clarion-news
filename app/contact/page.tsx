'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Contact</p>
        <h1 className="mt-4 text-3xl font-semibold">Get in touch with Baraka News</h1>
        <p className="mt-2 text-sm text-slate-500">Send editorial tips, press inquiries, or suggestions for coverage at Clarion Feature.</p>

        {!submitted ? (
          <form className="mt-8 grid gap-6" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Your name</span>
              <input required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</span>
              <input type="email" required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
              <textarea rows={6} required className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" />
            </label>
            <button type="submit" className="btn">Send message</button>
          </form>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <h2 className="text-xl font-semibold">Thanks—we received your message</h2>
            <p className="mt-3 text-sm">Our team will review it and follow up if needed.</p>
          </div>
        )}
      </div>
    </section>
  );
}
