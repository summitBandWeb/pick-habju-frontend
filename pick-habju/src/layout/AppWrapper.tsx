import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import AppHeader from '../components/Header/AppHeader.tsx';
import Footer from '../components/Footer/Footer';
import { useIsWindows } from '../hook/useIsWindow.ts';
import RoutePaths from '../router/routePaths.ts';

type AppWrapperProps = { children?: ReactNode };

/**
 * 모바일 기준 고정 폭 래퍼. 상단 헤더는 고정, 나머지 영역은 스크롤.
 */
const AppWrapper = ({ children }: AppWrapperProps) => {
  const isWindows = useIsWindows();
  const { pathname } = useLocation();
  const isMapPage = pathname === RoutePaths.MAP;
  const showFooter = !isMapPage;
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex justify-center bg-primary-white">
      {/* 컨테이너: 모바일은 100% 폭, 넓은 화면에서는 중앙 정렬 최대폭 */}
      {/* isWindows: 윈도우는 스크롤바 공간 확보 위해 max-w 26.0625rem (417px) */}
      <div
        className={`w-full h-screen flex flex-col bg-primary-white ${isWindows ? 'max-w-[26.0625rem]' : 'max-w-[25.125rem]'}`}
      >
        {/* 헤더(세이프 에어리어 + 로고 헤더) */}
        <AppHeader />

        {/* 스크롤 영역: 헤더 제외 나머지 */}
        <div
          className={`flex-1 flex flex-col ${
            isMapPage ? 'overflow-hidden' : 'scrollbar-stable overflow-y-auto overflow-x-hidden items-center'
          }`}
        >
          <div className={`w-full flex flex-col items-center ${isMapPage ? 'h-full' : ''}`}>{children}</div>
          {showFooter && (
            <div className="flex justify-center w-full">
              <Footer />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
