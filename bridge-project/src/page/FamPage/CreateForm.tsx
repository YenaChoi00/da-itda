import React, { useState } from 'react';
import { Info } from '../../model/info';
import { TabModel } from '../../model/tabModel';
import { addPrayerRequest } from '../../lib/firestore/card';
import { createUser } from '../../lib/firestore';
import Modal from 'react-modal';
import { addUsertoCell } from '../../lib/firestore/cell';
import { toast, ToastContainer } from 'react-toastify';

interface CreateFormProps {
  curDate: string;
  categories: TabModel[];
  changeIsWriting(isWriting: boolean): void;
}

const CreateForm: React.FC<CreateFormProps> = ({ curDate, categories, changeIsWriting }) => {
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
      initForm();
    } catch (error) {
      if (error instanceof Error) {
        // 모달 오픈
        // 모달 내부에서, createUser
        openModal();
      } else {
        console.error('Error adding prayer request:', error);
      }
    }
  };

  const initForm = () => {
    setNewInfo(emptyData);
    changeIsWriting(false);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const createMember = async () => {
    try {
      const userId = await createUser({ name: newInfo.name, level: 10 });
      await addUsertoCell(userId, newInfo.cellId);
      closeModal();
      successToast();
    } catch (error) {
      console.log('Error while create new member: ', error);
    }
  };

  const successToast = () =>
    toast.success(`${newInfo.name} 이/가 셀에 추가되었습니다. 이어서 저장을 눌러주세요.`, {
      position: 'bottom-left',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  return (
    <div className="flex flex-col px-2 space-y-2">
      <ToastContainer />
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="container">
          <p className="text-lg text-center">셀원 정보 확인</p>
          <div className="py-6">
            현재 팸에는 "{newInfo.name}" 이름의 셀원 정보가 없습니다. <br />
            <select
              className="w-1/3 input-box"
              value={newInfo.cellId}
              onChange={(e) => createCategory(e.target.value)}
            >
              {categories.map((item) => (
                <option value={item.id} key={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            의 새로운 셀원으로 추가하시겠습니까?
          </div>
          <div className="flex flex-row justify-end space-x-2">
            <button onClick={closeModal} type="button" className="self-end outline-hover-btn">
              수정하기
            </button>
            <button onClick={createMember} type="button" className="self-end primary-hover-btn">
              추가하기
            </button>
          </div>
        </div>
      </Modal>
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
          {categories.map((item) => (
            <option value={item.id} key={item.id}>
              {item.name}
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
