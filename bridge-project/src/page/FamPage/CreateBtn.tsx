import React, { useState } from 'react';
import { Info } from '../../model/info';

interface CreateBtnProps {
  curDate: string;
  newId: number;
  changeIsWriting(isWriting: boolean): void;
  updateFamData(newData: Info): void;
}

const CreateBtn: React.FC<CreateBtnProps> = ({
  curDate,
  newId,
  changeIsWriting,
  updateFamData,
}) => {
  const emptyData: Info = {
    id: 0,
    name: '',
    famId: 0,
    cellId: 0,
    date: '',
    content: [''],
  };

  const [newInfo, setNewInfo] = useState<Info>(emptyData);

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
      id: newId, // 임시
    }));
  };

  const checkEmpty = () => {
    if (
      newInfo.name.trim() === '' ||
      newInfo.content.length === 0 ||
      newInfo.content.every((item) => item.trim() === '')
    ) {
      const userConfirmed = window.confirm(
        '이름과 기도제목을 모두 입력해주세요.\n또는 작성을 취소하시겠습니까?',
      );

      if (userConfirmed) {
        // '예' 선택 -> 작성 취소
        initForm();
      }

      return;
    } else updateChanges();
  };

  const updateChanges = () => {
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      date: curDate, // 현재 페이지의 날짜로 자동 지정
    }));
    // 지금까지 작성된 Info 데이터 저장 & 업데이트
    updateFamData(newInfo);

    initForm();
  };

  const initForm = () => {
    setNewInfo(emptyData);
    changeIsWriting(false);
  };

  return (
    <div className="flex flex-col w-full px-2 space-y-2">
      <input
        type="text"
        id="name-with-label"
        onChange={(e) => createTitle(e.target.value)}
        name="name"
        placeholder="이름"
        className="w-full input-box"
      />
      <textarea
        onChange={(e) => createContent(e.target.value)}
        id="content"
        placeholder="기도제목을 입력해주세요. 엔터로 번호가 구분됩니다."
        name="content"
        rows={5}
        cols={40}
        className="w-full input-box"
      ></textarea>

      <button onClick={checkEmpty} type="button" className="self-end w-2/3 my-2 primary-btn">
        저장/취소하기
      </button>
    </div>
  );
};

export default CreateBtn;
