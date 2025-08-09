import clsx from 'classnames';
import type { ChevronProps } from './Chevron.types';
import { ChevronVariant } from './ChevronEnums';

import ChevronLeftIcon from '../../assets/svg/chevronLeft.svg';
import ChevronRightIcon from '../../assets/svg/chevronRight.svg';

const TOUCH_AREA = 'w-10.5 h-10.5 flex items-center justify-center';

const Chevron = ({ variant = ChevronVariant.Middle, onPrev, onNext }: ChevronProps) => {
  const showPrev = variant === ChevronVariant.Middle || variant === ChevronVariant.Last;
  const showNext = variant === ChevronVariant.Middle || variant === ChevronVariant.First;

  return (
    <div className={clsx('min-w-80 h-11 flex items-center justify-between')}>
      {/* 이전 화살표 */}
      {showPrev ? (
        <button onClick={onPrev} className={TOUCH_AREA} aria-label="Previous">
          <img src={ChevronLeftIcon} alt="previous" />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}

      {/* 다음 화살표 */}
      {showNext ? (
        <button onClick={onNext} className={TOUCH_AREA} aria-label="Next">
          <img src={ChevronRightIcon} alt="previous" />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}
    </div>
  );
};

export default Chevron;
