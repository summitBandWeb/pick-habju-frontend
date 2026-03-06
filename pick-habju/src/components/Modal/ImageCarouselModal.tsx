import { useEffect, useState } from 'react';
import Chevron from '../../components/Chevron/Chevron';
import { ChevronVariant } from '../../components/Chevron/ChevronEnums';
import TurnOffIcon from '../../assets/svg/turnOff.svg';
import ModalOverlay from './ModalOverlay';
import { useIsWindows } from '../../hook/useIsWindow';

type ImageCarouselModalProps = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
};

const ImageCarouselModal = ({ images, initialIndex = 0, onClose }: ImageCarouselModalProps) => {
  const isWindows = useIsWindows();
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
    <ModalOverlay onClose={onClose} dimmedClassName="bg-black/80" blurClassName="" animateFromBottom={false}>
      <div className={`w-full ${isWindows ? 'max-w-[26.875rem]' : 'max-w-[25.9375rem]'} relative`}>

        {/* 슬라이드 윈도우 */}
        <div className="overflow-hidden w-full">
          <div
            className="flex items-center"
            style={{
              transform: `translateX(-${current * 100}%)`,
              transition: 'transform 0.35s ease-out',
            }}
          >
            {images.map((image, index) => (
              <div key={index} className="w-full min-w-full flex-shrink-0 flex flex-col items-center">
                <div className="relative w-full mt-12 mb-4">

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

                  {/* 이미지 */}
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

        {/* 컨트롤 오버레이 (Chevron) */}
        <div className="pointer-events-none absolute top-12 left-0 right-0 bottom-0 flex items-center">
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
