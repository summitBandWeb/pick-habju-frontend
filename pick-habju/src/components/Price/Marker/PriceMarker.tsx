/**
 * 지도 마커 컴포넌트 (3단계)
 *
 * level 1 — 아이콘 + 텍스트 (기본)
 * level 2 — 아이콘만 (글씨 겹침 시)
 * level 3 — 점 마커 (아이콘끼리 겹침 시)
 *
 * renderToStaticMarkup()으로 HTML 문자열 변환 후 Naver Maps Marker의 icon.content에 사용.
 * hover는 CSS group-hover로, active는 setIcon() 재렌더로 처리.
 */
import DefaultNoteIcon from '../../../assets/svg/DefaultNote.svg?react';
import ParticalNoteIcon from '../../../assets/svg/ParticalNote.svg?react';
import PriceChip from '../PriceChip/PriceChip';
import type { PriceMarkerProps } from './PriceMarker.types';

export type { PriceMarkerLevel, PriceMarkerProps } from './PriceMarker.types';

// ── Naver Maps anchor 좌표 ──────────────────────────────────────────────────
// 말풍선 꼭짓점(▼)이 지도 좌표와 일치하는 픽셀 위치.
// 마커 콘텐츠 div 좌상단 기준. Union 컨테이너(35×40px)의 하단 중심.
export const PRICE_MARKER_ANCHOR_X = 17; // ≈ 35 / 2
export const PRICE_MARKER_ANCHOR_Y = 40; // Union 높이

// ── AABB 충돌 계산용 아이콘 크기 상수 ───────────────────────────────────────
export const PRICE_MARKER_ICON_W = 35;
export const PRICE_MARKER_ICON_H = 40;

// ── 라벨 추정 크기 (DOM 측정 폴백용) ────────────────────────────────────────
// name: 12px × line-height 1.2 × 최대 2줄 ≈ 29px
// price: 13px × line-height ~1.2 ≈ 16px
// max-w-[90px] 제약 기준 너비
export const PRICE_MARKER_LABEL_W = 90;
export const PRICE_MARKER_LABEL_H = 45;

// ── Level 3 점 마커 앵커 좌표 ────────────────────────────────────────────────
// 점 크기: size-3 = 12px. 앵커는 점 중심(6, 6).
// 버블 앵커(17, 40)와 다르므로 별도 상수로 관리.
export const PRICE_MARKER_DOT_ANCHOR_X = 6;
export const PRICE_MARKER_DOT_ANCHOR_Y = 6;
export const PRICE_MARKER_DOT_SIZE = 12; // size-3 = 12px

function getBubbleFillClasses(isFave: boolean, isPartial: boolean, isActive: boolean): string {
  if (isActive) {
    if (isFave && isPartial) return 'fill-yellow-700 group-hover/marker:fill-yellow-500';
    if (isFave) return 'fill-yellow-900 group-hover/marker:fill-yellow-500';
    if (isPartial) return 'fill-gray-600 group-hover/marker:fill-gray-200';
    return 'fill-gray-400 group-hover/marker:fill-gray-200';
  }
  if (isFave && isPartial) return 'fill-yellow-700 group-hover/marker:fill-yellow-500';
  if (isFave) return 'fill-yellow-900 group-hover/marker:fill-yellow-500';
  if (isPartial) return 'fill-gray-400 group-hover/marker:fill-gray-200';
  return 'fill-gray-300 group-hover/marker:fill-gray-200';
}

