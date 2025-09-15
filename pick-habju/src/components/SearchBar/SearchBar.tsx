import { useState, useEffect } from 'react';
import SearchIcon from '../../assets/svg/search.svg';
import DeleteIcon from '../../assets/svg/delete.svg';
import type { SearchBarProps } from './SearchBar.types';
import { useDebounce } from '../../hook/useDebounce';

const SearchBar = ({ value, onSearchChange }: SearchBarProps) => {
  const [searchText, setSearchText] = useState(value || '');

  // 디바운싱된 검색어 (500ms 지연)
  const debouncedSearchText = useDebounce(searchText, 500);

  // 외부에서 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setSearchText(value || '');
  }, [value]);

  // 디바운싱된 검색어가 변경되면 부모 컴포넌트에 알림
  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedSearchText);
    }
  }, [debouncedSearchText, onSearchChange]);

  const handleClearText = () => {
    setSearchText('');
  };

  return (
    <div className="w-92.5 h-12 px-4 py-1 flex items-center justify-center rounded-lg shadow-filter bg-primary-white">
      <img src={SearchIcon} alt="SearchIcon" className="mr-2" />
      <input
        type="text"
        placeholder="결과 내 합주실 검색"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="flex-1 outline-none text-gray-300 placeholder:text-gray-300 font-modal-call"
      />
      {searchText.trim() && (
        <img src={DeleteIcon} alt="DeleteIcon" className="cursor-pointer" onClick={handleClearText} />
      )}
    </div>
  );
};

export default SearchBar;
