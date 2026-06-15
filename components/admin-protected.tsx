'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth, firebaseDb } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState('Checking credentials...');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setMessage('Please sign in with an admin account.');
        setAuthorized(false);
        return;
      }
      const userRef = doc(firebaseDb, 'Users', user.uid);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      if (userData?.role === 'admin' || userData?.role === 'editor') {
        setAuthorized(true);
      } else {
        setMessage('You do not have permission to view this section.');
        setAuthorized(false);
      }
    });
    return unsubscribe;
  }, []);

  if (authorized === null) {
    return <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200">{message}</div>;
  }

  if (!authorized) {
    return <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200">{message}</div>;
  }

  return <>{children}</>;
}
