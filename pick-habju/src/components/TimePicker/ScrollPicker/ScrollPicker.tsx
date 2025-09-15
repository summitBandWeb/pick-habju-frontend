import { useRef, useEffect, useState } from 'react';

interface ScrollPickerProps<T extends string | number> {
  list: T[];
  value: T;
  onChange: (val: T) => void;
  itemHeight?: number;
  visibleCount?: number;
  disabled?: boolean;
}

const ScrollPicker = <T extends string | number>({
  list,
  value,
  onChange,
  itemHeight = 50,
  visibleCount = 5,
  disabled = false,
}: ScrollPickerProps<T>) => {
  const pad = Math.floor(visibleCount / 2);
  const padded = [...Array(pad).fill('' as T), ...list, ...Array(pad).fill('' as T)];
  const ref = useRef<HTMLUListElement>(null);
  const timer = useRef<number | null>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartScrollTop = useRef(0);
  const didDrag = useRef(false);

  // padded 배열 내 실제 선택된 인덱스
  const [selectedIdx, setSelectedIdx] = useState(() => {
    const base = list.indexOf(value);
    return base >= 0 ? base + pad : pad;
  });

  // value prop 이 바뀌면 selectedIdx 동기화
  useEffect(() => {
    const base = list.indexOf(value);
    if (base >= 0) setSelectedIdx(base + pad);
  }, [value, list, pad]);

  // 마운트 시 & selectedIdx 변경 시: 중앙으로 스냅
  useEffect(() => {
    if (!ref.current) return;
    const li = ref.current.children[selectedIdx] as HTMLElement;
    // scrollIntoView 로 block:'center' 하면 중앙 스냅 보장
    li.scrollIntoView({ block: 'center', behavior: 'auto' });
  }, [selectedIdx]);

  // 스크롤이 멈춘 뒤 처리 (debounce)
  const handleScroll = () => {
    if (disabled) return;
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    timer.current = window.setTimeout(() => {
      const { scrollTop } = ref.current!;
      // 중앙에 걸친 아이템 인덱스 계산
      const centerOffset = scrollTop + (visibleCount * itemHeight) / 2;
      const newIdx = Math.floor(centerOffset / itemHeight);
      const val = padded[newIdx];
      if (val !== '' && list.includes(val as T) && newIdx !== selectedIdx) {
        setSelectedIdx(newIdx);
        onChange(val as T);
      }
      // 최종적으로도 중앙에 스냅
      const li = ref.current!.children[newIdx] as HTMLElement;
      li.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }, 100);
  };

  // 드래그 핸들러들
  const handlePointerDown: React.PointerEventHandler<HTMLUListElement> = (e) => {
    if (disabled) return;
    if (!ref.current) return;
    didDrag.current = false;
    isDragging.current = true;
    dragStartY.current = e.clientY;
    dragStartScrollTop.current = ref.current.scrollTop;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    // 드래그 중 텍스트 선택 방지
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  const handlePointerMove: React.PointerEventHandler<HTMLUListElement> = (e) => {
    if (!isDragging.current || !ref.current) return;
    const deltaY = dragStartY.current - e.clientY;
    if (Math.abs(deltaY) > 3) didDrag.current = true;
    ref.current.scrollTop = dragStartScrollTop.current + deltaY;
    e.preventDefault();
  };

  const endDrag = () => {
    if (!isDragging.current || !ref.current) return;
    isDragging.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    // 드래그 종료 후 가장 가까운 아이템으로 스냅 및 선택
    const { scrollTop } = ref.current;
    const centerOffset = scrollTop + (visibleCount * itemHeight) / 2;
    const newIdx = Math.floor(centerOffset / itemHeight);
    const li = ref.current.children[newIdx] as HTMLElement;
    li.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  const handlePointerUp: React.PointerEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  const handlePointerCancel: React.PointerEventHandler<HTMLUListElement> = () => {
    endDrag();
  };

  // 아이템 클릭 시 해당 아이템을 중앙으로 스냅하며 선택
  const handleItemClick = (i: number) => {
    if (disabled) return;
    if (didDrag.current) return; // 드래그 후 발생한 클릭은 무시
    const val = padded[i];
    if (val === '' || !list.includes(val as T)) return;
    const li = ref.current!.children[i] as HTMLElement;
    li.scrollIntoView({ block: 'center', behavior: 'smooth' });
  };

  return (
    <ul
      ref={ref}
      onScroll={handleScroll}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      className="overflow-y-auto scroll-picker"
      style={{ height: `${itemHeight * visibleCount}px`, margin: 0, padding: 0, cursor: 'grab' }}
    >
      {padded.map((item, i) => {
        const isSel = i === selectedIdx;
        return (
          <li
            key={i}
            onClick={() => handleItemClick(i)}
            style={{
              height: `${itemHeight}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isSel ? 1 : 0.4,
              fontWeight: isSel ? 600 : 400,
              color: isSel ? '#000' : '#aaa',
              fontVariantNumeric: 'normal',
              minWidth: '0.1ch',
              letterSpacing: '0.01em',
              transition: 'opacity 180ms ease, color 180ms ease',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            {item}
          </li>
        );
      })}
    </ul>
  );
};

export default ScrollPicker;
