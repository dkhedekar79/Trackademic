import { lazy } from 'react';

// Lazy load all page components with proper error boundaries
export const LazyLanding = lazy(() => import('../pages/Landing'));
export const LazyLogin = lazy(() => import('../pages/Login'));
export const LazySignup = lazy(() => import('../pages/Signup'));
export const LazyDashboard = lazy(() => import('../pages/Dashboard'));
export const LazyGamifiedDashboard = lazy(() => import('./GamifiedDashboard'));
export const LazySubjects = lazy(() => import('../pages/Subjects'));
export const LazyStudy = lazy(() => import('../pages/Study'));
export const LazyTasks = lazy(() => import('../pages/Tasks'));
export const LazySchedule = lazy(() => import('../pages/Schedule'));
export const LazyInsights = lazy(() => import('../pages/Insights'));
export const LazyPrivacy = lazy(() => import('../pages/Privacy'));

// Lazy load heavy components
export const LazySidebar = lazy(() => import('./Sidebar'));
export const LazyNavbar = lazy(() => import('./Navbar'));
export const LazyAchievementSystem = lazy(() => import('./AchievementSystem'));
export const LazyLeaderboardSystem = lazy(() => import('./LeaderboardSystem'));
export const LazyMysteryBox = lazy(() => import('./MysteryBox'));
export const LazyPremiumSystem = lazy(() => import('./PremiumSystem'));
export const LazyQuestSystem = lazy(() => import('./QuestSystem'));
export const LazyRewardSystem = lazy(() => import('./RewardSystem'));
export const LazyStreakTracker = lazy(() => import('./StreakTracker'));
