import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CopyBtnProps {
  btnText: string;
  copyContent: string;
  toastText: string;
  copy(): void;
}

const CopyBtn: React.FC<CopyBtnProps> = ({ btnText, copyContent, toastText, copy }) => {
  const copyToast = () =>
    toast.info(toastText, {
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
    <>
      <CopyToClipboard text={copyContent} onCopy={copyToast}>
        <button
          type="button"
          className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
          onMouseUp={copy}
        >
          {btnText}
        </button>
      </CopyToClipboard>
      <ToastContainer />
    </>
  );
};

export default CopyBtn;
