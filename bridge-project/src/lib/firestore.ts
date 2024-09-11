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

// FIXME: remove test code
export async function getTest() {
  if (!db) {
    console.error('Firebase is not initialized. Cannot perform getTest()');
    return;
  }

  const querySnapshot = await getDocs(collection(db, 'user-dev'));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());
  });
}
