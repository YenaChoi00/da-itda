import React, { useContext, useEffect, useState } from 'react';
import { CellPageTab } from '../../model/tab';
import { getCellPageTab } from '../../lib/firestore/tab';
import TabPage from '../FamPage/TabPage';
import FadeLoader from 'react-spinners/FadeLoader';
import { addUser } from '../../lib/firestore/user';

const CellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState<CellPageTab[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';
  const fetchTabs = async () => {
    try {
      const fetchedTabs = await getCellPageTab(FAMILY_ID);
      setTabData(fetchedTabs);

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

  const submit = async () => {
    const user = {
      name: 'sss',
      level: 10,
    };
    const cellId = 'dh9zHzMSJA0YKRaWiB7w';

    try {
      await addUser(user, cellId);
      fetchTabs();
    } catch (error) {}
  };

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <h2 className="text-2xl font-semibold">예빈팸</h2>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-3">
          <h2 className="text-xl font-semibold">하형셀</h2>
          <button>수정</button>
        </div>
        <button onClick={submit} type="button" className="self-end outline-hover-btn">
          셀원 추가
        </button>
      </div>
      {isLoading ? (
        <>
          <div className="container flex flex-col items-center justify-center h-screen space-y-5">
            <FadeLoader color="#5db075" margin={3} />
            <span>데이터를 불러오는 중입니다.</span>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
};

export default CellPage;
