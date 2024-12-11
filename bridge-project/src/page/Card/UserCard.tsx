import React, { useEffect, useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi';
import { Info } from '../../model/info';
import { errorToast, successToast } from '../toast';
import './Datepicker.css';
import 'react-datepicker/dist/react-datepicker.css';
import { deleteUser, updateUser } from '../../lib/firestore/user';
import { dateFormat } from '../../assets/utils';
import CustomCalender from '../Calender';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface InfoWithoutContent extends Omit<Info, 'content' | 'date'> {
  content?: string[];
  date?: string;
  birthday: string;
}

interface UserCardProps {
  data: InfoWithoutContent;
  isEditable: boolean;
  startEdit(id: string): void;
  endEdit(): void;
  refreshData(): void;
}

const UserCard: React.FC<UserCardProps> = ({
  data,
  isEditable,
  startEdit,
  endEdit,
  refreshData,
}) => {
  const [title, setTitle] = useState(data.name);
  const [birthday, setBirthday] = useState<Date | null>();

  useEffect(() => {
    const bday = new Date(data.birthday);
    setBirthday(bday);
  }, []);

  const updateEditState = () => {
    startEdit(data.id);
  };

  const updateTitle = (value: string) => {
    setTitle(value);
  };

  const cancelUpdate = () => {
    // 초기화
    setTitle(data.name);
    endEdit();
  };

  // 수정
  const updateM = useMutation({
    mutationFn: ({ id, user }: { id: string; user: object }) =>
      updateUser({ id: id, userData: user }),
    onSuccess: async () => {
      successToast('성공적으로 수정되었습니다.');
      refreshData();
    },
    onError: async (e) => {
      console.log(e.message);
      errorToast('수정 중 오류가 발생하였습니다.');
    },
  });

  const saveUpdates = async () => {
    const newData = {
      name: title,
      birthday: dateFormat(birthday!),
    };
    updateM.mutate({ id: data.id, user: newData });
    endEdit();
  };

  // 삭제
  const deleteM = useMutation({
    mutationFn: (id: string) => deleteUser({ id: id }),
    onSuccess: async () => {
      successToast('정상적으로 삭제되었습니다.');
      refreshData();
    },
    onError: async (e) => {
      console.log(e.message);
      errorToast('삭제 중 오류가 발생하였습니다.');
    },
  });

  const deleteUserInfo = async () => {
    const userConfirmed = window.confirm('삭제 하시겠습니까?');

    if (userConfirmed) {
      deleteM.mutate(data.id);
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
        <CustomCalender selectedDate={birthday} onChange={(date) => setBirthday(date)} />
        <div className="flex flex-row justify-end space-x-2">
          <button onClick={cancelUpdate} type="button" className="self-end outline-hover-btn">
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
            <button className="bg-transparent" onClick={deleteUserInfo}>
              <HiOutlineTrash />
            </button>
          </div>
          <div className="self-start">{data.birthday}</div>
        </div>
      </div>
    );
};

export default UserCard;
