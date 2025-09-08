import type { RoomMetadata } from '../types/RoomMetadata';
import {
  ONE_HOUR_CALL_REQUIRED_BUSINESS_IDS,
  SAME_DAY_CALL_REQUIRED_BUSINESS_IDS,
  ONE_HOUR_CHAT_REQUIRED_BUSINESS_IDS,
  BUSINESS_PHONE_NUMBERS,
  BUSINESS_DISPLAY_NAMES
} from '../constants/data';

export type ModalType = 'book' | 'partial' | 'oneHourCall' | 'oneHourChat' | 'sameDayCall';

export interface ModalFlowDecision {
  modalType: ModalType;
  studioName?: string;
  phoneNumber?: string;
}

/**
 * 예약 버튼 클릭 시 어떤 모달을 띄울지 결정
 * 우선순위: 1시간 + 해당 합주실 > 당일 + 해당 합주실 > 일반 예약
 */
export function decideBookModalFlow(args: {
  room: RoomMetadata;
  dateIso: string;
  hourSlots: string[];
}): ModalFlowDecision {
  const { room, dateIso, hourSlots } = args;
  const isOneHour = hourSlots.length === 1;
  const isToday = isDateToday(dateIso);

  // 1시간 예약 + 해당 합주실이면 1) 채팅 > 2) 전화 모달 (우선순위)
  if (isOneHour && ONE_HOUR_CHAT_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'oneHourChat',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }
  if (isOneHour && ONE_HOUR_CALL_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'oneHourCall',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }

  // 당일 예약 + 해당 합주실이면 당일 전화 모달
  if (isToday && SAME_DAY_CALL_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'sameDayCall',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }

  // 그 외에는 일반 예약
  return { modalType: 'book' };
}

/**
 * 부분 예약 확인 후 어떤 모달을 띄울지 결정
 */
export function decidePartialToNextModalFlow(args: {
  room: RoomMetadata;
  dateIso: string;
  recommendedHourSlots: string[];
}): ModalFlowDecision {
  const { room, dateIso, recommendedHourSlots } = args;
  const isOneHour = recommendedHourSlots.length === 1;
  const isToday = isDateToday(dateIso);

  // 추천된 시간이 1시간 + 해당 합주실이면 1) 채팅 > 2) 전화 모달
  if (isOneHour && ONE_HOUR_CHAT_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'oneHourChat',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }
  if (isOneHour && ONE_HOUR_CALL_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'oneHourCall',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }

  // 당일 + 해당 합주실이면 당일 전화 모달
  if (isToday && SAME_DAY_CALL_REQUIRED_BUSINESS_IDS.includes(room.businessId)) {
    return {
      modalType: 'sameDayCall',
      studioName: BUSINESS_DISPLAY_NAMES[room.businessId] || room.branch,
      phoneNumber: BUSINESS_PHONE_NUMBERS[room.businessId] || '',
    };
  }

  // 그 외에는 일반 예약
  return { modalType: 'book' };
}

function isDateToday(dateIso: string): boolean {
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return dateIso === todayIso;
}
