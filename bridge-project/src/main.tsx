import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FamPage from './page/FamPage/FamPage.tsx';
import { CategoryInfo } from './lib/firestore/type.ts';
import { ToastContainer } from 'react-toastify';

export const CategoryContext = createContext<CategoryInfo>({
  fname: '',
  fid: '',
  cellArr: [{ cname: '', cid: '' }],
});

const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

// 중복 호출 방지
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <FamPage />
    <ToastContainer />
  </React.StrictMode>,
);
