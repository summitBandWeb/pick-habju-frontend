import { useToastStore } from '../../store/toast/toastStore';
import Error from '../../assets/svg/error.svg';

const ToastMessage = () => {
  const { message, isVisible } = useToastStore();

  if (!isVisible || !message) return null;

  return (
    <div>
      <div className="flex justify-center items-center gap-3 px-6 py-3 bg-gray-600 rounded-full  text-primary-white font-modal-default">
        <div>
          <img src={Error} alt="error" />
        </div>
        <div className="text-left whitespace-pre-line">{message}</div>
      </div>
    </div>
  );
};

export default ToastMessage;
