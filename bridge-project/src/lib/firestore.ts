import { FirebaseApp, initializeApp } from 'firebase/app';
import { collection, Firestore, getDocs, getFirestore } from 'firebase/firestore';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

let app: FirebaseApp | undefined;
let db: Firestore | undefined;

try {
  const configPath = join(process.cwd(), 'firebase.json');

  if (!existsSync(configPath)) {
    throw new Error('firebase.json does not exist');
  }

  // Load Firebase configuration from firebase.json
  const firebaseConfig = JSON.parse(readFileSync(configPath, 'utf8'));

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
export const getUsersCollection = () => collection(getDb(), 'user-dev');
export const getCellsCollection = () => collection(getDb(), 'cell-dev');
export const getFamiliesCollection = () => collection(getDb(), 'family-dev');
export const getPrayerRequestsCollection = () => collection(getDb(), 'prayer-request-dev');

// FIXME: remove test code
export async function getTest() {
  try {
    const querySnapshot = await getDocs(getUsersCollection());
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => `, doc.data());
    });
  } catch (error) {
    console.error('Error in getTest:', error instanceof Error ? error.message : String(error));
  }
}
