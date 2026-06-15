export type UserRole = 'admin' | 'editor' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  featuredImage: string;
  author: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  seoTitle: string;
  seoDescription: string;
  readingTime: number;
  keywords?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  articleId: string;
  userId: string;
  displayName: string;
  content: string;
  createdAt: string;
  approved: boolean;
}

export interface Bookmark {
  id: string;
  userId: string;
  articleId: string;
  createdAt: string;
}

export interface AnalyticsRecord {
  id: string;
  name: string;
  value: number;
  updatedAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}
