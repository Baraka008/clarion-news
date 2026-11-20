'use client';

import { useEffect, useState } from 'react';
import { getFirebaseClient } from '@/lib/firebaseClient';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminProtected({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [message, setMessage] = useState('Checking credentials...');

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    try {
      const { auth, db } = getFirebaseClient();
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!active) return;
        if (!user) {
          setMessage('Please sign in with an admin account.');
          setAuthorized(false);
          return;
        }
        try {
          const userSnapshot = await getDoc(doc(db, 'Users', user.uid));
          const role = userSnapshot.data()?.role;
          if (!active) return;
          if (role === 'admin' || role === 'editor') {
            setAuthorized(true);
          } else {
            setMessage('You do not have permission to view this section.');
            setAuthorized(false);
          }
        } catch (error) {
          console.error('Could not verify admin permissions:', error);
          if (active) {
            setMessage('Could not verify your permissions. Please try again later.');
            setAuthorized(false);
          }
        }
      }, (error) => {
        console.error('Authentication state failed:', error);
        if (active) {
          setMessage('Authentication is temporarily unavailable.');
          setAuthorized(false);
        }
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Firebase is not configured.');
      setAuthorized(false);
    }

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  if (authorized === null) {
    return <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200">{message}</div>;
  }
  if (!authorized) {
    return <div className="rounded-3xl bg-white p-8 text-slate-700 shadow-soft dark:bg-slate-900 dark:text-slate-200">{message}</div>;
  }
  return <>{children}</>;
}
