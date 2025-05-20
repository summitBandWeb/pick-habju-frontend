import type { PaginationDotsProps } from './PaginationDot.types';

const PaginationDots = ({ total, current }: PaginationDotsProps) => (
  <div className="flex items-center gap-x-1.5">
    {Array.from({ length: total }).map((_, idx) => {
      const isActive = idx === current;
      const dotClass = isActive ? 'bg-primary-white' : 'bg-gray-300';
      return <div key={idx} className={`w-2 h-2 rounded-full ${dotClass}`}></div>;
    })}
  </div>
);

export default PaginationDots;
