export interface SearchBarProps {
  value: string;
  onSearchChange: (searchText: string) => void;
  
  // 검색 조건 정보 (장소, 인원수, 시간)
  searchCondition: {
    location: string;      // 장소 (예: "이수")
    peopleCount: number;   // 인원수 (예: 13)
    dateTime: string;      // 시간 (예: "01/04 16-18시")
  };
  
  // 검색 조건 클릭 시 첫 화면으로 돌아가는 핸들러
  onConditionClick: () => void;

  /** 검색 입력 비활성화 여부 (noMatch 화면 표시 중 필터가 원인일 때 상호작용 차단) */
  disabled?: boolean;
}
