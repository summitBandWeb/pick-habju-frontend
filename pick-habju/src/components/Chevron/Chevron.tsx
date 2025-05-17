import clsx from 'classnames';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { ChevronVariant } from '../../enums/components';

interface ChevronProps {
  variant: ChevronVariant;
  onPrev?: () => void;
  onNext?: () => void;
}

const TOUCH_AREA = 'w-[42px] h-[42px] flex items-center justify-center';

const Chevron = ({ variant = ChevronVariant.Middle, onPrev, onNext }: ChevronProps) => {
  const showPrev = variant === ChevronVariant.Middle || variant === ChevronVariant.Last;
  const showNext = variant === ChevronVariant.Middle || variant === ChevronVariant.First;

  return (
    <div className={clsx('min-w-[320px] h-[44px] flex items-center justify-between')}>
      {/* 이전 화살표 */}
      {showPrev ? (
        <button onClick={onPrev} className={TOUCH_AREA} aria-label="Previous">
          <ChevronLeftIcon className="w-[42px] h-[42px] text-primary-white" />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}

      {/* 다음 화살표 */}
      {showNext ? (
        <button onClick={onNext} className={TOUCH_AREA} aria-label="Next">
          <ChevronRightIcon className="w-[42px] h-[42px] text-primary-white" />
        </button>
      ) : (
        <div className={TOUCH_AREA} />
      )}
    </div>
  );
};

export default Chevron;
