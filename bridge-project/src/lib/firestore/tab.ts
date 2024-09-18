import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import moment from 'moment';
import { getFamilyCollection, getPrayerRequestCollection, readUserArr } from '.';
import { Info } from '../../model/info';
import { TabModel } from '../../model/tabModel';
import { CellDoc, FamilyDoc, PrayerRequestDoc } from './type';

const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';

export async function getTabModels(): Promise<TabModel[]> {
  try {
    const cellArray: TabModel[] = [];

    // Get family with FAMILY_ID
    const familyRef = doc(getFamilyCollection(), FAMILY_ID);
    const familyDoc = await getDoc(familyRef);

    if (!familyDoc.exists()) {
      throw new Error('Family not found');
    }

    const familyData = familyDoc.data() as FamilyDoc;
    const cellRefs = familyData.cellArr;

    // Iterate through cells
    for (const cellRef of cellRefs) {
      const cellDoc = await getDoc(cellRef);
      const cellData = cellDoc.data() as CellDoc;
      const cellId = cellDoc.id;
      const cellName = cellData.name;

      // Create userDict for this cell
      const userDict = await readUserArr({ userRefArr: cellData.memberArr });

      // Get prayer requests for this cell
      const prayerRequestQuery = query(
        getPrayerRequestCollection(),
        where('user', 'in', cellData.memberArr),
      );
      const prayerRequestDocs = await getDocs(prayerRequestQuery);

      // Convert prayer requests to Info[]
      const infos: Info[] = prayerRequestDocs.docs.map((doc) => {
        const data = doc.data() as PrayerRequestDoc;
        return {
          id: doc.id,
          content: data.content,
          date: moment(data.date.toDate()).format('YYYY-MM-DD'),
          userId: data.user.id,
          name: userDict[data.user.id].name,
          cellId: cellId,
          famId: FAMILY_ID,
          famName: familyData.name,
          cellName: cellName,
          alive: data.alive,
        };
      });

      // Push Info[] to tabModels with cell id and cell name
      cellArray.push({
        id: cellId,
        name: cellName,
        content: infos,
      });
    }

    // Create an "All" tab that includes all prayer requests
    const allInfos = cellArray.flatMap((tab) => tab.content);
    const tabModels = [
      {
        id: 'all',
        name: '전체',
        content: allInfos,
      },
      ...cellArray,
    ];

    return tabModels;
  } catch (error) {
    console.error('Error fetching tab models:', error);
    throw error;
  }
}
