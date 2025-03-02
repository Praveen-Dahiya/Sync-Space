import { toast } from "react-toastify"

export default function notifyUserJoined(message: string) {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  });
}
