import React, { useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createUser } from '../../lib/firestore/user';
import { addUsertoCell } from '../../lib/firestore/cell';
import Modal from 'react-modal';
import { CategoryContext } from '../../main';

interface ModalProps {
  isOpen: boolean;
  cellId: string;
  updateCategoty: (newCell: string) => void;
  userName: string;
  closeModal: () => void;
  submitContent: () => void;
}

const CreateUserModal: React.FC<ModalProps> = ({
  isOpen,
  cellId,
  updateCategoty,
  userName,
  closeModal,
  submitContent,
}) => {
  const info = useContext(CategoryContext);
  const createMember = async () => {
    try {
      const userId = await createUser({ name: userName, level: 10 });
      await addUsertoCell(userId, cellId);
      submitContent();
      successToast();
      closeModal();
    } catch (error) {
      console.log('Error while create new member: ', error);
    }
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const successToast = () =>
    toast.success(`${userName} 이/가 셀에 추가되었습니다. 이어서 저장을 눌러주세요.`, {
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
    <div>
      <ToastContainer />
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <div className="container">
          <p className="text-lg text-center">셀원 정보 확인</p>
          <div className="py-6">
            현재 팸에는 "{userName}" 이름의 셀원 정보가 없습니다. <br />
            <select
              className="w-1/3 input-box"
              value={cellId}
              onChange={(e) => updateCategoty(e.target.value)}
            >
              {info.cellArr.map((item) => (
                <option value={item.cid} key={item.cid}>
                  {item.cname}
                </option>
              ))}
            </select>
            의 새로운 셀원으로 추가하시겠습니까?
          </div>
          <div className="flex flex-row justify-end space-x-2">
            <button onClick={closeModal} type="button" className="self-end outline-hover-btn">
              돌아가기
            </button>
            <button onClick={createMember} type="button" className="self-end primary-hover-btn">
              추가하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateUserModal;
