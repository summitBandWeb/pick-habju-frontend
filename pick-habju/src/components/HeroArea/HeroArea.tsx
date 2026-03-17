import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button/Button';
import { BtnSizeVariant, ButtonVariant } from '../Button/ButtonEnums';
import PersonCountInputDropdown from './Input/Person/PersonCountInputDropdown';
import DateTimeInputDropdown from './Input/Date/DateTimeInputDropdown';
import LocationInputDropdown, { type LocationOption } from './Input/Location/LocationInputDropdown';
import BackGroundImage from '../../assets/images/background.jpg';
import type { ActiveDropdown, HeroAreaProps } from './HeroArea.types';
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
import { trackSearchButtonClick } from '../../utils/analytics';
import { useGoogleFormToastStore } from '../../store/googleFormToast/googleFormToastStore';
import { useAnalyticsCycleStore } from '../../store/analytics/analyticsStore';
import { getServiceableStations, DEFAULT_SERVICEABLE_STATION_ID } from '../../constants/serviceable_stations';
import useReservationStore from '../../store/dateTime/reservationStore';

const STATIONS = getServiceableStations();

const LOCATION_OPTIONS: LocationOption[] = STATIONS.map((station) => ({
  id: station.id,
  name: station.name,
  subwayLine: station.subwayLine,
}));

const DEFAULT_LOCATION_ID = DEFAULT_SERVICEABLE_STATION_ID;

