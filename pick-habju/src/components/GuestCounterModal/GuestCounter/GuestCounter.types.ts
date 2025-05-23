export interface GuestCounterProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}
