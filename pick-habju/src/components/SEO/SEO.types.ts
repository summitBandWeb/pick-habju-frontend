export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  url: string;
  type?: 'website' | 'article';
}
