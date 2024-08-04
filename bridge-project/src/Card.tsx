import React, { useState, useEffect } from 'react';
import { Info } from './model/info';
import { HiOutlineTrash } from 'react-icons/hi';

interface OwnProps {
  data: Info;
  changeCard(newTitle: string, newContent: string[]): void;
  isEditable: boolean;
  startEdit(id: number): void;
  endEdit(): void;
  deleteItem(id: number): void;
}

const Card: React.FC<OwnProps> = ({
  data,
  changeCard,
  isEditable,
  startEdit,
  endEdit,
  deleteItem,
}) => {
  const [newContent, setNewContent] = useState(data.content);
  const [newTitle, setNewTitle] = useState(data.name);

  useEffect(() => {
    setNewContent(data.content);
    setNewTitle(data.name);
  }, [data]);

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

  const closeEdit = () => {
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
  const deleteContent = () => {
    const userConfirmed = window.confirm('정말 삭제 하시겠습니까?');

    if (userConfirmed) {
      deleteItem(data.id);
    }

    return;
  };

  return (
    <>
      {isEditable ? (
        // 편집 중일 때
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
            <button onClick={closeEdit} type="button" className="self-end outline-hover-btn">
              취소
            </button>
            <button onClick={saveUpdates} type="button" className="self-end primary-hover-btn">
              저장
            </button>
          </div>
        </div>
      ) : (
        // 편집 중 아닐 때
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
                <li key={index} className="text-left whitespace-pre-line">
                  {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
