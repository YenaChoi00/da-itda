import React, { useContext, useEffect, useState } from 'react';
import { CellPageTab } from '../../model/tab';
import { getCellPageTab } from '../../lib/firestore/tab';
import TabPage from '../FamPage/TabPage';
import FadeLoader from 'react-spinners/FadeLoader';
import { addUser } from '../../lib/firestore/user';
import { CategoryContext } from '../../main';
import { errorToast, successToast } from '../toast';

const CellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [tabData, setTabData] = useState<CellPageTab[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');

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

  const info = useContext(CategoryContext);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (info.cellArr.length > 0 && category === '') {
      setCategory(info.cellArr[0].cid);
    }
  }, [info.cellArr]);

  const createTitle = (value: string) => {
    setTitle(value);
  };

  const createCategory = (value: string) => {
    setCategory(value);
  };

  const closeAdd = () => {
    setTitle('');
    setIsAdding(false);
  };

  const getNameById = (id: string) => {
    const cell = info.cellArr.find((item) => item.cid === id);
    return cell ? cell.cname : null;
  };

  const checkValues = () => {
    if (title !== '') {
      if (category !== '') {
        return true;
      }
    }
    return false;
  };

  const submit = async () => {
    if (checkValues()) {
      const user = {
        name: title,
        level: 10,
      };
      const cellId = category;
      const cellName = getNameById(category);
      try {
        await addUser(user, cellId);
        await fetchTabs();

        successToast(`${title}이/가 ${cellName}에 추가되었습니다.`);
        closeAdd();
      } catch (error) {
        console.error(error);
        errorToast('오류가 발생하여 추가에 실패했습니다.');
      }
    }
  };

  return (
    <div className="container flex flex-col w-96 h-svh">
      <h2 className="text-2xl font-semibold">예빈팸</h2>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row space-x-3">
          <h2 className="text-xl font-semibold">하형셀</h2>
          <button>수정</button>
        </div>
      </div>

      {isAdding ? (
        <div className="flex flex-col p-2 space-y-2 ">
          <div className="flex space-x-2">
            <input
              type="text"
              id="name-with-label"
              onChange={(e) => createTitle(e.target.value)}
              name="name"
              placeholder="이름"
              className="w-2/3 input-box"
            />
            <select
              className="w-1/3 input-box"
              value={category}
              onChange={(e) => createCategory(e.target.value)}
            >
              {info.cellArr.map((item) => (
                <option value={item.cid} key={item.cid}>
                  {item.cname}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-row self-end space-x-2">
            <button onClick={closeAdd} type="button" className="self-end outline-hover-btn">
              취소
            </button>
            <button onClick={submit} type="button" className="self-end primary-hover-btn">
              추가
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          type="button"
          className="self-end outline-hover-btn"
        >
          셀원 추가
        </button>
      )}

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
