// src/lib/firebase/config.ts
import { initializeApp, getApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, type Auth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// IMPORTANT: Ensure these environment variables are correctly set in your .env file
// and match your Firebase project settings.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

// Initialize Firebase
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  if (!firebaseConfig.projectId) {
    console.error("Firebase projectId is missing. Check your .env file and Firebase setup.");
  }
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApp();
}

const firebaseAuth: Auth = getAuth(firebaseApp);
const firestore: Firestore = getFirestore(firebaseApp);

// Point the SDKs at local Firebase emulators for local development/demo use
// (no real Firebase project required). Enable with NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true.
if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  const globalWithEmulatorFlag = globalThis as unknown as { __firebaseEmulatorsConnected?: boolean };
  if (!globalWithEmulatorFlag.__firebaseEmulatorsConnected) {
    connectAuthEmulator(firebaseAuth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    globalWithEmulatorFlag.__firebaseEmulatorsConnected = true;
  }
}

export { firebaseApp, firebaseAuth, firestore };
