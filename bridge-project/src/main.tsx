import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FamPage from './page/FamPage/FamPage.tsx';
import TestComponent from './test-component.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  //   <FamPage />
  // </React.StrictMode>,
  <TestComponent></TestComponent>,
);
