import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, persistentLocalCache, persistentMultipleTabManager, initializeFirestore } from 'firebase/firestore';
import { firebaseConfig } from '@/config/firebaseClient';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with persistent cache
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

// Remove console logs in production
if (process.env.NODE_ENV === 'development') {
  console.log("Firebase API Key:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("Firebase Auth Domain:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("Firebase Project ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("Firebase Storage Bucket:", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log("Firebase Messaging Sender ID:", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log("Firebase App ID:", process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  console.log("Firebase Measurement ID:", process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
}

export { app, auth, db };
