/**
 * 숫자 키 입력했을 때 가능한 시간인지 검사하고 가능한 시간이면 추가, 불가능한 시간이면 다음 칸으로 넘김.
 * 24h 유효성 검사 후 digit 추가. 무효 입력 시 자동으로 다음 칸으로 넘김.
 */
export function processDigitInput(current: string, digit: string): string {
  if (current.length >= 4) return digit;
  const d = parseInt(digit, 10);
  const len = current.length;

  // len === 0: 시작 시간의 십의 자리 입력
  // len === 2: 끝 시간의 십의 자리 입력 (시작 시간 입력 완료 후)
  if (len === 0 || len === 2) {
    // 24시간제: 십의 자리는 0, 1, 2만 유효. 3 이상 입력 시 0을 앞에 붙여 다음 자리로 넘김 (예: "3" -> "03", "09" + "3" -> "0903")
    if (d >= 3) return (current + '0' + digit).slice(0, 4);
    return current + digit;
  }

  // len === 1: 시작 시간의 일의 자리 입력
  // len === 3: 끝 시간의 일의 자리 입력
  if (len === 1 || len === 3) {
    const first = parseInt(current[len - 1], 10);

    // 십의 자리가 2이고 일의 자리 입력이 4 이상일 경우
    // -> 24시 이상이 되므로 다음 시간(끝 시간)으로 넘김 (예: "2" + "5" -> "0205")
    if (first === 2 && d >= 4)
      return (current.slice(0, -1) + '0' + current.slice(-1) + '0' + digit).slice(0, 4);

    // 끝 시간의 십의 자리가 3 이상(30시~, 무효)일 때 일의 자리 입력 시
    // -> 0을 삽입해 조정 (예: "09" + "3" + "0" -> "0903" = 09시~03시)
    if (len === 3 && first >= 3)
      return (current.slice(0, 2) + '0' + current[2] + digit).slice(0, 4);

    return current + digit;
  }
  return current + digit;
}
