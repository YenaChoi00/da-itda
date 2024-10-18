import React, { useEffect, useState } from 'react';
import { CellPageTab } from '../../model/tab';
import { getCellPageTab } from '../../lib/firestore/tab';
import TabPage from '../FamPage/TabPage';

const CellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState<CellPageTab[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTabs = async () => {
    const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';

    try {
      const fetchedTabs = await getCellPageTab(FAMILY_ID);
      setTabData(fetchedTabs);

      console.log('tabData', tabData);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <h2 className="text-2xl font-semibold">예빈팸</h2>

      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-3">
          <h2 className="text-xl font-semibold">하형셀</h2>
          <button>수정</button>
        </div>
        <button>셀원 추가</button>
      </div>

      <div>
        {tabData.length > 0 ? (
          <TabPage
            tabData={tabData}
            activeTabNum={activeTab}
            setActiveTabNum={setActiveTab}
            refreshPage={fetchTabs}
          />
        ) : (
          <div className="container place-self-center">추가된 기도제목이 없습니다</div>
        )}
      </div>
    </div>
  );
};

export default CellPage;
