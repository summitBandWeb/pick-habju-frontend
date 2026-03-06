export {};

declare global {
  interface Window {
    naver: typeof naver;
    MarkerClustering?: typeof MarkerClustering;
  }

  /** MarkerClustering 아이콘 설정 (htmlMarker1/2/3 각각에 전달). */
  interface MarkerClusteringIcon {
    content: string;
    size: naver.maps.Size;
    anchor: naver.maps.Point;
  }

  /** MarkerClustering 생성자 옵션. */
  interface MarkerClusteringOptions {
    /** 클러스터를 표시할 지도 인스턴스. */
    map?: naver.maps.Map | null;
    /** 클러스터링할 마커 배열. */
    markers?: naver.maps.Marker[];
    /** 클러스터 클릭 시 줌인 비활성화 여부. */
    disableClickZoom?: boolean;
    /** 클러스터를 구성할 최소 마커 수. */
    minClusterSize?: number;
    /** 클러스터링을 해제할 줌 레벨. 이 레벨 이상에서는 개별 마커를 표시. */
    maxZoom?: number;
    /** 클러스터링 기준 그리드 크기(px). */
    gridSize?: number;
    /** 클러스터 마커 개수 단계별 아이콘 배열. indexGenerator 순서에 대응. */
    icons?: MarkerClusteringIcon[];
    /**
     * 클러스터 아이콘 구간 경계값 배열.
     * [5, 14] 이면 1-5→icons[0], 6-14→icons[1], 15+→icons[2].
     */
    indexGenerator?: number[] | ((count: number) => number);
    /** 클러스터 중심을 평균 좌표로 설정할지 여부. */
    averageCenter?: boolean;
    /**
     * 클러스터 마커 DOM 스타일링 콜백.
     * clusterMarker.getElement()로 DOM 요소에 접근 가능.
     */
    stylingFunction?: (
      clusterMarker: { getElement: () => Element | null },
      count: number,
    ) => void;
  }

  /**
   * 네이버 지도 MarkerClustering 유틸리티 라이브러리.
   * vendored: public/lib/naver/MarkerClustering.js
   */
  class MarkerClustering {
    constructor(options: MarkerClusteringOptions);
    setMarkers(markers: naver.maps.Marker[]): void;
    getMarkers(): naver.maps.Marker[];
    setMap(map: naver.maps.Map | null): void;
    getMap(): naver.maps.Map | null;
    setOptions(options: Partial<MarkerClusteringOptions>): void;
  }
}
