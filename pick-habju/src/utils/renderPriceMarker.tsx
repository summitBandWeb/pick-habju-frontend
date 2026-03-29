import { renderToStaticMarkup } from 'react-dom/server';
import PriceMarker from '../components/Price/Marker/PriceMarker';
import type { PriceMarkerProps } from '../components/Price/Marker/PriceMarker.types';

/**
 * renderToStaticMarkup(<PriceMarker />) 결과를 캐싱하는 래퍼.
 *
 * PriceMarker는 props가 같으면 항상 동일한 HTML을 반환하므로,
 * 모듈 레벨 Map에 캐싱해 동일한 상태의 마커를 다시 렌더링하지 않는다.
 * 선택/해제 반복, 충돌 감지 레벨 변경 등에서 유의미한 성능 개선 효과.
 */
const cache = new Map<string, string>();

export function renderPriceMarker(props: PriceMarkerProps): string {
  const key = `${props.level}|${props.name}|${props.price}|${props.isFave}|${props.isPartial}|${props.isActive}|${props.extraRoomCount}`;

  const cached = cache.get(key);
  if (cached !== undefined) return cached;

  const html = renderToStaticMarkup(<PriceMarker {...props} />);
  cache.set(key, html);
  return html;
}
