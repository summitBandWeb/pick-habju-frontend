import { useEffect, useState } from 'react';
import Chevron from '../../components/Chevron/Chevron';
import { ChevronVariant } from '../../components/Chevron/ChevronEnums';
import TurnOffIcon from '../../assets/svg/turnOff.svg';
import ModalOverlay from './ModalOverlay';

type ImageCarouselModalProps = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

const ImageCarouselModal = ({
  images,
  initialIndex = 0,
  onClose,
}: ImageCarouselModalProps) => {
  const [current, setCurrent] = useState(initialIndex);
  
  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);

  const total = images.length;
  const prev = () => setCurrent((p) => Math.max(0, p - 1));
  const next = () => setCurrent((p) => Math.min(total - 1, p + 1));

  const variant: ChevronVariant =
    current === 0 ? ChevronVariant.First : current === total - 1 ? ChevronVariant.Last : ChevronVariant.Middle;

  return (
    <ModalOverlay onClose={onClose} dimmedClassName="bg-black/80" animateFromBottom={false} >
      {/* 1. 최상위 컨테이너: 너비를 고정하고 내부 그림자를 위해 overflow-visible 상태 유지 */}
      <div className="w-[25.125rem] relative">
        
        {/* 2. 슬라이드 윈도우: 여기서만 옆 이미지를 잘라냄 */}
        <div className="overflow-hidden w-full">
          <div
            className="flex items-center"
            style={{
              // 이미지 너비(100%) + 간격(예: 40px) 만큼 이동하도록 설정
              transform: `translateX(calc(-${current * 100}% - ${current * 40}px))`,
              transition: 'transform 0.35s ease-out',
              gap: '40px', // 이미지 사이의 간격을 충분히 주어 옆 이미지가 안 보이게 함
            }}
          >
            {images.map((image, index) => (
              <div 
                key={index} 
                className="w-full min-w-full flex-shrink-0 flex flex-col items-center"
              >
                {/* 3. 개별 이미지 컨테이너: 위쪽 여백 확보 */}
                <div className="relative w-full mt-12 mb-4 px-3"> 
                  {/* px-3은 그림자가 잘리는 것 방지용 */}
                  
                  {/* 닫기 버튼 */}
                  <div className="absolute bottom-full right-0 z-10">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex p-3 items-center justify-center cursor-pointer"
                    >
                      <img src={TurnOffIcon} alt="close" />
                    </button>
                  </div>

                  {/* 이미지와 그림자 */}
                  <img
                    src={image}
                    alt={`확대 이미지 ${index + 1}`}
                    className="w-full h-auto block rounded-lg shadow-[0px_4px_10px_0_rgba(0,0,0,0.25)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. 컨트롤 오버레이 (Chevron) */}
        <div className="pointer-events-none absolute top-12 left-3 right-3 bottom-0 flex items-center">
          {total > 1 && (
            <div className="pointer-events-auto flex justify-between items-center w-full">
              <Chevron variant={variant} onPrev={prev} onNext={next} containerClassName="w-full" />
            </div>
          )}
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ImageCarouselModal;
