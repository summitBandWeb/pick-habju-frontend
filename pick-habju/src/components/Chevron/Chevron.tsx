import clsx from 'classnames';
import type { ChevronProps } from './Chevron.types';
import { ChevronVariant } from './ChevronEnums';

import ChevronLeftIcon from '../../assets/svg/chevronLeft.svg?react';
import ChevronRightIcon from '../../assets/svg/chevronRight.svg?react';

const TOUCH_AREA = 'w-10.5 h-10.5 flex items-center justify-center';

const ICON_STYLE = 'w-full h-full stroke-current fill-none';

const Chevron = ({ variant = ChevronVariant.Middle, onPrev, onNext, containerClassName }: ChevronProps) => {
  const showPrev = variant === ChevronVariant.Middle || variant === ChevronVariant.Last;
  const showNext = variant === ChevronVariant.Middle || variant === ChevronVariant.First;

  return (
    // 디폴트 색깔 primary-white 으로 설정, 상위에서 stroke 색상 변경 가능하도록 currentColor 사용
    <div
      className={clsx('h-11 flex items-center justify-between text-primary-white', containerClassName ?? 'min-w-92.5')}
    >
      {/* 이전 화살표 */}
      {showPrev ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          className={TOUCH_AREA}
          aria-label="Previous"
        >
          <ChevronLeftIcon className={ICON_STYLE} />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}

      {/* 다음 화살표 */}
      {showNext ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          className={TOUCH_AREA}
          aria-label="Next"
        >
          <ChevronRightIcon className={ICON_STYLE} />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}
    </div>
  );
};

export default Chevron;
