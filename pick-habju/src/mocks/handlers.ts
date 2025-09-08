import { http, HttpResponse, delay } from 'msw';
import type {
  AvailabilityRequest,
  AvailabilityResponse,
  AvailabilityResultItem,
  SlotAvailability,
} from '../api/availabilityApi';

type ScenarioKey =
  | 'all-available'
  | 'partial-available'
  | 'none-available'
  | 'unknown'
  | 'mixed-per-room'
  | 'recommend'
  | 'modal-flows'
  | 'onehour-sameday'
  | 'onehour-chat-atype'
  | 'weekend-sounddict'
  | 'slow'
  | 'error-500';

const getScenario = (req: Request): ScenarioKey | null => {
  const url = new URL(req.url);
  const header = req.headers.get('x-msw-scenario') as ScenarioKey | null;
  const qp = (url.searchParams.get('scenario') as ScenarioKey | null) ?? null;
  if (header) return header;
  if (qp) return qp;

  // Deterministic fallback by day
  const match = url.pathname.endsWith('/api/rooms/availability');
  if (match) {
    try {
      // Try body-based decision if date is present
      // Note: body can be read only once in native Request, so we avoid reading here.
      // Use day-of-month hash from query if provided as fallback.
      const dayStr = url.searchParams.get('d');
      if (dayStr) {
        const day = Number(dayStr);
        const idx = day % 7;
        return (
          [
            'all-available',
            'partial-available',
            'none-available',
            'unknown',
            'mixed-per-room',
            'recommend',
            'onehour-sameday',
          ][idx] as ScenarioKey
        );
      }
    } catch {
      // Fallback to partial-available
    }
  }

  // 기본값을 모의가 아닌 실제 API로 프록시하도록 null 반환
  return null;
};

const buildResults = (
  reqBody: AvailabilityRequest,
  perRoomAvailability: (roomIdx: number) => {
    available: SlotAvailability;
    slots: Record<string, SlotAvailability>;
  }
): AvailabilityResultItem[] => {
  return reqBody.rooms.map((room, idx) => {
    const { available, slots } = perRoomAvailability(idx);
    return {
      name: room.name,
      branch: room.branch,
      business_id: room.business_id,
      biz_item_id: room.biz_item_id,
      available,
      available_slots: slots,
    };
  });
};

