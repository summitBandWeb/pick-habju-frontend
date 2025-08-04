export interface BookStepCalculationModalProps {
  basicAmount: number;
  hours: number;
  addPersonCount?: number;
  addAmountPerPerson?: number;
  baseTotal: number;
  addTotal: number;
  finalTotal: number;
  onNext: () => void;
}
