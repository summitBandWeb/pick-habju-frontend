import type { FC } from 'react';
import classNames from 'classnames';
import PickHabjuLogo from '../../assets/svg/pickhabjuLogo.svg';
import PickHabjuLetter from '../../assets/svg/pickhabjuLetter.svg';

type HeaderLogoProps = {
  className?: string;
};

const HeaderLogo: FC<HeaderLogoProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'flex justify-center items-center gap-[0.37663rem] px-4',
        className
      )}
      aria-label="Pick Habju Logo"
    >
      <img src={PickHabjuLogo} alt="픽합주 심볼 로고" />
      <img src={PickHabjuLetter} alt="픽합주 워드마크" />
    </div>
  );
};

export default HeaderLogo;
