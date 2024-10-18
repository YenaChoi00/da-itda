import { useEffect, useMemo, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getFamPageTab } from '../../lib/firestore/index.ts';
import { Info } from '../../model/info.ts';
import { FamPageTab } from '../../model/tab.ts';
import CreateForm from './CreateForm.tsx';
import Header from '../Header/index.tsx';
import './FamPage.css';
import 'react-toastify/dist/ReactToastify.css';
import { CategoryContext } from '../../main.tsx';
import { CategoryInfo } from '../../lib/firestore/type.ts';
import { getCategoryInfo } from '../../lib/firestore/fam.ts';
import moment from 'moment';
import { copyToast } from '../toast.tsx';
import FadeLoader from 'react-spinners/FadeLoader';
import FamTabPage from './FamTabPage.tsx';

const FamPage: React.FC = () => {
  const FAMILY_ID = 'Tp9bH9o7J6JRZDy1sz2d';
  const [isLoading, setIsLoading] = useState(true);

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
  const [allTabData, setAllTabData] = useState<FamPageTab[]>([]);

  const fetchTabs = async () => {
    try {
      const fetchedTabs = await getFamPageTab(FAMILY_ID);
      setAllTabData(fetchedTabs);

      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  // 날짜별
  const [curDateData, setCurDateData] = useState<Info[]>([]);
  // 탭(셀)별
  const [tabData, setTabData] = useState<FamPageTab[]>(allTabData);
  const [activeTab, setActiveTab] = useState(0);

  useMemo(() => {
    if (allTabData.length > 0) {
      const everyContent = allTabData[0].content;
      const curDateData = everyContent.filter((item) => {
        return item.date === curDate && item.alive === true;
      });

      const filteredData = allTabData.map((item) => ({
        ...item,
        content:
          item.name === '전체'
            ? curDateData
            : curDateData.filter((curItem) => curItem.cellId === item.id),
      }));

      // 팸 전체 데이터 중, *현재 날짜*에 해당하는 데이터
      setCurDateData(curDateData);
      // 현재 날짜 데이터 중, *해당 셀*에 해당하는 데이터
      setTabData(filteredData);
    }
  }, [allTabData, curDate]);

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
              <CopyToClipboard
                text={contentForCopy}
                onCopy={() => copyToast('기도제목이 복사되었습니다.')}
              >
                <button
                  type="button"
                  className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
                  onMouseUp={setCopyData}
                >
                  복사하기
                </button>
              </CopyToClipboard>
            </>
          )}
        </div>
      );
  }

  return (
    <div className="container flex flex-col content-start w-96 h-svh">
      <CategoryContext.Provider value={info}>
        <Header curDate={curDate} changeDate={changeDate}></Header>
        {isLoading ? (
          <>
            <div className="container flex flex-col items-center justify-center h-screen space-y-5">
              <FadeLoader color="#5db075" margin={3} />
              <span>데이터를 불러오는 중입니다.</span>
            </div>
          </>
        ) : (
          <>
            {CreateCopyBtn()}
            {curDateData.length > 0 ? (
              <FamTabPage
                tabData={tabData}
                activeTabNum={activeTab}
                setActiveTabNum={setActiveTab}
                refreshPage={fetchTabs}
              />
            ) : (
              <div className="container place-self-center">추가된 기도제목이 없습니다</div>
            )}
          </>
        )}
      </CategoryContext.Provider>
    </div>
  );
};

export default FamPage;
