'use client';

import { useState } from 'react';

const tasks = [
  { id: 'summarize', label: 'Summarize article' },
  { id: 'rewrite', label: 'Rewrite news' },
  { id: 'headlines', label: 'Generate headlines' },
  { id: 'fact-check', label: 'Fact checklist' },
];

export default function AdminAssistantPage() {
  const [task, setTask] = useState('summarize');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setOutput('');
    try {
      const response = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, text: input }),
      });
      const data = await response.json();
      setOutput(data.result || 'No result available.');
    } catch (error) {
      setOutput('AI assistant failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-8 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-soft dark:bg-slate-900">
        <h1 className="text-3xl font-semibold">AI News Assistant</h1>
        <p className="mt-2 text-sm text-slate-500">Generate editorial summaries, headlines, and fact check support without publishing directly.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tasks.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTask(item.id)}
              className={`rounded-3xl border px-5 py-4 text-left text-sm font-medium transition ${task === item.id ? 'border-accent bg-accent/10 text-accent' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200'}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Article text for AI review</span>
            <textarea value={input} onChange={(event) => setInput(event.target.value)} rows={8} className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100" placeholder="Paste article content for AI assistance" />
          </label>
          <button onClick={handleGenerate} disabled={loading || !input.trim()} className="btn">
            {loading ? 'Generating…' : 'Generate output'}
          </button>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-base font-semibold">AI Response</h2>
            <pre className="mt-4 whitespace-pre-wrap break-words text-slate-700 dark:text-slate-200">{output}</pre>
          </div>
        </div>
      </div>
    </section>
  );
}
