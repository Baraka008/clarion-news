import Link from 'next/link';
import AuthButton from '@/components/auth-button';

const navigation = [
  ['World', '/world'],
  ['Business', '/business'],
  ['Technology', '/technology'],
  ['Sports', '/sports'],
  ['Search', '/search'],
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 -mx-4 mb-5 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/90 xl:mx-0 xl:rounded-b-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 py-4">
        <Link href="/" aria-label="Clarion Feature home" className="group flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#d51f45] text-xl font-black text-white shadow-lg shadow-rose-900/15">C</span>
          <span className="min-w-0">
            <span className="block text-[10px] font-bold uppercase tracking-[.28em] text-[#d51f45]">Independent perspective</span>
            <span className="block truncate text-xl font-black tracking-tight text-slate-950 dark:text-white sm:text-2xl">CLARION<span className="text-[#d51f45]">.</span></span>
          </span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {navigation.map(([label, href]) => (
            <Link key={href} href={href} className="text-sm font-semibold text-slate-600 transition hover:text-[#d51f45] dark:text-slate-300 dark:hover:text-rose-400">{label}</Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/admin" className="hidden rounded-full border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 transition hover:border-[#d51f45] hover:text-[#d51f45] dark:border-slate-700 dark:text-slate-200 sm:inline-flex">Dashboard</Link>
          <AuthButton />
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex gap-5 overflow-x-auto border-t border-slate-100 py-3 lg:hidden dark:border-slate-800">
        {navigation.map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap text-xs font-semibold text-slate-600 hover:text-[#d51f45] dark:text-slate-300">{label}</Link>
        ))}
      </nav>
    </header>
  );
}
