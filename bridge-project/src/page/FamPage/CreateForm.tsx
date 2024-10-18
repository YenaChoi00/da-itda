import React, { useContext, useState } from 'react';
import { Info } from '../../model/info';
import { addPrayerRequest } from '../../lib/firestore/card';
import CreateUserModal from './CreateUserModal';
import { CategoryContext } from '../../main';
import { successToast } from '../toast';

interface CreateFormProps {
  curDate: string;
  changeIsWriting(isWriting: boolean): void;
}

const CreateForm: React.FC<CreateFormProps> = ({ curDate, changeIsWriting }) => {
  const emptyData: Omit<Info, 'id'> = {
    name: '',
    famId: '0',
    famName: '',
    cellId: '0',
    cellName: '',
    date: '',
    content: [''],
    alive: true,
  };

  const [newInfo, setNewInfo] = useState<Omit<Info, 'id'>>(emptyData);
  const info = useContext(CategoryContext);

  const createTitle = (value: string) => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      name: value,
    }));
  };

  const createContent = (value: string) => {
    const list = value
      .split('\n')
      .map((item) => item.trim()) // 앞뒤 공백 제거
      .filter((item) => item !== ''); // \n 여러 번 입력해서 빈 요소가 된 것들 제거
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      content: list,
      date: curDate,
    }));
  };

  const createCategory = (value: string) => {
    const id = value;
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      cellId: id,
    }));
  };

  const vaildForm = () => {
    if (isFilled()) submitChanges();
  };

  const isFormEmpty = (): boolean => {
    return (
      newInfo.name.trim() === '' ||
      newInfo.content.length === 0 ||
      newInfo.content.every((item) => item.trim() === '')
    );
  };

  const isFilled = (): boolean => {
    if (isFormEmpty()) {
      // 비어있으면
      const confirm = window.confirm(
        '이름과 기도제목을 모두 입력해주세요.\n또는 작성을 취소하시겠습니까?',
      );
      if (confirm) {
        // 안내 모달
        // '예' 선택 -> 작성 취소
        initForm();
        return false; // 폼 작성 취소
      }
      return true;
    }
    return true; // 폼이 비어있지 않음
  };

  const submitChanges = async () => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      date: curDate, // 현재 페이지의 날짜로 자동 지정
    }));

    try {
      await addPrayerRequest(newInfo);
      successToast('정상적으로 추가되었습니다.');
      initForm();
    } catch (error) {
      if (error instanceof Error) {
        // User가 없을 때 - 모달 오픈
        setIsModalOpen(true);
      } else {
        console.error('Error adding prayer request:', error);
      }
    }
  };

  const initForm = () => {
    setNewInfo(emptyData);
    changeIsWriting(false);
  };

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col px-2 space-y-2">
      <CreateUserModal
        isOpen={isModalOpen}
        cellId={newInfo.cellId}
        updateCategoty={createCategory}
        userName={newInfo.name}
        closeModal={closeModal}
        submitContent={vaildForm}
      />
      <div className="flex space-x-2">
        <input
          type="text"
          id="name-with-label"
          onChange={(e) => createTitle(e.target.value)}
          name="name"
          placeholder="이름"
          className="w-2/3 input-box"
        />
        <select
          className="w-1/3 input-box"
          value={newInfo.cellId}
          onChange={(e) => createCategory(e.target.value)}
        >
          {info.cellArr.map((item) => (
            <option value={item.cid} key={item.cid}>
              {item.cname}
            </option>
          ))}
        </select>
      </div>
      <textarea
        onChange={(e) => createContent(e.target.value)}
        id="content"
        placeholder="기도제목을 입력해주세요. 엔터로 번호가 구분됩니다."
        name="content"
        rows={5}
        cols={40}
        className="w-full input-box"
      ></textarea>

      <button onClick={vaildForm} type="button" className="self-end w-2/3 my-2 primary-btn">
        저장/취소하기
      </button>
    </div>
  );
};

export default CreateForm;
