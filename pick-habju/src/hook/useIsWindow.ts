import { useState, useEffect } from 'react';

export const useIsWindows = (): boolean => {
  const [isWindows, setIsWindows] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsWindows(/Win/i.test(navigator.platform));
    }
  }, []);

  return isWindows;
};
