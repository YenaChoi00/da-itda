import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Card from './Card'
import { Info } from './model/info'

const App: React.FC = () => {
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


  const [myData, setMyData] = useState<Info[]>(data);

  return (
    <>
      <div>
        <h2>예나셀</h2>
        <div>
          <button>이전</button>
          <text>2024.07.14</text>
          <button>다음</button>
        </div>
        <button>작성하기</button>
        {myData.map((item, index) => (
          <Card key={index} data={item} />
        ))}
      </div>
    </>
  )
}

export default App
