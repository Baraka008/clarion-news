'use client';

import { useState } from 'react';

export default function AdminMediaPage() {
  const [status, setStatus] = useState('');

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const file = formData.get('file');
    if (!file || !(file instanceof File)) {
      setStatus('Please select an image file.');
      return;
    }
    const uploadData = new FormData();
    uploadData.append('file', file);
    const response = await fetch('/api/upload-image', { method: 'POST', body: uploadData });
    if (response.ok) {
      setStatus('Upload complete.');
    } else {
      setStatus('Upload failed.');
    }
  };

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Media library</p>
        <h1 className="mt-4 text-3xl font-semibold">Upload article images</h1>
        <form onSubmit={handleUpload} className="mt-8 grid gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
          <input name="file" type="file" accept="image/*" className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          <button type="submit" className="btn">Upload image</button>
          {status ? <p className="text-sm text-slate-600 dark:text-slate-300">{status}</p> : null}
        </form>
      </div>
    </section>
  );
}
