import BeforeSearchSvg from '../../assets/svg/BeforeSearch.svg';

const BeforeSearchView = () => {
  return (
    <div
      className="flex w-[25.125rem] flex-col justify-center items-start"
      aria-label="Before Search Section"
    >
      <div
        className="flex w-[25.125rem] h-[16.5625rem] pt-[4.06513rem] pr-[3.625rem] pb-[4.12238rem] pl-[3.625rem] justify-center items-center"
        aria-label="Before Search Illustration Wrapper"
      >
        <img src={BeforeSearchSvg} alt="Before Search Illustration" />
      </div>
    </div>
  );
};

export default BeforeSearchView;
