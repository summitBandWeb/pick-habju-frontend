import Button from '../components/Button/Button';
import PaginationDots from '../components/PaginationDot/PaginationDot';
import { ButtonVariant } from '../enums/components';

const HomePage = () => {
  return (
    <div>
      <Button label="검색하기" variant={ButtonVariant.Main} />
      <Button label="검색하기" variant={ButtonVariant.Sub} />
      <Button label="검색하기" variant={ButtonVariant.Text} />
      <PaginationDots total={5} current={0} />
    </div>
  );
};

export default HomePage;