const HeroArea = ({
  dateTime,
  peopleCount,
  initialLocationId,
  onDateTimeChange,
  onPersonCountChange,
  onSearch,
}: HeroAreaProps) => {
  const [dateTimeText, setDateTimeText] = useState<string>(dateTime.label);
  const [peopleCountText, setPeopleCountText] = useState<number>(peopleCount);

  // 초기 지역 선택: initialLocationId prop이 있으면 우선, 없으면 DEFAULT_LOCATION_ID
  // (LOCATION_OPTIONS와 STATIONS가 동일 소스이므로 find는 항상 값을 반환하지만, TS 타입상 방어 코드로 LOCATION_OPTIONS[0] 폴백)
  const [selectedLocation, setSelectedLocation] = useState<LocationOption>(
    LOCATION_OPTIONS.find((loc) => loc.id === (initialLocationId ?? DEFAULT_LOCATION_ID)) ?? LOCATION_OPTIONS[0]
  );
  const [isSearchClickLocked, setIsSearchClickLocked] = useState<boolean>(false);
  const [activeDropdown, setActiveDropdown] = useState<ActiveDropdown>(null);
  const [isDateTimeCloseBlocked, setIsDateTimeCloseBlocked] = useState<boolean>(false);
  const [dateTimeCommitRequestId, setDateTimeCommitRequestId] = useState<number>(0);
  const [pendingSearchAfterDateTimeCommit, setPendingSearchAfterDateTimeCommit] = useState<boolean>(false);

  // GoogleForm Toast Store
  const { incrementSearchCount, showToast } = useGoogleFormToastStore();

  const [lastWarningKey, setLastWarningKey] = useState<string | null>(null);
  const { selectedDate, hourSlots } = useReservationState();
  const actions = useReservationActions();
  const isToastVisible = useToastStore((s) => s.isVisible);

  // 각 필드의 열기/닫기 요청 핸들러
  const handleDateTimeOpenChange = useCallback((open: boolean) => {
    setActiveDropdown(open ? 'dateTime' : null);
    // 열림/닫힘과 무관하게 차단 상태를 초기화한다.
    // (취소 등 커밋 없이 닫힘 포함) 검색/다른 드롭다운이 영구적으로 막히는 상태를 방지.
    setIsDateTimeCloseBlocked(false);
  }, []);

  const handleLocationOpenChange = useCallback(
    (open: boolean) => {
      if (open && activeDropdown === 'dateTime' && isDateTimeCloseBlocked) return;
      setActiveDropdown(open ? 'location' : null);
    },
    [activeDropdown, isDateTimeCloseBlocked]
  );

  const handlePersonOpenChange = useCallback(
    (open: boolean) => {
      if (open && activeDropdown === 'dateTime' && isDateTimeCloseBlocked) return;
      setActiveDropdown(open ? 'person' : null);
    },
    [activeDropdown, isDateTimeCloseBlocked]
  );

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
        if (severity === 'error') {
          setIsDateTimeCloseBlocked(true);
          return false;
        }
        const dateKey = date.toDateString();
        const start24 = convertTo24Hour(sh, sp);
        const end24 = convertTo24Hour(eh, ep);
        const selectionKey = `${dateKey}|${start24}-${end24}`;
        if (lastWarningKey !== selectionKey) {
          setLastWarningKey(selectionKey);
          setIsDateTimeCloseBlocked(true);
          return false;
        }
      }
      actions.setDate([date]);
      actions.setHourSlots(sh, sp, eh, ep);
      setLastWarningKey(null);
      setIsDateTimeCloseBlocked(false);

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
        const last24 = parseHour(slots[slots.length - 1]);
        const end24 = (last24 + 1) % 24;
        const to12 = (h24: number): { hour: number; period: TimePeriod } => {
          if (h24 === 0) return { hour: 12, period: TimePeriod.AM };
          if (h24 < 12) return { hour: h24, period: TimePeriod.AM };
          if (h24 === 12) return { hour: 12, period: TimePeriod.PM };
          return { hour: h24 - 12, period: TimePeriod.PM };
        };
        const s12 = to12(start24);
        const e12 = to12(end24);
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

  const anyDropdownOpen = activeDropdown !== null;

  const runSearch = useCallback(() => {
    if (isSearchClickLocked) return;
    setIsSearchClickLocked(true);
    setTimeout(() => setIsSearchClickLocked(false), 600);

    // 커밋 직후에도 최신 값을 보장하기 위해 스토어에서 직접 조회
    const { selectedDate: latestSelectedDate, hourSlots: latestHourSlots } = useReservationStore.getState();

    // 스토어에 값이 없으면 props의 기본값 사용
    let dateIso: string;
    let slots: string[];

    if (latestSelectedDate) {
      dateIso = `${latestSelectedDate.getFullYear()}-${String(latestSelectedDate.getMonth() + 1).padStart(2, '0')}-${String(
        latestSelectedDate.getDate()
      ).padStart(2, '0')}`;
    } else {
      dateIso = dateTime.date;
    }

    if (latestHourSlots && latestHourSlots.length > 0) {
      slots = latestHourSlots;
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
    const station = STATIONS.find((s) => s.id === selectedLocation.id) ?? STATIONS[0];
    onSearch({
      location: station.name,
      stationId: station.id,
      center: station.center,
      bounds: station.bounds,
      date: dateIso,
      hour_slots: slots,
      peopleCount: peopleCountText,
    });
  }, [
    dateTime.date,
    dateTime.hour_slots,
    incrementSearchCount,
    isSearchClickLocked,
    onSearch,
    peopleCountText,
    selectedLocation.id,
    showToast,
    setDateTimeText,
  ]);

  return (
    <div
      className="relative w-full h-[625px] flex flex-col items-center overflow-hidden"
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
        <motion.div
          className="flex flex-col items-center"
          animate={{
            y:
              activeDropdown === 'dateTime'
                ? -170
                : activeDropdown === 'location'
                  ? -175
                  : activeDropdown === 'person'
                    ? -40
                    : 0,
          }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className={`text-primary-white font-hero-headline ${anyDropdownOpen ? 'mt-30' : 'mt-[142.5px]'} mb-8`}>
            합주실 예약 현황을 한눈에
          </h1>

          <div className="flex flex-col items-center mb-6">
            <div className="flex flex-col gap-4 mb-6">
              <div>
                <LocationInputDropdown
                  location={selectedLocation.name}
                  options={LOCATION_OPTIONS}
                  onSelect={handleLocationSelect}
                  isOpen={activeDropdown === 'location'}
                  onOpenChange={handleLocationOpenChange}
                />
              </div>
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
                commitRequestId={dateTimeCommitRequestId}
                onCommitResult={(didClose) => {
                  if (!pendingSearchAfterDateTimeCommit) return;
                  setPendingSearchAfterDateTimeCommit(false);
                  if (!didClose) return;
                  runSearch();
                }}
              />
              <PersonCountInputDropdown
                count={peopleCountText}
                onConfirm={handlePersonCountConfirm}
                isOpen={activeDropdown === 'person'}
                onOpenChange={handlePersonOpenChange}
              />
            </div>
            <div className={activeDropdown === 'location' ? 'pb-5' : activeDropdown === 'person' ? 'pt-2.5' : ''}>
              <Button
                label="검색하기"
                onClick={() => {
                  if (activeDropdown === 'dateTime') {
                    setPendingSearchAfterDateTimeCommit(true);
                    setDateTimeCommitRequestId((v) => v + 1);
                    return;
                  }
                  if (isDateTimeCloseBlocked) return;
                  runSearch();
                }}
                variant={ButtonVariant.Main}
                size={BtnSizeVariant.MD}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* 토스트 (드롭다운/모달 검증용, 항상 마운트) */}
      <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <ToastMessage />
      </div>
    </div>
  );
};

export default HeroArea;
