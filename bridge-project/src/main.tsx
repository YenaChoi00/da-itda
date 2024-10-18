import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FamPage from './page/FamPage/index.tsx';
import { CategoryInfo } from './lib/firestore/type.ts';
import { ToastContainer } from 'react-toastify';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import CellPage from './page/CellPage/index.tsx';
import Root from './root.tsx';
import { getCategoryInfo } from './lib/firestore/fam.ts';

// CategoryContext 생성
export const CategoryContext = createContext<CategoryInfo>({
  fname: '',
  fid: '',
  cellArr: [{ cname: '', cid: '' }],
});

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

// 중복 호출 방지
const root = ReactDOM.createRoot(container);

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/fam',
    element: <FamPage />,
  },
  {
    path: '/admin',
    element: <CellPage />,
  },
]);

const App = () => {
  const [info, setInfo] = useState<CategoryInfo>({
    fname: '',
    fid: '',
    cellArr: [{ cname: '', cid: '' }],
  });

  // useEffect로 Firestore에서 데이터 가져오기
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const categoryInfo = await getCategoryInfo();
        setInfo(categoryInfo);
      } catch (error) {
        console.error('Error fetching category info:', error);
      }
    };

    fetchInfo();
  }, []);

  return (
    <React.StrictMode>
      <CategoryContext.Provider value={info}>
        <RouterProvider router={router} />
        <ToastContainer />
      </CategoryContext.Provider>
    </React.StrictMode>
  );
};

// 렌더링
root.render(<App />);
