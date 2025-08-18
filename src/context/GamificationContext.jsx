import React, { createContext, useContext, useState, useEffect } from 'react';

const GamificationContext = createContext();

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ children }) => {
  const [userStats, setUserStats] = useState(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : {
      xp: 0,
      level: 1,
      totalSessions: 0,
      totalStudyTime: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastStudyDate: null,
      badges: [],
      achievements: [],
      dailyQuests: [],
      weeklyGoal: 0,
      weeklyProgress: 0,
      subjectMastery: {},
      prestigeLevel: 0,
      sessionHistory: []
    };
  });

  const [showRewards, setShowRewards] = useState(false);
  const [recentRewards, setRecentRewards] = useState([]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  // Calculate XP needed for next level
  const getXPForNextLevel = (level) => {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  };

  // Calculate level from XP
  const getLevelFromXP = (xp) => {
    let level = 1;
    let xpNeeded = 0;
    while (xp >= xpNeeded) {
      xpNeeded += getXPForNextLevel(level);
      level++;
    }
    return level - 1;
  };

  // Calculate XP progress to next level
  const getXPProgress = () => {
    const currentLevelXP = userStats.xp - getTotalXPForLevel(userStats.level - 1);
    const xpNeeded = getXPForNextLevel(userStats.level);
    return Math.min(100, (currentLevelXP / xpNeeded) * 100);
  };

  const getTotalXPForLevel = (level) => {
    let total = 0;
    for (let i = 1; i <= level; i++) {
      total += getXPForNextLevel(i);
    }
    return total;
  };

  // Award XP for study session
  const awardXP = (sessionDuration, subjectName, streakBonus = 0) => {
    const baseXP = Math.floor(sessionDuration / 5); // 1 XP per 5 minutes
    const streakMultiplier = 1 + (streakBonus * 0.1); // 10% bonus per streak day
    const subjectBonus = userStats.subjectMastery[subjectName] ? 1.2 : 1; // 20% bonus for mastered subjects
    
    let totalXP = Math.floor(baseXP * streakMultiplier * subjectBonus);
    
    // Random bonus (5% chance for 50% bonus)
    if (Math.random() < 0.05) {
      totalXP = Math.floor(totalXP * 1.5);
      addReward('Lucky Scholar!', '+50% bonus XP', 'gold');
    }

    const oldLevel = userStats.level;
    const newXP = userStats.xp + totalXP;
    const newLevel = getLevelFromXP(newXP);

    setUserStats(prev => ({
      ...prev,
      xp: newXP,
      level: newLevel,
      totalSessions: prev.totalSessions + 1,
      totalStudyTime: prev.totalStudyTime + sessionDuration
    }));

    // Check for level up
    if (newLevel > oldLevel) {
      addReward('Level Up!', `Reached Level ${newLevel}`, 'purple');
      checkAchievements();
    }

    return totalXP;
  };

  // Update streak
  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastStudy = userStats.lastStudyDate ? new Date(userStats.lastStudyDate).toDateString() : null;
    
    if (lastStudy === today) {
      return userStats.currentStreak; // Already studied today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toDateString();

    let newStreak;
    if (lastStudy === yesterdayStr) {
      newStreak = userStats.currentStreak + 1;
    } else {
      newStreak = 1;
    }

    setUserStats(prev => ({
      ...prev,
      currentStreak: newStreak,
      longestStreak: Math.max(prev.longestStreak, newStreak),
      lastStudyDate: new Date().toISOString()
    }));

    // Check streak achievements
    if (newStreak === 7) addReward('Week Warrior!', '7-day streak!', 'blue');
    if (newStreak === 30) addReward('Streak Master!', '30-day streak!', 'gold');
    if (newStreak === 100) addReward('Century Club!', '100-day streak!', 'diamond');

    return newStreak;
  };

  // Add reward notification
  const addReward = (title, description, type = 'default') => {
    const reward = {
      id: Date.now(),
      title,
      description,
      type,
      timestamp: new Date().toISOString()
    };

    setRecentRewards(prev => [reward, ...prev.slice(0, 4)]);
    setShowRewards(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setShowRewards(false);
    }, 3000);
  };

  // Check for achievements
  const checkAchievements = () => {
    const achievements = [
      {
        id: 'first_session',
        title: 'First Steps',
        description: 'Complete your first study session',
        condition: () => userStats.totalSessions === 1,
        icon: '🎯'
      },
      {
        id: 'ten_hours_week',
        title: 'Dedicated Scholar',
        description: 'Study 10 hours in a week',
        condition: () => getWeeklyStudyTime() >= 600,
        icon: '📚'
      },
      {
        id: 'level_10',
        title: 'Rising Star',
        description: 'Reach level 10',
        condition: () => userStats.level >= 10,
        icon: '⭐'
      },
      {
        id: 'level_50',
        title: 'Academic Weapon',
        description: 'Reach level 50',
        condition: () => userStats.level >= 50,
        icon: '⚡'
      },
      {
        id: 'hundred_sessions',
        title: 'Century Scholar',
        description: 'Complete 100 study sessions',
        condition: () => userStats.totalSessions >= 100,
        icon: '🏆'
      }
    ];

    achievements.forEach(achievement => {
      if (!userStats.achievements.includes(achievement.id) && achievement.condition()) {
        setUserStats(prev => ({
          ...prev,
          achievements: [...prev.achievements, achievement.id]
        }));
        addReward(achievement.title, achievement.description, 'achievement');
      }
    });
  };

  // Get weekly study time
  const getWeeklyStudyTime = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return userStats.sessionHistory
      .filter(session => new Date(session.timestamp) > oneWeekAgo)
      .reduce((total, session) => total + session.duration, 0);
  };

  // Add study session to history
  const addStudySession = (sessionData) => {
    const session = {
      ...sessionData,
      timestamp: new Date().toISOString(),
      xpEarned: awardXP(sessionData.durationMinutes, sessionData.subjectName, userStats.currentStreak)
    };

    setUserStats(prev => ({
      ...prev,
      sessionHistory: [session, ...prev.sessionHistory.slice(0, 99)] // Keep last 100 sessions
    }));

    updateStreak();
    checkAchievements();
  };

  // Get user rank/title
  const getUserRank = () => {
    if (userStats.level >= 50) return 'Academic Weapon';
    if (userStats.level >= 30) return 'Mastermind';
    if (userStats.level >= 20) return 'Scholar Elite';
    if (userStats.level >= 10) return 'Rising Star';
    if (userStats.level >= 5) return 'Dedicated Learner';
    return 'Rookie Scholar';
  };

  // Generate daily quests
  const generateDailyQuests = () => {
    const quests = [
      {
        id: 'study_45_min',
        title: 'Study 45 Minutes',
        description: 'Complete a 45-minute study session',
        progress: 0,
        target: 45,
        reward: 50,
        type: 'time'
      },
      {
        id: 'complete_3_tasks',
        title: 'Task Master',
        description: 'Complete 3 tasks today',
        progress: 0,
        target: 3,
        reward: 30,
        type: 'tasks'
      },
      {
        id: 'study_2_subjects',
        title: 'Multi-Subject',
        description: 'Study 2 different subjects',
        progress: 0,
        target: 2,
        reward: 40,
        type: 'subjects'
      }
    ];

    setUserStats(prev => ({
      ...prev,
      dailyQuests: quests
    }));
  };

  // Update quest progress
  const updateQuestProgress = (questId, progress) => {
    setUserStats(prev => ({
      ...prev,
      dailyQuests: prev.dailyQuests.map(quest => 
        quest.id === questId 
          ? { ...quest, progress: Math.min(quest.target, quest.progress + progress) }
          : quest
      )
    }));
  };

  const value = {
    userStats,
    showRewards,
    recentRewards,
    awardXP,
    updateStreak,
    addReward,
    addStudySession,
    getUserRank,
    getXPProgress,
    getXPForNextLevel,
    generateDailyQuests,
    updateQuestProgress,
    getWeeklyStudyTime,
    setShowRewards
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
