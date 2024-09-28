import React, { useState } from 'react';
import { TabModel } from '../../model/tabModel';
import Card from '../Card/index.tsx';

interface TabProps {
  tabData: TabModel[];
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

  return (
    <div className="flex flex-col tab">
      <ul className="grid grid-flow-col cursor-pointer justify-stretch">
        {tabData.map((tab: TabModel, index: number) => (
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
        {tabData.length > 0 &&
          tabData[activeTabNum].content.map((item) => (
            <Card
              key={item.id}
              data={item}
              isEditable={item.id === editingId}
              startEdit={(id: string) => startEdit(id)}
              endEdit={endEdit}
              refreshParentPage={refreshPage}
            />
          ))}
      </div>
    </div>
  );
};

export default TabPage;
