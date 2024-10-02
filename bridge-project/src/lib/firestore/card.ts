import { addDoc, doc, Timestamp, updateDoc } from 'firebase/firestore';
import { getPrayerRequestCollection, getUserDocByName } from '.';
import { Info } from '../../model/info';

export async function addPrayerRequest(param: Omit<Info, 'id'>) {
  try {
    const date = new Date(param.date);

    const userRef = getUserDocByName(param.name);
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
  const userRef = await getUserDocByName(data.name);
  await updateDoc(requestRef, {
    content: data.content,
    user: userRef,
  });
}
