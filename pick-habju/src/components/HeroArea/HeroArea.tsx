import { useCallback, useMemo, useState } from 'react';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInputDropdown from './Input/Person/PersonCountInputDropdown';
import DateTimeInputDropdown from './Input/Date/DateTimeInputDropdown';
import LocationInputDropdown, { type LocationOption } from './Input/Location/LocationInputDropdown';
import BackGroundImage from '../../assets/images/background.jpg';
import type { HeroAreaProps } from './HeroArea.types';
import { TimePeriod } from '../TimePicker/TimePickerEnums';
import { showToastByKey } from '../../utils/showToastByKey';
import { ReservationToastKey, ReservationToastSeverity } from '../ToastMessage/ToastMessageEnums';
import ToastMessage from '../ToastMessage/ToastMessage';
import { useReservationActions, useReservationState } from '../../hook/useReservationStore';
import { convertTo24Hour } from '../../utils/formatDate';
import { validateReservationTime } from '../../utils/timeValidation';
import { useToastStore } from '../../store/toast/toastStore';
import { formatReservationLabel } from '../../utils/formatReservationLabel';
import { generateHourSlots } from '../../utils/formatTime';
import { useSearchStore } from '../../store/search/searchStore';
import { SearchPhase } from '../../store/search/searchStore.types';
import { trackSearchButtonClick } from '../../utils/analytics';
import { useGoogleFormToastStore } from '../../store/googleFormToast/googleFormToastStore';
import { useAnalyticsCycleStore } from '../../store/analytics/analyticsStore';

type ActiveDropdown = 'dateTime' | 'person' | 'location' | null;

// 지역 옵션 데이터
const LOCATION_OPTIONS: LocationOption[] = [
  { 
    id: 'sadang', 
    name: '사당', 
    subwayLine: '2호선·4호선',
    coordinates: { lat: 37.4762, lng: 126.9812 }
  },
  { 
    id: 'gangnam', 
    name: '강남', 
    subwayLine: '2호선',
    coordinates: { lat: 37.4979, lng: 127.0276 }
  },
  { 
    id: 'hongdae', 
    name: '홍대입구', 
    subwayLine: '2호선·공항철도·경의중앙선',
    coordinates: { lat: 37.5572, lng: 126.9239 }
  },
  { 
    id: 'sinchon', 
    name: '신촌', 
    subwayLine: '2호선',
    coordinates: { lat: 37.5559, lng: 126.9362 }
  },
  { 
    id: 'jamsil', 
    name: '잠실', 
    subwayLine: '2호선·8호선',
    coordinates: { lat: 37.5133, lng: 127.1000 }
  },
];

