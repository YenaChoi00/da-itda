import React, { useEffect, useMemo, useState } from 'react';
import { CellPageTab } from '../../model/tab.ts';
import UserCard from '../Card/UserCard.tsx';
import { HiOutlinePencil } from 'react-icons/hi';
import { errorToast, successToast } from '../toast.tsx';
import { updateCellName } from '../../lib/firestore/cell.ts';
import { useMutation } from '@tanstack/react-query';

interface TabProps {
  tabData: CellPageTab[];
  activeTabNum: number;
  setActiveTabNum: (num: number) => void;
  refreshData: () => void;
}

const TabPage: React.FC<TabProps> = ({ tabData, activeTabNum, setActiveTabNum, refreshData }) => {
  const [editingId, setEditingId] = useState<string>('-1');

  const startEdit = (id: string) => {
    setEditingId(id);
  };

  const endEdit = () => {
    setEditingId('-1');
  };

  const curTabData = useMemo(() => {
    const allTabData = tabData[activeTabNum].memberArr;
    const filteredData = allTabData.filter((item) => {
      return item.alive === true;
    });

    return filteredData;
  }, [activeTabNum, tabData]);

  const [isEditCategory, setIsEditCategory] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>('');

  const initCategoryName = () => {
    const cellName = tabData[activeTabNum].name;
    setNewCategory(cellName);
  };

  useEffect(() => {
    initCategoryName();
  }, [activeTabNum, tabData]);

  const updateC = useMutation({
    mutationFn: ({ name, id }: { name: string; id: string }) =>
      updateCellName({ cellName: name, cellId: id }),
    onSuccess: async () => {
      successToast('성공적으로 수정되었습니다.');
      closeEditCategoryName();
      refreshData();
    },
    onError: async (e) => {
      console.log(e.message);
      errorToast('수정 중 오류가 발생하였습니다.');
    },
  });

  const editCategoryName = async () => {
    const newData = {
      name: newCategory,
      id: tabData[activeTabNum].id,
    };
    updateC.mutate(newData);
  };

  const closeEditCategoryName = () => {
    initCategoryName();
    setIsEditCategory(false);
  };

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

      {tabData[activeTabNum].name !== '전체' &&
        (isEditCategory ? (
          <div className="flex flex-row items-center mt-4 mb-2 space-x-1">
            <input
              onChange={(e) => setNewCategory(e.target.value)}
              value={newCategory}
              className="w-1/3 mb-2 mr-2 text-xl input-box"
            />
            <button
              onClick={closeEditCategoryName}
              type="button"
              className="self-center outline-hover-btn"
            >
              취소
            </button>
            <button
              onClick={editCategoryName}
              type="button"
              className="self-center primary-hover-btn"
            >
              수정
            </button>
          </div>
        ) : (
          <div className="flex flex-row items-center mt-4 mb-2 space-x-1">
            <h2 className="text-xl font-semibold">{newCategory}</h2>
            <button
              className="p-2 bg-transparent hover:border-primary"
              onClick={() => setIsEditCategory(true)}
            >
              <HiOutlinePencil />
            </button>
          </div>
        ))}

      <div>
        {curTabData.length > 0 ? (
          curTabData.map((item) => (
            <UserCard
              key={item.id}
              data={item}
              isEditable={item.id === editingId}
              startEdit={(id: string) => startEdit(id)}
              endEdit={endEdit}
              refreshData={refreshData}
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
