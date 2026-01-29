import type { SEOProps } from './SEO.types';

/*
 * SEO 컴포넌트
 * 
 * React 19의 네이티브 기능을 사용하여 메타 태그를 관리합니다.
 * 컴포넌트 내부에서 직접 <title>, <meta> 태그를 렌더링할 수 있습니다.
 * react-helmet-async 라이브러리를 사용하지 않습니다. >> React 19에서 지원하지 않음
 * 
 */

export const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  url = 'https://pickhabju.com',
  type = 'website',
}: SEOProps) => {
  return (
    <>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="픽합주" />
      <link rel="canonical" href={url} />

      {/* Open Graph (카카오톡, 페이스북 등) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="픽합주" />
      <meta property="og:locale" content="ko_KR" />
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter Card (트위터/X 공유) */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}
    </>
  );
};
