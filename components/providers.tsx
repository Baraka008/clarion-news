'use client';

import { useEffect, useState } from 'react';
import ThemeToggle from '@/components/theme-toggle';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const currentTheme = window.localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', currentTheme === 'dark');
  }, []);

  return (
    <div className="min-h-screen">
      <div className="fixed bottom-4 right-4 z-50">
        {mounted && <ThemeToggle />}
      </div>
      {children}
    </div>
  );
}
