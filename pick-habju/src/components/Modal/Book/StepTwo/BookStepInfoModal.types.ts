export interface BookStepInfoCheckProps {
  date: string;
  time: string;
  location: string;
  peopleCount: number;
  amount: number;
  onConfirm: () => void;
}
