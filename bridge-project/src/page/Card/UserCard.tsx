import React, { useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Info } from '../../model/info';
import { successToast } from '../toast';
import DatePicker from 'react-datepicker';
import { ko } from 'date-fns/locale/ko';
import './Datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import { updateUser } from '../../lib/firestore/user';
import { UserDoc } from '../../lib/firestore/type';

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
  const [title, setTitle] = useState(data.name);
  const [birthday, setBirthday] = useState<Date | null>(new Date('2000-12-04'));

  const updateEditState = () => {
    startEdit(data.id);
  };

  const updateTitle = (value: string) => {
    setTitle(value);
  };

  const initForm = () => {
    // 초기화
    setTitle(data.name);
    endEdit();
  };

  // 수정된 내용 저장
  const saveUpdates = async () => {
    try {
      const user = {
        name: title,
        // level: 10,
        // birthday: birthday
      };
      await updateUser({ id: data.id, userData: user });
      successToast('성공적으로 수정되었습니다.');
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
            value={title}
            onChange={(e) => updateTitle(e.target.value)}
            className="w-2/3 mb-2 input-box"
          />
          <input disabled value={data.cellName} className="w-1/3 mb-2 input-box" />
        </div>
        <DatePicker
          locale={ko}
          dateFormat="yyyy-MM-dd"
          shouldCloseOnSelect
          minDate={new Date('1970-01-01')}
          maxDate={new Date()}
          selected={birthday}
          onChange={(date) => setBirthday(date)}
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