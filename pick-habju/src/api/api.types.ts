// 1. 기본 응답 구조 (Generic Wrapper)
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 2. 룸 상세 정보 (room_detail)
export interface RoomDetail {
  name: string;
  branch: string;
  business_id: string;
  biz_item_id: string;
  image_urls: string[];
  max_capacity: number;
  recommend_capacity: number;
  base_capacity: number | null;
  extra_charge: number | null;
  lat: number;
  lng: number;
  price_per_hour: number;
  can_reserve_one_hour: boolean;
  requires_call_on_sameday: boolean;
}

// 3. 개별 룸 예약 가능 여부 (results 배열의 아이템)
export interface RoomAvailabilityResult {
  room_detail: RoomDetail;
  available: boolean;
  // 시간대별 가능 여부 (예: "13:00": true)
  available_slots: Record<string, boolean>;
}

// 4. 지점 요약 정보 (branch_summary 값)
export interface BranchSummaryInfo {
  min_price: number;
  available_count: number;
  lat: number;
  lng: number;
}

// 5. 메인 결과 데이터 (result)
export interface BookingSearchResult {
  date: string;
  start_hour: string;
  end_hour: string;
  hour_slots: string[];
  available_biz_item_ids: string[];
  results: RoomAvailabilityResult[];
  // Key가 business_id(string)인 동적 객체
  branch_summary: Record<string, BranchSummaryInfo>;
}

// 6. 최종 API 응답 타입
export type BookingAPIResponse = BaseResponse<BookingSearchResult>;
