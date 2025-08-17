import { postJson } from './apiClient';

export interface AvailabilityRoomReqItem {
  name: string;
  branch: string;
  business_id: string;
  biz_item_id: string;
}

export interface AvailabilityRequest {
  date: string; // YYYY-MM-DD
  hour_slots: string[]; // ["19:00","20:00"]
  rooms: AvailabilityRoomReqItem[];
}

export type SlotAvailability = boolean | 'unknown';

export interface AvailabilityResultItem {
  name: string;
  branch: string;
  business_id: string;
  biz_item_id: string;
  available: SlotAvailability;
  available_slots: Record<string, SlotAvailability>;
}

export interface AvailabilityResponse {
  date: string;
  hour_slots: string[];
  results: AvailabilityResultItem[];
  available_biz_item_ids: string[];
}

export const postRoomAvailability = async (
  payload: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  return postJson<AvailabilityRequest, AvailabilityResponse>(
    '/api/rooms/availability',
    payload
  );
};

// --- Frontend helper: 자정 경계 분할 처리 ---

const parseHour = (hhmm: string): number => {
  const [hh] = hhmm.split(':');
  return Number(hh);
};

const splitByMidnight = (date: string, hourSlots: string[]): { date: string; hour_slots: string[] }[] => {
  if (hourSlots.length <= 1) return [{ date, hour_slots: hourSlots }];
  let splitIndex = -1;
  for (let i = 1; i < hourSlots.length; i += 1) {
    const prevH = parseHour(hourSlots[i - 1]);
    const curH = parseHour(hourSlots[i]);
    if (curH < prevH) {
      splitIndex = i;
      break;
    }
  }
  if (splitIndex === -1) return [{ date, hour_slots: hourSlots }];

  const base = new Date(date + 'T00:00:00');
  const next = new Date(base);
  next.setDate(base.getDate() + 1);
  const nextDateIso = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;

  return [
    { date, hour_slots: hourSlots.slice(0, splitIndex) },
    { date: nextDateIso, hour_slots: hourSlots.slice(splitIndex) },
  ];
};

export const postRoomAvailabilitySmart = async (
  payload: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  const parts = splitByMidnight(payload.date, payload.hour_slots);
  if (parts.length === 1) {
    return postRoomAvailability(payload);
  }

  // 두 파트 병렬 호출
  const [resp1, resp2] = await Promise.all([
    postRoomAvailability({ ...payload, date: parts[0].date, hour_slots: parts[0].hour_slots }),
    postRoomAvailability({ ...payload, date: parts[1].date, hour_slots: parts[1].hour_slots }),
  ]);

  // 병합: available_biz_item_ids는 교집합, results는 같은 biz_item_id 기준으로 AND/'unknown' 우선 결합
  const availableSet1 = new Set<string>(resp1.available_biz_item_ids ?? []);
  const availableSet2 = new Set<string>(resp2.available_biz_item_ids ?? []);
  const availableIntersection: string[] = [...availableSet1].filter((id) => availableSet2.has(id));

  const byId = new Map<string, AvailabilityResultItem>();
  const take = (r: AvailabilityResultItem) => {
    byId.set(r.biz_item_id, { ...r, available_slots: { ...(r.available_slots || {}) } });
  };
  resp1.results?.forEach(take);
  resp2.results?.forEach((r) => {
    const prev = byId.get(r.biz_item_id);
    if (!prev) {
      take(r);
      return;
    }
    // available 결합: unknown 우선, 아니면 AND
    let mergedAvailable: SlotAvailability;
    if (prev.available === 'unknown' || r.available === 'unknown') mergedAvailable = 'unknown';
    else mergedAvailable = (prev.available && r.available) as boolean;
    byId.set(r.biz_item_id, {
      ...prev,
      available: mergedAvailable,
      available_slots: { ...(prev.available_slots || {}), ...(r.available_slots || {}) },
    });
  });

  return {
    date: payload.date,
    hour_slots: payload.hour_slots,
    results: Array.from(byId.values()),
    available_biz_item_ids: availableIntersection,
  };
};
