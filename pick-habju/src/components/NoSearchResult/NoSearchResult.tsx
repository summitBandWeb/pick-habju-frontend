import NoLocationIcon from '../../assets/svg/NoLocation.svg';

const NoSearchResult = () => {
  return (
    <div className="flex w-full max-w-100.5 flex-col justify-center items-center">
      <div className="flex py-[3.563rem] px-19.5 justify-center items-center flex-col mt-3">
        <img src={NoLocationIcon} alt="No Location Illustration" />
        <div className="flex flex-col items-center justify-center gap-2 font-button text-gray-300 mt-5">
          <p>앗, 일치하는 합주실이 없네요.</p>
          <p>다른 합주실을 둘러보는 건 어떨까요?</p>
        </div>
      </div>
    </div>
  );
};

export default NoSearchResult;
