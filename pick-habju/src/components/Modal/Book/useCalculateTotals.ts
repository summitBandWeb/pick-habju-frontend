import { useMemo } from 'react';

interface Totals {
  baseTotal: number;
  addTotal: number;
  finalAmount: number;
}

export const useCalculateTotals = (
  basicAmount: number,
  hours: number,
  addPersonCount: number,
  addAmountPerPerson: number
): Totals => {
  return useMemo(() => {
    const baseTotal = basicAmount * hours;
    const addTotal = addPersonCount > 0 ? addAmountPerPerson * addPersonCount : 0;
    const finalAmount = baseTotal + addTotal;
    return { baseTotal, addTotal, finalAmount };
  }, [basicAmount, hours, addPersonCount, addAmountPerPerson]);
};
