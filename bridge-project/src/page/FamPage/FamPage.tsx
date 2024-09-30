import { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import { getTabModels } from '../../lib/firestore';
import { Info } from '../../model/info.ts';
import { TabModel } from '../../model/tabModel.ts';
import CreateForm from './CreateForm.tsx';
import Header from '../Header/index.tsx';
import TabPage from './TabPage.tsx';
import './FamPage.css';
import 'react-toastify/dist/ReactToastify.css';
import { CategoryContext } from '../../main.tsx';
import { CategoryInfo } from '../../lib/firestore/type.ts';
import { getCategoryInfo } from '../../lib/firestore/fam.ts';
import moment from 'moment';

const FamPage: React.FC = () => {
  const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';
  const [info, setInfo] = useState<CategoryInfo>({
    fname: '',
    fid: '',
    cellArr: [{ cname: '', cid: '' }],
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const categoryInfo = await getCategoryInfo();
        setInfo(categoryInfo);
      } catch (Error) {
        console.log(Error);
      }
    };

    fetchInfo();
  }, []);

  const DATE: string = moment('2024-07-17').format('YYYY-MM-DD').toString();
  const [curDate, setCurDate] = useState<string>(DATE);
  const [allTabData, setAllTabData] = useState<TabModel[]>([]);

  const fetchTabs = async () => {
    const fetchedTabs = await getTabModels(FAMILY_ID);
    setAllTabData(fetchedTabs);
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  // 날짜별
  const [curDateData, setCurDateData] = useState<Info[]>([]);
  useEffect(() => {
    // 팸 전체 데이터 중, *현재 날짜*에 해당하는 데이터
    if (allTabData.length > 0) {
      const everyContent = allTabData[0].content;
      const filtered = everyContent.filter((item) => {
        return item.date === curDate && item.alive === true;
      });
      setCurDateData(filtered);
    }
  }, [allTabData, curDate]);

  // 탭(셀)별
  const [tabData, setTabData] = useState<TabModel[]>(allTabData);
  const [activeTab, setActiveTab] = useState(0);

  // 현재 날짜 데이터 중, *해당 셀*에 해당하는 데이터
  useEffect(() => {
    setTabData(
      allTabData.map((item) => ({
        ...item,
        content:
          item.name === '전체'
            ? curDateData
            : curDateData.filter((curItem) => curItem.cellId === item.id),
      })),
    );
  }, [allTabData, curDateData]);

  const changeDate = (newDate: string) => {
    setCurDate(newDate);
  };

  const [isWriting, setIsWriting] = useState<boolean>(false);
  const [contentForCopy, setContentForCopy] = useState<string>('');

  const changeWrtState = (state: boolean) => {
    setIsWriting(state);
    fetchTabs(); // 화면 업데이트
  };

  // 복사
  const setCopyData = () => {
    const data = [...tabData[activeTab].content];
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

  const copyToast = () =>
    toast.info('기도제목이 복사되었습니다.', {
      position: 'bottom-left',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  function CreateCopyBtn() {
    if (isWriting)
      return (
        <CreateForm
          curDate={curDate}
          changeIsWriting={(isWriting: boolean) => changeWrtState(isWriting)}
        />
      );
    else
      return (
        <div className="flex flex-row justify-center my-2">
          <button
            onClick={() => setIsWriting(true)}
            type="button"
            className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
          >
            추가하기
          </button>
          {curDateData.length > 0 && (
            <>
              <CopyToClipboard text={contentForCopy} onCopy={copyToast}>
                <button
                  type="button"
                  className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
                  onMouseUp={setCopyData}
                >
                  복사하기
                </button>
              </CopyToClipboard>
              <ToastContainer />
            </>
          )}
        </div>
      );
  }

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <CategoryContext.Provider value={info}>
        <Header curDate={curDate} changeDate={changeDate}></Header>

        {CreateCopyBtn()}

        {curDateData.length > 0 ? (
          <TabPage
            tabData={tabData}
            activeTabNum={activeTab}
            setActiveTabNum={setActiveTab}
            refreshPage={fetchTabs}
          />
        ) : (
          <div className="container place-self-center">추가된 기도제목이 없습니다</div>
        )}
      </CategoryContext.Provider>
    </div>
  );
};

export default FamPage;