export const handlers = [
  http.post('*/api/rooms/availability', async ({ request }) => {
    const scenario = getScenario(request);

    // 시나리오가 없으면 실제 API로 프록시 (Postman과 동일한 응답 확인용)
    if (!scenario) {
      return fetch(request);
    }

    // Simulate network slowness for specific scenario
    if (scenario === 'slow') {
      await delay(1500);
    }

    const body = (await request.json()) as AvailabilityRequest;

    if (scenario === 'error-500') {
      return HttpResponse.json(
        { message: 'Mocked server error' },
        { status: 500 }
      );
    }

    const hourSlots = body.hour_slots;

    let results: AvailabilityResultItem[] = [];
    let availableIds: string[] = [];

    switch (scenario) {
      case 'all-available': {
        results = buildResults(body, () => ({
          available: true,
          slots: Object.fromEntries(hourSlots.map((h) => [h, true])),
        }));
        availableIds = body.rooms.map((r) => r.biz_item_id);
        break;
      }

      case 'none-available': {
        results = buildResults(body, () => ({
          available: false,
          slots: Object.fromEntries(hourSlots.map((h) => [h, false])),
        }));
        availableIds = [];
        break;
      }

      case 'unknown': {
        results = buildResults(body, () => ({
          available: 'unknown',
          slots: Object.fromEntries(hourSlots.map((h) => [h, 'unknown'] as const)),
        }));
        availableIds = [];
        break;
      }

      case 'mixed-per-room': {
        results = buildResults(body, (idx) => {
          if (idx % 3 === 0) {
            return {
              available: true,
              slots: Object.fromEntries(hourSlots.map((h, i) => [h, i % 2 === 0])),
            };
          }
          if (idx % 3 === 1) {
            return {
              available: false,
              slots: Object.fromEntries(hourSlots.map((h, i) => [h, i % 3 === 0 ? 'unknown' : false])),
            };
          }
          return {
            available: 'unknown',
            slots: Object.fromEntries(hourSlots.map((h, i) => [h, i % 2 === 1 ? true : 'unknown'])),
          };
        });
        availableIds = results
          .filter((r) => r.available === true || Object.values(r.available_slots).some((v) => v === true))
          .map((r) => r.biz_item_id);
        break;
      }

      case 'recommend': {
        results = buildResults(body, (idx) => {
          if (idx % 2 === 0) {
            const slots: Record<string, SlotAvailability> = {};
            hourSlots.forEach((h, i) => {
              slots[h] = i < 2 ? true : false;
            });
            return { available: false, slots };
          }
          const slots: Record<string, SlotAvailability> = {};
          hourSlots.forEach((h, i) => {
            slots[h] = i === 0 ? true : false;
          });
          return { available: false, slots };
        });
        availableIds = [];
        break;
      }

      case 'modal-flows': {
        results = body.rooms.map((room, idx) => {
          const isJunsound = room.business_id === '1384809';
          const isDream = room.business_id === 'dream_sadang';

          if (isJunsound) {
            if (idx % 2 === 0) {
              const slots = Object.fromEntries(hourSlots.map((h) => [h, true] as const));
              return {
                name: room.name,
                branch: room.branch,
                business_id: room.business_id,
                biz_item_id: room.biz_item_id,
                available: true,
                available_slots: slots,
              } as AvailabilityResultItem;
            }
            const slots: Record<string, SlotAvailability> = {};
            hourSlots.forEach((h, i) => {
              slots[h] = i === 0 ? true : false;
            });
            return {
              name: room.name,
              branch: room.branch,
              business_id: room.business_id,
              biz_item_id: room.biz_item_id,
              available: false,
              available_slots: slots,
            } as AvailabilityResultItem;
          }

          if (isDream) {
            if (idx % 2 === 0) {
              const slots = Object.fromEntries(hourSlots.map((h) => [h, true] as const));
              return {
                name: room.name,
                branch: room.branch,
                business_id: room.business_id,
                biz_item_id: room.biz_item_id,
                available: true,
                available_slots: slots,
              } as AvailabilityResultItem;
            }
            const slots: Record<string, SlotAvailability> = {};
            hourSlots.forEach((h, i) => {
              slots[h] = i < 2 ? true : false;
            });
            return {
              name: room.name,
              branch: room.branch,
              business_id: room.business_id,
              biz_item_id: room.biz_item_id,
              available: false,
              available_slots: slots,
            } as AvailabilityResultItem;
          }

          const slots = Object.fromEntries(hourSlots.map((h) => [h, false] as const));
          return {
            name: room.name,
            branch: room.branch,
            business_id: room.business_id,
            biz_item_id: room.biz_item_id,
            available: false,
            available_slots: slots,
          } as AvailabilityResultItem;
        });
        availableIds = results
          .filter((r) => r.available === true)
          .map((r) => r.biz_item_id);
        break;
      }

      // 당일 + 1시간 재현에 최적화: 준사운드(1384809)만 사용 가능 처리
      // - 실제로는 사용자가 오늘 날짜 + 1개 슬롯 선택 시, 클릭 즉시 1시간 전화 모달이 우선 노출됩니다.
      case 'onehour-sameday': {
        results = body.rooms.map((room) => {
          const isJunsound = room.business_id === '1384809';
          const slots = Object.fromEntries(
            hourSlots.map((h) => [h, isJunsound ? (true as SlotAvailability) : (false as SlotAvailability)])
          );
          return {
            name: room.name,
            branch: room.branch,
            business_id: room.business_id,
            biz_item_id: room.biz_item_id,
            available: isJunsound ? (true as SlotAvailability) : (false as SlotAvailability),
            available_slots: slots,
          } as AvailabilityResultItem;
        });
        availableIds = results.filter((r) => r.business_id === '1384809' && r.available === true).map((r) => r.biz_item_id);
        break;
      }

      // 에이타입(984268) 1시간 가능 + 다른 합주실은 불가로 만들어 oneHourChat 모달 경로 재현
      case 'onehour-chat-atype': {
        results = body.rooms.map((room) => {
          const isAtype = room.business_id === '984268';
          const slots = Object.fromEntries(
            hourSlots.map((h) => [h, isAtype ? (true as SlotAvailability) : (false as SlotAvailability)])
          );

          return {
            name: room.name,
            branch: room.branch,
            business_id: room.business_id,
            biz_item_id: room.biz_item_id,
            available: isAtype ? (true as SlotAvailability) : (false as SlotAvailability),
            available_slots: slots,
          } as AvailabilityResultItem;
        });
        availableIds = results.filter((r) => r.business_id === '984268' && r.available === true).map((r) => r.biz_item_id);
        break;
      }

      // 사운딕트(1132767) 주말 시나리오 검증용. 모두 가능 처리하여 가격 표시만 확인
      case 'weekend-sounddict': {
        results = body.rooms.map((room) => {
          const isSounddict = room.business_id === '1132767';
          const slots = Object.fromEntries(hourSlots.map((h) => [h, isSounddict ? (true as SlotAvailability) : (false as SlotAvailability)]));
          return {
            name: room.name,
            branch: room.branch,
            business_id: room.business_id,
            biz_item_id: room.biz_item_id,
            available: isSounddict ? (true as SlotAvailability) : (false as SlotAvailability),
            available_slots: slots,
          } as AvailabilityResultItem;
        });
        availableIds = results.filter((r) => r.business_id === '1132767' && r.available === true).map((r) => r.biz_item_id);
        break;
      }

      case 'partial-available':
      default: {
        results = buildResults(body, () => ({
          available: true,
          slots: Object.fromEntries(
            hourSlots.map((h, i) => [h, i % 4 === 0 ? false : i % 3 === 0 ? 'unknown' : true])
          ),
        }));
        availableIds = results
          .filter((r) => Object.values(r.available_slots).some((v) => v === true))
          .map((r) => r.biz_item_id);
        break;
      }
    }

    const response: AvailabilityResponse = {
      date: body.date,
      hour_slots: hourSlots,
      results,
      available_biz_item_ids: availableIds,
    };

    return HttpResponse.json(response);
  }),
];
