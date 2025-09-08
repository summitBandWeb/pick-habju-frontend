export interface RoomMetadata {
    name: string
    branch: string
    businessId: string
    bizItemId: string
    imageUrls: string[]
    maxCapacity: number
    recommendCapacity: number
    baseCapacity?: number
    extraCharge?: number
    /**
     * 주말(토/일) 요금. 제공되지 않으면 평일과 동일한 것으로 간주
     */
    weekendPricePerHour?: number
    pricePerHour: number
    subway: {
        station: string
        timeToWalk: string
    }
    canReserveOneHour: boolean,
    requiresCallOnSameDay: boolean
    /**
     * 시간대별 요금 정책. startHour 이상 endHour 미만 구간에 적용
     * 예) 0~8시: 10000, 8~14시: 15000, 14~24시: 18000
     */
    timeBandPricing?: { startHour: number; endHour: number; pricePerHour: number }[]
}
