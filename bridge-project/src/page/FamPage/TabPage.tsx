import React, { useMemo, useState } from 'react';
import { FamPageTab } from '../../model/tab.ts';
import Card from '../Card/index.tsx';

interface TabProps {
  tabData: FamPageTab[];
  activeTabNum: number;
  setActiveTabNum: (num: number) => void;
  refreshPage: () => Promise<void>;
}

const TabPage: React.FC<TabProps> = ({ tabData, activeTabNum, setActiveTabNum, refreshPage }) => {
  const [editingId, setEditingId] = useState<string>('-1');

  const startEdit = (id: string) => {
    setEditingId(id);
  };

  const endEdit = () => {
    setEditingId('-1');
    refreshPage();
  };

  const curTabData = useMemo(() => tabData[activeTabNum].content, [activeTabNum, tabData]);

  return (
    <div className="flex flex-col tab">
      <ul className="grid grid-flow-col cursor-pointer justify-stretch">
        {tabData.map((tab: FamPageTab, index: number) => (
          <li
            key={index}
            onClick={() => setActiveTabNum(index)}
            className={`${activeTabNum === index ? 'active' : ''} inline-block p-4 border-b-2`}
          >
            {tab.name}
          </li>
        ))}
      </ul>

      <div>
        {curTabData.length > 0 ? (
          curTabData.map((item) => (
            <Card
              key={item.id}
              data={item}
              isEditable={item.id === editingId}
              startEdit={(id: string) => startEdit(id)}
              endEdit={endEdit}
              refreshParentPage={refreshPage}
            />
          ))
        ) : (
          <div className="container place-self-center">
            {tabData[activeTabNum].name}의 기도제목이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default TabPage;
