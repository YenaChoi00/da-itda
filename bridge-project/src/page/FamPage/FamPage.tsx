import { useEffect, useMemo, useState } from 'react';
import './FamPage.css';
import { Info } from '../../model/info.ts';
import { TabModel } from '../../model/tabModel.ts';
import { total, DATE } from '../../assets/dummy.ts';
import Header from '../Header';
import CopyBtn from './CopyBtn.tsx';
import TabPage from './TabPage.tsx';
import CreateBtn from './CreateBtn.tsx';

const FamPage: React.FC = () => {
  const tabs: TabModel[] = useMemo(
    () => [
      { name: '전체', id: 1, content: [] },
      { name: '하형셀', id: 12, content: [] },
      { name: '예나셀', id: 11, content: [] },
    ],
    [],
  );

  const [curDate, setCurDate] = useState<string>(DATE);
  const [famData, setFamData] = useState<Info[]>(total);
  // 날짜별
  const [curDateList, setCurDateList] = useState<Info[]>([]);
  // 탭(셀)별
  const [tabData, setTabData] = useState<TabModel[]>(tabs);

  const [isWriting, setIsWriting] = useState<boolean>(false);

  const [contentForCopy, setContentForCopy] = useState<string>('');

  useEffect(() => {
    // 팸 전체 데이터 중, *현재 날짜*에 해당하는 데이터
    const filtered = famData.filter((item) => item.date === curDate);
    setCurDateList(filtered);
  }, [curDate, famData]);

  // 현재 날짜 데이터 중, *해당 셀*에 해당하는 데이터
  const updatedTabData = useMemo(() => {
    return tabs.map((item) => ({
      ...item,
      content:
        item.name === '전체'
          ? curDateList
          : curDateList.filter((curItem) => curItem.cellId === item.id),
    }));
  }, [curDateList, tabs]);

  useEffect(() => {
    setTabData(updatedTabData);
  }, [updatedTabData]);

  const changeDate = (newDate: string) => {
    setCurDate(newDate);
    // setEditingId(-1);
  };

  // TabPage 내부 업데이트 관련 함수
  const updateFamData = (updatedData: Info[]) => {
    setFamData(updatedData);
  };

  // 복사
  const copy = () => {
    // const data = [...tabData[active].content];
    const data = [...tabData[0].content]; // 임시
    const copyData = data
      .map((item) => {
        const contentText = item.content
          .map((contentItem, index) => `${index + 1}. ${contentItem}`)
          .join('\n');
        return `${item.name}\n${contentText}`;
      })
      .join('\n\n');

    setContentForCopy(copyData);
  };

  function CreateCopyBtn() {
    return (
      <div className="flex flex-row justify-center my-2">
        <button
          onClick={() => setIsWriting(true)}
          type="button"
          className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
        >
          추가하기
        </button>
        {curDateList.length > 0 && (
          <CopyBtn
            btnText="복사하기"
            copyContent={contentForCopy}
            toastText="기도제목이 복사되었습니다."
            copy={copy}
          />
        )}
      </div>
    );
  }

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <Header curDate={curDate} name="예빈팸" changeDate={changeDate}></Header>
      {isWriting ? (
        <CreateBtn
          curDate={curDate}
          newId={famData.length + 1}
          changeIsWriting={(isWriting: boolean) => setIsWriting(isWriting)}
          updateFamData={(newData: Info) => updateFamData([...famData, newData])}
        />
      ) : (
        CreateCopyBtn()
      )}

      {curDateList.length > 0 ? (
        <TabPage tabData={tabData} famData={famData} updateFamData={updateFamData} />
      ) : (
        <div className="container place-self-center">추가된 기도제목이 없습니다</div>
      )}
    </div>
  );
};

export default FamPage;
