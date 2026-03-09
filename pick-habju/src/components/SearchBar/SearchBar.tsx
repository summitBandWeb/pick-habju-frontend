import { useState, useEffect, useRef } from 'react';
import SearchIcon from '../../assets/svg/search.svg';
import SearchCloseIcon from '../../assets/svg/SearchClose.svg?react';
import SearchLocationIcon from '../../assets/svg/searchLocation.svg';
import PersonIcon from '../../assets/svg/person.svg';
import type { SearchBarProps } from './SearchBar.types';
import { useDebounce } from '../../hook/useDebounce';

const SearchBar = ({ value, onSearchChange, searchCondition, onConditionClick, disabled = false }: SearchBarProps) => {
  const [searchText, setSearchText] = useState(value);

  // 디바운싱된 검색어 (500ms 지연)
  const debouncedSearchText = useDebounce(searchText, 500);

  // onSearchChange를 ref로 관리하여 불필요한 effect 재실행 방지
  const onSearchChangeRef = useRef(onSearchChange);
  useEffect(() => {
    onSearchChangeRef.current = onSearchChange;
  }, [onSearchChange]);

  // 외부에서 value가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    setSearchText(value);
  }, [value]);

  // 디바운싱된 검색어가 변경되면 부모 컴포넌트에 알림
  useEffect(() => {
    onSearchChangeRef.current(debouncedSearchText);
  }, [debouncedSearchText]);

  const handleClearText = () => {
    setSearchText('');
  };

  return (
    <div className="flex h-14.5 w-full min-w-[17.375rem] items-center justify-between self-stretch rounded-[0.9375rem] bg-primary-white px-[0.9375rem] py-2.5 shadow-search">
      {/* 왼쪽: 검색 입력 필드 */}
      <div className={`flex flex-1 min-w-0 items-center gap-[0.9375rem] ${!searchText.trim() ? 'pr-3' : ''}`}>
        <img src={SearchIcon} alt="SearchIcon" className="h-4.5 w-4 shrink-0" />
        <input
          type="text"
          placeholder="결과 내 합주실 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={disabled}
          className="flex-1 min-w-0 outline-none text-gray-600 placeholder:text-gray-300 font-modal-call disabled:cursor-not-allowed"
        />
        <div className="shrink-0 w-12 h-12 flex items-center justify-center">
          {searchText.trim() && !disabled && (
            <SearchCloseIcon className="w-4 h-4 cursor-pointer text-gray-300" onClick={handleClearText} />
          )}
        </div>
      </div>

      {/* 오른쪽: 구분선 + 검색 조건 요약 */}
      <div
        className="flex max-w-[7.375rem] shrink-0 items-center gap-2 self-stretch cursor-pointer transition-opacity hover:opacity-80"
        onClick={onConditionClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onConditionClick();
          }
        }}
      >
        {/* 세로 구분선 */}
        <div className="h-9.5 w-0.5 shrink-0 bg-yellow-700" />

        {/* 검색 조건 요약 */}
        <div className="flex min-w-0 flex-1 items-center self-stretch">
          <div className="flex h-full min-w-0 flex-1 flex-col items-start justify-between px-2">
            {/* 첫 번째 줄: 장소 + 인원수 */}
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex min-w-0 items-center gap-[0.3125rem]">
                <img src={SearchLocationIcon} alt="위치" className="h-3 w-[0.625rem] shrink-0" />
                <span className="truncate font-summary text-gray-600">{searchCondition.location}</span>
              </div>
              <div className="flex shrink-0 items-center gap-[0.3125rem]">
                <img src={PersonIcon} alt="인원" className="h-2.5 w-2.5 shrink-0" />
                <span className="font-summary text-gray-600">{searchCondition.peopleCount}명</span>
              </div>
            </div>

            {/* 두 번째 줄: 날짜/시간 */}
            <span className="block w-full whitespace-nowrap font-summary text-gray-600">{searchCondition.dateTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
