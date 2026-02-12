export const API_ERROR_CODES = {
  GENERIC: {
    UNKNOWN_ERROR: 'GENERIC-000',
  },
  COMMON: {
    INTERNAL_SERVER_ERROR: 'Common-001',
    UNDEFINED_ERROR: 'COMMON-002',
  },
  API: {
    EXTERNAL_API_FAILED: 'API-001',
  },
  RATELIMIT: {
    TOO_MANY_REQUESTS: 'RateLimit-001',
  },
  VALIDATION: {
    INVALID_INPUT: 'VALIDATION_ERROR',
  },
  DATE: {
    INVALID_FORMAT: 'Date-001',
    PAST_DATE_NOT_ALLOWED: 'Date-002',
  },
  HOUR: {
    INVALID_FORMAT: 'Hour-001',
    PAST_TIME_NOT_ALLOWED: 'Hour-002',
    CONTINUOUS_TIME_REQUIRED: 'Hour-003',
  },
  DATABASE: {
    QUERY_FAILED: 'DATABASE-001',
  },
  ROOM: {
    ROOM_KEY_MISSING: 'Room-001',
    ROOM_KEY_NOT_FOUND: 'Room-002',
    ROOMS_LIST_EMPTY: 'Room-003',
  },
  RESPONSE: {
    ID_LIST_MISMATCH: 'Response-001',
  },
  CRAWLER: {
    UNKNOWN_ERROR: 'CRAWLER-001',
    SERVICE_ERROR: 'CRAWLER-002',
    BOT_BLOCKED: 'CRAWLER-003',
    TIMEOUT: 'CRAWLER-004',
  },
  PARSER: {
    PARSING_FAILED: 'PARSER-001',
    RESPONSE_TIMEOUT: 'PARSER-002',
    RESPONSE_PARSE_FAILED: 'PARSER-003',
  },
  // Groove/Naver/Dream 서비스 개별 코드는 사용하지 않습니다.
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  'GENERIC-000': '알 수 없는 오류가 발생했습니다.',
  'Common-001': '(정의되지 않음)',
  'COMMON-002': '(정의되지 않음)',
  'API-001': '외부 API 호출에 실패했습니다.',
  'RateLimit-001': '요청 횟수가 초과되었습니다. 잠시 후 다시 시도해주세요.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  'Date-001': '날짜 형식이 잘못되었습니다.',
  'Date-002': '과거 날짜는 허용되지 않습니다.',
  'Hour-001': '시간 형식이 잘못되었습니다.',
  'Hour-002': '과거 시간은 허용되지 않습니다.',
  'Hour-003': '연속된 시간 값을 입력해야 합니다.',
  'DATABASE-001': '룸 데이터 조회에 실패했습니다.',
  'Room-001': 'RoomKey 필드가 누락되었습니다.',
  'Room-002': 'RoomKey가 존재하지 않습니다.',
  'Room-003': 'rooms 목록이 비어 있습니다.',
  'Response-001': '요청과 응답의 합숙실 ID 리스트가 불일치합니다.',
  'CRAWLER-001': '크롤링 중 오류가 발생했습니다.',
  'CRAWLER-002': '대상 서비스(네이버, 그루브, 드림)별 오류 메시지를 사용합니다.',
  'CRAWLER-003': '봇 감지로 인해 접근이 차단되었습니다.',
  'CRAWLER-004': '크롤링 타임아웃이 발생했습니다.',
  'PARSER-001': 'LLM 파싱 중 오류가 발생했습니다.',
  'PARSER-002': 'LLM 응답 타임아웃이 발생했습니다.',
  'PARSER-003': 'LLM 응답을 파싱할 수 없습니다.',
} as const;
