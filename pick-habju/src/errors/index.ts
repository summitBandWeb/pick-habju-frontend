/**
 * 에러 관련 모듈 통합 export
 * 이 파일을 통해 에러 처리 관련 모든 유틸리티를 한 곳에서 import할 수 있습니다.
 * 
 * @example
 * import { 
 *   ApiError, 
 *   extractApiError, 
 *   isApiError,
 *   isRoomError 
 * } from '@/errors';
 */

export { ApiError } from './api-error';
export type { ApiErrorBody } from './api-error';

// 에러 유틸리티 함수들
export {
  extractApiError,
  logApiError,
  getUserFriendlyMessage,
} from './api-error-utils';

export type { ExtractedApiError } from './api-error-utils';

// 에러 가드 함수들
export {
  isApiErrorLike,
  isApiError,
  isDateError,
  isPastDateError,
  isHourError,
  isRoomError,
  isRoomKeyNotFound,
  isGrooveError,
  isNaverError,
  isDreamError,
  isExternalApiError,
} from './guard-utils';

export type { ApiErrorLike } from './guard-utils';
