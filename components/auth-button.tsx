'use client';

import { useEffect, useState } from 'react';
import { getFirebaseClient } from '@/lib/firebaseClient';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User } from 'firebase/auth';

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    try {
      const { auth } = getFirebaseClient();
      const unsubscribe = onAuthStateChanged(auth, setUser, (error) => {
        console.error('Firebase auth state failed:', error);
        setConfigError('Sign-in is temporarily unavailable.');
      });
      setReady(true);
      return unsubscribe;
    } catch (error) {
      setConfigError(error instanceof Error ? error.message : 'Firebase is not configured.');
      setReady(true);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      const { auth } = getFirebaseClient();
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (error) {
      console.error('Sign in failed:', error);
      setConfigError(error instanceof Error ? error.message : 'Sign in failed.');
    }
  };

  const handleSignOut = async () => {
    try {
      const { auth } = getFirebaseClient();
      await signOut(auth);
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  if (!ready) return <button className="btn-secondary" disabled>Loading…</button>;
  if (configError) return <button className="btn-secondary" disabled title={configError}>Sign-in unavailable</button>;

  return user ? (
    <button onClick={handleSignOut} className="btn-secondary">Sign out</button>
  ) : (
    <button onClick={handleSignIn} className="btn">Sign in</button>
  );
}
