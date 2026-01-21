/**
 * 공통 에러 객체 클래스
 *
 * 모든 API 호출에서 에러를 통일된 형태로 다루기 위한 클래스
 * 백엔드에서 반환하는 에러 응답 형식 (timestamp, status, errorCode, message)을 처리합니다.
 */

/**
 * API 에러 응답 본문 구조
 * 
 * @example
 * {
 *   "timestamp": "2024-01-20T01:23:45",
 *   "status": 422,
 *   "errorCode": "Date-001",
 *   "message": "날짜 형식이 맞지 않습니다."
 * }
 */

export interface ApiErrorBody {
  timestamp?: string;
  status: number;
  errorCode: string;
  message: string;
}

export class ApiError<T extends ApiErrorBody = ApiErrorBody> extends Error {
  status: number; // HTTP 상태 코드
  body?: T; // 백엔드 에러 응답 본문
  code?: string; // 백엔드 에러 코드
  rawText?: string; // 파싱되지 않은 원본 응답 텍스트
  url?: string; // 에러가 발생한 API URL
  method?: string; // HTTP 메서드 (GET, POST, PUT, DELETE 등)

  constructor(opts: {
    status: number;
    message: string;
    code?: string;
    body?: T;
    rawText?: string;
    url?: string;
    method?: string;
  }) {
    super(opts.message);
    
    Object.setPrototypeOf(this, new.target.prototype);
    
    this.name = 'ApiError';
    this.status = opts.status;
    this.code = opts.code;
    this.body = opts.body;
    this.rawText = opts.rawText;
    this.url = opts.url;
    this.method = opts.method;
  }

  /**
   * JSON 직렬화를 위한 메서드
   * 로깅 및 디버깅 시 유용합니다.
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      url: this.url,
      method: this.method,
      body: this.body,
      rawText: this.rawText,
    };
  }
}
