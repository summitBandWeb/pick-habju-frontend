import type { PriceMarkerLevel } from '../components/Price/Marker/PriceMarker.types';
import {
  PRICE_MARKER_ANCHOR_X,
  PRICE_MARKER_ANCHOR_Y,
  PRICE_MARKER_ICON_W,
  PRICE_MARKER_ICON_H,
} from '../components/Price/Marker/PriceMarker';

/** 픽셀 좌표 기준 사각형 */
type Rect = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

/** 충돌 검사에 사용할 마커 박스 정보 */
export type MarkerBox = {
  id: string;
  /** Icon Box: 말풍선 아이콘 영역 */
  iconBox: Rect;
  /** Label Box: 텍스트 라벨 영역 (level 1일 때의 잠재적 영역) */
  labelBox: Rect;
  /**
   * 우선순위. 낮을수록 높은 우선순위.
   * 0 = selected, 1 = fave, 2 = normal
   */
  priority: number;
};

/** 두 사각형이 겹치는지 검사 (AABB) */
function isRectOverlap(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

/**
 * 마커의 Icon Box / Label Box 좌표를 계산한다.
 *
 * @param pos - projection.fromCoordToOffset() 결과. 앵커(말풍선 꼭짓점)의 픽셀 좌표.
 * @param labelSize - DOM 측정으로 얻은 라벨 실제 크기. null이면 labelBox를 빈 영역으로 처리.
 */
export function buildMarkerBox(
  id: string,
  pos: { x: number; y: number },
  labelSize: { width: number; height: number } | null,
  priority: number
): MarkerBox {
  // Icon Box: 앵커(pos)가 아이콘 하단 중앙 → 좌상단으로 역산
  const iconBox: Rect = {
    left: pos.x - PRICE_MARKER_ANCHOR_X,
    right: pos.x - PRICE_MARKER_ANCHOR_X + PRICE_MARKER_ICON_W,
    top: pos.y - PRICE_MARKER_ANCHOR_Y,
    bottom: pos.y,
  };

  // Label Box: 아이콘 하단(pos.y)에서 5px gap 이후 시작, 가로 중앙 정렬
  const labelBox: Rect = labelSize
    ? {
        left: pos.x - labelSize.width / 2,
        right: pos.x + labelSize.width / 2,
        top: pos.y + 5,
        bottom: pos.y + 5 + labelSize.height,
      }
    : { left: 0, right: 0, top: 0, bottom: 0 };

  return { id, iconBox, labelBox, priority };
}

/**
 * 마커 배열의 충돌을 검사하여 각 마커의 표시 레벨을 반환한다.
 *
 * 알고리즘:
 * 1. priority 오름차순 정렬 (selected → fave → normal)
 * 2. 각 마커 B에 대해 B보다 우선순위가 높은 마커 A와 비교:
 *    - B.iconBox ∩ A.iconBox → Level 3 (점) 확정
 *    - B.labelBox ∩ A.iconBox → Level 2 (아이콘만)
 *    - A가 Level 1이면: B.labelBox ∩ A.labelBox → Level 2
 * 3. 위 조건 없음 → Level 1 (full) 유지
 */
export function computeMarkerLevels(boxes: MarkerBox[]): Map<string, PriceMarkerLevel> {
  const sorted = [...boxes].sort((a, b) => a.priority - b.priority);
  const levels = new Map<string, PriceMarkerLevel>();

  for (let i = 0; i < sorted.length; i++) {
    const current = sorted[i];
    let level: PriceMarkerLevel = 1;

    for (let j = 0; j < i; j++) {
      const other = sorted[j];
      const otherLevel = levels.get(other.id) ?? 1;

      // Level 3 판정: 아이콘끼리 겹침
      if (isRectOverlap(current.iconBox, other.iconBox)) {
        level = 3;
        break;
      }

      // Level 2 판정: 내 라벨이 상대 아이콘과 겹침
      if (isRectOverlap(current.labelBox, other.iconBox)) {
        level = 2;
      }

      // Level 2 판정: 상대가 Level 1이면 상대 라벨과도 비교
      if (otherLevel === 1 && isRectOverlap(current.labelBox, other.labelBox)) {
        level = 2;
      }
    }

    levels.set(current.id, level);
  }

  return levels;
}

/**
 * 마커 ID → 우선순위 숫자 반환.
 * selected(0) > fave(1) > normal(2)
 */
export function getMarkerPriority(isSelected: boolean, isFave: boolean): number {
  if (isSelected) return 0;
  if (isFave) return 1;
  return 2;
}

export type { PriceMarkerLevel };
export { PRICE_MARKER_ICON_W, PRICE_MARKER_ICON_H };
