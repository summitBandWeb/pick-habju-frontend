import TimeIcon from '../../assets/svg/Time.svg?react';
import { useSearchStore } from '../../store/search/searchStore';
import { useAnalyticsCycleStore } from '../../store/analytics/analyticsStore';
import { pushGtmEvent } from '../../utils/gtm';

const PartiallyPossibleButton = () => {
  const includePartiallyPossible = useSearchStore((s) => s.includePartiallyPossible);
  const setIncludePartiallyPossible = useSearchStore((s) => s.setIncludePartiallyPossible);
  const recordPartiallyPossibleClick = useAnalyticsCycleStore((s) => s.recordPartiallyPossibleClick);
  const cycleId = useAnalyticsCycleStore((s) => s.cycleId);

  const isActive = includePartiallyPossible;

  return (
    <button
      className={`h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 flex gap-1.25 items-center outline-none border border-transparent transition-colors ${
        isActive
          ? 'bg-gray-600 text-primary-white [&_path]:fill-primary-white'
          : 'bg-primary-white text-gray-300 hover:bg-gray-200 [&_path]:fill-gray-300'
      }`}
      onClick={() => {
        const next = !includePartiallyPossible;
        setIncludePartiallyPossible(next);
        recordPartiallyPossibleClick();
        pushGtmEvent('fs_partially_possible_click', { cycle_id: cycleId, next_value: next });
      }}
    >
      <TimeIcon className="w-3 h-3 shrink-0" />
      <span className="font-modal-call whitespace-nowrap">일부시간만 가능</span>
    </button>
  );
};

export default PartiallyPossibleButton;
