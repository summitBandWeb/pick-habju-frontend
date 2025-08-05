import type {RoomMetadata} from "../types/RoomMetadata"

export const ROOMS: RoomMetadata[] = [
  {
    name: "블랙룸",
    branch: "비쥬합주실 1호점",
    businessId: "522011", // 합주실 id
    bizItemId: "3968885", // 룸 id
    imageUrls: ["/pick-habju/public/images/habjusil/bizu1/bizu1-black-1.jpg","/pick-habju/public/images/habjusil/bizu1/bizu1-black-2.jpg"],
    maxCapacity: 15,
    recommendCapacity: 11,
    pricePerHour: 22000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "화이트룸",
    branch: "비쥬합주실 1호점",
    businessId: "522011",
    bizItemId: "3968896",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu1/bizu1-white-1.jpg","/pick-habju/public/images/habjusil/bizu1/bizu1-white-2.jpg","/pick-habju/public/images/habjusil/bizu1/bizu1-white-3.jpg"],
    maxCapacity: 6,
    recommendCapacity: 5,
    pricePerHour: 17000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "A룸",
    branch: "비쥬합주실 2호점",
    businessId: "706924",
    bizItemId: "4450044",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu2/bizu2-ab-1.jpg","/pick-habju/public/images/habjusil/bizu2/bizu2-ab-2.jpg"],
    maxCapacity: 20,
    recommendCapacity: 11,
    pricePerHour: 23000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "B룸",
    branch: "비쥬합주실 2호점",
    businessId: "706924",
    bizItemId: "4450073",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu2/bizu2-ab-1.jpg","/pick-habju/public/images/habjusil/bizu2/bizu2-ab-2.jpg"],
    maxCapacity: 20,
    recommendCapacity: 11,
    pricePerHour: 23000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "Jazz",
    branch: "비쥬합주실 3호점",
    businessId: "917236",
    bizItemId: "5098028",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-1.jpg","/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-2.jpg","/pick-habju/public/images/habjusil/bizu3/bizu3-jazz-3.jpg"],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 25000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "Modern",
    branch: "비쥬합주실 3호점",
    businessId: "917236",
    bizItemId: "5098033",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu3/bizu3-modern-1.jpg", "/pick-habju/public/images/habjusil/bizu3/bizu3-modern-2.jpg"],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 25000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "Classic",
    branch: "비쥬합주실 3호점",
    businessId: "917236",
    bizItemId: "5098039",
    imageUrls: ["/pick-habju/public/images/habjusil/bizu3/bizu3-classic-1.jpg", "/pick-habju/public/images/habjusil/bizu3/bizu3-classic-2.jpg"],
    maxCapacity: 12,
    recommendCapacity: 10,
    pricePerHour: 26000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 7분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "R룸",
    branch: "준사운드",
    businessId: "1384809",
    bizItemId: "6649826",
    imageUrls: ["/pick-habju/public/images/habjusil/junsound/junsound-r-1.jpg", "/pick-habju/public/images/habjusil/junsound/junsound-r-2.jpg"],
    maxCapacity: 8,
    recommendCapacity: 7,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 18000,
    subway: {
      station: "상도역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true
  },
  {
    name: "S룸",
    branch: "준사운드",
    businessId: "1384809",
    bizItemId: "6649835",
    imageUrls: ["/pick-habju/public/images/habjusil/junsound/junsound-s-1.jpg"],
    maxCapacity: 13,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 21000,
    subway: {
      station: "상도역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true
  },
  {
    name: "A룸",
    branch: "준사운드",
    businessId: "1384809",
    bizItemId: "6649859",
    imageUrls: ["/pick-habju/public/images/habjusil/junsound/junsound-a-1.jpg"],
    maxCapacity: 15,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 22000,
    subway: {
      station: "상도역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true
  },
  {
    name: "B룸",
    branch: "준사운드",
    businessId: "1384809",
    bizItemId: "6677665",
    imageUrls: ["/pick-habju/public/images/habjusil/junsound/junsound-b-1.jpg"],
    maxCapacity: 13,
    recommendCapacity: 11,
    baseCapacity: 7,
    extraCharge: 1000,
    pricePerHour: 20000,
    subway: {
      station: "상도역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: false,
    requiresCallOnSameDay: true
  },
  {
    name: "A룸",
    branch: "그루브 사당점",
    businessId: "sadang",
    bizItemId: "13",
    imageUrls: ["/pick-habju/public/images/habjusil/groove/groove-a-1.jpg"],
    maxCapacity: 17,
    recommendCapacity: 13,
    baseCapacity: 15,
    extraCharge: 1000,
    pricePerHour: 22000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "B룸",
    branch: "그루브 사당점",
    businessId: "sadang",
    bizItemId: "14",
    imageUrls: ["/pick-habju/public/images/habjusil/groove/groove-b-1.jpg"],
    maxCapacity: 16,
    recommendCapacity: 12,
    baseCapacity: 12,
    extraCharge: 1000,
    pricePerHour: 20000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "C룸",
    branch: "그루브 사당점",
    businessId: "sadang",
    bizItemId: "15",
    imageUrls: ["/pick-habju/public/images/habjusil/groove/groove-c-1.jpg"],
    maxCapacity: 10,
    recommendCapacity: 8,
    baseCapacity: 8,
    extraCharge: 1000,
    pricePerHour: 17000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "D룸",
    branch: "그루브 사당점",
    businessId: "sadang",
    bizItemId: "16",
    imageUrls: ["/pick-habju/public/images/habjusil/groove/groove-d-1.jpg"],
    maxCapacity: 8,
    recommendCapacity: 6,
    baseCapacity: 6,
    extraCharge: 1000,
    pricePerHour: 15000,
    subway: {
      station: "이수역",
      timeToWalk: "도보 4분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: false
  },
  {
    name: "V룸",
    branch: "드림합주실 사당점",
    businessId: "dream_sadang",
    bizItemId: "25",
    imageUrls:["/pick-habju/public/images/habjusil/dream/dream-v-1.jpg","/pick-habju/public/images/habjusil/dream/dream-v-2.jpg","/pick-habju/public/images/habjusil/dream/dream-v-3.jpg","/pick-habju/public/images/habjusil/dream/dream-v-4.jpg"],
    maxCapacity: 30,
    recommendCapacity: 17,
    baseCapacity: 13,
    extraCharge: 1000,
    pricePerHour: 25000,
    subway: {
      station: "사당역",
      timeToWalk: "도보 6분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true
  },
	{
    name: "S룸",
    branch: "드림합주실 사당점",
    businessId: "dream_sadang",
    bizItemId: "26",
    imageUrls:["/pick-habju/public/images/habjusil/dream/dream-s-1.jpg","/pick-habju/public/images/habjusil/dream/dream-s-2.jpg","/pick-habju/public/images/habjusil/dream/dream-s-3.jpg","/pick-habju/public/images/habjusil/dream/dream-s-4.jpg"],
    maxCapacity: 25,
    recommendCapacity: 15,
    baseCapacity: 12,
    extraCharge: 1000,
    pricePerHour: 23000,
    subway: {
      station: "사당역",
      timeToWalk: "도보 6분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true
  },
	{
    name: "Q룸",
    branch: "드림합주실 사당점",
    businessId: "dream_sadang",
    bizItemId: "27",
    imageUrls: ["/pick-habju/public/images/habjusil/dream/dream-q-1.jpg", "/pick-habju/public/images/habjusil/dream/dream-q-2.jpg", "/pick-habju/public/images/habjusil/dream/dream-q-3.jpg", "/pick-habju/public/images/habjusil/dream/dream-q-4.jpg"],
    maxCapacity: 17,
    recommendCapacity: 13,
    baseCapacity: 10,
    extraCharge: 1000,
    pricePerHour: 21000,
    subway: {
      station: "사당역",
      timeToWalk: "도보 6분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true
  },
	{
    name: "C룸",
    branch: "드림합주실 사당점",
    businessId: "dream_sadang",
    bizItemId: "28",
    imageUrls: ["/pick-habju/public/images/habjusil/dream/dream-c-1.jpg", "/pick-habju/public/images/habjusil/dream/dream-c-2.jpg", "/pick-habju/public/images/habjusil/dream/dream-c-3.jpg", "/pick-habju/public/images/habjusil/dream/dream-c-4.jpg"],
    maxCapacity: 10,
    recommendCapacity: 9,
    baseCapacity: 8,
    extraCharge: 1000,
    pricePerHour: 17000,
    subway: {
      station: "사당역",
      timeToWalk: "도보 6분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true
  },
  {
    name: "D룸",
    branch: "드림합주실 사당점",
    businessId: "dream_sadang",
    bizItemId: "29",
    imageUrls: ["/pick-habju/public/images/habjusil/dream/dream-d-1.jpg", "/pick-habju/public/images/habjusil/dream/dream-d-2.jpg", "/pick-habju/public/images/habjusil/dream/dream-d-3.jpg", "/pick-habju/public/images/habjusil/dream/dream-d-4.jpg"],
    maxCapacity: 6,
    recommendCapacity: 5,
    baseCapacity: 5,
    extraCharge: 1000,
    pricePerHour: 12000,
    subway: {
      station: "사당역",
      timeToWalk: "도보 6분"
    },
    canReserveOneHour: true,
    requiresCallOnSameDay: true
  },
];
