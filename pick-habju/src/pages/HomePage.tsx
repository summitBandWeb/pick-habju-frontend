import HeroArea from '../components/HeroArea/HeroArea';
import Card from '../components/Card/Card';
import SearchSection from '../components/Search/SearchSection';
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
  const defaultDateTime = `${month}월 ${day}일 (${weekdayKorean}) ${startHour}~${displayEndHour}시`;
  const defaultPeopleCount = 12;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-[25.125rem] flex-col justify-center items-center bg-primary-white">
        <HeroArea
          dateTime={defaultDateTime}
          peopleCount={defaultPeopleCount}
          onDateTimeChange={() => {}}
          onPersonCountChange={() => {}}
          onSearch={() => {}}
        />
      </div>

      {/* HeroArea 아래 영역: 어떤 View가 뜨든 공통 배경 */}
      <div className="w-full flex flex-col items-center bg-[#FFFBF0]">
        <div className="flex w-[25.125rem] flex-col items-center">
          <SearchSection />

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
    </div>
  );
};

export default HomePage;
