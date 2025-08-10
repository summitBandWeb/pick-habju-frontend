import { useEffect, useMemo, useState } from 'react';
import { useToastStore } from '../../store/toast/toastStore';
import Error from '../../assets/svg/error.svg';

const ToastMessage = () => {
  const { message, isVisible } = useToastStore();
  const [shouldRender, setShouldRender] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    let timeoutId: number | undefined;
    if (isVisible && message) {
      setIsExiting(false);
      setShouldRender(true);
    } else if (shouldRender) {
      setIsExiting(true);
      timeoutId = window.setTimeout(() => {
        setShouldRender(false);
        setIsExiting(false);
      }, 200);
    }
    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isVisible, message, shouldRender]);

  const animationClass = useMemo(
    () => (isExiting ? 'animate-[toast-out_0.2s_ease-in_forwards]' : 'animate-[toast-in_0.2s_ease-out]'),
    [isExiting]
  );

  if (!shouldRender || !message) return null;

  return (
    <div className="w-full flex justify-center">
      <div className={`flex justify-center items-center gap-3 px-6 py-3 bg-gray-600 rounded-full text-primary-white font-modal-default transition-all ${animationClass}`}>
        <div>
          <img src={Error} alt="error" />
        </div>
        <div className="text-left whitespace-pre-line">{message}</div>
      </div>
    </div>
  );
};

export default ToastMessage;