// ── 말풍선 SVG ──────────────────────────────────────────────────────────────
// 4가지 상태 모두 동일한 경로(viewBox 0 0 41 46), fill 색상만 다름.
// SVG filter/mask ID(pm-shadow, pm-mask)는 여러 마커 인스턴스에서 공유하지만
// 모든 정의가 동일하므로 첫 번째 정의가 사용되어도 시각 결과가 동일하다.
// inset: -5% -8.57% -10% -8.57% → SVG(41×46)가 컨테이너(35×40) 밖으로 overflow
function BubbleSVG({ fillClasses }: { fillClasses: string }) {
  return (
    <svg
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      overflow="visible"
      style={{ display: 'block' }}
      viewBox="0 0 41 46"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#pm-shadow)">
        <mask id="pm-mask" fill="white">
          <path d="M20.5 2C30.1647 2.00005 37.9998 10.0191 38 19.9111C38 28.6015 31.9528 35.8453 23.9307 37.4775L20.499 42L17.0664 37.4766C9.0457 35.8432 3 28.6005 3 19.9111C3.00024 10.019 10.8352 2 20.5 2Z" />
        </mask>
        {/* 말풍선 채우기 */}
        <path
          d="M20.5 2C30.1647 2.00005 37.9998 10.0191 38 19.9111C38 28.6015 31.9528 35.8453 23.9307 37.4775L20.499 42L17.0664 37.4766C9.0457 35.8432 3 28.6005 3 19.9111C3.00024 10.019 10.8352 2 20.5 2Z"
          className={`${fillClasses}`}
        />
        {/* 흰색 테두리 (mask로 내부 클리핑) */}
        <path
          d="M20.5 2L20.5 0H20.5V2ZM38 19.9111H40V19.9111L38 19.9111ZM23.9307 37.4775L23.5319 35.5177C23.0557 35.6146 22.6311 35.8815 22.3374 36.2686L23.9307 37.4775ZM20.499 42L18.9058 43.209C19.284 43.7073 19.8735 44 20.4991 44C21.1246 44 21.7141 43.7073 22.0923 43.209L20.499 42ZM17.0664 37.4766L18.6596 36.2676C18.366 35.8806 17.9415 35.6137 17.4655 35.5168L17.0664 37.4766ZM3 19.9111L1 19.9111V19.9111H3ZM20.5 2L20.5 4C29.0166 4.00004 35.9998 11.0796 36 19.9112L38 19.9111L40 19.9111C39.9997 8.95855 31.3129 5.66244e-05 20.5 0L20.5 2ZM38 19.9111H36C36 27.6635 30.6097 34.0776 23.5319 35.5177L23.9307 37.4775L24.3294 39.4374C33.2959 37.613 40 29.5395 40 19.9111H38ZM23.9307 37.4775L22.3374 36.2686L18.9058 40.791L20.499 42L22.0923 43.209L25.5239 38.6865L23.9307 37.4775ZM20.499 42L22.0922 40.791L18.6596 36.2676L17.0664 37.4766L15.4732 38.6856L18.9058 43.209L20.499 42ZM17.0664 37.4766L17.4655 35.5168C10.3889 34.0757 5 27.6626 5 19.9111H3H1C1 29.5384 7.70249 37.6107 16.6673 39.4363L17.0664 37.4766ZM3 19.9111L5 19.9112C5.00022 11.0796 11.9833 4 20.5 4V2V0C9.68709 0 1.00027 8.95853 1 19.9111L3 19.9111Z"
          fill="white"
          mask="url(#pm-mask)"
        />
      </g>
      <defs>
        {/* drop shadow: dy=1, blur=1.5, opacity=0.35 */}
        <filter
          id="pm-shadow"
          x="0"
          y="0"
          width="41"
          height="46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// ── PriceMarker ─────────────────────────────────────────────────────────────
const PriceMarker = ({
  level,
  name,
  price,
  isFave,
  isPartial,
  isActive,
  extraRoomCount,
}: PriceMarkerProps) => {
  // ── Level 3: 점 마커 ──────────────────────────────────────────────────────
  // Default: Gray/300 (#AFAFAF), Partial: Gray/400 (#7C7C7C), Fave: Yellow/900 (#F5BE00)
  // 공통: 12×12px 원형, 흰색 2px 링, 드롭 섀도 (shadow-price)
  if (level === 3) {
    const dotBg = isFave
      ? 'bg-yellow-900 hover:bg-yellow-500'
      : isPartial
        ? 'bg-gray-400 hover:bg-gray-200'
        : 'bg-gray-300 hover:bg-gray-200';
    return (
      <div
        className={`size-3 rounded-full ${dotBg} transition-colors duration-150`}
        style={{ boxShadow: '0 0 0 2px white, 0px 1px 3px 0px rgba(0, 0, 0, 0.35)' }}
      />
    );
  }

  // ── Level 1 / 2: 말풍선 아이콘 마커 ──────────────────────────────────────
  const fillClasses = getBubbleFillClasses(isFave, isPartial, isActive);
  const hasChip = extraRoomCount > 0;

  return (
    // group/price: PriceChip의 group-hover/price: 클래스 트리거
    // group/marker: 마커 자체의 hover 효과 (chip margin 변경 등)
    // pr-[9px]: chip이 오른쪽으로 overflow될 공간 확보
    <div
      className={`group/price group/marker inline-flex items-start pr-[9px] relative transition-transform duration-150 ${isActive ? 'scale-[1.3]' : ''}`}
      style={{ transformOrigin: `${PRICE_MARKER_ANCHOR_X}px ${PRICE_MARKER_ANCHOR_Y}px` }}
    >
      {/* ── 말풍선 아이콘 영역 ──────────────────────────────────────────── */}
      {/* mr-[-9px]: chip을 왼쪽으로 9px 당겨 마커와 겹치게 함 (Figma: negative gap -9px) */}
      <div className="relative flex items-center justify-center shrink-0 mr-[-9px]">
        {/* Union 컨테이너: 35×40px. SVG는 inset으로 컨테이너 밖으로 overflow */}
        <div className="w-[35px] h-[40px] relative shrink-0">
          <div className="absolute inset-[-5%_-8.57%_-10%_-8.57%]">
            <BubbleSVG fillClasses={fillClasses} />
          </div>
        </div>

        {/* 음표 아이콘 16×16px */}
        {!isPartial ? (
          // Default / Fave: 버블 원 중앙 배치
          // left: calc(50% - 0.5px) -translate-x-1/2 → 아이콘 중심 x ≈ 17px
          // top: 9.5px → 아이콘 중심 y ≈ 17.5px (버블 원 중심)
          <div className="absolute size-4 left-[calc(50%-0.5px)] top-[9.5px] -translate-x-1/2">
            <DefaultNoteIcon className="w-full h-full" />
          </div>
        ) : (
          // Partial / Fave+Partial: 약간 다른 위치 + overflow-clip
          <div className="absolute size-4 left-2.5 top-[10.5px] flex items-center justify-center overflow-clip">
            <ParticalNoteIcon className="h-full w-auto" />
          </div>
        )}
      </div>

      {/* ── 룸 수 Chip (복수 룸일 때만 표시) ───────────────────────────── */}
      {/* mr-[-9px]: 칩 우측 공간을 당겨 outer div의 pr-[9px]와 상쇄        */}
      {hasChip && (
        <PriceChip
          count={extraRoomCount + 1}
          isActive={isActive}
          className="mr-[-9px] relative z-10"
        />
      )}

      {/* ── 텍스트 라벨 (Level 1 전용) ──────────────────────────────────── */}
      {/* 말풍선 하단 + 5px gap 기준 절대 위치, 버블 중심 x에 맞춰 가운데 정렬  */}
      {level === 1 && (
        <div
          data-marker-label=""
          className="absolute top-[45px] left-[17px] -translate-x-1/2 flex flex-col items-center pointer-events-none"
        >
          <span className={`font-roomlist-name text-center max-w-[90px] text-shadow-[0_0_1px_white] ${isActive ? 'text-primary-black' : 'text-gray-600 group-hover/marker:text-primary-black'}`}>
            {name}
          </span>
          <span className={`font-roomlist-price text-center w-[70px] text-shadow-[0_0_1px_white] ${isActive ? 'text-primary-black' : 'text-gray-600 group-hover/marker:text-primary-black'}`}>
            ₩ {price}
          </span>
        </div>
      )}
    </div>
  );
};

export default PriceMarker;
