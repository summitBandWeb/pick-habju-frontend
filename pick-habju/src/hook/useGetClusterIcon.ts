import { useMemo } from 'react';

/** useNavermaps() 훅이 반환하는 navermaps 객체에서 실제 사용하는 부분만 정의 */
interface NaverMapsLike {
  Size: new (width: number, height: number) => unknown;
  Point: new (x: number, y: number) => unknown;
}

/**
 * 네이버 지도 마커 클러스터링에 사용되는 아이콘을 생성하는 훅
 *
 * 클러스터 아이콘은 마커 개수에 따라 3단계로 구분됩니다:
 * - htmlMarker1: 1~5개 (50x50px, 밝은 노란색)
 * - htmlMarker2: 6~14개 (70x70px, 진한 노란색)
 * - htmlMarker3: 15개 이상 (80x80px, 진한 노란색)
 *
 * @param navermaps - naver.maps 네임스페이스 객체 (useNavermaps() 반환값)
 * @returns 클러스터 아이콘 마커 설정 객체 3개
 */

const CLUSTER_STYLES = {
  /** 1~5개 마커 클러스터 */
  small: {
    size: 50,
    background: 'radial-gradient(circle, rgba(255,205,56,1) 50%, rgba(255,205,56,0.9) 100%)',
  },
  /** 6~14개 마커 클러스터 */
  medium: {
    size: 70,
    background: 'radial-gradient(circle, rgba(255,195,0,1) 0%, rgba(255,191,0,0.9) 100%)',
    opacity: 0.95,
  },
  /** 15개 이상 마커 클러스터 */
  large: {
    size: 80,
    background: 'radial-gradient(circle, rgba(255,195,0,1) 0%, rgba(255,191,0,0.9) 100%)',
    opacity: 0.95,
  },
} as const;

const createClusterContent = (
  size: number,
  background: string,
  opacity?: number,
) => {
  const opacityStyle = opacity !== undefined ? `opacity:${opacity};` : '';

  return `<div style="cursor:pointer;width:${size}px;height:${size}px;line-height:${size}px;font-size:18px;font-family:'Pretendard',sans-serif;font-weight:700;color:#fff;text-align:center;letter-spacing:0.54px;border-radius:50%;background:${background};box-shadow:0px 0px 8px 0px rgba(226,171,8,0.25);${opacityStyle}"></div>`;
};

export const useGetClusterIcon = (navermaps: NaverMapsLike) => {
  const icons = useMemo(() => {
    const { small, medium, large } = CLUSTER_STYLES;

    const htmlMarker1 = {
      content: createClusterContent(small.size, small.background),
      size: new navermaps.Size(small.size, small.size),
      anchor: new navermaps.Point(small.size / 2, small.size / 2),
    };

    const htmlMarker2 = {
      content: createClusterContent(medium.size, medium.background, medium.opacity),
      size: new navermaps.Size(medium.size, medium.size),
      anchor: new navermaps.Point(medium.size / 2, medium.size / 2),
    };

    const htmlMarker3 = {
      content: createClusterContent(large.size, large.background, large.opacity),
      size: new navermaps.Size(large.size, large.size),
      anchor: new navermaps.Point(large.size / 2, large.size / 2),
    };

    return { htmlMarker1, htmlMarker2, htmlMarker3 };
  }, [navermaps]);

  return icons;
};
