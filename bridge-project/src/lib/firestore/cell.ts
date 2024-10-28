import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';

import { getCellCollection, getUserCollection } from '.';
import { UserDoc } from './type';

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

export async function getLeader(cellId: string) {
  const cellRef = doc(getCellCollection(), cellId);
  const cellSnap = await getDoc(cellRef);

  if (cellSnap.exists()) {
    const cellData = cellSnap.data();
    const userRef = cellData.leader;

    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const userData = userSnap.data() as UserDoc;
      return userData;
    } else {
      throw new Error('User document does not exist.');
    }
  } else {
    throw new Error('Cell document does not exist.');
  }
}

export async function getCellNameById(cellId: string) {
  const cellRef = doc(getCellCollection(), cellId);
  const cellSnap = await getDoc(cellRef);

  if (cellSnap.exists()) {
    const cellData = cellSnap.data();
    return cellData.name;
  } else {
    throw new Error('Cell document does not exist.');
  }
}

export async function updateCellName({ cellId, cellName }: { cellId: string; cellName: string }) {
  try {
    const cellRef = doc(getCellCollection(), cellId);
    console.log(cellRef);
    await updateDoc(cellRef, {
      name: cellName,
    });
  } catch (error) {
    throw new Error('Cell document does not exist.');
  }
}
