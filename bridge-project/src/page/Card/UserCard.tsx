import React, { useState, useEffect } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Info } from '../../model/info';
import { UserInfo } from '../../lib/firestore/type';
import { getAllFamUserWCategory } from '../../lib/firestore/fam';
import { successToast } from '../toast';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import './Datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';

interface InfoWithoutContent extends Omit<Info, 'content' | 'date' | 'alive'> {
  content?: string[];
  date?: string;
  alive?: boolean;
}

interface UserCardProps {
  data: InfoWithoutContent;
  isEditable: boolean;
  startEdit(id: string): void;
  endEdit(): void;
  refreshParentPage: () => Promise<void>;
}

const UserCard: React.FC<UserCardProps> = ({
  data,
  isEditable,
  startEdit,
  endEdit,
  refreshParentPage,
}) => {
  const [newContent, setNewContent] = useState(data.content || []);
  const [newTitle, setNewTitle] = useState(data.name);
  const [newCategory, setNewCategory] = useState(data.cellName);
  const [birthday, setBirthday] = useState<Date | null>(new Date('2000-12-04'));

  const updateEditState = () => {
    startEdit(data.id);
  };

  const updateTitle = (value: string) => {
    setNewTitle(value);
    updateCategoryByTitle(value);
  };

  const updateCategoryByTitle = (title: string) => {
    const arr = userArr.find((item) => item.name === title);
    if (arr) {
      const category = arr.cell;
      setNewCategory(category);
    }
  };

  const updateContent = (index: number, value: string) => {
    const updatedContent = [...newContent];
    updatedContent[index] = value;
    setNewContent(updatedContent);
  };

  const [userArr, setUserArr] = useState<UserInfo[]>([]);
  const getAllUser = async () => {
    try {
      const data = await getAllFamUserWCategory();
      setUserArr(data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const initForm = () => {
    // 초기화
    if (data.content) {
      setNewContent(data.content);
    }
    setNewTitle(data.name);
    endEdit();
  };

  const checkEmptyContent = () => {
    const validArr = newContent.filter((e) => e !== '');
    if (validArr.length === 0) {
      deleteContent();
    }
    return validArr;
  };

  // 수정된 내용 저장
  const saveUpdates = async () => {
    try {
      if (data.content && data.date && data.alive) {
        const content = checkEmptyContent();
        // await
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
    endEdit();
  };

  // 삭제
  const deleteContent = async () => {
    const userConfirmed = window.confirm('삭제 하시겠습니까?');

    if (userConfirmed) {
      try {
        // await deletePrayerRequest(data.id);
        successToast('정상적으로 삭제되었습니다.');
        refreshParentPage();
      } catch (error) {
        console.error('Error deleting User Info:', error);
      }
    }

    return;
  };

  if (isEditable)
    return (
      <div className="flex flex-col p-2">
        <div className="flex space-x-2">
          <input
            value={newTitle}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-2/3 mb-2 input-box"
          />
          <input disabled value={newCategory} className="w-1/3 mb-2 input-box" />
        </div>
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
        <DatePicker
          locale={ko}
          dateFormat="yyyy-MM-dd"
          shouldCloseOnSelect
          minDate={new Date('1910-01-01')}
          maxDate={new Date()}
          selected={birthday}
          onChange={(date) => setBirthday(date)}
          className=""
        />
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
          <div className="self-start">생년월일</div>
        </div>
      </div>
    );
};

export default UserCard;
