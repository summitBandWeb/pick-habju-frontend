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

  return (
    <ul
      ref={ref}
      onScroll={handleScroll}
      className="overflow-y-auto scroll-picker"
      style={{ height: `${itemHeight * visibleCount}px`, margin: 0, padding: 0 }}
    >
      {padded.map((item, i) => {
        const isSel = i === selectedIdx;
        return (
          <li
            key={i}
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
