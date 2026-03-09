import type { MapCenter, MapBounds } from '../types/map';

export const SERVICEABLE_STATION_IDS = [
  'sadang',
  'sangdo',
  'sinchon',
  'isu',
  'hapjeong',
  'hongdae',
  'heukseok',
] as const;

export const DEFAULT_SERVICEABLE_STATION_ID = 'sadang' as const satisfies ServiceableStationId;

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
    id: 'sadang',
    name: '사당',
    subwayLine: '2호선·4호선',
    center: { lat: 37.47655, lng: 126.981688 },
    bounds: { swLat: 37.47155, swLng: 126.975688, neLat: 37.48155, neLng: 126.987688 },
  },
  {
    id: 'sangdo',
    name: '상도',
    subwayLine: '7호선',
    center: { lat: 37.5028, lng: 126.9479 },
    bounds: { swLat: 37.4978, swLng: 126.9419, neLat: 37.5078, neLng: 126.9539 },
  },
  {
    id: 'sinchon',
    name: '신촌',
    subwayLine: '2호선',
    center: { lat: 37.555153, lng: 126.93689 },
    bounds: { swLat: 37.550153, swLng: 126.93089, neLat: 37.560153, neLng: 126.94289 },
  },
  {
    id: 'isu',
    name: '이수',
    subwayLine: '4호선·7호선',
    center: { lat: 37.485196, lng: 126.981605 },
    bounds: { swLat: 37.480196, swLng: 126.975605, neLat: 37.490196, neLng: 126.987605 },
  },
  {
    id: 'hapjeong',
    name: '합정',
    subwayLine: '2호선·6호선',
    center: { lat: 37.549637, lng: 126.914667 },
    bounds: { swLat: 37.544637, swLng: 126.908667, neLat: 37.554637, neLng: 126.920667 },
  },
  {
    id: 'hongdae',
    name: '홍대입구',
    subwayLine: '2호선·공항철도·경의중앙선',
    center: { lat: 37.556748, lng: 126.923643 },
    bounds: { swLat: 37.551748, swLng: 126.917643, neLat: 37.561748, neLng: 126.929643 },
  },
  {
    id: 'heukseok',
    name: '흑석',
    subwayLine: '9호선',
    center: { lat: 37.508117, lng: 126.964945 },
    bounds: { swLat: 37.503117, swLng: 126.958945, neLat: 37.513117, neLng: 126.970945 },
  },
];

export const getServiceableStations = (): readonly ServiceableStation[] => SERVICEABLE_STATIONS;
