import NoResultSvg from '../../assets/svg/NoResult.svg';

const NoResultView = () => {
  return (
    <div
      className="flex w-full max-w-[25.9375rem] flex-col justify-center items-start bg-[#FFFBF0]"
      aria-label="No Result Section"
    >
      <div
        className="flex w-full h-[16.5625rem] pt-[4.06513rem] pr-[3.625rem] pb-[4.12238rem] pl-[3.625rem] justify-center items-center"
        aria-label="No Result Illustration Wrapper"
      >
        <img src={NoResultSvg} alt="No Result Illustration" />
      </div>
    </div>
  );
};

export default NoResultView;
