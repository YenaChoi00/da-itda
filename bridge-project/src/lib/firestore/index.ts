import { FirebaseApp, initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore } from 'firebase/firestore';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
  };

  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
} catch (error) {
  console.error(
    'Error initializing Firebase:',
    error instanceof Error ? error.message : String(error),
  );
}

// Check Firestore database instance
const checkDb = (): boolean => {
  if (!db) {
    console.error('Firebase is not initialized.');
    return false;
  }
  return true;
};

// Get Firestore database instance
export const getDb = (): Firestore => {
  if (!checkDb()) {
    throw new Error('Firestore database is not initialized');
  }
  return db!;
};

// Collection getter functions
export const getUserCollection = () => collection(getDb(), 'user-dev');
export const getCellCollection = () => collection(getDb(), 'cell-dev');
export const getFamilyCollection = () => collection(getDb(), 'family-dev');
export const getPrayerRequestCollection = () => collection(getDb(), 'prayer-request-dev');

// FIXME: remove test code
export async function getTest() {
  try {
    const querySnapshot = await getDocs(getUserCollection());
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => `, doc.data());
    });
  } catch (error) {
    console.error('Error in getTest:', error instanceof Error ? error.message : String(error));
  }
}

export * from './tab';
