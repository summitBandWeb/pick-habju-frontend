import { motion, AnimatePresence } from 'framer-motion';
import { useGoogleFormToastStore, GOOGLE_FORM_URL } from '../../store/googleFormToast/googleFormToastStore';
import FlightIcon from '../../assets/svg/Flight.svg';
import LargeDelete from '../../assets/svg/LargeDelete.svg';

const GoogleFormToast = () => {
  const { isVisible, hideToast, markGoogleFormVisited } = useGoogleFormToastStore();

  const handleToastClick = () => {
    markGoogleFormVisited();
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    hideToast();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0, 0, 0.2, 1],
          }}
          className="absolute shadow-card top-3.5 left-1/2 transform -translate-x-1/2 z-100 bg-primary-white flex justify-center px-4 py-3 w-[22.75rem] h-18 rounded-[12.5rem] cursor-pointer"
          onClick={handleToastClick}
        >
          <img src={FlightIcon} alt="FlightIcon" className="mr-2" />
          <div className="flex flex-col items-start justify-center mr-3">
            <div className="font-modal-default text-primary-black">오류 및 건의사항을 알려주세요!</div>
            <div className="font-modal-calcdetail text-gray-300">몇 분 내로 답변드리겠습니다</div>
          </div>
          <img src={LargeDelete} alt="LargeDelete" onClick={handleCloseClick} className="cursor-pointer" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GoogleFormToast;
