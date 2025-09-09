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
  dateIso?: string; // 주말 판단 및 timeBand 가격 반영을 위해 선택적 입력
}): number {
  const { room, hourSlots, peopleCount, dateIso } = args;

  const hours = Array.isArray(hourSlots) ? hourSlots.length : 0;
  if (hours <= 0) return 0;

  // 시간대별/주말 요금을 반영하여 시간 단위로 합산
  const base = sumHourlyBase({ room, hourSlots, dateIso });

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
  dateIso?: string;
}): {
  basicAmount: number;
  hours: number;
  baseTotal: number;
  addPersonCount: number;
  addAmountPerPerson: number;
  addTotal: number;
  finalTotal: number;
} {
  const { room, hourSlots, peopleCount, dateIso } = args;
  const hours = Array.isArray(hourSlots) ? hourSlots.length : 0;
  // 표기용 기본 단가: 첫 슬롯의 단가(없으면 room.pricePerHour)
  const firstUnit = getUnitPriceForHour({ room, hour: parseFirstHour(hourSlots), dateIso }) ?? room.pricePerHour;
  const basicAmount = firstUnit;
  const baseTotal = sumHourlyBase({ room, hourSlots, dateIso });

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

// === 내부 유틸: 시간대/주말 단가 계산 ===
function isWeekend(dateIso?: string): boolean {
  if (!dateIso) return false;
  const d = new Date(dateIso);
  const day = d.getDay(); // 0=일,6=토
  return day === 0 || day === 6;
}

function parseFirstHour(hourSlots: string[]): number | undefined {
  if (!Array.isArray(hourSlots) || hourSlots.length === 0) return undefined;
  const h = parseInt(hourSlots[0].split(':')[0], 10);
  return Number.isNaN(h) ? undefined : h;
}

function getUnitPriceForHour(args: { room: RoomMetadata; hour?: number; dateIso?: string }): number | undefined {
  const { room, hour, dateIso } = args;
  if (typeof hour !== 'number') return undefined;

  // 1) 시간대별(price band) 우선
  if (Array.isArray(room.timeBandPricing) && room.timeBandPricing.length > 0) {
    const band = room.timeBandPricing.find((b) => hour >= b.startHour && hour < b.endHour);
    if (band) return band.pricePerHour;
  }

  // 2) 주말 가격 적용
  if (isWeekend(dateIso) && typeof room.weekendPricePerHour === 'number') {
    return room.weekendPricePerHour;
  }

  // 3) 기본 단가
  return room.pricePerHour;
}

function sumHourlyBase(args: { room: RoomMetadata; hourSlots: string[]; dateIso?: string }): number {
  const { room, hourSlots, dateIso } = args;
  if (!Array.isArray(hourSlots) || hourSlots.length === 0) return 0;
  let total = 0;
  for (const slot of hourSlots) {
    const hour = parseInt(slot.split(':')[0], 10);
    const unit = getUnitPriceForHour({ room, hour, dateIso }) ?? room.pricePerHour;
    total += unit;
  }
  return total;
}
