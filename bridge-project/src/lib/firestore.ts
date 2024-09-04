import { initializeApp } from 'firebase/app';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function getTest() {
  const querySnapshot = await getDocs(collection(db, 'user-dev'));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => `, doc.data());
  });
}
