/** 캐러셀에서 한 장의 카드로 표시할 룸 정보. */
export interface CardCarouselRoom {
  /** 룸 이름 */
  name: string;
  /** 지점 이름 */
  branch: string;
  /** 지점(사업장) ID */
  businessId: string;
  /** 룸(biz_item) ID. 마커 선택 동기화 키로 사용. */
  bizItemId: string;
  /** 룸 이미지 URL 목록 */
  imageUrls: string[];
  /** 권장 인원 범위 [최소, 최대] */
  recommendCapacityRange: [number, number];
  /** 예상 결제 금액 (원) */
  estimatedPrice: number;
  /** 시간당 가격 (원) */
  pricePerHour: number;
  /** 일부 시간만 가능한 룸 여부 */
  partialAvailable: boolean;
  /** 부분 가능 시간 범위 텍스트 (예: "14:00~16:00"). partial 룸일 때만 존재. */
  availableTimeRange?: string;
}

/**
 * CardCarousel 컴포넌트 Props.
 * selectedRoomId 변경 시 해당 슬라이드로 자동 이동하고,
 * 스와이프 시 onCardChange로 선택된 룸 ID를 상위에 알린다.
 */
export interface CardCarouselProps {
  rooms: CardCarouselRoom[];
  /** 현재 선택된 룸의 bizItemId. null이면 첫 번째 슬라이드. */
  selectedRoomId: string | null;
  /** 캐러셀 표시 여부. false면 슬라이드 언마운트 애니메이션 후 숨김. */
  isOpen: boolean;
  /** 스와이프 또는 마커 선택으로 활성 슬라이드가 변경될 때 호출. bizItemId를 전달. */
  onCardChange: (id: string) => void;
  /**
   * 스와이프 전환 애니메이션이 완전히 끝난 뒤 호출. bizItemId를 전달.
   * panTo 등 지도 조작은 이 콜백에서 실행해야 swipe 애니메이션과 겹치지 않는다.
   */
  onSwipeTransitionEnd?: (id: string) => void;
  /** 예약하기 버튼 클릭 시 호출. bizItemId를 전달. */
  onBookClick: (bizItemId: string) => void;
  /** 강제 디바이스 모드 (Storybook 등 테스트용). 미설정 시 자동 감지. */
  forceDevice?: 'mobile' | 'desktop';
}
