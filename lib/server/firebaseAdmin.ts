import admin from 'firebase-admin';

/**
 * Firebase Admin is initialized only when a server request actually needs it.
 * Keeping initialization lazy prevents Next.js from requiring production
 * service-account secrets while it is collecting/building route modules.
 */
function getAdminApp() {
  if (admin.apps.length) return admin.app();

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      'Firebase Admin is not configured. Set NEXT_PUBLIC_FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in the server environment.',
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert({
      project_id: projectId,
      client_email: clientEmail,
      private_key: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

function lazyService<T extends object>(factory: () => T): T {
  return new Proxy({} as T, {
    get(_target, property) {
      const service = factory();
      const value = Reflect.get(service, property, service);
      return typeof value === 'function' ? value.bind(service) : value;
    },
  });
}

export const adminAuth = lazyService(() => getAdminApp().auth());
export const adminDb = lazyService(() => getAdminApp().firestore());
export const adminStorage = lazyService(() => getAdminApp().storage());
