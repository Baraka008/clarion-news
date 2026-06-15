import Link from 'next/link';
import AuthButton from '@/components/auth-button';

export default function SiteHeader() {
  return (
    <header className="border-b border-slate-200 pb-4 dark:border-slate-800">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-2 py-4 sm:px-4">
        <Link href="/" className="space-y-1">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Clarion Feature</p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">Trusted global journalism</h1>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300 md:flex">
          <Link href="/" className="hover:text-slate-950 dark:hover:text-white">Home</Link>
          <Link href="/world" className="hover:text-slate-950 dark:hover:text-white">World</Link>
          <Link href="/technology" className="hover:text-slate-950 dark:hover:text-white">Technology</Link>
          <Link href="/business" className="hover:text-slate-950 dark:hover:text-white">Business</Link>
          <Link href="/sports" className="hover:text-slate-950 dark:hover:text-white">Sports</Link>
          <Link href="/search" className="hover:text-slate-950 dark:hover:text-white">Search</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="hidden rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400 dark:border-slate-700 dark:text-slate-100 md:inline-flex">
            Dashboard
          </Link>
          <AuthButton />
        </div>
      </div>
    </header>
  );
}
