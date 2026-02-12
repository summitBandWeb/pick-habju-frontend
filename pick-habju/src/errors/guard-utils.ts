/**
 * API 에러 타입 가드 함수들
 *
 * 에러 객체의 타입을 체크하고, 특정 에러 상황을 판별하는 함수들을 제공합니다.
 */

import { API_ERROR_CODES } from '../constants/api-error-codes';
import { ApiError } from './api-error';

/**
 * API 에러와 유사한 구조를 가진 객체의 타입
 */

export type ApiErrorLike = {
  status?: number;
  code?: string;
};

/**
 * 주어진 값이 ApiError와 유사한 구조를 가졌는지 확인합니다.
 *
 * @param e - 확인할 값
 * @returns ApiError 유사 객체 여부
 */
export const isApiErrorLike = (e: unknown): e is ApiErrorLike =>
  !!e && typeof e === 'object' && ('status' in e || 'code' in e);

/**
 * 주어진 값이 ApiError 인스턴스이거나 유사한 구조를 가졌는지 확인합니다.
 *
 * @param e - 확인할 값
 * @returns ApiError 여부
 *
 * @example
 * try {
 *   await fetchData();
 * } catch (err) {
 *   if (isApiError(err)) {
 *     console.log(err.status, err.code);
 *   }
 * }
 */
export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError || isApiErrorLike(e);

// 날짜 관련 에러인지 확인합니다.
export const isDateError = (e: unknown): boolean =>
  isApiError(e) &&
  (e.code === API_ERROR_CODES.DATE.INVALID_FORMAT || e.code === API_ERROR_CODES.DATE.PAST_DATE_NOT_ALLOWED);

// 과거 날짜 에러인지 확인합니다.
export const isPastDateError = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.DATE.PAST_DATE_NOT_ALLOWED;

// 시간 관련 에러인지 확인합니다.
export const isHourError = (e: unknown): boolean =>
  isApiError(e) &&
  (e.code === API_ERROR_CODES.HOUR.INVALID_FORMAT ||
    e.code === API_ERROR_CODES.HOUR.PAST_TIME_NOT_ALLOWED ||
    e.code === API_ERROR_CODES.HOUR.CONTINUOUS_TIME_REQUIRED);

// 방(Room) 관련 에러인지 확인합니다.
export const isRoomError = (e: unknown): boolean =>
  isApiError(e) &&
  (e.code === API_ERROR_CODES.ROOM.ROOM_KEY_MISSING ||
    e.code === API_ERROR_CODES.ROOM.ROOM_KEY_NOT_FOUND ||
    e.code === API_ERROR_CODES.ROOM.ROOMS_LIST_EMPTY);

// RoomKey가 존재하지 않는 에러인지 확인합니다.
export const isRoomKeyNotFound = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.ROOM.ROOM_KEY_NOT_FOUND;

// 요청이 너무 많은지 확인합니다.
export const isRateLimitError = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.RATELIMIT.TOO_MANY_REQUESTS;

// 입력값 검증 에러인지 확인합니다.
export const isValidationError = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.VALIDATION.INVALID_INPUT;

// DB 조회 실패 에러인지 확인합니다.
export const isDatabaseError = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.DATABASE.QUERY_FAILED;

// 응답 데이터 불일치 에러인지 확인합니다.
export const isResponseError = (e: unknown): boolean =>
  isApiError(e) && e.code === API_ERROR_CODES.RESPONSE.ID_LIST_MISMATCH;

// 크롤러 관련 에러인지 확인합니다.
export const isCrawlerError = (e: unknown): boolean =>
  isApiError(e) &&
  (e.code === API_ERROR_CODES.CRAWLER.UNKNOWN_ERROR ||
    e.code === API_ERROR_CODES.CRAWLER.SERVICE_ERROR ||
    e.code === API_ERROR_CODES.CRAWLER.BOT_BLOCKED ||
    e.code === API_ERROR_CODES.CRAWLER.TIMEOUT);

// 파서 관련 에러인지 확인합니다.
export const isParserError = (e: unknown): boolean =>
  isApiError(e) &&
  (e.code === API_ERROR_CODES.PARSER.PARSING_FAILED ||
    e.code === API_ERROR_CODES.PARSER.RESPONSE_TIMEOUT ||
    e.code === API_ERROR_CODES.PARSER.RESPONSE_PARSE_FAILED);

// 외부 API 호출 실패 에러인지 확인합니다.
export const isExternalApiError = (e: unknown): boolean =>
  isApiError(e) && (e.code === API_ERROR_CODES.API.EXTERNAL_API_FAILED || isCrawlerError(e) || isParserError(e));
