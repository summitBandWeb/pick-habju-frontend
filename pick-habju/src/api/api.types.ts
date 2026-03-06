// 1. 기본 응답 구조 (Generic Wrapper)
export interface BaseResponse<T> {
  isSuccess: boolean;
  code: string;
  message: string;
  result: T;
}

// 2. 정책 경고 타입
export type PolicyWarningType = 'call_required_today' | 'call_required_1h' | 'chat_required_1h';

export interface PolicyWarning {
  type: PolicyWarningType;
  message: string;
}

// 3. 룸 상세 정보
export interface RoomDetail {
  biz_item_id: string;
  name: string;
  price_per_hour: number;
  available: boolean;
  // 시간대별 가능 여부 (예: "14:00": true)
  available_slots: Record<string, boolean>;
  estimated_price: number;
  image_urls: string[];
  max_capacity: number;
  recommend_capacity: number;
  recommend_capacity_range: [number, number]; // 튜플 타입으로 정의
  base_capacity: number | null;
  extra_charge: number | null;
  min_capacity: number;
  min_hours: number;
  max_hours: number | null;
  standby_days: number | null;
  policy_warnings: PolicyWarning[];
}

// 4. 지점 정보 (branches 배열의 아이템)
export interface Branch {
  business_id: string;
  branch: string;
  lat: number;
  lng: number;
  min_price_available: number;
  min_price_partial: number;
  available_count: number;
  phone_number: string | null;
  display_name: string | null;
  rooms: RoomDetail[];
}

// 5. 메인 결과 데이터 (result)
export interface BookingSearchResult {
  date: string;
  start_hour: string;
  end_hour: string;
  hour_slots: string[];
  available_biz_item_ids: string[];
  branches: Branch[];
}

// 6. 최종 API 응답 타입
export type BookingAPIResponse = BaseResponse<BookingSearchResult>;
