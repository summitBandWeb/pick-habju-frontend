import { useSearchStore } from '../../store/search/searchStore';
import { SearchPhase } from '../../store/search/searchStore.types';
import BeforeSearchView from './BeforeSearchView';
import NoResultView from './NoResultView';
import DefaultView from './DefaultView';
import DefaultSkeletonView from './DefaultSkeletonView';

const SearchSection = () => {
  const phase = useSearchStore((s) => s.phase);

  switch (phase) {
    case SearchPhase.BeforeSearch:
      return <BeforeSearchView />;
    case SearchPhase.Loading:
      return <DefaultSkeletonView />;
    case SearchPhase.NoResult:
      return <NoResultView />;
    case SearchPhase.Default:
      return <DefaultView />;
    default:
      return null; // Loading/Default는 이후 단계에서 구현
  }
};

export default SearchSection;
