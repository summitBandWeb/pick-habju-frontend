export const API_ERROR_CODES = {
  GENERIC: {
    UNKNOWN_ERROR: 'GENERIC-000',
  },
  COMMON: {
    INTERNAL_SERVER_ERROR: 'Common-001',
  },
  API: {
    EXTERNAL_API_FAILED: 'API-001',
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
  ROOM: {
    ROOM_KEY_MISSING: 'Room-001',
    ROOM_KEY_NOT_FOUND: 'Room-002',
    ROOMS_LIST_EMPTY: 'Room-003',
  },
  RESPONSE: {
    ID_LIST_MISMATCH: 'Response-001',
  },
  GROOVE: {
    INVALID_CREDENTIALS: 'Groove-001',
    LOGIN_FAILED: 'Groove-002',
    SERVER_REQUEST_FAILED: 'Groove-003',
    PARSING_FAILED: 'Groove-004',
  },
  NAVER: {
    API_REQUEST_FAILED: 'Naver-001',
    DATA_PROCESSING_FAILED: 'Naver-002',
  },
  DREAM: {
    SERVER_REQUEST_FAILED: 'Dream-001',
    DATA_PROCESSING_FAILED: 'Dream-002',
  },
} as const;

export const ERROR_MESSAGES: Record<string, string> = {
  'GENERIC-000': '알 수 없는 오류가 발생했습니다.',
  'Common-001': '서버 내부 오류가 발생했습니다.',
  'API-001': '외부 API 호출에 실패했습니다.',
  'Date-001': '날짜 형식이 잘못되었습니다.',
  'Date-002': '과거 날짜는 허용되지 않습니다.',
  'Hour-001': '시간 형식이 잘못되었습니다.',
  'Hour-002': '과거 시간은 허용되지 않습니다.',
  'Hour-003': '연속된 시간 값을 입력해야 합니다.',
  'Room-001': 'RoomKey 필드가 누락되었습니다.',
  'Room-002': 'RoomKey가 존재하지 않습니다.',
  'Room-003': 'rooms 목록이 비어 있습니다.',
  'Response-001': '요청과 응답의 합숙실 ID 리스트가 불일치합니다.',
  'Groove-001': '그루브 확정 변수 정보(ID, PASSWORD)가 유효하지 않습니다.',
  'Groove-002': '그루브 로그인에 실패했습니다.',
  'Groove-003': '그루브 서버에 요청하는 중 오류가 발생했습니다.',
  'Groove-004': '그루브 예약 페이지에서 방 정보를 파싱하는 중 오류가 발생했습니다.',
  'Naver-001': '네이버 예약 API에 요청하는 중 오류가 발생했습니다.',
  'Naver-002': '네이버 예약 정보를 처리하는 중 오류가 발생했습니다.',
  'Dream-001': '드림 합숙실 서버에 요청하는 중 오류가 발생했습니다.',
  'Dream-002': '드림 합숙실의 예약 정보를 처리하는 중 오류가 발생했습니다.',
} as const;