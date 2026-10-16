'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const demo = !firebaseAuth || !firebaseDb;
  const [authorized, setAuthorized] = useState<boolean | null>(demo ? true : null);
  const [message, setMessage] = useState('Checking credentials...');

  useEffect(() => {
    if (!firebaseAuth || !firebaseDb) return;
    const db = firebaseDb;
    return onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setMessage('Please sign in with an admin account.');
        setAuthorized(false);
        return;
      }
      try {
        const userSnapshot = await getDoc(doc(db, 'Users', user.uid));
        const role = userSnapshot.data()?.role;
        if (role === 'admin' || role === 'editor') {
          setAuthorized(true);
        } else {
          setMessage('You do not have permission to view this section.');
          setAuthorized(false);
        }
      } catch {
        setMessage('Could not check your permissions. Try again in a moment.');
        setAuthorized(false);
      }
    });
  }, []);

  if (!authorized) {
    return <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200">{message}</div>;
  }

  return (
    <>
      {demo ? (
        <p className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 px-5 py-3 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          Demo mode: the dashboard is open to everyone and nothing you save is stored. Connect Firebase to require admin sign-in.
        </p>
      ) : null}
      {children}
    </>
  );
}
