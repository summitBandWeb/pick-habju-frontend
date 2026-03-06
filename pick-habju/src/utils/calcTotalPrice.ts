import type { RoomDetail } from '../api/api.types';

/**
 * 예약 모달 요금 내역 계산 (API 기반)
 * - 서버에서 계산된 estimatedPrice를 최종 금액으로 사용
 * - 내역 표시용 baseTotal은 price_per_hour * 시간으로 단순 계산
 */
export function getPriceBreakdown(args: {
  room: Pick<RoomDetail, 'price_per_hour' | 'base_capacity' | 'extra_charge'>;
  hourSlots: string[];
  peopleCount: number;
  estimatedPrice: number;
}): {
  basicAmount: number;
  hours: number;
  baseTotal: number;
  addPersonCount: number;
  addAmountPerPerson: number;
  addTotal: number;
  finalTotal: number;
} {
  const { room, hourSlots, peopleCount, estimatedPrice } = args;
  const hours = Array.isArray(hourSlots) ? hourSlots.length : 0;

  const basicAmount = room.price_per_hour;
  const baseTotal = room.price_per_hour * hours;

  const baseCapacity = typeof room.base_capacity === 'number' ? room.base_capacity : undefined;
  const addAmountPerPerson = typeof room.extra_charge === 'number' ? room.extra_charge : 0;
  const addPersonCount = baseCapacity ? Math.max(peopleCount - baseCapacity, 0) : 0;
  const addTotal = addPersonCount > 0 ? addPersonCount * addAmountPerPerson * Math.max(hours, 0) : 0;

  return { basicAmount, hours, baseTotal, addPersonCount, addAmountPerPerson, addTotal, finalTotal: estimatedPrice };
}

export function getRoomLocationLine(room: { branch: string; name: string }): string {
  return `${room.branch} ${room.name}`;
}

export function formatTimeRangeFromSlots(hourSlots: string[]): string {
  if (!hourSlots || hourSlots.length === 0) return '';
  const parseHour = (s: string) => parseInt(s.split(':')[0], 10) || 0;
  const start = parseHour(hourSlots[0]);
  const last = parseHour(hourSlots[hourSlots.length - 1]);
  const end = (last + 1) % 24;
  const endDisplay = end === 0 ? 24 : end;
  return `${start}시-${endDisplay}시`;
}
