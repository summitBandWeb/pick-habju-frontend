import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

type ModalOverlayProps = {
  open?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 배경색 투명도 조절이 필요한 경우 (예: 이미지 캐러셀은 더 어둡게) */
  dimmedClassName?: string;
  /** backdrop-blur 클래스 (기본 'backdrop-blur-[2px]', 빈 문자열로 비활성화 가능) */
  blurClassName?: string;
  /** 클릭 시 닫힘 방지 옵션 (강제 선택이 필요한 경우 true) */
  lockBackground?: boolean;
  /** 아래→위 슬라이드 애니메이션 (false: ImageCarousel 등 즉시 표시) */
  animateFromBottom?: boolean;
};

const ModalOverlay = ({
  open = true,
  onClose,
  children,
  dimmedClassName = 'bg-black/60',
  blurClassName = 'backdrop-blur-[2px]',
  lockBackground = false,
  animateFromBottom = true,
}: ModalOverlayProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // ESC 닫기
  useEffect(() => {
    if (!open) return;

    // 스크롤 잠금
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = originalStyle; // 스크롤 복구
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className={`fixed -inset-px z-[70] flex items-center justify-center overflow-hidden ${dimmedClassName} ${blurClassName}`}
      onClick={(e) => {
        if (!lockBackground && e.target === overlayRef.current) onClose();
      }}
    >
      {animateFromBottom ? (
        <motion.div
          initial={{ y: 60, opacity: 0.4 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </motion.div>
      ) : (
        <div onClick={(e) => e.stopPropagation()}>{children}</div>
      )}
    </div>,
    document.body
  );
};

export default ModalOverlay;
