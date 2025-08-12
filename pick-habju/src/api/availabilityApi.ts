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