const HeroArea = ({ dateTime, peopleCount, onDateTimeChange, onPersonCountChange, onSearch }: HeroAreaProps) => {
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime.label);
  const [peopleCountText, setPeopleCountText] = useState<number>(peopleCount);
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(LOCATION_OPTIONS[0]);
  const [isSearchClickLocked, setIsSearchClickLocked] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  
  const phase = useSearchStore((s) => s.phase);
  const isLoading = phase === SearchPhase.Loading;

  // GoogleForm Toast Store
  const { incrementSearchCount, showToast } = useGoogleFormToastStore();

  const [lastWarningKey, setLastWarningKey] = useState<string | null>(null);
  const { selectedDate, hourSlots } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  // 각 필드의 열기/닫기 요청 핸들러
  const handleDateTimeOpenChange = useCallback((open: boolean) => {
    setActiveDropdown(open ? 'dateTime' : null);
  }, []);

  const handleLocationOpenChange = useCallback((open: boolean) => {
    setActiveDropdown(open ? 'location' : null);
  }, []);

  const handlePersonOpenChange = useCallback((open: boolean) => {
    setActiveDropdown(open ? 'person' : null);
  }, []);

  const handlePersonCountConfirm = useCallback(
    (val: number) => {
      setPeopleCountText(val);
      try {
        const last = useSearchStore.getState().lastQuery;
        if (typeof last?.peopleCount === 'number' && last.peopleCount !== val) {
          onPersonCountChange?.();
        }
      } catch (error) {
        console.debug('비교 실패:', error);
      }
      return true;
    },
    [onPersonCountChange]
  );

  const handleLocationSelect = useCallback((location: LocationOption) => {
    setSelectedLocation(location);
    return true;
  }, []);

  const handleDateTimeConfirm = useCallback(
    (date: Date, sh: number, sp: TimePeriod, eh: number, ep: TimePeriod): boolean => {
      const key = validateReservationTime(date, sh, sp, eh, ep);
      if (key) {
        const severity = ReservationToastSeverity[key as ReservationToastKey];
        showToastByKey(key);
        if (severity === 'error') return false;
        const dateKey = date.toDateString();
        const start24 = convertTo24Hour(sh, sp);
        const end24 = convertTo24Hour(eh, ep);
        const selectionKey = `${dateKey}|${start24}-${end24}`;
        if (lastWarningKey !== selectionKey) {
          setLastWarningKey(selectionKey);
          return false;
        }
      }
      actions.setDate([date]);
      actions.setHourSlots(sh, sp, eh, ep);
      setLastWarningKey(null);

      const dateIso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      const start24 = convertTo24Hour(sh, sp);
      const end24 = convertTo24Hour(eh, ep);
      const slots = generateHourSlots(start24, end24);
      setDateTimeText(formatReservationLabel(dateIso, slots));

      try {
        const last = useSearchStore.getState().lastQuery;
        const nextSlots = generateHourSlots(start24, end24);
        const isSameDate = last?.date === dateIso;
        const isSameSlots =
          Array.isArray(last?.hour_slots) &&
          last!.hour_slots.length === nextSlots.length &&
          last!.hour_slots.every((v, i) => v === nextSlots[i]);
        if (!(isSameDate && isSameSlots)) {
          onDateTimeChange?.();
        }
      } catch (error) {
        console.debug('비교 실패:', error);
      }
      return true;
    },
    [actions, lastWarningKey, onDateTimeChange]
  );

  const initialTimeFromSlots = useMemo(() => {
    try {
      const slots = hourSlots && hourSlots.length > 0 ? hourSlots : dateTime.hour_slots;
      if (Array.isArray(slots) && slots.length > 0) {
        const parseHour = (hhmm: string): number => {
          const h = parseInt(hhmm.split(':')[0], 10);
          return isNaN(h) ? 9 : h;
        };
        const start24 = parseHour(slots[0]);
        const end24 = (start24 + slots.length) % 24;
        const to12 = (h24: number): { hour: number; period: TimePeriod } => {
          if (h24 === 0) return { hour: 12, period: TimePeriod.AM };
          if (h24 < 12) return { hour: h24, period: TimePeriod.AM };
          if (h24 === 12) return { hour: 12, period: TimePeriod.PM };
          return { hour: h24 - 12, period: TimePeriod.PM };
        };
        const s12 = to12(start24);
        const e12 = to12(end24 === 0 ? 24 % 24 : end24);
        return { startHour: s12.hour, startPeriod: s12.period, endHour: e12.hour, endPeriod: e12.period };
      }
    } catch (error) {
      console.debug('파싱 실패:', error);
    }
    return {
      startHour: 9,
      startPeriod: TimePeriod.AM,
      endHour: 5,
      endPeriod: TimePeriod.PM,
    };
  }, [hourSlots, dateTime.hour_slots]);

  return (
    <div
      className="relative w-full h-97.5 flex flex-col items-center"
      style={{
        backgroundImage: `url(${BackGroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* 오버레이 레이어 */}
      <div className="absolute inset-0 bg-primary-black opacity-50 z-0" />

      {/* 실제 콘텐츠 */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h1 className="text-primary-white font-hero-headline mt-15.5 mb-8">합주실 예약 현황을 한눈에</h1>

        <div className="flex flex-col items-center">
          <div className="flex flex-col gap-3 mb-8">
            <LocationInputDropdown
              location={selectedLocation.name}
              options={LOCATION_OPTIONS}
              onSelect={handleLocationSelect}
              isOpen={activeDropdown === 'location'}
              onOpenChange={handleLocationOpenChange}
            />
            <DateTimeInputDropdown
              dateTime={dateTimeText}
              initialSelectedDate={selectedDate ?? undefined}
              onConfirm={handleDateTimeConfirm}
              disabled={isToastVisible}
              initialStartHour={initialTimeFromSlots.startHour}
              initialStartPeriod={initialTimeFromSlots.startPeriod}
              initialEndHour={initialTimeFromSlots.endHour}
              initialEndPeriod={initialTimeFromSlots.endPeriod}
              isOpen={activeDropdown === 'dateTime'}
              onOpenChange={handleDateTimeOpenChange}
            />
            <PersonCountInputDropdown
              count={peopleCountText}
              onConfirm={handlePersonCountConfirm}
              isOpen={activeDropdown === 'person'}
              onOpenChange={handlePersonOpenChange}
            />
          </div>
          <div>
            <Button
              label="검색하기"
              onClick={() => {
                if (isLoading || isSearchClickLocked) return;
                setIsSearchClickLocked(true);
                setTimeout(() => setIsSearchClickLocked(false), 600);

                // 스토어에 값이 없으면 props의 기본값 사용
                let dateIso: string;
                let slots: string[];

                if (selectedDate) {
                  dateIso = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(
                    selectedDate.getDate()
                  ).padStart(2, '0')}`;
                } else {
                  dateIso = dateTime.date;
                }

                if (hourSlots && hourSlots.length > 0) {
                  slots = hourSlots;
                } else {
                  slots = dateTime.hour_slots;
                }

                // 직전 사이클 요약 전송 및 새 사이클 시작
                try {
                  useAnalyticsCycleStore.getState().endCycleAndFlush({
                    date: dateIso,
                    hour_slots: slots,
                    people_count: peopleCountText,
                  });
                } catch (e) {
                  console.debug('endCycleAndFlush failed', e);
                }

                // 검색 횟수 증가 및 토스트 표시 조건 확인
                incrementSearchCount();
                showToast();

                // 검색 버튼 클릭 이벤트를 GA에 추적
                trackSearchButtonClick({
                  date: dateIso,
                  hour_slots: slots,
                  peopleCount: peopleCountText,
                });

                // UI 라벨 업데이트 보정
                setDateTimeText(formatReservationLabel(dateIso, slots));
                onSearch({ 
                  location: selectedLocation.name,
                  locationId: selectedLocation.id,
                  coordinates: selectedLocation.coordinates,
                  date: dateIso, 
                  hour_slots: slots, 
                  peopleCount: peopleCountText 
                });
              }}
              variant={ButtonVariant.Main}
              size={BtnSizeVariant.MD}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      {/* 토스트 (드롭다운/모달 검증용, 항상 마운트) */}
      <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <ToastMessage />
      </div>
    </div>
  );
};

export default HeroArea;
