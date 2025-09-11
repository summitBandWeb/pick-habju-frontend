import HeaderLogo from './HeaderLogo';
import GoogleFormToast from '../GoogleFormToast/GoogleFormToast';

// const SafeArea = () => (
//   <div
//     className="flex h-[2.75rem] pr-[22.625rem] items-center self-stretch bg-primary-white"
//     aria-label="Safe Area"
//   />
// );

const LogoHeader = () => (
  <div className="flex items-center self-stretch bg-primary-white py-[0.375rem] pr-4" aria-label="Logo Header">
    <HeaderLogo />
  </div>
);

const AppHeader = () => {
  return (
    <div className="flex w-full justify-center items-center relative">
      <GoogleFormToast />
      <div className="flex flex-col w-full max-w-[25.9375rem]">
        {/* <SafeArea /> */}
        <LogoHeader />
      </div>
    </div>
  );
};

export default AppHeader;
