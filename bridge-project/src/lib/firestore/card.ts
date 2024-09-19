import { addDoc, doc, getDocs, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { getPrayerRequestCollection, getUserCollection } from '.';
import { Info } from '../../model/info';

export async function addPrayerRequest(param: Omit<Info, 'id'>) {
  try {
    const date = new Date(param.date);

    const userQuery = query(getUserCollection(), where('name', '==', param.name));

    const userDocs = await getDocs(userQuery);
    if (userDocs.empty) {
      throw console.log(`No user found with the name ${param.name}`);
    }
    const userRef = userDocs.docs[0].ref;

    const cardRef = getPrayerRequestCollection();
    await addDoc(cardRef, {
      content: param.content,
      date: Timestamp.fromDate(date),
      user: userRef,
      alive: true,
    });
  } catch (error) {
    throw new Error(`Error fetching tab models: ${error}`);
  }
}

export async function deletePrayerRequest(id: string) {
  const requestRef = doc(getPrayerRequestCollection(), id);
  await updateDoc(requestRef, {
    alive: false,
  });
}

export async function updatePrayerRequest(data: Info) {
  const requestRef = doc(getPrayerRequestCollection(), data.id);
  // user: ref 객체
  await updateDoc(requestRef, {
    content: data.content,
  });
}
