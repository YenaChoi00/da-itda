import { addDoc, doc, getDocs, query, Timestamp, where } from 'firebase/firestore';
import { getPrayerRequestCollection, getUserCollection } from '.';
import { Info } from '../../model/info';

export async function addPrayerRequest(param: Info) {
  //   try {
  //   } catch (error) {
  //     console.error('Error fetching tab models:', error);
  //     throw error;
  //   }
  const date = new Date(param.date);

  const userQuery = query(getUserCollection(), where('name', '==', param.name));
  // 이름 없으면 새로운 user 생성
  // createUser()
  const userDocs = await getDocs(userQuery);
  if (userDocs.empty) {
    throw new Error('No user found with the name ${param.name}');
  }
  const userRef = userDocs.docs[0].ref;

  const cardRef = getPrayerRequestCollection();
  const cardDoc = await addDoc(cardRef, {
    content: param.content,
    date: Timestamp.fromDate(date),
    user: userRef,
  });

  console.log(cardDoc);
}
