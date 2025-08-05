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
    pricePerHour: number
    subway: {
        station: string
        timeToWalk: string
    }
    canReserveOneHour: boolean,
    requiresCallOnSameDay: boolean
}
