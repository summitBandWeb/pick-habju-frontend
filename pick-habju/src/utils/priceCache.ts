import { ROOMS } from '../constants/data';
import { calculateTotalPrice } from './calcTotalPrice';

interface PriceCacheParams {
  hourSlots: string[];
  peopleCount: number;
  dateIso: string;
}

/**
 * 가격 계산 결과를 캐싱하는 클래스
 *
 * 동일한 검색 조건(시간대, 인원수, 날짜)에서 여러 룸의 가격을 계산할 때
 * 중복 계산을 방지하여 성능을 최적화합니다.
 *
 * @example
 * ```
 * const cache = new PriceCache({
 *   hourSlots: ['10:00', '11:00'],
 *   peopleCount: 4,
 *   dateIso: '2024-01-15'
 * });
 *
 * const price1 = cache.getPrice(0); // 계산하여 캐시에 저장
 * const price2 = cache.getPrice(0); // 캐시에서 반환 (성능 향상)
 * ```
 */

export class PriceCache {
  private cache = new Map<string, number>();
  private params: PriceCacheParams;

  constructor(params: PriceCacheParams) {
    this.params = params;
  }

  /**
   * 룸 인덱스에 대한 가격을 캐시에서 가져오거나 계산하여 반환
   *
   * @param roomIndex - ROOMS 배열에서의 룸 인덱스
   * @returns 계산된 총 가격
   */

  getPrice(roomIndex: number): number {
    const cacheKey = `${roomIndex}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const price = calculateTotalPrice({
      room: ROOMS[roomIndex],
      hourSlots: this.params.hourSlots,
      peopleCount: this.params.peopleCount,
      dateIso: this.params.dateIso,
    });

    this.cache.set(cacheKey, price);
    return price;
  }

  /**
   * 캐시를 초기화
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * 캐시 크기 반환 (디버깅용)
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * 단순한 함수형 접근 방식의 가격 캐시
 *
 * PriceCache 클래스보다 가벼운 함수형 접근 방식입니다.
 * sortCards 함수에서 주로 사용되며, 매개변수가 변경될 때마다
 * 새로운 캐시 함수를 생성해야 합니다.
 *
 * @param params - 가격 계산에 필요한 매개변수
 * @returns 룸 인덱스를 받아 가격을 반환하는 캐시 함수
 *
 * @example
 * ```
 * const getPrice = createPriceCache({
 *   hourSlots: ['14:00', '15:00'],
 *   peopleCount: 2,
 *   dateIso: '2024-01-20'
 * });
 *
 * const price1 = getPrice(0); // 계산하여 캐시에 저장
 * const price2 = getPrice(0); // 캐시에서 반환
 * const price3 = getPrice(1); // 새로 계산하여 캐시에 저장
 * ```
 */

export const createPriceCache = (params: PriceCacheParams) => {
  const cache = new Map<number, number>();

  return (roomIndex: number): number => {
    if (cache.has(roomIndex)) {
      return cache.get(roomIndex)!;
    }

    const price = calculateTotalPrice({
      room: ROOMS[roomIndex],
      hourSlots: params.hourSlots,
      peopleCount: params.peopleCount,
      dateIso: params.dateIso,
    });

    cache.set(roomIndex, price);
    return price;
  };
};
