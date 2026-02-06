/**
 * 숫자 키 입력했을 때 가능한 시간인지 검사하고 가능한 시간이면 추가, 불가능한 시간이면 다음 칸으로 넘김.
 * 24h 유효성 검사 후 digit 추가. 무효 입력 시 자동으로 다음 칸으로 넘김.
 */
export function processDigitInput(current: string, digit: string): string {
  if (current.length >= 4) return digit;
  const d = parseInt(digit, 10);
  const len = current.length;

  if (len === 0 || len === 2) {
    if (d >= 3) return (current + '0' + digit).slice(0, 4);
    return current + digit;
  }
  if (len === 1 || len === 3) {
    const first = parseInt(current[len - 1], 10);
    if (first === 2 && d >= 4)
      return (current.slice(0, -1) + '0' + current.slice(-1) + '0' + digit).slice(0, 4);
    if (len === 3 && first >= 3)
      return (current.slice(0, 2) + '0' + current[2] + digit).slice(0, 4);
    return current + digit;
  }
  return current + digit;
}
