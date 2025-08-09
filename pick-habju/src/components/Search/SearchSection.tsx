import { useSearchStore } from '../../store/search/searchStore';
import { SearchPhase } from '../../store/search/searchStore.types';
import BeforeSearchView from './BeforeSearchView';
import NoResultView from './NoResultView';

const SearchSection = () => {
  const { phase } = useSearchStore();

  switch (phase) {
    case SearchPhase.BeforeSearch:
      return <BeforeSearchView />;
    case SearchPhase.NoResult:
      return <NoResultView />;
    default:
      return null; // Loading/Default는 이후 단계에서 구현
  }
};

export default SearchSection;
