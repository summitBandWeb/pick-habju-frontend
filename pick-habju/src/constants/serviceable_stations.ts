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
    bounds: { swLat: 37.480196, swLng: 126.975605, neLat: 37.490196, neLng: 126.987605 },
  },
  {
    id: 'sadang',
    name: '사당',
    subwayLine: '2호선·4호선',
    center: { lat: 37.476550, lng: 126.981688 },
    bounds: { swLat: 37.471550, swLng: 126.975688, neLat: 37.481550, neLng: 126.987688 },
  },
  {
    id: 'hongdae',
    name: '홍대입구',
    subwayLine: '2호선·공항철도·경의중앙선',
    center: { lat: 37.556748, lng: 126.923643 },
    bounds: { swLat: 37.551748, swLng: 126.917643, neLat: 37.561748, neLng: 126.929643 },
  },
  {
    id: 'sinchon',
    name: '신촌',
    subwayLine: '2호선',
    center: { lat: 37.555153, lng: 126.936890 },
    bounds: { swLat: 37.550153, swLng: 126.930890, neLat: 37.560153, neLng: 126.942890 },
  },
];

export const getServiceableStations = (): readonly ServiceableStation[] => SERVICEABLE_STATIONS;
