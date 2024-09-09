import React, { useState } from 'react';
import { TabModel } from '../../model/tabModel';
import Card from '../Card/index.tsx';
import { Info } from '../../model/info.ts';

interface TabProps {
  tabData: TabModel[];
  activeTabNum: number;
  setActiveTabNum: (num: number) => void;
  famData: Info[];
  updateFamData: (updatedData: Info[]) => void;
}

const TabPage: React.FC<TabProps> = ({
  tabData,
  activeTabNum,
  setActiveTabNum,
  famData,
  updateFamData,
}) => {
  const [editingId, setEditingId] = useState<number>(-1);

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
    let updatedData = [...famData];
    if (newName) {
      updatedData = updatedData.map((item) => (item.id === id ? { ...item, name: newName } : item));
    }
    if (newRequest) {
      updatedData = updatedData.map((item) =>
        item.id === id ? { ...item, content: newRequest } : item,
      );
    }
    updateFamData(updatedData);
  };

  // 삭제
  const deleteItem = (id: number) => {
    let updatedData = [...famData];
    updatedData = updatedData.filter((data) => data.id != id);
    updateFamData(updatedData);
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
        {tabData[activeTabNum].content.map((item) => (
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
        ))}
      </div>
    </div>
  );
};

export default TabPage;
