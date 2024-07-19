import { useState } from 'react'
import './App.css'
import Card from './Card'
import { Info } from './model/info'

const App: React.FC = () => {
  let date: string = '2024-07-17';
  let data: Info[] = [
    {
      name: '최예나',
      date: '2024-07-17',
      content: [
        '오늘 말씀을 기억하며 하나님과 동행하는 취준 기간이 되도록',
        '동생이 군대에서 하나님을 만날 수 있기를'
      ]
    },
    {
      name: '서지혜',
      date: '2024-07-17',
      content: [
        '알바를 시작했는데, 취준과 병행할 수 있도록 체력을 허락하시길',
        '준비할 것도 많고, 막막한 취준이지만 그렇기에 더 철저히 하나님을 붙잡고 가는 기간이 되길',
        '가족들을 위한 중보를 할 때, 무거운 마음이 아니라 맡겨드리는 마음이 되길.힘듦을 이겨낼 사랑의 마음을 부어주시길.'
      ]
    }
  ]
  let emptyData: Info = {
    name: '',
    date: '',
    content: ['']
  }


  const [curDate, setCurDate] = useState<string>(date);
  const [myData, setMyData] = useState<Info[]>(data);

  const [adding, setAdding] = useState(false);
  const [newInfo, setNewInfo] = useState<Info>(emptyData);

  // 작성
  const createNewInfo = () => {
    setAdding(true);
  }

  const handleNameChange = (value: string) => {
    setNewInfo(prevInfo => ({
      ...prevInfo,
      name: value
    }));
  }

  const handleContentChange = (value: string) => {
    const list = value.split('\n');
    setNewInfo(prevInfo => ({
      ...prevInfo,
      content: list
    }));
  }

  const createSave = () => {

    if (newInfo.name.trim() === '' || newInfo.content.length === 0 || newInfo.content.every(item => item.trim() === '')) {
      const userConfirmed = window.confirm('이름과 기도제목을 모두 입력해주세요.\n또는 작성을 취소하시겠습니까?');

      if (userConfirmed) {
        // '예'를 선택하면 입력 초기화
        setNewInfo(emptyData);
        setAdding(false);
      }

      return;
    }


    setNewInfo(prevInfo => ({
      ...prevInfo,
      date: curDate // 현재 페이지의 날짜로 자동 지정
    }));
    // 지금까지 작성된 Info 데이터 저장 & 업데이트
    setMyData([...myData, newInfo]);
    // 데이터 초기화
    setNewInfo(emptyData);
    // 작성 중 상태 해제
    setAdding(false);
  }

  // 이름 수정
  const changeName = (index: number, newName: string) => {
    const updatedData = [...myData];
    updatedData[index].name = newName;
    setMyData(updatedData);
  }
  // 내용 수정
  const changeContent = (index: number, newContent: string[]) => {
    const updatedData = [...myData];
    updatedData[index].content = newContent;
    setMyData(updatedData);
  }

  return (
    <>
      <div>
        <h2>예나셀</h2>
        <div>
          <button>이전</button>
          <text>{curDate}</text>
          <button>다음</button>
        </div>
        {adding ? (
          <div>
            <input type="text" onChange={(e) => handleNameChange(e.target.value)}></input>
            <textarea id="inputbox" onChange={(e) => handleContentChange(e.target.value)}></textarea>
            <button onClick={createSave}>저장하기</button>
          </div>) : (
          <button onClick={createNewInfo}>작성하기</button>)}
        {myData.map((item, index) => (
          <Card
            key={index}
            data={item}
            changeContent={(newContent: string[]) => changeContent(index, newContent)}
            changeName={(newName: string) => changeName(index, newName)}
          />
        ))}
      </div >
    </>
  )
}

export default App
