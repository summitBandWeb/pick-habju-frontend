import GrayCheckIcon from '../../assets/svg/GrayCheck.svg';
import BlueCheckIcon from '../../assets/svg/BlueCheck.svg';
import { useSearchStore } from '../../store/search/searchStore';

const PartiallyPossibleButton = () => {
  const includePartiallyPossible = useSearchStore((s) => s.includePartiallyPossible);
  const setIncludePartiallyPossible = useSearchStore((s) => s.setIncludePartiallyPossible);

  const isActive = includePartiallyPossible;

  return (
    <button
      className="w-[9.25rem] h-10 rounded-[6.25rem] shadow-filter px-4 py-2.5 flex gap-2.5 items-center outline-none bg-primary-white hover:bg-gray-100"
      onClick={() => setIncludePartiallyPossible(!includePartiallyPossible)}
    >
      <span className={`font-modal-call ${isActive ? 'text-blue-500' : 'text-gray-300'}`}>일부시간 가능만</span>
      <img src={isActive ? BlueCheckIcon : GrayCheckIcon} alt="check icon" />
    </button>
  );
};

export default PartiallyPossibleButton;
