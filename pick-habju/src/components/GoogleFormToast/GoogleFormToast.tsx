import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleFormToastStore, GOOGLE_FORM_URL } from '../../store/googleFormToast/googleFormToastStore';
import FlightIcon from '../../assets/svg/Flight.svg';
import LargeDelete from '../../assets/svg/LargeDelete.svg';
import { useState, useEffect } from 'react';
import { pushGtmEvent } from '../../utils/gtm';

const GoogleFormToast = () => {
  const { isVisible, hideToast, markGoogleFormVisited } = useGoogleFormToastStore();
  const searchCount = useGoogleFormToastStore((s) => s.searchCount);
  const [isIconLoaded, setIsIconLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const showIndex = searchCount === 2 ? 2 : 1;

  // 컴포넌트 마운트 시 아이콘 미리 로딩
  useEffect(() => {
    const preloadIcon = new Image();
    preloadIcon.onload = () => setIsIconLoaded(true);
    preloadIcon.src = FlightIcon;
  }, []);

  // 아이콘 로딩 완료 후 isVisible이 true면 약간의 지연 후 실제로 보여주기
  useEffect(() => {
    if (isVisible && isIconLoaded) {
      // 렌더링이 완전히 준비된 후 자연스럽게 나타나도록 약간 지연
      const showTimer = setTimeout(() => {
        setShouldShow(true);
      }, 1000); // 1초 지연으로 부드러운 렌더링

      return () => clearTimeout(showTimer);
    } else {
      setShouldShow(false);
    }
  }, [isVisible, isIconLoaded]);

  // 노출 시점 추적 (impression)
  useEffect(() => {
    if (shouldShow) {
      pushGtmEvent('google_form_toast_impression', { show_index: showIndex });
    }
  }, [shouldShow, showIndex]);

  const handleToastClick = () => {
    pushGtmEvent('google_form_toast_click', { show_index: showIndex });
    markGoogleFormVisited();
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    pushGtmEvent('google_form_toast_close', { show_index: showIndex });
    hideToast();
  };

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0, 0, 0.2, 1],
          }}
          className="absolute shadow-card top-3.5 left-1/2 transform -translate-x-1/2 z-100 bg-primary-white flex items-center px-4 py-3 w-[22.75rem] h-18 rounded-[12.5rem] cursor-pointer"
          onClick={handleToastClick}
        >
          <img src={FlightIcon} alt="FlightIcon" className="h-11 mr-2 flex-shrink-0" />
          <div className="flex flex-col items-start justify-center mr-3 gap-0.5 flex-1">
            <div className="font-modal-default text-primary-black whitespace-nowrap">
              오류 및 건의사항을 알려주세요!!
            </div>
            <div className="font-modal-calcdetail text-gray-300">몇 분 내로 답변드리겠습니다</div>
          </div>
          <img
            src={LargeDelete}
            alt="LargeDelete"
            onClick={handleCloseClick}
            className="cursor-pointer flex-shrink-0"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoogleFormToast;
