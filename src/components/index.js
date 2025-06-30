// Main Components Index
// Re-export all components from their respective modules for easy access

// === CATEGORY EXPORTS ===
// Layout Components
export * from './layout';

// Blog Components  
export * from './blog';

// UI Components
export * from './ui';

// Performance Components
export * from './performance';

// Form Components
export * from './forms';

// === ROOT LEVEL COMPONENTS ===
// Keep Hero at root level (main landing component)
export { default as Hero } from './Hero';
export { default as ServiceWorkerRegistration } from './ServiceWorkerRegistration';

// === CONVENIENT GROUPED EXPORTS ===
// For when you need to destructure multiple components from the same category

// Layout components as a namespace
export const Layout = {
  Header: require('./layout/Header').default,
  Footer: require('./layout/Footer').default,
};

// Blog components as a namespace
export const Blog = {
  BlogCard: require('./blog/BlogCard').default,
  BlogContent: require('./blog/BlogContent').default,
  BlogGrid: require('./blog/BlogGrid').default,
};

// UI components as a namespace
export const UI = {
  AnimatedBackground: require('./ui/AnimatedBackground').default,
  TypingAnimation: require('./ui/TypingAnimation').default,
  ThemeSwitcher: require('./ui/ThemeSwitcher').default,
};

// Performance components as a namespace
export const Performance = {
  PerformanceMonitor: require('./performance/PerformanceMonitor').default,
  PerformanceBudget: require('./performance/PerformanceBudget').default,
  CriticalResourcePreloader: require('./performance/CriticalResourcePreloader').default,
};

// Form components as a namespace
export const Forms = {
  ContactForm: require('./forms/ContactForm').default,
};

// === USAGE EXAMPLES ===
/*
// Individual imports (recommended):
import { Header, Footer } from '@/components/layout';
import { BlogCard, BlogGrid } from '@/components/blog';
import { Hero } from '@/components';

// Namespace imports (when you need multiple from same category):
import { Layout, Blog } from '@/components';
// Then use: Layout.Header, Blog.BlogCard, etc.

// Mixed imports:
import Hero, { Layout, UI } from '@/components';
*/
