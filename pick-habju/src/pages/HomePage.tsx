import HeroArea from '../components/HeroArea/HeroArea';
import { ROOMS } from '../constants/data';
import { postRoomAvailability, type AvailabilityRequest, type AvailabilityResponse } from '../api/availabilityApi';
import { useSearchStore } from '../store/search/searchStore';
import { SearchPhase } from '../store/search/searchStore.types';
import SearchSection from '../components/Search/SearchSection';


const HomePage = () => {
  // 현재 시간이 정시가 아니면, 다음 정시로 올림 (예: 14:03 -> 15:00)
  const now = new Date();
  const baseDate = new Date(now);
  let startHour = now.getHours();
  if (now.getMinutes() > 0) {
    startHour += 1;
    if (startHour === 24) {
      // 자정 넘어가는 경우: 날짜 +1, 00시 시작
      baseDate.setDate(baseDate.getDate() + 1);
      startHour = 0;
    }
  }

  const month = baseDate.getMonth() + 1;
  const day = String(baseDate.getDate()).padStart(2, '0');
  const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][baseDate.getDay()];

  const rawEndHour = (startHour + 2) % 24;
  const displayEndHour = rawEndHour === 0 ? 24 : rawEndHour <= startHour ? rawEndHour + 24 : rawEndHour;
  const defaultDateIso = `${baseDate.getFullYear()}-${String(month).padStart(2, '0')}-${day}`;
  const defaultSlots = [
    `${String(startHour).padStart(2, '0')}:00`,
    `${String((startHour + 1) % 24).padStart(2, '0')}:00`,
  ];
  const defaultDateTimeLabel = `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${displayEndHour}시`;
  const defaultPeopleCount = 12;

  const setDefaultFromResponse = useSearchStore((s) => s.setDefaultFromResponse);
  const setPhase = useSearchStore((s) => s.setPhase);

  const handleSearch = async (params: { date: string; hour_slots: string[]; peopleCount: number }) => {
    const { date, hour_slots, peopleCount } = params;
    // 인원수 기준으로 룸 필터링
    const filteredRooms = ROOMS.filter((r) => peopleCount <= r.maxCapacity).map((r) => ({
      name: r.name,
      branch: r.branch,
      business_id: r.businessId,
      biz_item_id: r.bizItemId,
    }));

    // 혹시몰라 두긴했는데.. 빈 배열이 나오면 안되니까 체크
    if (filteredRooms.length === 0) {
      setPhase(SearchPhase.NoResult);
      return;
    }

    const payload: AvailabilityRequest = {
      date,
      hour_slots,
      rooms: filteredRooms,
    };

    try {
      const resp: AvailabilityResponse = await postRoomAvailability(payload);
      setDefaultFromResponse({ response: resp, peopleCount });
    } catch (e) {
      console.error(e);
      alert('가용 시간 조회 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-[25.125rem] flex-col justify-center items-center">
        <HeroArea
          dateTime={{ label: defaultDateTimeLabel, date: defaultDateIso, hour_slots: defaultSlots }}
          peopleCount={defaultPeopleCount}
          onDateTimeChange={() => {}}
          onPersonCountChange={() => {}}
          onSearch={handleSearch}
        />
        {/* 결과 뷰는 SearchSection이 phase에 따라 렌더 */}
        <div className="w-full">
          <SearchSection />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
