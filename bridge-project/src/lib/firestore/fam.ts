import { doc, getDoc } from 'firebase/firestore';
import { getAllUser, getFamilyCollection } from '.';
import { CategoryInfo, FamilyDoc } from './type';

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
