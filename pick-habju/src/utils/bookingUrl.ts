import type { RoomMetadata } from '../types/RoomMetadata';

// 커스텀 링크 레지스트리: 확장에는 열려 있고 기본 동작에는 닫혀 있도록, businessId 기준으로 매핑
const CUSTOM_BOOKING_URL_BY_BUSINESS_ID: Record<string, string> = {
  // 그루브 사당점
  sadang: 'https://www.groove4.co.kr/',
  // 드림합주실 사당점
  dream_sadang:
    'https://www.xn--hy1bm6g6ujjkgomr.com/bbs/board.php?bo_table=booking&mode=step2&rm_ix=2',
};

/**
 * 합주실 예약 URL 생성
 * - 커스텀 매핑에 존재하면 해당 URL 반환
 * - 그 외엔 네이버 예약 기본 패턴을 사용
 */
export function getBookingUrl(room: RoomMetadata, dateIso: string): string {
  const custom = CUSTOM_BOOKING_URL_BY_BUSINESS_ID[room.businessId];
  if (custom) return custom;

  const params = new URLSearchParams({ area: 'ple', lang: 'ko', startDate: dateIso });
  return `https://booking.naver.com/booking/10/bizes/${room.businessId}/items/${room.bizItemId}?${params.toString()}`;
}
