import { http, HttpResponse, delay } from 'msw';
import type { BookingAPIResponse, Branch, RoomDetail } from '../api/api.types';

type ScenarioKey =
  | 'all-available'
  | 'partial-available'
  | 'none-available'
  | 'recommend'
  | 'slow'
  | 'error-500';

// ─────────────────────────────────────────────
// Mock 전용 정적 데이터 (Swagger 실제 응답 기반)
// 새 지점/룸 추가 시 이 배열에 항목을 추가하세요.
// ─────────────────────────────────────────────
type MockRoomBase = Omit<RoomDetail, 'available' | 'available_slots'>;
type MockBranchBase = Omit<Branch, 'rooms' | 'min_price_available' | 'min_price_partial' | 'available_count'> & {
  rooms: MockRoomBase[];
};

const MOCK_BRANCHES: MockBranchBase[] = [
  {
    business_id: '1482133',
    branch: '라디오가가합주실 신촌점',
    lat: 37.5551826,
    lng: 126.9347174,
    phone_number: '010-2780-3517',
    display_name: '라디오가가합주실 신촌점',
    rooms: [
      {
        biz_item_id: '6999756',
        name: 'S룸',
        price_per_hour: 20000,
        estimated_price: 40000,
        image_urls: ['https://naverbooking-phinf.pstatic.net/20250818_51/1755494635360DUeGK_JPEG/s.jpg'],
        max_capacity: 11,
        recommend_capacity: 7,
        recommend_capacity_range: [7, 9],
        base_capacity: null,
        extra_charge: null,
        min_capacity: 1,
        min_hours: 1,
        max_hours: null,
        policy_warnings: [],
      },
    ],
  },
];

// ─────────────────────────────────────────────

const getScenario = (req: Request): ScenarioKey | null => {
  const url = new URL(req.url);
  const header = req.headers.get('x-msw-scenario') as ScenarioKey | null;
  const qp = url.searchParams.get('scenario') as ScenarioKey | null;
  return header ?? qp;
};

/** "19:00" ~ "22:00" → ["19:00", "20:00", "21:00"] */
const generateHourSlots = (startHour: string, endHour: string): string[] => {
  const slots: string[] = [];
  let h = parseInt(startHour.split(':')[0], 10);
  const end = parseInt(endHour.split(':')[0], 10);
  while (h < end) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    h += 1;
  }
  return slots;
};

const buildBranches = (
  getAvailability: (roomIdx: number) => { available: boolean; slots: Record<string, boolean> },
): Branch[] => {
  let roomIdx = 0;
  return MOCK_BRANCHES.map((branch) => {
    const rooms: RoomDetail[] = branch.rooms.map((room) => {
      const { available, slots } = getAvailability(roomIdx);
      roomIdx += 1;
      return { ...room, available, available_slots: slots };
    });

    const availableRooms = rooms.filter((r) => r.available);
    const partialRooms = rooms.filter(
      (r) => !r.available && Object.values(r.available_slots).some(Boolean),
    );

    return {
      ...branch,
      rooms,
      min_price_available: availableRooms.length
        ? Math.min(...availableRooms.map((r) => r.estimated_price))
        : null,
      min_price_partial: partialRooms.length
        ? Math.min(...partialRooms.map((r) => r.estimated_price))
        : null,
      available_count: availableRooms.length,
    };
  });
};

export const handlers = [
  http.get('*/api/rooms/availability/', async ({ request }) => {
    const scenario = getScenario(request);

    // 시나리오 없으면 실제 API로 프록시
    if (!scenario) return fetch(request);

    if (scenario === 'slow') await delay(1500);

    const url = new URL(request.url);
    const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
    const startHour = url.searchParams.get('start_hour') ?? '19:00';
    const endHour = url.searchParams.get('end_hour') ?? '22:00';
    const hourSlots = generateHourSlots(startHour, endHour);

    if (scenario === 'error-500') {
      return HttpResponse.json({ message: 'Mocked server error' }, { status: 500 });
    }

    let branches: Branch[];
    let availableIds: string[];

    switch (scenario) {
      case 'all-available': {
        branches = buildBranches(() => ({
          available: true,
          slots: Object.fromEntries(hourSlots.map((h) => [h, true])),
        }));
        availableIds = MOCK_BRANCHES.flatMap((b) => b.rooms.map((r) => r.biz_item_id));
        break;
      }

      case 'none-available': {
        branches = buildBranches(() => ({
          available: false,
          slots: Object.fromEntries(hourSlots.map((h) => [h, false])),
        }));
        availableIds = [];
        break;
      }

      case 'recommend': {
        // 전체 불가지만 일부 슬롯은 가능 → PARTIAL 카드 표시
        branches = buildBranches((idx) => ({
          available: false,
          slots: Object.fromEntries(hourSlots.map((h, i) => [h, idx % 2 === 0 ? i < 2 : i === 0])),
        }));
        availableIds = [];
        break;
      }

      case 'partial-available':
      default: {
        // 1/3 전체 가능, 1/3 일부 가능, 1/3 불가
        branches = buildBranches((idx) => {
          if (idx % 3 === 0) {
            return { available: true, slots: Object.fromEntries(hourSlots.map((h) => [h, true])) };
          }
          if (idx % 3 === 1) {
            return { available: false, slots: Object.fromEntries(hourSlots.map((h, i) => [h, i < 2])) };
          }
          return { available: false, slots: Object.fromEntries(hourSlots.map((h) => [h, false])) };
        });
        availableIds = MOCK_BRANCHES.flatMap((b) =>
          b.rooms.filter((_, idx) => idx % 3 === 0).map((r) => r.biz_item_id),
        );
        break;
      }
    }

    const response: BookingAPIResponse = {
      isSuccess: true,
      code: 'COMMON200',
      message: '성공입니다.',
      result: {
        date,
        start_hour: startHour,
        end_hour: endHour,
        hour_slots: hourSlots,
        available_biz_item_ids: availableIds,
        branches,
      },
    };

    return HttpResponse.json(response);
  }),
];
