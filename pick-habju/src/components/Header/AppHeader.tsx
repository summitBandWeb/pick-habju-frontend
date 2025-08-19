import HeaderLogo from './HeaderLogo';

const LogoHeader = () => (
  <div
    className="flex items-center self-stretch bg-primary-white py-[0.375rem] pr-[16.31088rem]"
    aria-label="Logo Header"
  >
    <HeaderLogo />
  </div>
);

const AppHeader = () => {
  return (
    <div className="flex w-[25.125rem] justify-center items-center">
      <div className="flex flex-col w-full">
        <LogoHeader />
      </div>
    </div>
  );
};

export default AppHeader;
