import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchStore } from '../store/search/searchStore';
import RoutePaths from '../router/routePaths';

const MapPage = () => {
  const lastQuery = useSearchStore((s) => s.lastQuery);
  const navigate = useNavigate();

  useEffect(() => {
    if (!lastQuery) {
      navigate(RoutePaths.HOME, { replace: true });
      return;
    }
    console.log('[MapPage] 검색 파라미터:', lastQuery);
  }, [lastQuery, navigate]);

  return (
    <div className="w-full flex flex-col items-center">
      <p>MapPage</p>
    </div>
  );
};

export default MapPage;
