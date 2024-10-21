import React, { useEffect, useMemo, useState } from 'react';
import { CellPageTab } from '../../model/tab.ts';
import UserCard from '../Card/UserCard.tsx';
import { HiOutlinePencil } from 'react-icons/hi';

interface TabProps {
  tabData: CellPageTab[];
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

  const editCategoryName = () => [console.log('editCategoryName')];

  return (
    <div className="flex flex-col tab">
      <ul className="grid grid-flow-col cursor-pointer justify-stretch">
        {tabData.map((tab: CellPageTab, index: number) => (
          <li
            key={index}
            onClick={() => setActiveTabNum(index)}
            className={`${activeTabNum === index ? 'active' : ''} inline-block p-4 border-b-2`}
          >
            {tab.name}
          </li>
        ))}
      </ul>

      {tabData[activeTabNum].name === '전체' ? (
        <></>
      ) : (
        <div className="flex flex-row items-center mt-4 mb-2 space-x-1">
          <h2 className="text-xl font-semibold">{tabData[activeTabNum].name}</h2>
          <button
            className="p-2 bg-transparent hover:border-primary"
            onClick={() => editCategoryName}
          >
            <HiOutlinePencil />
          </button>
        </div>
      )}

      <div>
        {curTabData.length > 0 ? (
          curTabData.map((item) => (
            <UserCard
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
            {tabData[activeTabNum].name}에 셀원이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default TabPage;
