export type SlideDirection = 'prev' | 'next';

export interface DatePickerBodyProps {
  activeStartDate?: Date;
  slideDirection?: SlideDirection;
  selectedDates: Date[];
  onChange: (date: Date) => void;
}
