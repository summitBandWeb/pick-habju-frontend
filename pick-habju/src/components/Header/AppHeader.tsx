import HeaderLogo from './HeaderLogo';

const LogoHeader = () => (
  <div
    className="flex items-center self-stretch bg-primary-white py-[0.375rem] pr-4"
    aria-label="Logo Header"
  >
    <HeaderLogo />
  </div>
);

const AppHeader = () => {
  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col w-full max-w-[25.9375rem]">
        <LogoHeader />
      </div>
    </div>
  );
};

export default AppHeader;
