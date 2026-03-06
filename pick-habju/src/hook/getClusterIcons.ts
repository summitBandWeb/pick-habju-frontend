/**
 * 네이버 지도 마커 클러스터링에 사용되는 아이콘을 생성하는 함수.
 *
 * 클러스터 아이콘은 마커 개수에 따라 3단계로 구분됩니다:
 * - htmlMarker1: 1~5개 (50px → 호버 60px)
 * - htmlMarker2: 6~14개 (70px → 호버 80px)
 * - htmlMarker3: 15개 이상 (80px → 호버 90px)
 *
 * 스타일은 src/index.css에 전역으로 정의되어 있습니다.
 *
 * @param navermaps - naver.maps 네임스페이스 객체
 * @returns 클러스터 아이콘 마커 설정 객체 3개
 */

const CLUSTER_STYLES = {
  /** 1~5개 마커 클러스터 (기본 50px, 호버 60px) */
  small: { size: 50 },
  /** 6~14개 마커 클러스터 (기본 70px, 호버 80px) */
  medium: { size: 70, opacity: 0.95 },
  /** 15개 이상 마커 클러스터 (기본 80px, 호버 90px) */
  large: { size: 80, opacity: 0.95 },
} as const;

const createClusterContent = (
  variant: keyof typeof CLUSTER_STYLES,
  size: number,
  opacity?: number,
) => {
  const opacityStyle = opacity !== undefined ? `opacity:${opacity};` : '';

  return `<div class="cluster-icon cluster-icon--${variant}" style="cursor:pointer;width:${size}px;height:${size}px;line-height:${size}px;font-size:18px;font-family:'Pretendard',sans-serif;font-weight:700;color:#fff;text-align:center;letter-spacing:0.54px;border-radius:50%;${opacityStyle}"></div>`;
};

export const getClusterIcons = (navermaps: typeof naver.maps) => {
  const { small, medium, large } = CLUSTER_STYLES;

  const htmlMarker1 = {
    content: createClusterContent('small', small.size),
    size: new navermaps.Size(small.size, small.size),
    anchor: new navermaps.Point(small.size / 2, small.size / 2),
  };

  const htmlMarker2 = {
    content: createClusterContent('medium', medium.size, medium.opacity),
    size: new navermaps.Size(medium.size, medium.size),
    anchor: new navermaps.Point(medium.size / 2, medium.size / 2),
  };

  const htmlMarker3 = {
    content: createClusterContent('large', large.size, large.opacity),
    size: new navermaps.Size(large.size, large.size),
    anchor: new navermaps.Point(large.size / 2, large.size / 2),
  };

  return { htmlMarker1, htmlMarker2, htmlMarker3 };
};
