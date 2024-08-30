import { useEffect, useState } from 'react';
import './CellPage.css';
import Card from './Card/index.tsx';
import { Info } from './model/info.ts';
import { data, DATE } from './assets/dummy.ts';
import Header from './Header/index.tsx';
import CopyBtn from './Header/CopyBtn.tsx';

const CellPage: React.FC = () => {
  const emptyData: Info = {
    id: 0,
    name: '',
    date: '',
    content: [''],
  };

  const [curDate, setCurDate] = useState<string>(DATE);
  const [myData, setMyData] = useState<Info[]>(data);
  const [curDateItem, setCurDateItem] = useState<Info[]>([]);

  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [newInfo, setNewInfo] = useState<Info>(emptyData);

  const [editingId, setEditingId] = useState<number>(-1);

  const [contentForCopy, setContentForCopy] = useState<string>('');

  useEffect(() => {
    const filtered = myData.filter((item) => item.date === curDate);
    setCurDateItem(filtered);
  }, [curDate, myData]);

  const changeDate = (newDate: string) => {
    setCurDate(newDate);
    endEdit();
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
      id: myData.length + 1, // 임시
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
    setMyData([...myData, newInfo]);

    setNewInfo(emptyData);
    setIsWriting(false);
  };

  const startEdit = (id: number) => {
    setEditingId(id);
  };

  const endEdit = () => {
    setEditingId(-1);
  };

  const changeItem = (
    id: number,
    newName: string | undefined,
    newRequest: string[] | undefined,
  ) => {
    let updatedData = [...myData];
    if (newName) {
      updatedData = updatedData.map((item) => (item.id === id ? { ...item, name: newName } : item));
    }
    if (newRequest) {
      updatedData = updatedData.map((item) =>
        item.id === id ? { ...item, content: newRequest } : item,
      );
    }
    setMyData(updatedData);
  };

  // 삭제
  const deleteItem = (id: number) => {
    let updatedData = [...myData];
    updatedData = updatedData.filter((data) => data.id != id);
    setMyData(updatedData);
  };

  // 복사
  const copy = () => {
    const data = [...curDateItem];
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
      <Header curDate={curDate} name="예나셀" changeDate={changeDate}></Header>
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
          {curDateItem.length > 0 && (
            <CopyBtn
              btnText="복사하기"
              copyContent={contentForCopy}
              toastText="기도제목이 복사되었습니다."
              copy={copy}
            />
          )}
        </div>
      )}
      {curDateItem.length > 0 ? (
        curDateItem.map((item) => (
          <Card
            key={item.id}
            data={item}
            changeCard={(newTitle: string, newContent: string[]) =>
              changeItem(item.id, newTitle, newContent)
            }
            isEditable={item.id === editingId}
            startEdit={(id: number) => startEdit(id)}
            endEdit={endEdit}
            deleteItem={deleteItem}
          />
        ))
      ) : (
        <div className="container place-self-center">추가된 기도제목이 없습니다</div>
      )}
    </div>
  );
};

export default CellPage;
