import { ROOMS } from '../constants/data';
import { calculateTotalPrice } from './calcTotalPrice';
import { SortType } from '../components/FilterSection/FilterSection.constants';
import type { SearchCardItem } from '../store/search/searchStore.types';
import { CardKind } from '../store/search/searchStore.types';

interface SortParams {
  hourSlots: string[];
  peopleCount: number;
  dateIso: string;
}

export const sortCards = (cards: SearchCardItem[], sortType: SortType, sortParams: SortParams): SearchCardItem[] => {
  return [...cards].sort((a, b) => {
    // 카드 우선순위: not_yet 카드는 항상 맨 아래
    if (a.kind === CardKind.NOT_YET && b.kind !== CardKind.NOT_YET) return 1;
    if (b.kind === CardKind.NOT_YET && a.kind !== CardKind.NOT_YET) return -1;

    const roomA = ROOMS[a.roomIndex];
    const roomB = ROOMS[b.roomIndex];

    // 메인 정렬 기준
    let mainCompare = 0;

    switch (sortType) {
      case SortType.PRICE_LOW: {
        const totalPriceA = calculateTotalPrice({
          room: roomA,
          hourSlots: sortParams.hourSlots,
          peopleCount: sortParams.peopleCount,
          dateIso: sortParams.dateIso,
        });
        const totalPriceB = calculateTotalPrice({
          room: roomB,
          hourSlots: sortParams.hourSlots,
          peopleCount: sortParams.peopleCount,
          dateIso: sortParams.dateIso,
        });
        mainCompare = totalPriceA - totalPriceB;
        break;
      }

      case SortType.PRICE_HIGH: {
        const totalPriceA = calculateTotalPrice({
          room: roomA,
          hourSlots: sortParams.hourSlots,
          peopleCount: sortParams.peopleCount,
          dateIso: sortParams.dateIso,
        });
        const totalPriceB = calculateTotalPrice({
          room: roomB,
          hourSlots: sortParams.hourSlots,
          peopleCount: sortParams.peopleCount,
          dateIso: sortParams.dateIso,
        });
        mainCompare = totalPriceB - totalPriceA;
        break;
      }

      case SortType.CAPACITY_LOW:
        mainCompare = roomA.maxCapacity - roomB.maxCapacity;
        break;

      case SortType.CAPACITY_HIGH:
        mainCompare = roomB.maxCapacity - roomA.maxCapacity;
        break;

      default:
        mainCompare = 0;
        break;
    }

    // 메인 기준으로 구분되면 그대로 반환
    if (mainCompare !== 0) return mainCompare;

    // 보조 정렬 기준 (가격 같으면 인원순, 인원 같으면 가격순)
    if (sortType === SortType.PRICE_LOW || sortType === SortType.PRICE_HIGH) {
      // 가격 정렬일 때 가격이 같으면 인원 많은순 -> (내림차순)
      const capacityCompare = roomB.maxCapacity - roomA.maxCapacity;
      if (capacityCompare !== 0) return capacityCompare;
    } else if (sortType === SortType.CAPACITY_LOW || sortType === SortType.CAPACITY_HIGH) {
      // 인원 정렬일 때 인원수가 동일하면 → 가격 낮은순으로 2차 정렬
      const totalPriceA = calculateTotalPrice({
        room: roomA,
        hourSlots: sortParams.hourSlots,
        peopleCount: sortParams.peopleCount,
        dateIso: sortParams.dateIso,
      });
      const totalPriceB = calculateTotalPrice({
        room: roomB,
        hourSlots: sortParams.hourSlots,
        peopleCount: sortParams.peopleCount,
        dateIso: sortParams.dateIso,
      });
      const priceCompare = totalPriceA - totalPriceB;
      if (priceCompare !== 0) return priceCompare;
    }

    // 최종적으로 룸 이름으로 정렬 (일관성 보장)
    return roomA.name.localeCompare(roomB.name);
  });
};
