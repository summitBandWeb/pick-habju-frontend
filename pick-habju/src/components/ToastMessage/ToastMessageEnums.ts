export enum ReservationToastKey {
  INVALID_TYPE = 'INVALID_TYPE',
  PAST_TIME = 'PAST_TIME',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
}

export const ReservationToastMessages: Record<ReservationToastKey, string> = {
  [ReservationToastKey.INVALID_TYPE]: '올바른 시간으로 골라 주세요!',
  [ReservationToastKey.PAST_TIME]: '현재 이후 시간으로 골라 주세요!',
  [ReservationToastKey.TOO_LONG]: '예약 시간이 조금 긴 것 같은데요,\n5시간 초과면 예약이 불가능해요!',
  [ReservationToastKey.TOO_SHORT]: '일부 공간은 1시간 예약이 제한돼요.\n2시간 이상이면 선택지가 늘어나요!',
};

// 오류/경고 구분 (확인 버튼 validate 시 동작 제어 용도)
export type ToastSeverity = 'error' | 'warning';

// 키별 심각도 매핑
// - INVALID_TYPE, PAST_TIME: 오류 → 검색 차단
// - TOO_LONG: v1에서는 오류로 처리 v2에서는 경고 처리 후 검색하기 기준에 len(hour_slots) 도 추가해야
// - TOO_SHORT: 경고 → 검색 허용
export const ReservationToastSeverity: Record<ReservationToastKey, ToastSeverity> = {
  [ReservationToastKey.INVALID_TYPE]: 'error',
  [ReservationToastKey.PAST_TIME]: 'error',
  [ReservationToastKey.TOO_LONG]: 'error',
  [ReservationToastKey.TOO_SHORT]: 'warning',
};
