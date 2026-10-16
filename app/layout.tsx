import './globals.css';
import type { Metadata } from 'next';
import SiteHeader from '@/components/site-header';
import SiteFooter from '@/components/site-footer';
import Providers from '@/components/providers';
import { isDemoMode, siteUrl } from '@/lib/config';

export const metadata: Metadata = {
  title: 'Clarion Feature | Global journalism with depth',
  description: 'Clarion Feature is a premium news platform delivering breaking stories, in-depth reporting, and trusted analysis from around the world.',
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: 'Clarion Feature',
    description: 'Global journalism with depth. Breaking news, analysis, and trending stories from across the world.',
    type: 'website',
    url: siteUrl,
    siteName: 'Clarion Feature',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Clarion Feature',
    description: 'Premium news coverage from around the globe.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-neutral text-slate-900 antialiased selection:bg-accent selection:text-white dark:bg-slate-950 dark:text-slate-100">
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 xl:px-0">
            <SiteHeader />
            {isDemoMode ? (
              <p className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                <strong>Demo mode.</strong> You are seeing built-in sample stories. Add your Firebase keys to <code>.env.local</code> to publish real articles.
              </p>
            ) : null}
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </Providers>
      </body>
    </html>
  );
}
