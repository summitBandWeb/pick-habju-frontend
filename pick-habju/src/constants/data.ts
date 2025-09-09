import type { RoomMetadata } from '../types/RoomMetadata';

const ROOMS_RAW: RoomMetadata[] = [
  {
    name: '블랙룸',
    branch: '비쥬합주실 1호점',
    businessId: '522011', // 합주실 id
    bizItemId: '3968885', // 룸 id
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu1/bizu1-black-1.webp',
      '/pick-habju/public/images/habjusil/bizu1/bizu1-black-2.webp',
    ],
    maxCapacity: 15,
    recommendCapacity: 11,
    pricePerHour: 22000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: '화이트룸',
    branch: '비쥬합주실 1호점',
    businessId: '522011',
    bizItemId: '3968896',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu1/bizu1-white-1.webp',
      '/pick-habju/public/images/habjusil/bizu1/bizu1-white-2.webp',
      '/pick-habju/public/images/habjusil/bizu1/bizu1-white-3.webp',
    ],
    maxCapacity: 6,
    recommendCapacity: 5,
    pricePerHour: 17000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'A룸',
    branch: '비쥬합주실 2호점',
    businessId: '706924',
    bizItemId: '4450044',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu2/bizu2-ab-1.webp',
      '/pick-habju/public/images/habjusil/bizu2/bizu2-ab-2.webp',
    ],
    maxCapacity: 20,
    recommendCapacity: 11,
    pricePerHour: 23000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'B룸',
    branch: '비쥬합주실 2호점',
    businessId: '706924',
    bizItemId: '4450073',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu2/bizu2-ab-1.webp',
      '/pick-habju/public/images/habjusil/bizu2/bizu2-ab-2.webp',
    ],
    maxCapacity: 20,
    recommendCapacity: 11,
    pricePerHour: 23000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'Jazz',
    branch: '비쥬합주실 3호점',
    businessId: '917236',
    bizItemId: '5098028',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-1.webp',
      '/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-2.webp',
      '/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-3.webp',
    ],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 25000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'Modern',
    branch: '비쥬합주실 3호점',
    businessId: '917236',
    bizItemId: '5098033',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu3/bizu3-modern-1.webp',
      '/pick-habju/public/images/habjusil/bizu3/bizu3-modern-2.webp',
    ],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 25000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'Classic',
    branch: '비쥬합주실 3호점',
    businessId: '917236',
    bizItemId: '5098039',
    imageUrls: [
      '/pick-habju/public/images/habjusil/bizu3/bizu3-classic-1.webp',
      '/pick-habju/public/images/habjusil/bizu3/bizu3-classic-2.webp',
    ],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 26000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 7분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'R룸',
    branch: '준사운드',
    businessId: '1384809',
    bizItemId: '6649826',
    imageUrls: [
      '/pick-habju/public/images/habjusil/junsound/junsound-r-1.webp',
      '/pick-habju/public/images/habjusil/junsound/junsound-r-2.webp',
    ],
    maxCapacity: 8,
    recommendCapacity: 7,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 18000,
    subway: {
      station: '상도역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true,
  },
  {
    name: 'S룸',
    branch: '준사운드',
    businessId: '1384809',
    bizItemId: '6649835',
    imageUrls: ['/pick-habju/public/images/habjusil/junsound/junsound-s-1.webp'],
    maxCapacity: 13,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 21000,
    subway: {
      station: '상도역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true,
  },
  {
    name: 'A룸',
    branch: '준사운드',
    businessId: '1384809',
    bizItemId: '6649859',
    imageUrls: ['/pick-habju/public/images/habjusil/junsound/junsound-a-1.webp'],
    maxCapacity: 15,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 22000,
    subway: {
      station: '상도역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true,
  },
  {
    name: 'B룸',
    branch: '준사운드',
    businessId: '1384809',
    bizItemId: '6677665',
    imageUrls: ['/pick-habju/public/images/habjusil/junsound/junsound-b-1.webp'],
    maxCapacity: 13,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 20000,
    subway: {
      station: '상도역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true,
  },
  {
    name: 'A룸',
    branch: '그루브 사당점',
    businessId: 'sadang',
    bizItemId: '13',
    imageUrls: ['/pick-habju/public/images/habjusil/groove/groove-a-1.webp'],
    maxCapacity: 17,
    recommendCapacity: 13,
    baseCapacity: 15,
    extraCharge: 1000,
    pricePerHour: 22000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'B룸',
    branch: '그루브 사당점',
    businessId: 'sadang',
    bizItemId: '14',
    imageUrls: ['/pick-habju/public/images/habjusil/groove/groove-b-1.webp'],
    maxCapacity: 16,
    recommendCapacity: 12,
    baseCapacity: 12,
    extraCharge: 1000,
    pricePerHour: 20000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'C룸',
    branch: '그루브 사당점',
    businessId: 'sadang',
    bizItemId: '15',
    imageUrls: ['/pick-habju/public/images/habjusil/groove/groove-c-1.webp'],
    maxCapacity: 10,
    recommendCapacity: 8,
    baseCapacity: 8,
    extraCharge: 1000,
    pricePerHour: 17000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'D룸',
    branch: '그루브 사당점',
    businessId: 'sadang',
    bizItemId: '16',
    imageUrls: ['/pick-habju/public/images/habjusil/groove/groove-d-1.webp'],
    maxCapacity: 8,
    recommendCapacity: 6,
    baseCapacity: 6,
    extraCharge: 1000,
    pricePerHour: 15000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'V룸',
    branch: '드림합주실 사당점',
    businessId: 'dream_sadang',
    bizItemId: '25',
    imageUrls: [
      '/pick-habju/public/images/habjusil/dream/dream-v-1.webp',
      '/pick-habju/public/images/habjusil/dream/dream-v-2.webp',
      '/pick-habju/public/images/habjusil/dream/dream-v-3.webp',
      '/pick-habju/public/images/habjusil/dream/dream-v-4.webp',
    ],
    maxCapacity: 30,
    recommendCapacity: 17,
    baseCapacity: 13,
    extraCharge: 1000,
    pricePerHour: 25000,
    subway: {
      station: '사당역',
      timeToWalk: '도보 6분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true,
  },
  {
    name: 'S룸',
    branch: '드림합주실 사당점',
    businessId: 'dream_sadang',
    bizItemId: '26',
    imageUrls: [
      '/pick-habju/public/images/habjusil/dream/dream-s-1.webp',
      '/pick-habju/public/images/habjusil/dream/dream-s-2.webp',
      '/pick-habju/public/images/habjusil/dream/dream-s-3.webp',
      '/pick-habju/public/images/habjusil/dream/dream-s-4.webp',
    ],
    maxCapacity: 25,
    recommendCapacity: 15,
    baseCapacity: 12,
    extraCharge: 1000,
    pricePerHour: 23000,
    subway: {
      station: '사당역',
      timeToWalk: '도보 6분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true,
  },
  {
    name: 'Q룸',
    branch: '드림합주실 사당점',
    businessId: 'dream_sadang',
    bizItemId: '27',
    imageUrls: [
      '/pick-habju/public/images/habjusil/dream/dream-q-1.webp',
      '/pick-habju/public/images/habjusil/dream/dream-q-2.webp',
      '/pick-habju/public/images/habjusil/dream/dream-q-3.webp',
      '/pick-habju/public/images/habjusil/dream/dream-q-4.webp',
    ],
    maxCapacity: 17,
    recommendCapacity: 13,
    baseCapacity: 10,
    extraCharge: 1000,
    pricePerHour: 21000,
    subway: {
      station: '사당역',
      timeToWalk: '도보 6분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true,
  },
  {
    name: 'C룸',
    branch: '드림합주실 사당점',
    businessId: 'dream_sadang',
    bizItemId: '28',
    imageUrls: [
      '/pick-habju/public/images/habjusil/dream/dream-c-1.webp',
      '/pick-habju/public/images/habjusil/dream/dream-c-2.webp',
      '/pick-habju/public/images/habjusil/dream/dream-c-3.webp',
      '/pick-habju/public/images/habjusil/dream/dream-c-4.webp',
    ],
    maxCapacity: 10,
    recommendCapacity: 9,
    baseCapacity: 8,
    extraCharge: 1000,
    pricePerHour: 17000,
    subway: {
      station: '사당역',
      timeToWalk: '도보 6분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true,
  },
  {
    name: 'D룸',
    branch: '드림합주실 사당점',
    businessId: 'dream_sadang',
    bizItemId: '29',
    imageUrls: [
      '/pick-habju/public/images/habjusil/dream/dream-d-1.webp',
      '/pick-habju/public/images/habjusil/dream/dream-d-2.webp',
      '/pick-habju/public/images/habjusil/dream/dream-d-3.webp',
      '/pick-habju/public/images/habjusil/dream/dream-d-4.webp',
    ],
    maxCapacity: 6,
    recommendCapacity: 5,
    baseCapacity: 5,
    extraCharge: 1000,
    pricePerHour: 12000,
    subway: {
      station: '사당역',
      timeToWalk: '도보 6분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true,
  },
  {
    name: 'L룸',
    branch: '스페이스개러지 중앙대점',
    businessId: '1042278',
    bizItemId: '5865609',
    imageUrls: [
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-l-1.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-l-2.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-l-3.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-l-4.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-l-5.webp',
    ],
    maxCapacity: 15,
    recommendCapacity: 14,
    pricePerHour: 20000,
    subway: {
      station: '흑석역',
      timeToWalk: '도보 2분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'R룸',
    branch: '스페이스개러지 중앙대점',
    businessId: '1042278',
    bizItemId: '5667365',
    imageUrls: [
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-r-1.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-r-2.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-r-3.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-r-4.webp',
    ],
    maxCapacity: 6,
    recommendCapacity: 4,
    pricePerHour: 15000,
    subway: {
      station: '흑석역',
      timeToWalk: '도보 2분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'X룸',
    branch: '스페이스개러지 중앙대점',
    businessId: '1042278',
    bizItemId: '6925753',
    imageUrls: [
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-x-1.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-x-2.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-x-3.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-x-4.webp',
      '/pick-habju/public/images/habjusil/spacegarage/spacegarage-x-5.webp',
    ],
    maxCapacity: 5,
    recommendCapacity: 3,
    pricePerHour: 13000,
    subway: {
      station: '흑석역',
      timeToWalk: '도보 2분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'A룸',
    branch: '사운딕트합주실',
    businessId: '1132767',
    bizItemId: '5836982',
    imageUrls: [
      '/pick-habju/public/images/habjusil/sounddict/sounddict-a-1.webp',
      '/pick-habju/public/images/habjusil/sounddict/sounddict-a-2.webp',
    ],
    maxCapacity: 8,
    recommendCapacity: 7,
    pricePerHour: 15000, // 주말에는 20000
    weekendPricePerHour: 20000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'B룸',
    branch: '사운딕트합주실',
    businessId: '1132767',
    bizItemId: '5850284',
    imageUrls: [
      '/pick-habju/public/images/habjusil/sounddict/sounddict-b-1.webp',
      '/pick-habju/public/images/habjusil/sounddict/sounddict-b-2.webp',
    ],
    maxCapacity: 8,
    recommendCapacity: 7,
    pricePerHour: 15000, // 주말에는 19000
    weekendPricePerHour: 19000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: 'C룸',
    branch: '사운딕트합주실',
    businessId: '1132767',
    bizItemId: '5836988',
    imageUrls: [
      '/pick-habju/public/images/habjusil/sounddict/sounddict-c-1.webp',
      '/pick-habju/public/images/habjusil/sounddict/sounddict-c-2.webp',
    ],
    maxCapacity: 8,
    recommendCapacity: 7,
    pricePerHour: 15000, // 주말에는 18000
    weekendPricePerHour: 18000,
    subway: {
      station: '이수역',
      timeToWalk: '도보 4분',
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false,
  },
  {
    name: '라운지룸',
    branch: '에이타입사운드 라운지점',
    businessId: '984268',
    bizItemId: '5326848',
    imageUrls: [
      '/pick-habju/public/images/habjusil/atype/atype-lounge-1.webp',
      '/pick-habju/public/images/habjusil/atype/atype-lounge-2.webp',
      '/pick-habju/public/images/habjusil/atype/atype-lounge-3.webp',
      '/pick-habju/public/images/habjusil/atype/atype-lounge-4.webp',
      '/pick-habju/public/images/habjusil/atype/atype-lounge-5.webp',
    ],
    maxCapacity: 12,
    recommendCapacity: 10,
    // 4인 초과 1인 1시간
    baseCapacity: 4,
    extraCharge: 1000,
    // 오전 0시~오전 8시: 10000
    // 오전 8시~오후 2시: 15000
    // 오후 2시~오전 0시: 18000
    // 시간대별 요금은 timeBandPricing으로 관리 (pricePerHour는 표시용/기본값)
    // pricePerHour(에이타입): 계산엔 관여하지 않고, 검색 전 카드 등에서 표시용 기본값(fallback)으로만 사용됩니다.
    pricePerHour: 18000,
    timeBandPricing: [
      { startHour: 0, endHour: 8, pricePerHour: 10000 },
      { startHour: 8, endHour: 14, pricePerHour: 15000 },
      { startHour: 14, endHour: 24, pricePerHour: 18000 },
    ],
    subway: {
      station: '이수역',
      timeToWalk: '도보 2분',
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: false,
  },
];

// 1시간 예약시 전화 필요한 합주실들
export const ONE_HOUR_CALL_REQUIRED_BUSINESS_IDS = [
  '1384809', // 준사운드
];

// 당일 예약시 전화 필요한 합주실들
export const SAME_DAY_CALL_REQUIRED_BUSINESS_IDS = [
  '1384809', // 준사운드
  'dream_sadang', // 드림합주실 사당점
];

// 1시간 예약시 '채팅문의' 필요한 합주실들
export const ONE_HOUR_CHAT_REQUIRED_BUSINESS_IDS = [
  '984268', // 에이타입사운드 라운지점
];

// 합주실별 전화번호
export const BUSINESS_PHONE_NUMBERS: Record<string, string> = {
  '522011': '070-4237-1004', // 비쥬합주실 1호점
  '706924': '070-4237-1004', // 비쥬합주실 2호점
  '917236': '070-4237-1004', // 비쥬합주실 3호점
  '1384809': '010-8476-7377', // 준사운드
  sadang: '010-6235-1423', // 그루브 사당점
  dream_sadang: '0507-1423-5054',
  // 스페이스 개러지 중앙대점
  '1042278': '0507-1423-8962',
  // 사운딕트합주실
  '1132767': '0507-1386-7235',
  // 에이타입사운드 라운지점
  '984268': '0507-1372-7845',
};

// 합주실별 대표명 (전화 안내용)
export const BUSINESS_DISPLAY_NAMES: Record<string, string> = {
  '522011': '비쥬합주실 1호점',
  '706924': '비쥬합주실 2호점',
  '917236': '비쥬합주실 3호점',
  '1384809': '준사운드',
  sadang: '그루브 사당점',
  dream_sadang: '드림합주실 사당점',
  '1042278': '스페이스 개러지 중앙대점',
  '1132767': '사운딕트합주실',
  '984268': '에이타입사운드 라운지점',
};

export const ROOMS: RoomMetadata[] = ROOMS_RAW.map((room) => ({
  ...room,
  imageUrls: room.imageUrls.map((src) => src.replace('/pick-habju/public', '')),
}));

// === 가격 정책 그룹 상수 (유지보수 편의) ===
// 1) 시간대별 요금이 적용되는 합주실(사업장) ID 목록
export const TIMEBAND_PRICING_BUSINESS_IDS: string[] = [
  '984268', // 에이타입사운드 라운지점
];

// 2) 주말 요금이 별도로 존재하는 합주실(사업장) ID 목록
export const WEEKEND_PRICING_BUSINESS_IDS: string[] = [
  '1132767', // 사운딕트합주실
];

// 합주실별(사업장 단위) unknown(오픈대기) 날짜 상수
// - 날짜는 'YYYY-MM-DD' 형식
// - ranges는 양끝 포함 범위
export type UnknownDateRange = { start: string; end: string };
export type UnknownDateRule = { dates?: string[]; ranges?: UnknownDateRange[] };

// business_id 기준 설정 (예: 'sadang', 'dream_sadang', '1384809', ...)
// 유지보수를 위해 기본값은 비워두고, 필요 시 각 키에 날짜를 추가하세요.
export const UNKNOWN_DATES_BY_BUSINESS_ID: Record<string, UnknownDateRule> = {};

// 특정 방(biz_item_id) 단위 설정이 필요한 경우 사용
// 주의: 방 단위 설정이 적용되면 해당 방이 속한 사업장 전체가 오픈대기로 처리됩니다.
export const UNKNOWN_DATES_BY_BIZ_ITEM_ID: Record<string, UnknownDateRule> = {};

// 현재 날짜 기준 X일 이후부터 오픈대기 처리(사업장 단위)
// 기준: 2025-08-17 기준으로 그루브 사당점은 11/9부터, 드림합주실 사당점은 12/16부터 오픈대기
// → 동적으로 매일 +1씩 밀리도록 임계일(일수)을 상수화
export const REOPEN_AFTER_DAYS_BY_BUSINESS_ID: Record<string, number> = {
  sadang: 84, // 8/17 → 11/09 (diffDays=84)부터 오픈대기
  dream_sadang: 121, // 8/17 → 12/16 (diffDays=121)부터 오픈대기
};
