import { useEffect, useState } from 'react';
import Chevron from '../../components/Chevron/Chevron';
import { ChevronVariant } from '../../components/Chevron/ChevronEnums';
import ModalOverlay from './ModalOverlay';

type ImageCarouselModalProps = {
  open?: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
  closeIconSrc?: string; // 아이콘 경로 제공 시 사용. 없으면 텍스트 버튼 사용
};

const ImageCarouselModal = ({
  open = true,
  images,
  initialIndex = 0,
  onClose,
  closeIconSrc,
}: ImageCarouselModalProps) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    setCurrent(initialIndex);
  }, [initialIndex]);

  const total = images.length;
  const prev = () => {
    setCurrent((p) => Math.max(0, p - 1));
  };
  const next = () => {
    setCurrent((p) => Math.min(total - 1, p + 1));
  };

  const variant: ChevronVariant =
    current === 0 ? ChevronVariant.First : current === total - 1 ? ChevronVariant.Last : ChevronVariant.Middle;

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      dimmedClassName="bg-black/80" // 기존 디자인(더 어두운 배경) 유지
    >
      {/* 내부 컨텐츠: 중앙 정렬 등 레이아웃은 ModalOverlay가 처리하므로 내용물만 배치 */}
      {/* 컨테이너: wrapper 폭 기준 중앙 */}
      <div className="w-full max-w-[23.125rem]">
        {/* Group */}
        <div className="w-[23.125rem] flex flex-col items-start flex-shrink-0">
          {/* Rectangle (이미지 프레임 - 가변 높이) */}
          <div className="relative w-full flex-shrink-0 overflow-hidden">
            {/* 이미지 레이어만 슬라이드 */}
            <div
              className="flex items-center"
              style={{
                transform: `translateX(-${current * 100}%)`,
                transition: 'transform 0.35s ease-out',
              }}
            >
              {images.map((image, index) => (
                <div key={index} className="w-[23.125rem] min-w-[23.125rem] flex-shrink-0">
                  {index === current && (
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
                  )}
                  <img
                    src={image}
                    alt={`확대 이미지 ${index + 1}`}
                    className="w-full h-auto block"
                  />
                </div>
              ))}
            </div>

            {/* 상단 그라데이션 */}
            <div className="pointer-events-none absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/70 to-transparent" />
            {/* 하단 그라데이션 */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

            {/* 컨트롤 오버레이 - Chevron을 이미지 영역 내 세로 중앙에 배치 */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-center items-stretch">
              {total > 1 && (
                <div className="pointer-events-auto flex justify-between items-center self-stretch px-0">
                  <Chevron variant={variant} onPrev={prev} onNext={next} containerClassName="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ImageCarouselModal;
