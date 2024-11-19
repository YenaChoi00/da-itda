import React, { useContext, useEffect, useState } from 'react';
import { CellPageTab } from '../../model/tab';
import { getCellPageTab } from '../../lib/firestore/tab';
import FadeLoader from 'react-spinners/FadeLoader';
import { addUser } from '../../lib/firestore/user';
import { CategoryContext } from '../../main';
import { errorToast, successToast } from '../toast';
import CellTabPage from './CellTabPage';
import { dateFormat } from '../../assets/utils';
import CustomCalender from '../Calender';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const CellPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [title, setTitle] = useState<string>('');
  const [birthday, setBirthday] = useState<Date | null>();

  const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';

  const queryClient = useQueryClient();
  const query = useQuery<CellPageTab[]>({
    queryKey: ['cellPageData'],
    queryFn: async () => getCellPageTab(FAMILY_ID),
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['cellPageData'] });
  };

  const info = useContext(CategoryContext);
  const [category, setCategory] = useState<string>('');

  useEffect(() => {
    if (info.cellArr.length > 0 && category === '') {
      setCategory(info.cellArr[0].cid);
    }
  }, [info.cellArr.length]);

  const createTitle = (value: string) => {
    setTitle(value);
  };

  const createCategory = (value: string) => {
    setCategory(value);
  };

  const closeAdd = () => {
    setTitle('');
    setBirthday(null);
    setCategory('');
    setIsAdding(false);
  };

  const getNameById = (id: string) => {
    const cell = info.cellArr.find((item) => item.cid === id);
    return cell ? cell.cname : null;
  };

  const checkValues = () => {
    if (title !== '') {
      if (birthday) {
        if (category !== '') {
          return true;
        } else {
          errorToast('셀을 선택해주세요.');
          return false;
        }
      } else {
        errorToast('생년월일을 입력해주세요.');
        return false;
      }
    } else {
      errorToast('이름을 입력해주세요.');
      return false;
    }
  };

  const submit = async () => {
    if (checkValues()) {
      const user = {
        name: title,
        level: 10,
        birthday: dateFormat(birthday!),
        alive: true,
      };
      const cellId = category;
      const cellName = getNameById(category);
      try {
        await addUser(user, cellId);
        refreshData();

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
          <CustomCalender selectedDate={birthday} onChange={(date) => setBirthday(date)} />
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
          className="self-end m-1 outline-hover-btn"
        >
          셀원 추가
        </button>
      )}

      {query.isLoading || query.isFetching ? (
        <div className="container flex flex-col items-center justify-center h-screen space-y-5">
          <FadeLoader color="#5db075" margin={3} />
          <span>데이터를 불러오는 중입니다.</span>
        </div>
      ) : query.isError ? (
        <div className="container place-self-center">데이터를 불러오는 데 오류가 발생했습니다.</div>
      ) : (
        <div>
          {query.data?.length != undefined ? (
            <CellTabPage
              tabData={query.data!}
              activeTabNum={activeTab}
              setActiveTabNum={setActiveTab}
              refreshData={refreshData}
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
