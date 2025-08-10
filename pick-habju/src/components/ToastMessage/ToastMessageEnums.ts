export enum ReservationToastKey {
  INVALID_TYPE = 'INVALID_TYPE',
  PAST_TIME = 'PAST_TIME',
  TOO_LONG = 'TOO_LONG',
  TOO_SHORT = 'TOO_SHORT',
  TOO_MANY_PEOPLE = 'TOO_MANY_PEOPLE',
}

export const ReservationToastMessages: Record<ReservationToastKey, string> = {
  [ReservationToastKey.INVALID_TYPE]: '올바른 시간으로 골라 주세요!',
  [ReservationToastKey.PAST_TIME]: '현재 이후 시간으로 골라 주세요!',
  [ReservationToastKey.TOO_LONG]: '예약 시간이 조금 긴 것 같은데요,\n5시간 초과면 예약이 불가능해요!',
  [ReservationToastKey.TOO_SHORT]: '일부 공간은 1시간 예약이 제한돼요.\n2시간 이상이면 선택지가 늘어나요!',
  [ReservationToastKey.TOO_MANY_PEOPLE]: '예약 인원이 조금 많은 것 같은데요,\n다시 한 번 확인해 주시겠어요?',
};
