import {
  collection,
  deleteDoc,
  doc,
  documentId,
  DocumentReference,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';

import { getCellCollection, getDb } from '.';
import { Cell, CellDoc, UserDoc } from './type';

const USER_COLLECTION_NAME = 'user-dev';

export const getUserCollection = () => collection(getDb(), USER_COLLECTION_NAME);

export async function createUser(userData: Omit<UserDoc, 'id'>): Promise<string> {
  try {
    const userCollection = getUserCollection();
    const newUserRef = doc(userCollection);
    await setDoc(newUserRef, userData);
    return newUserRef.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function readAllUser(): Promise<UserDoc[]> {
  const querySnapshot = await getDocs(getUserCollection());
  return querySnapshot.docs.map((doc) => doc.data() as UserDoc);
}

export async function getAllUser(cellId: string) {
  const cellRef = doc(getCellCollection(), cellId);
  const cellSnap = await getDoc(cellRef);

  if (cellSnap.exists()) {
    const cellData = cellSnap.data() as CellDoc;

    const userIds = cellData.memberArr.map((user) => user.id);
    // 최대 10개 밖에 못 가져옴.
    const userQuery = query(getUserCollection(), where(documentId(), 'in', userIds));

    const querySnapshot = await getDocs(userQuery);
    const userArr = querySnapshot.docs.map((doc) => doc.data() as UserDoc);

    return userArr;
  } else {
    throw new Error('Error while fetching every user in fam.');
  }
}

export async function getAllUserWithCell(cellId: string) {
  const cellRef = doc(getCellCollection(), cellId);
  const cellSnap = await getDoc(cellRef);

  if (cellSnap.exists()) {
    const cellData = cellSnap.data() as CellDoc;

    const userIds = cellData.memberArr.map((user) => user.id);
    // 최대 10개 밖에 못 가져옴.
    const userQuery = query(getUserCollection(), where(documentId(), 'in', userIds));

    const querySnapshot = await getDocs(userQuery);
    const userArr: Cell = {
      name: '',
      memberArr: [],
    };

    userArr.name = cellData.name;

    querySnapshot.docs.forEach((doc) => {
      userArr.memberArr.push(doc.data() as UserDoc);
    });

    return userArr;
  } else {
    throw new Error('Error while fetching every user in fam.');
  }
}

interface ReadUserArrArgs {
  userRefArr: DocumentReference[];
}
export async function readUserArr({
  userRefArr,
}: ReadUserArrArgs): Promise<{ [key: string]: UserDoc }> {
  const userDict: { [key: string]: UserDoc } = {};
  for (const userRef of userRefArr) {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserDoc;
    userDict[userRef.id] = userData;
  }
  return userDict;
}

export async function readUser({ id }: { id: string }): Promise<UserDoc | null> {
  const userRef = doc(getUserCollection(), id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserDoc;
  } else {
    return null;
  }
}

export async function updateUser({
  id,
  userData,
}: {
  id: string;
  userData: Partial<UserDoc>;
}): Promise<void> {
  try {
    const userRef = doc(getUserCollection(), id);
    await updateDoc(userRef, userData);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser({ id }: { id: string }): Promise<void> {
  try {
    const userRef = doc(getUserCollection(), id);
    await deleteDoc(userRef);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}
