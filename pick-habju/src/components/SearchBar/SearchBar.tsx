import { useState, useEffect } from 'react';
import SearchIcon from '../../assets/svg/search.svg';
import SearchCloseIcon from '../../assets/svg/SearchClose.svg?react';
import SearchLocationIcon from '../../assets/svg/searchLocation.svg';
import PersonIcon from '../../assets/svg/person.svg';
import type { SearchBarProps } from './SearchBar.types';
import { useDebounce } from '../../hook/useDebounce';

const SearchBar = ({ 
  value, 
  onSearchChange, 
  searchCondition,
  onConditionClick
}: SearchBarProps) => {
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
    <div className="w-[380px] h-[58px] px-[15px] py-[10px] flex items-center justify-between rounded-[15px] shadow-search bg-primary-white">
      {/* 왼쪽: 검색 입력 필드 */}
      <div className={`flex flex-1 min-w-0 gap-[15px] items-center ${searchCondition && !searchText.trim() ? 'pr-3' : ''}`}>
        <img src={SearchIcon} alt="SearchIcon" className="w-4 h-[17px] shrink-0" />
        <input
          type="text"
          placeholder="결과 내 합주실 검색"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="flex-1 min-w-0 outline-none text-gray-600 placeholder:text-gray-300 font-modal-call"
        />
        <div className="shrink-0 w-12 h-12 flex items-center justify-center">
          {searchText.trim() && (
            <SearchCloseIcon 
              className="w-4 h-4 cursor-pointer text-gray-300" 
              onClick={handleClearText} 
            />
          )}
        </div>
      </div>

      {/* 오른쪽: 구분선 + 검색 조건 요약 */}
      {searchCondition && (
        <div 
          className="flex gap-2 items-center shrink-0 self-stretch cursor-pointer hover:opacity-80 transition-opacity"
          onClick={onConditionClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              onConditionClick?.();
            }
          }}
        >
          {/* 세로 구분선 */}
          <div className="w-0.5 h-[38px] bg-yellow-700 shrink-0" />

          {/* 검색 조건 요약 */}
          <div className="flex items-center self-stretch">
            <div className="flex flex-col h-full items-start justify-between px-2 shrink-0">
              {/* 첫 번째 줄: 장소 + 인원수 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-[5px]">
                  <img src={SearchLocationIcon} alt="위치" className="w-[10px] h-3 shrink-0" />
                  <span className="font-summary text-gray-600">{searchCondition.location}</span>
                </div>
                <div className="flex items-center gap-[5px]">
                  <img src={PersonIcon} alt="인원" className="w-[10px] h-[10px] shrink-0" />
                  <span className="font-summary text-gray-600">{searchCondition.peopleCount}명</span>
                </div>
              </div>

              {/* 두 번째 줄: 날짜/시간 */}
              <span className="font-summary text-gray-600">{searchCondition.dateTime}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
