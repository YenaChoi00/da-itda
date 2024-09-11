import { useEffect, useMemo, useState } from 'react';
import { DATE, total } from '../../assets/dummy.ts';
import { Info } from '../../model/info.ts';
import { TabModel } from '../../model/tabModel.ts';
import Card from '../Card/index.tsx';
import Header from '../Header';
import CopyBtn from './CopyBtn.tsx';
import './FamPage.css';

const FamPage: React.FC = () => {
  const emptyData: Info = {
    id: '0',
    name: '',
    famId: '0',
    cellId: '0',
    date: '',
    content: [''],
  };

  const tabs: TabModel[] = useMemo(
    () => [
      { name: '전체', id: '1', content: [] },
      { name: '하형셀', id: '12', content: [] },
      { name: '예나셀', id: '11', content: [] },
    ],
    [],
  );

  const [curDate, setCurDate] = useState<string>(DATE);
  const [famData, setFamData] = useState<Info[]>(total);
  // 날짜별
  const [curDateList, setCurDateList] = useState<Info[]>([]);
  // 탭(셀)별
  const [tabData, setTabData] = useState<TabModel[]>(tabs);

  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [newInfo, setNewInfo] = useState<Info>(emptyData);

  const [contentForCopy, setContentForCopy] = useState<string>('');

  const [editingId, setEditingId] = useState<string>('-1');

  const [active, setActive] = useState(0);

  useEffect(() => {
    // 팸 전체 데이터 중, *현재 날짜*에 해당하는 데이터
    const filtered = famData.filter((item) => item.date === curDate);
    setCurDateList(filtered);
  }, [curDate, famData]);

  // 현재 날짜 데이터 중, *해당 셀*에 해당하는 데이터
  const updatedTabData = useMemo(() => {
    return tabs.map((item) => ({
      ...item,
      content:
        item.name === '전체'
          ? curDateList
          : curDateList.filter((curItem) => curItem.cellId === item.id),
    }));
  }, [curDateList, tabs]);

  useEffect(() => {
    setTabData(updatedTabData);
  }, [updatedTabData]);
  // ----모듈화---

  const changeDate = (newDate: string) => {
    setCurDate(newDate);
    // setEditingId(-1);
  };

  const createTitle = (value: string) => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      name: value,
    }));
  };

  const createContent = (value: string) => {
    const list = value
      .split('\n')
      .map((item) => item.trim()) // 앞뒤 공백 제거
      .filter((item) => item !== ''); // \n 여러 번 입력해서 빈 요소가 된 것들 제거
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      content: list,
      date: curDate,
      id: (famData.length + 1).toString(), // 임시
    }));
  };

  const checkEmpty = () => {
    if (
      newInfo.name.trim() === '' ||
      newInfo.content.length === 0 ||
      newInfo.content.every((item) => item.trim() === '')
    ) {
      const userConfirmed = window.confirm(
        '이름과 기도제목을 모두 입력해주세요.\n또는 작성을 취소하시겠습니까?',
      );

      if (userConfirmed) {
        // '예' 선택 -> 작성 취소
        setNewInfo(emptyData);
        setIsWriting(false);
      }

      return;
    } else updateChanges();
  };

  const updateChanges = () => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      date: curDate, // 현재 페이지의 날짜로 자동 지정
    }));
    // 지금까지 작성된 Info 데이터 저장 & 업데이트
    setFamData([...famData, newInfo]);

    setNewInfo(emptyData);
    setIsWriting(false);
  };

  // Card 동작 관련 함수
  const startEdit = (id: string) => {
    setEditingId(id);
  };

  const endEdit = () => {
    setEditingId('-1');
  };

  const changeItem = (
    id: string,
    newName: string | undefined,
    newRequest: string[] | undefined,
  ) => {
    let updatedData = [...famData];
    if (newName) {
      updatedData = updatedData.map((item) => (item.id === id ? { ...item, name: newName } : item));
    }
    if (newRequest) {
      updatedData = updatedData.map((item) =>
        item.id === id ? { ...item, content: newRequest } : item,
      );
    }
    setFamData(updatedData);
  };

  // 삭제
  const deleteItem = (id: string) => {
    let updatedData = [...famData];
    updatedData = updatedData.filter((data) => data.id != id);
    setFamData(updatedData);
  };

  // 복사
  const copy = () => {
    const data = [...tabData[active].content];
    const copyData = data
      .map((item) => {
        const contentText = item.content
          .map((contentItem, index) => `${index + 1}. ${contentItem}`)
          .join('\n');
        return `${item.name}\n${contentText}`;
      })
      .join('\n\n');

    setContentForCopy(copyData);
  };

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <Header curDate={curDate} name="예빈팸" changeDate={changeDate}></Header>
      {isWriting ? (
        <div className="flex flex-col w-full px-2 space-y-2">
          <input
            type="text"
            id="name-with-label"
            onChange={(e) => createTitle(e.target.value)}
            name="name"
            placeholder="이름"
            className="w-full input-box"
          />
          <textarea
            onChange={(e) => createContent(e.target.value)}
            id="content"
            placeholder="기도제목을 입력해주세요. 엔터로 번호가 구분됩니다."
            name="content"
            rows={5}
            cols={40}
            className="w-full input-box"
          ></textarea>

          <button onClick={checkEmpty} type="button" className="self-end w-2/3 my-2 primary-btn">
            저장/취소하기
          </button>
        </div>
      ) : (
        <div className="flex flex-row justify-center my-2">
          <button
            onClick={() => setIsWriting(true)}
            type="button"
            className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
          >
            추가하기
          </button>
          {curDateList.length > 0 && (
            <CopyBtn
              btnText="복사하기"
              copyContent={contentForCopy}
              toastText="기도제목이 복사되었습니다."
              copy={copy}
            />
          )}
        </div>
      )}
      {curDateList.length > 0 ? (
        <div className="flex flex-col my-3 tab">
          <ul className="grid grid-flow-col cursor-pointer justify-stretch">
            {tabData.map((tab: TabModel, index: number) => (
              <li
                key={index}
                onClick={() => setActive(index)}
                className={`${active === index ? 'active' : ''} inline-block p-4 border-b-2`}
              >
                {tab.name}
              </li>
            ))}
          </ul>

          <div>
            {tabData[active].content.map((item) => (
              <Card
                key={item.id}
                data={item}
                changeCard={(newTitle: string, newContent: string[]) =>
                  changeItem(item.id, newTitle, newContent)
                }
                isEditable={item.id === editingId}
                startEdit={(id: number) => startEdit(id.toString())}
                endEdit={endEdit}
                deleteItem={deleteItem}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="container place-self-center">추가된 기도제목이 없습니다</div>
      )}
    </div>
  );
};

export default FamPage;
