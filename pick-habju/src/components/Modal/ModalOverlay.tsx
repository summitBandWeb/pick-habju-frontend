import { useEffect, useRef } from 'react';

type ModalOverlayProps = {
  open?: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** 배경색 투명도 조절이 필요한 경우 (예: 이미지 캐러셀은 더 어둡게) */
  dimmedClassName?: string;
  /** 클릭 시 닫힘 방지 옵션 (강제 선택이 필요한 경우 true) */
  lockBackground?: boolean;
};

const ModalOverlay = ({
  open = true,
  onClose,
  children,
  dimmedClassName = 'bg-black/60',
  lockBackground = false,
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

  return (
    <div
      ref={overlayRef}
      className={`fixed inset-0 z-50 flex items-center justify-center ${dimmedClassName} backdrop-blur-[2px]`} // backdrop-blur 등 스타일 토큰 활용 가능
      onClick={(e) => {
        // 배경 클릭 시 닫기 (lockBackground가 false일 때만)
        if (!lockBackground && e.target === overlayRef.current) onClose();
      }}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};

export default ModalOverlay;
