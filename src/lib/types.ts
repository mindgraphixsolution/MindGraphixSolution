import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface Service {
  id: number | string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: LucideIcon;
  iconName?: string;
  features?: string[];
  pricing?: string;
  duration?: string;
  gradient?: string;
  image?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: 'web' | 'design' | 'ecommerce' | 'motion';
  image: string;
  description: string;
  tags?: string[];
  client?: string;
  order?: number;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Tech' | 'Design' | 'Business' | 'News';
  author: string;
  date: string;
  readTime: string;
  image: string;
  featured?: boolean;
  tags?: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  image: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  socials: {
    linkedin?: string;
    github?: string;
    behance?: string;
    dribbble?: string;
  };
}

export interface Statistic {
  label: string;
  value: number;
  suffix?: string;
}
