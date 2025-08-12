import type { RoomMetadata } from '../types/RoomMetadata';

/**
 * 총 요금 계산
 * - 기본: pricePerHour * 사용 시간(시간 슬롯 개수)
 * - 초과 인원: max(peopleCount - baseCapacity, 0) * extraCharge * 사용 시간
 * - baseCapacity 또는 extraCharge가 없으면 초과 요금 0으로 처리
 */
export function calculateTotalPrice(args: {
  room: RoomMetadata;
  hourSlots: string[];
  peopleCount: number;
}): number {
  const { room, hourSlots, peopleCount } = args;

  const hours = Array.isArray(hourSlots) ? hourSlots.length : 0;
  if (hours <= 0) return 0;

  const base = room.pricePerHour * hours;

  const baseCapacity = typeof room.baseCapacity === 'number' ? room.baseCapacity : undefined;
  const extraCharge = typeof room.extraCharge === 'number' ? room.extraCharge : undefined;

  if (!baseCapacity || !extraCharge) {
    return base;
  }

  const exceed = Math.max(peopleCount - baseCapacity, 0);
  const extra = exceed * extraCharge * hours;
  return base + extra;
}

export function getPriceBreakdown(args: {
  room: RoomMetadata;
  hourSlots: string[];
  peopleCount: number;
}): {
  basicAmount: number;
  hours: number;
  baseTotal: number;
  addPersonCount: number;
  addAmountPerPerson: number;
  addTotal: number;
  finalTotal: number;
} {
  const { room, hourSlots, peopleCount } = args;
  const hours = Array.isArray(hourSlots) ? hourSlots.length : 0;
  const basicAmount = room.pricePerHour;
  const baseTotal = basicAmount * Math.max(hours, 0);

  const baseCapacity = typeof room.baseCapacity === 'number' ? room.baseCapacity : undefined;
  const addAmountPerPerson = typeof room.extraCharge === 'number' ? room.extraCharge : 0;
  const addPersonCount = baseCapacity ? Math.max(peopleCount - baseCapacity, 0) : 0;
  const addTotal = addPersonCount > 0 ? addPersonCount * addAmountPerPerson * Math.max(hours, 0) : 0;
  const finalTotal = baseTotal + addTotal;

  return { basicAmount, hours, baseTotal, addPersonCount, addAmountPerPerson, addTotal, finalTotal };
}

export function getRoomLocationLine(room: RoomMetadata): string {
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
