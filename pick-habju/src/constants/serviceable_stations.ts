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
    bounds: { swLat: 37.465196, swLng: 126.956605, neLat: 37.505196, neLng: 127.006605 },
  },
  {
    id: 'sadang',
    name: '사당',
    subwayLine: '2호선·4호선',
    center: { lat: 37.476550, lng: 126.981688 },
    bounds: { swLat: 37.456550, swLng: 126.956688, neLat: 37.496550, neLng: 127.006688 },
  },
  {
    id: 'hongdae',
    name: '홍대입구',
    subwayLine: '2호선·공항철도·경의중앙선',
    center: { lat: 37.556748, lng: 126.923643 },
    bounds: { swLat: 37.536748, swLng: 126.898643, neLat: 37.576748, neLng: 126.948643 },
  },
  {
    id: 'sinchon',
    name: '신촌',
    subwayLine: '2호선',
    center: { lat: 37.555153, lng: 126.936890 },
    bounds: { swLat: 37.535153, swLng: 126.911890, neLat: 37.575153, neLng: 126.961890 },
  },
];

export const getServiceableStations = (): readonly ServiceableStation[] => SERVICEABLE_STATIONS;
