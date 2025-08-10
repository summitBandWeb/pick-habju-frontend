import HeroArea from '../components/HeroArea/HeroArea';
import { ROOMS } from '../constants/data';
import { postRoomAvailability, type AvailabilityRequest } from '../api/availabilityApi';
import Card from '../components/Card/Card';
import img1 from '../assets/images/1.png';
import img2 from '../assets/images/2.png';
import img3 from '../assets/images/3.png';


const HomePage = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = String(now.getDate()).padStart(2, '0');
  const weekdayKorean = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const startHour = now.getHours();
  const rawEndHour = (startHour + 2) % 24;
  const displayEndHour = rawEndHour === 0 ? 24 : rawEndHour <= startHour ? rawEndHour + 24 : rawEndHour;
  const defaultDateIso = `${now.getFullYear()}-${String(month).padStart(2, '0')}-${day}`;
  const defaultSlots = [
    `${String(startHour).padStart(2, '0')}:00`,
    `${String((startHour + 1) % 24).padStart(2, '0')}:00`,
  ];
  const defaultDateTimeLabel = `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${displayEndHour}시`;
  const defaultPeopleCount = 12;

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
      alert('조건에 맞는 합주실이 없어요. 인원 수를 조정해 주세요.');
      return;
    }

    const payload: AvailabilityRequest = {
      date,
      hour_slots,
      rooms: filteredRooms,
    };

    try {
      await postRoomAvailability(payload);
      // TODO: 응답을 상태/뷰에 반영 (Search Default 화면 조립)
      // useSearchStore.setState({ phase: SearchPhase.Default, ...data }) 형태로 확장 예정
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
        {/* 테스트용 카드 섹션 */}
        <div className="w-full flex flex-col items-center gap-4 py-4">
          {/* 디폴트 카드 */}
          <Card
            images={[img1, img2, img3]}
            title="비쥬 합주실 3호점"
            subtitle="Modern룸"
            price={55000}
            locationText="이수역"
            walkTime="4분"
            capacity="12인"
          />

          {/* 일부 시간만 가능 */}
          <Card
            images={[img2, img3, img1]}
            title="그루브 사당점"
            subtitle="C룸"
            price={17000}
            locationText="이수역"
            walkTime="4분"
            capacity="8인"
            partialAvailable
          />

          {/* 오픈 대기 (기본 90일 후) */}
          <Card
            images={[img3, img1, img2]}
            title="드림합주실 사당점"
            subtitle="V룸"
            price={25000}
            locationText="사당역"
            walkTime="6분"
            capacity="17인"
            booked
          />

          {/* 오픈 대기 (커스텀 45일 후) */}
          <Card
            images={[img1, img3, img2]}
            title="비쥬 합주실 2호점"
            subtitle="B룸"
            price={20000}
            locationText="이수역"
            walkTime="7분"
            capacity="11인"
            booked
            reOpenDaysFromNow={45}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
