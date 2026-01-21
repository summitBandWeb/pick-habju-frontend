/**
 * API 에러 처리 유틸리티 함수들
 * 
 * 에러 객체에서 필요한 정보를 추출하고, 로깅하는 등의 공통 작업을 수행합니다.
 */

import { ApiError, type ApiErrorBody } from './api-error';
import { ERROR_MESSAGES } from '../constants/api-error-codes';

type Meta = Record<string, unknown>;

/**
 * extractApiError 반환 타입
 */
export interface ExtractedApiError {
  status: number;
  code: string;
  message: string;
  timestamp?: string;
  body?: ApiErrorBody;
  url?: string;
  method?: string;
}

/**
 * 에러 객체에서 API 에러 정보를 추출합니다.
 * 
 * @param err - 처리할 에러 객체
 * @returns 표준화된 에러 정보 객체
 * 
 * @example
 * try {
 *   await fetchRooms();
 * } catch (err) {
 *   const errorInfo = extractApiError(err);
 *   console.log(errorInfo.code); // "Room-002"
 *   console.log(errorInfo.message); // "RoomKey가 존재하지 않습니다."
 * }
 */

export const extractApiError = (err: unknown): ExtractedApiError => {
  const e = err as ApiError;
  
  return {
    // 백엔드 응답 필드
    status: e?.body?.status ?? e?.status ?? 0,
    code: e?.body?.errorCode ?? e?.code ?? 'UNKNOWN',
    message: e?.body?.message ?? e?.message ?? 'Unknown error',
    timestamp: e?.body?.timestamp,
    
    // 디버깅/로깅 정보 ( 프론트에서 추가 )
    body: e?.body,      // 원본 응답 전체
    url: e?.url,        // API 엔드포인트
    method: e?.method,  // HTTP 메서드
  };
};

/**
 * API 에러를 콘솔에 로깅합니다.
 * 
 * @param err - 로깅할 에러 객체
 * @param meta - 추가로 로깅할 메타데이터
 * 
 * @example
 * try {
 *   await updateReservation(data);
 * } catch (err) {
 *   logApiError(err, { userId: '123', action: 'update_reservation' });
 * }
 */

// 이후 Sentry 등 외부 에러 추적 도구와 연동 시 사용
export const logApiError = (err: unknown, meta?: Meta) => {
  const data = extractApiError(err);
  console.error('[API ERROR]', { ...data, ...meta });
};


/* 추후 에러 코드 관련하여 Toast 작업이 필요할 경우 그대로 사용하시면 됩니다. */

/**
 * 에러 코드에 해당하는 한글 메시지를 가져오기
 */
const getErrorMessage = (code: string): string => {
  return ERROR_MESSAGES[code] ?? '알 수 없는 오류가 발생했습니다.';
};

/**
 * 에러 객체에서 사용자에게 표시할 메시지를 가져옵니다.
 * 서버 메시지가 있으면 그것을 사용하고, 없으면 에러 코드 기반 메시지를 반환합니다.
 * 
 * @param err - 에러 객체
 * @returns 사용자에게 표시할 메시지
 * 
 * @example
 * try {
 *   await bookRoom(roomId);
 * } catch (err) {
 *   const userMessage = getUserFriendlyMessage(err);
 *   showToast(userMessage);
 * }
 */

export const getUserFriendlyMessage = (err: unknown): string => {
  const { code, message } = extractApiError(err);
  
  if (message && message !== 'Unknown error') {
    return message;
  }
  
  return getErrorMessage(code);
};
