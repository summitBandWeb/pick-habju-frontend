import { useSearchStore } from '../../store/search/searchStore';
import { SearchPhase } from '../../store/search/searchStore.types';
import BeforeSearchView from './BeforeSearchView';

const SearchSection = () => {
  const { phase } = useSearchStore();

  if (phase === SearchPhase.BeforeSearch) {
    return <BeforeSearchView />;
  }

  // Loading/NoResult/Default는 이후 단계에서 구현
  return null;
};

export default SearchSection;
