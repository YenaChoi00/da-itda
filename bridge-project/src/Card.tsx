import React, { useState } from 'react';
import { Info } from './model/info';
import { BsFillTrashFill } from 'react-icons/bs';

interface OwnProps {
  data: Info;
  changeContent(newContent: string[]): void;
  changeTitle(newTitle: string): void;
}

const Card: React.FC<OwnProps> = ({ data, changeContent, changeTitle }) => {
  // 더블클릭 - 수정
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(data.content);
  const [newTitle, setNewTitle] = useState(data.name);

  // 내용 수정
  const updateEditState = () => {
    setIsEditing(true);
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

  // 수정된 내용 저장
  const saveUpdates = () => {
    changeContent(newContent);
    changeTitle(newTitle);
    setIsEditing(false);
  };

  return (
    <>
      {isEditing ? (
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
          <button onClick={saveUpdates} type="button" className="self-end w-2/3 primary-btn">
            저장/취소하기
          </button>
        </div>
      ) : (
        // 편집 중 아닐 때
        <div className="container flex justify-start">
          <div onDoubleClick={updateEditState} className="flex flex-col w-full">
            <div className="flex justify-between mb-1">
              <h4 className="self-center text-base font-semibold">{data.name}</h4>
              <button className="bg-transparent">
                <BsFillTrashFill />
              </button>
            </div>
            <ol className="pl-5 list-decimal">
              {data.content.map((item, index) => (
                <li key={index} className="text-left">
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
