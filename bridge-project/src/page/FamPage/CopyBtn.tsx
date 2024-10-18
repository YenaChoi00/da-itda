import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import 'react-toastify/dist/ReactToastify.css';
import { copyToast } from '../toast';

interface CopyBtnProps {
  btnText: string;
  copyContent: string;
  toastText: string;
  copy(): void;
}

const CopyBtn: React.FC<CopyBtnProps> = ({ btnText, copyContent, toastText, copy }) => {
  return (
    <>
      <CopyToClipboard text={copyContent} onCopy={() => copyToast(toastText)}>
        <button
          type="button"
          className="self-center w-1/3 mx-1 font-semibold outline-hover-btn"
          onMouseUp={copy}
        >
          {btnText}
        </button>
      </CopyToClipboard>
    </>
  );
};

export default CopyBtn;
