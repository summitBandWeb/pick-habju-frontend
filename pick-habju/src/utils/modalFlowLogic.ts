import type { PolicyWarning } from '../api/api.types';

export type ModalType = 'book' | 'partial' | 'oneHourCall' | 'oneHourChat' | 'sameDayCall';

/**
 * policy_warnings 배열로 어떤 모달을 열지 결정.
 * partial 분기는 호출부에서 isPartialFilterActive로 먼저 처리한 뒤 이 함수를 호출.
 * 우선순위: chat_required_1h > call_required_1h > call_required_today > book
 */
export function resolveModalFromWarnings(warnings: PolicyWarning[]): Exclude<ModalType, 'partial'> {
  const types = warnings.map((w) => w.type);
  if (types.includes('chat_required_1h')) return 'oneHourChat';
  if (types.includes('call_required_1h')) return 'oneHourCall';
  if (types.includes('call_required_today')) return 'sameDayCall';
  return 'book';
}
