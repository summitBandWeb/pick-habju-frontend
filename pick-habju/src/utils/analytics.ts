// GA4 이벤트를 GTM dataLayer로 전달하는 래퍼
import { pushGtmEvent } from './gtm';

/**
 * 검색 버튼 클릭 이벤트를 추적합니다.
 * @param searchParams 검색 매개변수 (날짜, 시간대, 인원수)
 */
export const trackSearchButtonClick = (searchParams: {
  date: string;
  hour_slots: string[];
  peopleCount: number;
}) => {
  pushGtmEvent('search_button_click', {
    event_category: 'user_interaction',
    event_label: `date:${searchParams.date}_slots:${searchParams.hour_slots.join(',')}_people:${searchParams.peopleCount}`,
    value: searchParams.peopleCount,
    date: searchParams.date,
    hour_slots: searchParams.hour_slots,
    people_count: searchParams.peopleCount,
  });
};

/**
 * API 응답 시간을 추적합니다.
 * @param responseTime 응답 시간 (밀리초)
 * @param isSuccess 요청 성공 여부
 * @param roomCount 반환된 룸 개수 (성공 시)
 */
export const trackApiResponseTime = (
  responseTime: number,
  isSuccess: boolean,
  roomCount?: number
) => {
  pushGtmEvent('api_response_time', {
    event_category: 'api_performance',
    event_label: isSuccess ? 'success' : 'error',
    value: Math.round(responseTime),
    response_time_ms: Math.round(responseTime),
    room_count: roomCount || 0,
    is_success: isSuccess,
  });
};

/**
 * 검색 결과를 추적합니다.
 * @param totalRooms 전체 룸 개수
 * @param availableRooms 예약 가능한 룸 개수
 * @param searchDuration 검색에 걸린 총 시간
 */
export const trackSearchResults = (
  totalRooms: number,
  availableRooms: number,
  searchDuration: number
) => {
  pushGtmEvent('search_results', {
    event_category: 'search_performance',
    event_label: `total:${totalRooms}_available:${availableRooms}`,
    value: availableRooms,
    total_rooms: totalRooms,
    available_rooms: availableRooms,
    search_duration_ms: Math.round(searchDuration),
  });
};

/**
 * 에러 발생을 추적합니다.
 * @param errorType 에러 타입
 * @param errorMessage 에러 메시지
 */
export const trackError = (errorType: string, errorMessage: string) => {
  pushGtmEvent('error_occurred', {
    event_category: 'error',
    event_label: errorType,
    error_message: errorMessage,
  });
};
