import type { PropsWithChildren } from 'react';
import AppHeader from '../components/Header/AppHeader';
import Footer from '../components/Footer/Footer';

type AppWrapperProps = PropsWithChildren<{}>;

/**
 * 모바일 기준 고정 폭 래퍼. 상단 헤더는 고정, 나머지 영역은 스크롤.
 */
const AppWrapper = ({ children }: AppWrapperProps) => {
  return (
    <div className="min-h-screen w-full flex justify-center bg-primary-white">
      {/* 고정 폭 컨테이너 (디자인 기준 25.125rem) */}
      <div className="w-[25.125rem] h-screen flex flex-col bg-primary-white">
        {/* 헤더(세이프 에어리어 + 로고 헤더) */}
        <AppHeader />

        {/* 스크롤 영역: 헤더 제외 나머지 */}
        <div className="flex-1 overflow-y-auto">
          {children}
          <div className="flex justify-center py-6">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppWrapper;
