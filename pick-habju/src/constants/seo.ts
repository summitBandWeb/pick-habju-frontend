import type { SEOProps } from '../components/SEO/SEO.types';

/*
 * SEO 메타데이터 상수
 * 
 * 페이지별 SEO 정보를 중앙에서 관리.
 */

/* 기본 SEO 정보 */
export const DEFAULT_SEO = {
  siteName: '픽합주',
  siteUrl: 'https://www.pickhabju.com',
  defaultImage: 'https://www.pickhabju.com/images/test-image.jpg',
} as const;

/* 페이지별 SEO 메타데이터 */
export const SEO_METADATA: Record<string, Omit<SEOProps, 'url'>> = {
  home: {
    title: '합주실 예약을 한 번에 찾는 방법 | PickHabju (픽합주)',
    description:
      'PickHabju(픽합주)는 지역, 시간, 인원 조건에 맞춰 예약 가능한 합주실을 한 번에 조회할 수 있는 서비스입니다.',
    keywords: '합주실, 합주실예약, 연습실, 밴드연습실, 픽합주',
  },
  // 추후 페이지가 추가되면 여기에 추가
  // anotherPage: {
  //   title: '픽합주 소개',
  //   description: '픽합주는...',
  //   keywords: '픽합주, 소개',
  // },
} as const;
