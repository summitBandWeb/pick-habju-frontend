import { useEffect, useRef, useState } from 'react';
import Chevron from '../../components/Chevron/Chevron';
import PaginationDots from '../../components/PaginationDot/PaginationDot';
import { ChevronVariant } from '../../components/Chevron/ChevronEnums';

type ImageCarouselModalProps = {
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  closeIconSrc?: string; // 아이콘 경로 제공 시 사용. 없으면 텍스트 버튼 사용
};

const ImageCarouselModal = ({ images, initialIndex = 0, onClose, closeIconSrc }: ImageCarouselModalProps) => {
  const [current, setCurrent] = useState(initialIndex);
  const [animKey, setAnimKey] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);

  const total = images.length;
  const prev = () => {
    setCurrent((p) => Math.max(0, p - 1));
    setAnimKey((k) => k + 1);
  };
  const next = () => {
    setCurrent((p) => Math.min(total - 1, p + 1));
    setAnimKey((k) => k + 1);
  };

  const variant: ChevronVariant =
    current === 0 ? ChevronVariant.First : current === total - 1 ? ChevronVariant.Last : ChevronVariant.Middle;

  const currentImage = images[current];

  // ESC 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // 바깥 클릭 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose();
  };

  // 스크롤 잠금
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  return (
    <div ref={overlayRef} onClick={handleOverlayClick} className="fixed inset-0 z-50 flex justify-center items-start bg-black/60">
      {/* 컨테이너: wrapper 폭 기준 중앙 */}
      <div className="mt-4 w-[25.125rem]">
        {/* Close 버튼 영역 (오른쪽 정렬) */}
        <div className="w-full flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex p-3 flex-col items-start gap-[0.625rem]"
            aria-label="닫기"
          >
            {closeIconSrc ? (
              <img src={closeIconSrc} alt="close" />
            ) : (
              <span className="text-primary-white text-xl">×</span>
            )}
          </button>
        </div>

        {/* Group */}
        <div className="h-[16.25rem] self-stretch flex flex-col items-center">
          {/* Rectangle (이미지 영역) */}
          <div
            key={animKey}
            className="relative w-[23.125rem] h-[16.25rem] flex-shrink-0 rounded-t-[0.75rem] rounded-b-[0rem] overflow-hidden transition-opacity duration-200 ease-out"
            style={{ backgroundImage: `url(${currentImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 1 }}
            aria-label="확대 이미지"
          >
            {/* Frame (컨트롤 오버레이) */}
            <div className="absolute inset-0 flex w-[23.125rem] h-[16.25rem] flex-col justify-between items-start">
              {/* Chevron Row */}
              <div className="flex pt-[6.25rem] justify-between items-center self-stretch px-1">
                <Chevron variant={variant} onPrev={prev} onNext={next} />
              </div>

              {/* Pagination */}
              <div className="w-full flex justify-center pb-2">
                <PaginationDots total={total} current={current} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;
