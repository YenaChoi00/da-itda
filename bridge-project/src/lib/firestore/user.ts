import { collection, doc, DocumentReference, getDoc, getDocs } from 'firebase/firestore';

import { getDb } from '.';
import { UserDoc } from './type';

const USER_COLLECTION_NAME = 'user-dev';

export const getUserCollection = () => collection(getDb(), USER_COLLECTION_NAME);

export async function getAllUser(): Promise<UserDoc[]> {
  const querySnapshot = await getDocs(getUserCollection());
  return querySnapshot.docs.map((doc) => doc.data() as UserDoc);
}

interface GetUserArrArgs {
  userRefArr: DocumentReference[];
}
export async function getUserArr({
  userRefArr,
}: GetUserArrArgs): Promise<{ [key: string]: UserDoc }> {
  const userDict: { [key: string]: UserDoc } = {};
  for (const userRef of userRefArr) {
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as UserDoc;
    userDict[userRef.id] = userData;
  }
  return userDict;
}

export async function getUser({ id }: { id: string }): Promise<UserDoc | null> {
  const userRef = doc(getUserCollection(), id);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserDoc;
  } else {
    return null;
  }
}
