import React, { useState } from 'react';
import { Info } from '../../model/info.ts';
import { TabModel } from '../../model/tabModel';
import Card from '../Card/index.tsx';

interface TabProps {
  tabData: TabModel[];
  activeTabNum: number;
  setActiveTabNum: (num: number) => void;
  famData: Info[];
  refreshPage: () => Promise<void>;
}

const TabPage: React.FC<TabProps> = ({
  tabData,
  activeTabNum,
  setActiveTabNum,
  famData,
  refreshPage,
}) => {
  const [editingId, setEditingId] = useState<string>('-1');

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
    // updateFamData(updatedData);
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
              changeCard={(newTitle: string, newContent: string[]) =>
                changeItem(item.id, newTitle, newContent)
              }
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
