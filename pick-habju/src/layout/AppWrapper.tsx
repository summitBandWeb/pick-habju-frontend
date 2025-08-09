import type { PropsWithChildren } from 'react';
import AppHeader from '../components/Header/AppHeader.tsx';
import Footer from '../components/Footer/Footer';

type AppWrapperProps = PropsWithChildren<Record<string, never>>;

/**
 * 모바일 기준 고정 폭 래퍼. 상단 헤더는 고정, 나머지 영역은 스크롤.
 */
const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-primary-white">
      {/* 고정 폭 컨테이너 (디자인 기준 25.125rem → 402px 기준 확장) */}
      <div className="w-[26rem] h-screen flex flex-col bg-primary-white">
        {/* 헤더(세이프 에어리어 + 로고 헤더) */}
        <AppHeader />

        {/* 스크롤 영역: 헤더 제외 나머지 */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center">
          <div className="w-full flex flex-col items-center">
            {children}
          </div>
          <div className="flex justify-center py-6 w-full">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
