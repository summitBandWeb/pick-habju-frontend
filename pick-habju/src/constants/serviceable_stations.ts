export const SERVICEABLE_STATION_IDS = ['isu', 'sangdo', 'sadang', 'heukseok', 'hongdae', 'hapjeong'] as const;

export type ServiceableStationId = (typeof SERVICEABLE_STATION_IDS)[number];

export interface StationCenter {
  lat: number;
  lng: number;
}

export interface StationBounds {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
}

export interface ServiceableStation {
  id: ServiceableStationId;
  name: string;
  subwayLine: string;
  center: StationCenter;
  bounds: StationBounds;
}

/** 서비스 가능 역 목록 (한 곳에서 id·이름·노선·좌표 정의) */
const SERVICEABLE_STATIONS: ServiceableStation[] = [
  {
    id: 'isu',
    name: '이수',
    subwayLine: '4호선·7호선',
    center: { lat: 37.485196, lng: 126.981605 },
    bounds: { swLat: 37.4845, swLng: 126.9798, neLat: 37.4885, neLng: 126.9838 },
  },
  {
    id: 'sangdo',
    name: '상도',
    subwayLine: '7호선',
    center: { lat: 37.502790, lng: 126.947949 },
    bounds: { swLat: 37.500790, swLng: 126.945949, neLat: 37.504790, neLng: 126.949949 },
  },
  {
    id: 'sadang',
    name: '사당',
    subwayLine: '2호선·4호선',
    center: { lat: 37.476550, lng: 126.981688 },
    bounds: { swLat: 37.47, swLng: 126.974, neLat: 37.483, neLng: 126.989 },
  },
  {
    id: 'heukseok',
    name: '흑석',
    subwayLine: '9호선',
    center: { lat: 37.50877, lng: 126.963708 },
    bounds: { swLat: 37.5068, swLng: 126.9616, neLat: 37.5108, neLng: 126.9656 },
  },
  {
    id: 'hongdae',
    name: '홍대입구',
    subwayLine: '2호선·공항철도·경의중앙선',
    center: { lat: 37.556748, lng: 126.923643 },
    bounds: { swLat: 37.554748, swLng: 126.921643, neLat: 37.558748, neLng: 126.925643 },
  },
  {
    id: 'hapjeong',
    name: '합정',
    subwayLine: '2호선·6호선',
    center: { lat: 37.549529, lng: 126.914051 },
    bounds: { swLat: 37.547529, swLng: 126.912052, neLat: 37.551529, neLng: 126.916051 },
  },
];

export const getServiceableStations = (): ServiceableStation[] => SERVICEABLE_STATIONS;
