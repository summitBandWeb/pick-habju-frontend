export interface HeroAreaProps {
  dateTime: {
    label: string; // UI 표기를 위한 라벨
    date: string; // YYYY-MM-DD
    hour_slots: string[]; // ["19:00","20:00"]
  };
  peopleCount: number;
  onDateTimeChange: () => void;
  onPersonCountChange: () => void;
  onSearch: (params: { date: string; hour_slots: string[]; peopleCount: number }) => void;
}
