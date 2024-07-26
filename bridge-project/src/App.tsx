import { useState } from 'react';
import './App.css';
import Card from './Card';
import { Info } from './model/info';
import { HiChevronLeft } from 'react-icons/hi';
import { HiChevronRight } from 'react-icons/hi';

const App: React.FC = () => {
  const DATE: string = '2024-07-17';
  const data: Info[] = [
    {
      id: 1,
      name: '최예나',
      date: '2024-07-17',
      content: [
        '오늘 말씀을 기억하며 하나님과 동행하는 취준 기간이 되도록',
        '동생이 군대에서 하나님을 만날 수 있기를',
      ],
    },
    {
      id: 2,
      name: '서지혜',
      date: '2024-07-17',
      content: [
        '알바를 시작했는데, 취준과 병행할 수 있도록 체력을 허락하시길',
        '준비할 것도 많고, 막막한 취준이지만 그렇기에 더 철저히 하나님을 붙잡고 가는 기간이 되길',
        '가족들을 위한 중보를 할 때, 무거운 마음이 아니라 맡겨드리는 마음이 되길.힘듦을 이겨낼 사랑의 마음을 부어주시길.',
      ],
    },
  ];
  const emptyData: Info = {
    id: 0,
    name: '',
    date: '',
    content: [''],
  };

  const [curDate, setCurDate] = useState<string>(DATE);
  const [myData, setMyData] = useState<Info[]>(data);

  const [isCreate, setIsCreate] = useState(false);
  const [newInfo, setNewInfo] = useState<Info>(emptyData);

  const [editingId, setEditingId] = useState(0);

  // 작성
  const createNewInfo = () => {
    setIsCreate(true);
  };

  const createTitle = (value: string) => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      name: value,
    }));
  };

  const createContent = (value: string) => {
    const list = value.split('\n');
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      content: list,
      id: myData.length + 1, // 임시
    }));
  };

  const updateChanges = () => {
    if (
      newInfo.name.trim() === '' ||
      newInfo.content.length === 0 ||
      newInfo.content.every((item) => item.trim() === '')
    ) {
      const userConfirmed = window.confirm(
        '이름과 기도제목을 모두 입력해주세요.\n또는 작성을 취소하시겠습니까?',
      );

      if (userConfirmed) {
        // '예'를 선택하면 입력 초기화
        setNewInfo(emptyData);
        setIsCreate(false);
      }

      return;
    }

    setNewInfo((prevInfo) => ({
      ...prevInfo,
      date: curDate, // 현재 페이지의 날짜로 자동 지정
    }));
    // 지금까지 작성된 Info 데이터 저장 & 업데이트
    setMyData([...myData, newInfo]);
    // 데이터 초기화
    setNewInfo(emptyData);
    // 작성 중 상태 해제
    setIsCreate(false);
  };

  // 어떤 카드의 수정이 시작되었을 때
  const startEdit = (id: number) => {
    setEditingId(id);
  };
  const endEdit = () => {
    setEditingId(0);
  };

  // 이름 수정
  const changeName = (index: number, newName: string) => {
    const updatedData = [...myData];
    updatedData[index].name = newName;
    setMyData(updatedData);
  };
  // 내용 수정
  const changePrayerRequest = (index: number, newRequest: string[]) => {
    const updatedData = [...myData];
    updatedData[index].content = newRequest;
    setMyData(updatedData);
  };

  // 삭제
  const deleteItem = (id: number) => {
    let updatedData = [...myData];
    updatedData = updatedData.filter((data) => data.id != id);
    setMyData(updatedData);
  };

  return (
    <>
      <div className="container flex flex-col content-start w-96">
        <h2 className="text-2xl font-semibold">예나셀</h2>
        <div className="flex content-center justify-between my-2">
          <button className="bg-transparent hover:border-primary">
            <HiChevronLeft />
          </button>
          <span className="self-center">{curDate}</span>
          <button className="bg-transparent hover:border-primary">
            <HiChevronRight />
          </button>
        </div>
        {isCreate ? (
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

            <button
              onClick={updateChanges}
              type="button"
              className="self-end w-2/3 my-2 primary-btn"
            >
              저장/취소하기
            </button>
          </div>
        ) : (
          <button
            onClick={createNewInfo}
            type="button"
            className="self-center w-2/3 my-2 font-semibold outline-hover-btn"
          >
            추가하기
          </button>
        )}

        {myData.length != 0 ? (
          myData.map((item, index) => (
            <Card
              key={index}
              data={item}
              changeContent={(newContent: string[]) => changePrayerRequest(index, newContent)}
              changeTitle={(newTitle: string) => changeName(index, newTitle)}
              isEditable={item.id == editingId ? true : false}
              startEdit={(id: number) => startEdit(id)}
              endEdit={endEdit}
              deleteItem={deleteItem}
            />
          ))
        ) : (
          <div className="container place-self-center">추가된 기도제목이 없습니다</div>
        )}
      </div>
    </>
  );
};

export default App;
