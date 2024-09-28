import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FamPage from './page/FamPage/FamPage.tsx';
import { CategoryInfo } from './lib/firestore/type.ts';

export const CategoryContext = createContext<CategoryInfo>({
  fname: '',
  fid: '',
  cellArr: [{ cname: '', cid: '' }],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FamPage />
  </React.StrictMode>,
);
