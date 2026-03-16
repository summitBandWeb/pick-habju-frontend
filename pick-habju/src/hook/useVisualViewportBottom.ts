import { useState, useEffect } from 'react';

/**
 * 모바일 브라우저 하단 UI(주소창, 네비게이션 바)에 의해 가려지는 높이(px)를 반환합니다.
 * Visual Viewport API로 window.innerHeight와 visualViewport.height의 차이를 계산합니다.
 * - Android Chrome 하단 주소창: ~56px
 * - 일반 환경(데스크탑, URL바 없음): 0px
 */
export function useVisualViewportBottom(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      setOffset(Math.max(0, window.innerHeight - vv.height - vv.offsetTop));
    };

    update();
    vv.addEventListener('resize', update);
    return () => vv.removeEventListener('resize', update);
  }, []);

  return offset;
}
