import React, { useState } from 'react';
import { Info } from '../../model/info';
import { TabModel } from '../../model/tabModel';

interface CreateFormProps {
  curDate: string;
  newId: number;
  categories: TabModel[];
  changeIsWriting(isWriting: boolean): void;
  updateFamData(newData: Info): void;
}

const CreateForm: React.FC<CreateFormProps> = ({
  curDate,
  newId,
  categories,
  changeIsWriting,
  updateFamData,
}) => {
  const emptyData: Info = {
    id: 0,
    name: '',
    famId: 0,
    famName: '',
    cellId: 0,
    cellName: '',
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

  const createCategory = (value: string) => {
    const id = Number(value);
    setNewInfo((prevInfo) => ({
      ...prevInfo,
      cellId: id,
    }));
  };

  const vaildForm = () => {
    if (isFilled()) updateChanges();
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
    <div className="flex flex-col px-2 space-y-2">
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