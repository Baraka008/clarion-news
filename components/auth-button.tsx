'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebaseClient';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export default function AuthButton() {
  const [user, setUser] = useState<null | { displayName: string | null }>(null);

  useEffect(() => {
    if (!firebaseAuth) return;
    return onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser ? { displayName: currentUser.displayName } : null);
    });
  }, []);

  if (!firebaseAuth) {
    return (
      <span className="rounded-full bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-900 dark:bg-amber-500/20 dark:text-amber-200" title="Sign-in turns on once Firebase is configured">
        Demo mode
      </span>
    );
  }

  const auth = firebaseAuth;
  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  return user ? (
    <button onClick={() => signOut(auth)} className="btn-secondary">
      Sign out
    </button>
  ) : (
    <button onClick={handleSignIn} className="btn">
      Sign in
    </button>
  );
}
