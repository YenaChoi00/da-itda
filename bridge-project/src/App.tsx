import { useEffect, useState } from 'react';
import './App.css';
import Card from './Card';
import { Info } from './model/info';
import { HiChevronLeft } from 'react-icons/hi';
import { HiChevronRight } from 'react-icons/hi';
import moment from 'moment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const DATE: string = moment('2024-07-17').format('YYYY-MM-DD').toString();
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
    {
      id: 3,
      name: '최예나',
      date: '2024-07-24',
      content: [
        '새로운 기도제목1',
        '새로운 기도제목2',
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
  const [curDateItem, setCurDateItem] = useState<Info[]>([]);

  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [newInfo, setNewInfo] = useState<Info>(emptyData);

  const [editingId, setEditingId] = useState<number>(0);

  const [contentForCopy, setContentForCopy] = useState<string>('');

  useEffect(() => {
    const filtered = myData.filter((item) => item.date === curDate);
    setCurDateItem(filtered);
  }, [curDate, myData]);

  useEffect(() => {
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
  }, [curDateItem]);

  // 날짜 이동
  const moveForward = () => {
    const momentDate = moment(curDate, 'YYYY-MM-DD');
    const newDate = momentDate.add(7, 'days').format('YYYY-MM-DD').toString(); // n째주 대신 7일 기준으로
    setCurDate(newDate);
  };
  const moveBackward = () => {
    const momentDate = moment(curDate, 'YYYY-MM-DD');
    const newDate = momentDate.subtract(7, 'days').format('YYYY-MM-DD').toString();
    setCurDate(newDate);
  };

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
  const copyToast = () =>
    toast.info('기도제목이 복사되었습니다.', {
      position: 'bottom-left',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  return (
    <>
      <div className="container flex flex-col content-start w-96 h-svh">
        <h2 className="text-2xl font-semibold">예나셀</h2>
        <div className="flex content-center justify-between my-2">
          <button className="bg-transparent hover:border-primary" onClick={moveBackward}>
            <HiChevronLeft />
          </button>
          <span className="self-center">{curDate}</span>
          <button className="bg-transparent hover:border-primary" onClick={moveForward}>
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
          <div className="flex flex-row justify-center my-2">
            <button
              onClick={createNewInfo}
              type="button"
              className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
            >
              추가하기
            </button>
            {curDateItem.length != 0 ? (
              <CopyToClipboard text={contentForCopy} onCopy={copyToast}>
                <button
                  type="button"
                  className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
                >
                  복사하기
                </button>
              </CopyToClipboard>
            ) : (
              <></>
            )}
            <ToastContainer />
          </div>
        )}
        {curDateItem.length != 0 ? (
          curDateItem.map((item, index) => (
            <Card
              key={index}
              data={item}
              changeCard={(newTitle: string, newContent: string[]) =>
                changeItem(item.id, newTitle, newContent)
              }
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
