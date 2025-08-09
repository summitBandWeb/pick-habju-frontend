import HeaderLogo from './HeaderLogo';

const SafeArea = () => (
  <div
    className="flex h-[2.75rem] pr-[22.625rem] items-center self-stretch bg-primary-white"
    aria-label="Safe Area"
  />
);

const LogoHeader = () => (
  <div
    className="flex items-center self-stretch bg-primary-white pt-[0.375rem] pr-[16.31088rem] pb-[0.625rem]"
    aria-label="Logo Header"
  >
    <HeaderLogo />
  </div>
);

const AppHeader = () => {
  return (
    <div className="flex w-[25.125rem] h-[6.25rem] justify-center items-center">
      <div className="flex flex-col w-full">
        <SafeArea />
        <LogoHeader />
      </div>
    </div>
  );
};

export default AppHeader;
