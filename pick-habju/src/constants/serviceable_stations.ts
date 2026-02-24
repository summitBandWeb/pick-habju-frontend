import type { MapCenter, MapBounds } from '../types/map';

export const SERVICEABLE_STATION_IDS = ['isu', 'sadang', 'hongdae', 'sinchon'] as const;

export type ServiceableStationId = (typeof SERVICEABLE_STATION_IDS)[number];

export interface ServiceableStation {
  id: ServiceableStationId;
  name: string;
  subwayLine: string;
  center: MapCenter;
  bounds: MapBounds;
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
    id: 'sadang',
    name: '사당',
    subwayLine: '2호선·4호선',
    center: { lat: 37.476550, lng: 126.981688 },
    bounds: { swLat: 37.470000, swLng: 126.974000, neLat: 37.483000, neLng: 126.989000 },
  },
  {
    id: 'hongdae',
    name: '홍대입구',
    subwayLine: '2호선·공항철도·경의중앙선',
    center: { lat: 37.556748, lng: 126.923643 },
    bounds: { swLat: 37.554748, swLng: 126.921643, neLat: 37.558748, neLng: 126.925643 },
  },
  {
    id: 'sinchon',
    name: '신촌',
    subwayLine: '2호선',
    center: { lat: 37.555153, lng: 126.936890 },
    bounds: { swLat: 37.553153, swLng: 126.934890, neLat: 37.557153, neLng: 126.938890 },
  },
];

export const getServiceableStations = (): readonly ServiceableStation[] => SERVICEABLE_STATIONS;
