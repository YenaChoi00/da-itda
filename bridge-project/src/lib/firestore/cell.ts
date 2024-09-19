import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

import { getCellCollection, getUserCollection } from '.';

export async function addUsertoCell(userId: string, cellId: string) {
  try {
    const userRef = doc(getUserCollection(), userId);
    const cellRef = doc(getCellCollection(), cellId);
    await updateDoc(cellRef, {
      memberArr: arrayUnion(userRef),
    });
  } catch (error) {
    console.error('Error adding user to cell:', error);
    throw error;
  }
}
