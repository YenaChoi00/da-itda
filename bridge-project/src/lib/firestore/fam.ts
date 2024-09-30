import { doc, getDoc } from 'firebase/firestore';
import { getAllUser, getFamilyCollection } from '.';
import { CategoryInfo, FamilyDoc, UserDoc, UserInfo } from './type';
import { getCellNameById, getLeader } from './cell';

const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';

export async function getCategoryInfo() {
  const info: CategoryInfo = {
    fid: '',
    fname: '',
    cellArr: [],
  };
  const famRef = doc(getFamilyCollection(), FAMILY_ID);
  const famSnap = await getDoc(famRef);

  if (famSnap.exists()) {
    const famData = famSnap.data() as FamilyDoc;
    info.fid = famSnap.id;
    info.fname = famData.name;

    famData.cellArr.forEach(async (cellRef) => {
      const cellSnap = await getDoc(cellRef);
      if (cellSnap.exists()) {
        const cellData = cellSnap.data();
        info.cellArr.push({ cname: cellData.name, cid: cellSnap.id });
      }
    });
    return info;
  } else {
    throw new Error('Error while fetching category data.');
  }
}

export async function getAllFamUser() {
  const famRef = doc(getFamilyCollection(), FAMILY_ID);
  const famSnap = await getDoc(famRef);

  if (famSnap.exists()) {
    const everyUser: UserDoc[] = [];
    const famData = famSnap.data() as FamilyDoc;
    const cellIds = famData.cellArr.map((cell) => cell.id);

    // 1. Staff
    const staffRef = famSnap.data().leader;
    const staffDoc = await getDoc(staffRef);
    everyUser.push(staffDoc.data() as UserDoc);

    cellIds.forEach(async (id) => {
      try {
        // 2. leader
        const leader = await getLeader(id);
        everyUser.push(leader);
        // 3. member
        const userArr = await getAllUser(id);
        everyUser.push(...userArr);
      } catch (e) {
        console.log(e);
      }
    });

    return everyUser;
  } else {
    throw new Error('Error while fetching category data.');
  }
}

export async function getAllFamUserWCategory() {
  const famRef = doc(getFamilyCollection(), FAMILY_ID);
  const famSnap = await getDoc(famRef);

  if (famSnap.exists()) {
    const everyUser: UserInfo[] = [];
    const famData = famSnap.data() as FamilyDoc;
    const cellIds = famData.cellArr.map((cell) => cell.id);

    // 1. Staff
    const staffRef = famSnap.data().leader;
    const staffDoc = await getDoc(staffRef);
    const staff = {
      cell: '전체',
      ...(staffDoc.data() as UserDoc),
    };
    everyUser.push(staff);

    cellIds.forEach(async (id) => {
      try {
        const cellName = await getCellNameById(id);
        // 2. leader
        const leader = await getLeader(id);
        const leaderInfo = {
          cell: cellName,
          ...leader,
        };
        everyUser.push(leaderInfo);
        // 3. member
        const userArr = await getAllUser(id);
        const userInfoArr = userArr.map((user) => ({
          ...user,
          cell: cellName,
        }));
        everyUser.push(...userInfoArr);
      } catch (e) {
        console.log(e);
      }
    });

    return everyUser;
  } else {
    throw new Error('Error while fetching category data.');
  }
}
