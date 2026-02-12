export type NoticeType = 'noResults' | 'loading' | 'noMatch';

export interface ErrorNoticeProps {
  /** Notice 타입: noResults(검색 결과 없음), loading(로딩), noMatch(필터링 결과 없음) */
  type: NoticeType;
  /** 돌아가기 버튼 클릭 핸들러 (noResults 타입에서 사용) */
  onClose?: () => void;
  /** 자동 숨김 시간 (ms) - noMatch 타입에서 기본 3000ms */
  autoHideAfter?: number;
  /** 자동 숨김 시 콜백 함수 (noMatch 타입에서 사용) */
  onAutoHide?: () => void;
}
