import { useEffect, useState } from 'react';
import type { ErrorNoticeProps } from './ErrorNotice.types';
import WarningIcon from '../../assets/svg/warningIcon.svg';
import LoadingSpinner from '../../assets/svg/loadingSpinner.svg';
import NoLocationIcon from '../../assets/svg/NoLocation.svg';

const ErrorNotice = ({
  type,
  onClose,
  autoHideAfter = 3000,
  onAutoHide,
}: ErrorNoticeProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // noMatch 타입일 때 자동 숨김 타이머
  useEffect(() => {
    if (type === 'noMatch' && isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onAutoHide?.();
      }, autoHideAfter);

      return () => clearTimeout(timer);
    }
  }, [type, autoHideAfter, onAutoHide, isVisible]);

  if (!isVisible) return null;

  // 타입별 아이콘 설정
  const getIcon = () => {
    switch (type) {
      case 'noResults':
        return <img src={WarningIcon} alt="warning" className="w-[84px] h-[84px]" />;
      case 'loading':
        return (
          <img
            src={LoadingSpinner}
            alt="loading"
            className="w-[68px] h-[68px] animate-spin"
          />
        );
      case 'noMatch':
        return <img src={NoLocationIcon} alt="no location" className="w-[68px] h-[77px]" />;
      default:
        return null;
    }
  };

  // 타입별 메시지 설정
  const getMessage = () => {
    switch (type) {
      case 'noResults':
        return (
          <>
            <p className="w-full">조건에 맞는 합주실이 없어요.</p>
            <p className="w-full">검색 조건을 다시 설정해주세요.</p>
          </>
        );
      case 'loading':
        return (
          <>
            <p>서버가 혼잡하여 응답이 지연되고 있어요.</p>
            <p>처리 중이니 잠시만 기다려주세요.</p>
          </>
        );
      case 'noMatch':
        return (
          <>
            <p className="w-full min-w-full whitespace-pre-wrap">앗, 일치하는 합주실이 없네요.</p>
            <p>다른 합주실을 둘러보는 건 어떨까요?</p>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="backdrop-blur-[3px] bg-[rgba(9,9,9,0.7)] flex flex-col items-center justify-center w-full h-full">
      <div className="flex flex-col items-center justify-center gap-[16px] flex-1 w-full">
        {/* 아이콘 */}
        <div className="shrink-0">{getIcon()}</div>

        {/* 메시지 */}
        <div className="flex flex-col items-center justify-between h-[46px] w-full text-[#e6e6e6] text-[16px] font-semibold text-center leading-normal whitespace-pre-wrap">
          {getMessage()}
        </div>

        {/* 돌아가기 버튼 (noResults 타입에서만 표시) */}
        {type === 'noResults' && onClose && (
          <button
            onClick={onClose}
            className="flex items-center justify-center px-[10px] py-[10px] h-[48px] w-[182.5px] rounded-[10px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] mt-[4px]"
          >
            <p className="text-[#afafaf] text-[16px] font-semibold underline decoration-solid">
              검색하기
            </p>
          </button>
        )}
      </div>
    </div>
  );
};

export type { ErrorNoticeProps, NoticeType } from './ErrorNotice.types';
export default ErrorNotice;
