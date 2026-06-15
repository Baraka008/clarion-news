import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 py-8 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-2 sm:px-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">Clarion Feature</p>
          <p className="mt-1 text-sm">Professional global journalism, curated for clarity and trust.</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/search">Search</Link>
          <Link href="/admin">Admin</Link>
        </div>
      </div>
    </footer>
  );
}
