import type { ReactNode } from 'react';
import AppHeader from '../components/Header/AppHeader.tsx';
import Footer from '../components/Footer/Footer';

type AppWrapperProps = { children?: ReactNode };

/**
 * 모바일 기준 고정 폭 래퍼. 상단 헤더는 고정, 나머지 영역은 스크롤.
 */
const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden flex justify-center bg-primary-white">
      {/* 컨테이너: 모바일은 100% 폭, 넓은 화면에서는 중앙 정렬 최대폭 */}
      <div className="w-full max-w-[25.9375rem] h-screen flex flex-col bg-primary-white">
        {/* 헤더(세이프 에어리어 + 로고 헤더) */}
        <AppHeader />

        {/* 스크롤 영역: 헤더 제외 나머지 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center bg-[#FFFBF0] scrollbar-stable">
          <div className="w-full flex flex-col items-center">{children}</div>
          <div className="flex justify-center py-6 w-full bg-[#FFFBF0]">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
