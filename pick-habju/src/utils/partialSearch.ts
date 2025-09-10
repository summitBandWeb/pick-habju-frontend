/**
 * 부분검색 유틸리티 함수들
 * 사용자가 단어의 일부만 입력해도 해당하는 결과를 찾을 수 있도록 지원
 */

const INITIAL_CONSONANTS = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

/**
 * 문자열에서 한글 초성을 추출하는 함수
 * @example "비쥬합주실" → "ㅂㅈㅎㅈㅅ"
 */

const getInitialConsonants = (str: string): string => {
  return str
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);

      // 이미 초성인 경우 그대로 반환
      if (INITIAL_CONSONANTS.includes(char)) {
        return char;
      }

      // 한글 완성형 문자 처리 (가-힣)
      if (code >= 44032 && code <= 55203) {
        const initialIndex = Math.floor((code - 44032) / 588);
        return INITIAL_CONSONANTS[initialIndex] || '';
      }

      return ''; // 한글이 아닌 경우
    })
    .join('');
};

/**
 * 문자열이 한글 초성으로만 이루어져 있는지 확인하는 함수
 */

const isOnlyInitialConsonants = (str: string): boolean => {
  if (!str) return false;
  return str.split('').every((char) => INITIAL_CONSONANTS.includes(char));
};

/**
 * 연속된 부분 문자열 매칭
 * @example "비합" → "비쥬합주실" (O), "합비" → "비쥬합주실" (X)
 */

const isConsecutiveMatch = (searchTerm: string, targetText: string): boolean => {
  if (!searchTerm || !targetText) return false;

  const search = searchTerm.toLowerCase();
  const target = targetText.toLowerCase();

  // 일반 문자열 매칭
  if (target.includes(search)) return true;

  // 공백 제거 후 매칭
  const searchNoSpace = search.replace(/\s/g, '');
  const targetNoSpace = target.replace(/\s/g, '');
  if (targetNoSpace.includes(searchNoSpace)) return true;

  // 각 글자를 순서대로 포함하는지 확인
  if (search.length >= 2) {
    const searchChars = search.split('');
    let lastIndex = -1;
    let allMatched = true;

    for (const char of searchChars) {
      const index = target.indexOf(char, lastIndex + 1);
      if (index === -1) {
        allMatched = false;
        break;
      }
      lastIndex = index;
    }

    if (allMatched) return true;
  }

  return false;
};

/**
 * 하이브리드 초성 검색을 지원하는 함수.
 * - 다중 초성: 단어의 시작 부분과 일치해야 함 (엄격)
 * - 단일 초성: 단어 내에 포함되면 일치 (유연)
 * @example
 * "ㅂㅈ" → "비쥬합주실" (O - '비쥬'의 시작과 일치)
 * "ㅈㅅ" → "비쥬합주실" (X - '주실'은 단어의 시작이 아님)
 * "ㅈ" → "비쥬합주실" (O - '쥬'의 초성이 포함됨)
 */

const isInitialConsonantMatch = (searchTerm: string, targetText: string): boolean => {
  const searchInitials = getInitialConsonants(searchTerm);
  const targetInitials = getInitialConsonants(targetText);

  if (!searchInitials) return false;

  // 전체 초성이 검색어 초성으로 '시작'하는지 (가장 우선)
  if (targetInitials.startsWith(searchInitials)) {
    return true;
  }

  // 각 단어의 초성이 검색어 초성으로 '시작'하는지
  const targetWords = targetText.split(/[\s\-.]+/);
  for (const word of targetWords) {
    if (getInitialConsonants(word).startsWith(searchInitials)) {
      return true;
    }
  }

  // [특별 케이스] 검색어가 단일 초성일 경우에만 '포함' 여부도 확인
  if (searchInitials.length === 1 && targetInitials.includes(searchInitials)) {
    return true;
  }

  return false;
};

/**
 * 단어 분리 후 부분 매칭
 * @example "비 합" → "비쥬합주실" (O), "합 비" → "비쥬합주실" (X - 순서가 맞지 않음)
 */

const isWordPartialMatch = (searchTerm: string, targetText: string): boolean => {
  const searchWords = searchTerm.toLowerCase().trim().split(/\s+/);
  const target = targetText.toLowerCase();

  let lastIndex = -1;
  for (const word of searchWords) {
    const index = target.indexOf(word, lastIndex + 1);
    if (index === -1) return false;
    lastIndex = index;
  }

  return true;
};

/**
 * 종합 부분검색 함수
 *
 * @param searchTerm 사용자가 입력한 검색어
 * @param roomName 룸 이름 (예: "블랙룸")
 * @param branchName 지점 이름 (예: "비쥬합주실 1호점")
 * @returns 매칭 여부
 */

export const partialSearch = (searchTerm: string, roomName: string, branchName: string): boolean => {
  if (!searchTerm.trim()) return true;

  const search = searchTerm.trim();

  // 연속된 부분 문자열 매칭 (가장 일반적)
  if (isConsecutiveMatch(search, roomName) || isConsecutiveMatch(search, branchName)) {
    return true;
  }

  // 초성 검색 (입력어가 초성으로만 이루어진 경우)
  if (isOnlyInitialConsonants(search) && isInitialConsonantMatch(search, branchName)) {
    return true;
  }

  // 단어 분리 후 순서 매칭 (공백으로 구분된 여러 단어)
  if (isWordPartialMatch(search, `${branchName} ${roomName}`)) {
    return true;
  }

  return false;
};
