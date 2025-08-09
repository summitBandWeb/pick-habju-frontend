import HeroArea from '../components/HeroArea/HeroArea';
import SearchSection from '../components/Search/SearchSection';


const HomePage = () => {

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex w-[25.125rem] flex-col justify-center items-center">
        <HeroArea
          dateTime={"3월 26일 (수) 18-20시"}
          peopleCount={10}
          onDateTimeChange={() => {}}
          onPersonCountChange={() => {}}
          onSearch={() => {}}
        />
        <SearchSection />
      </div>
    </div>
  );
};

export default HomePage;
