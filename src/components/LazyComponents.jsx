import { lazy } from 'react';

// Lazy load all page components with proper error boundaries
export const LazyLanding = lazy(() => 
  import('../pages/Landing').catch(() => import('./ErrorFallback'))
);

export const LazyLogin = lazy(() => 
  import('../pages/Login').catch(() => import('./ErrorFallback'))
);

export const LazySignup = lazy(() => 
  import('../pages/Signup').catch(() => import('./ErrorFallback'))
);

export const LazyDashboard = lazy(() => 
  import('../pages/Dashboard').catch(() => import('./ErrorFallback'))
);

export const LazyGamifiedDashboard = lazy(() => 
  import('./GamifiedDashboard').catch(() => import('./ErrorFallback'))
);

export const LazySubjects = lazy(() => 
  import('../pages/Subjects').catch(() => import('./ErrorFallback'))
);

export const LazyStudy = lazy(() => 
  import('../pages/Study').catch(() => import('./ErrorFallback'))
);

export const LazyTasks = lazy(() => 
  import('../pages/Tasks').catch(() => import('./ErrorFallback'))
);

export const LazySchedule = lazy(() => 
  import('../pages/Schedule').catch(() => import('./ErrorFallback'))
);

export const LazyInsights = lazy(() => 
  import('../pages/Insights').catch(() => import('./ErrorFallback'))
);

export const LazyPrivacy = lazy(() => 
  import('../pages/Privacy').catch(() => import('./ErrorFallback'))
);

// Lazy load heavy components
export const LazySidebar = lazy(() => 
  import('./Sidebar').catch(() => import('./ErrorFallback'))
);

export const LazyNavbar = lazy(() => 
  import('./Navbar').catch(() => import('./ErrorFallback'))
);

export const LazyAchievementSystem = lazy(() => 
  import('./AchievementSystem').catch(() => import('./ErrorFallback'))
);

export const LazyLeaderboardSystem = lazy(() => 
  import('./LeaderboardSystem').catch(() => import('./ErrorFallback'))
);

export const LazyMysteryBox = lazy(() => 
  import('./MysteryBox').catch(() => import('./ErrorFallback'))
);

export const LazyPremiumSystem = lazy(() => 
  import('./PremiumSystem').catch(() => import('./ErrorFallback'))
);

export const LazyQuestSystem = lazy(() => 
  import('./QuestSystem').catch(() => import('./ErrorFallback'))
);

export const LazyRewardSystem = lazy(() => 
  import('./RewardSystem').catch(() => import('./ErrorFallback'))
);

export const LazyStreakTracker = lazy(() => 
  import('./StreakTracker').catch(() => import('./ErrorFallback'))
);
