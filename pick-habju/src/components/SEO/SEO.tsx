import type { SEOProps } from './SEO.types';

/*
 * SEO 컴포넌트
 * 
 * React 19의 네이티브 기능을 사용하여 메타 태그를 관리합니다.
 * 컴포넌트 내부에서 직접 <title>, <meta> 태그를 렌더링할 수 있습니다.
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

      {/* Open Graph (카카오톡, 페이스북 등) */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      {ogImage && <meta property="og:image" content={ogImage} />}
    </>
  );
};
