'use client';

import { useEffect, useState } from 'react';
import { firebaseAuth } from '@/lib/firebaseClient';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';

export default function AuthButton() {
  const [user, setUser] = useState<null | { displayName: string | null }>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      setUser(currentUser ? { displayName: currentUser.displayName } : null);
    });
    return unsubscribe;
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
    } catch (error) {
      console.error('Sign in failed', error);
    }
  };

  const handleSignOut = async () => {
    await signOut(firebaseAuth);
  };

  return user ? (
    <button onClick={handleSignOut} className="btn-secondary">
      Sign out
    </button>
  ) : (
    <button onClick={handleSignIn} className="btn">
      Sign in
    </button>
  );
}
