import { toast } from 'react-toastify';

export const successToast = (msg: string) =>
  toast.success(msg, {
    position: 'bottom-left',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

export const copyToast = (msg: string) =>
  toast.info(msg, {
    position: 'bottom-left',
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
