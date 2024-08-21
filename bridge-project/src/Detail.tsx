import React from 'react';
import Tab from './Tab';
import { TabModel } from './model/tabModel';
import { data, data2, total } from './assets/dummy.ts';
import { Info } from './model/info';
import CardReadOnly from './CardReadOnly.tsx';
import Header from './Header.tsx';

const Detail: React.FC = () => {
  const curDate: string = '2024-07-17';

  const changeDate = (newDate: string) => {
    // 임시
  };

  const TabContent = (itemArr: Info[]): JSX.Element[] => {
    return itemArr.map((item) => <CardReadOnly data={item} />);
  };

  const tabData: TabModel[] = [
    { title: '전체', content: TabContent(total) },
    { title: '하형셀', content: TabContent(data2) },
    { title: '예나셀', content: TabContent(data) },
  ];
  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <Header curDate={curDate} name="예빈팸" changeDate={changeDate}></Header>
      <Tab tabs={tabData} />
    </div>
  );
};

export default Detail;
