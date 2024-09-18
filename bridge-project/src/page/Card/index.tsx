import React, { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Info } from '../../model/info';
import { deletePrayerRequest } from '../../lib/firestore/card';

interface OwnProps {
  data: Info;
  changeCard(newTitle: string, newContent: string[]): void;
  isEditable: boolean;
  startEdit(id: string): void;
  endEdit(): void;
  refreshParentPage: () => Promise<void>;
}

const Card: React.FC<OwnProps> = ({
  data,
  changeCard,
  isEditable,
  startEdit,
  endEdit,
  refreshParentPage,
}) => {
  const [newContent, setNewContent] = useState(data.content);
  const [newTitle, setNewTitle] = useState(data.name);

  const updateEditState = () => {
    startEdit(data.id);
  };

  const updateTitle = (value: string) => {
    setNewTitle(value);
  };

  const updateContent = (index: number, value: string) => {
    const updatedContent = [...newContent];
    if (value == '') {
      // 빈 값이면 아예 삭제
      updatedContent.splice(index, 1);
    } else {
      updatedContent[index] = value;
    }
    setNewContent(updatedContent);
  };

  const initForm = () => {
    // 초기화
    setNewContent(data.content);
    setNewTitle(data.name);
    endEdit();
  };

  // 수정된 내용 저장
  const saveUpdates = () => {
    changeCard(newTitle, newContent);
    endEdit();
  };

  // 삭제
  const deleteContent = async () => {
    const userConfirmed = window.confirm('정말 삭제 하시겠습니까?');

    if (userConfirmed) {
      try {
        await deletePrayerRequest(data.id);
        refreshParentPage();
      } catch (error) {
        console.error('Error deleting prayer request:', error);
      }
    }

    return;
  };

  if (isEditable)
    return (
      <div className="flex flex-col p-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => updateTitle(e.target.value)}
          className="w-full mb-2 input-box"
        />
        <ol className="pl-5 mb-2 space-y-2 list-decimal">
          {newContent.map((item, index) => (
            <li key={index}>
              <textarea
                value={item}
                onChange={(e) => updateContent(index, e.target.value)}
                className="w-full input-box"
              />
            </li>
          ))}
        </ol>
        <div className="flex flex-row justify-end space-x-2">
          <button onClick={initForm} type="button" className="self-end outline-hover-btn">
            취소
          </button>
          <button onClick={saveUpdates} type="button" className="self-end primary-hover-btn">
            저장
          </button>
        </div>
      </div>
    );
  else
    return (
      <div className="container flex justify-start">
        <div onDoubleClick={updateEditState} className="flex flex-col w-full">
          <div className="flex justify-between mb-1">
            <h4 className="self-center text-base font-semibold">{data.name}</h4>
            <button className="bg-transparent" onClick={deleteContent}>
              <HiOutlineTrash />
            </button>
          </div>
          <ol className="pl-5 list-decimal">
            {data.content.map((item, index) => (
              <li key={index} className="mb-2 text-left whitespace-pre-line">
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
};

export default Card;
