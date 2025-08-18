import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Star, 
  Trophy, 
  Target, 
  Fire, 
  Crown, 
  TrendingUp, 
  Calendar,
  Award,
  Zap,
  BookOpen,
  Clock,
  Users,
  Share2
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { AnimatedProgressBar, NotificationBadge } from './RewardAnimations';

const GamifiedDashboard = () => {
  const { 
    userStats, 
    getUserRank, 
    getStreakStatus, 
    calculateProgressToNextLevel,
    calculateXPForNextLevel
  } = useGamification();

  const [activeTab, setActiveTab] = useState('overview');

  const streakStatus = getStreakStatus();
  const userRank = getUserRank();
  const progressToNextLevel = calculateProgressToNextLevel(userStats.xp, userStats.level);
  const xpForNextLevel = calculateXPForNextLevel(userStats.level);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Star },
    { id: 'quests', label: 'Quests', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'social', label: 'Social', icon: Users }
  ];

  const getStreakEmoji = (streak) => {
    if (streak >= 100) return '👑';
    if (streak >= 50) return '🔥';
    if (streak >= 30) return '⚡';
    if (streak >= 7) return '💪';
    return '🌟';
  };

  const getLevelColor = (level) => {
    if (level >= 50) return 'from-purple-600 to-pink-600';
    if (level >= 30) return 'from-blue-600 to-purple-600';
    if (level >= 20) return 'from-green-600 to-blue-600';
    if (level >= 10) return 'from-yellow-600 to-green-600';
    return 'from-orange-600 to-yellow-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header with Level and Rank */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-xl p-6 mb-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className={`w-20 h-20 rounded-full bg-gradient-to-r ${getLevelColor(userStats.level)} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}
            >
              {userStats.level}
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{userRank}</h1>
              <p className="text-gray-600">Level {userStats.level} • {userStats.prestige > 0 && `Prestige ${userStats.prestige}`}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">
                  {userStats.xp.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-2 mb-2">
              <Fire className="w-5 h-5 text-orange-500" />
              <span className="text-lg font-bold text-gray-800">
                {getStreakEmoji(userStats.currentStreak)} {userStats.currentStreak}
              </span>
            </div>
            <p className="text-sm text-gray-600">Day Streak</p>
            <p className={`text-xs ${streakStatus.status === 'warning' ? 'text-orange-600' : streakStatus.status === 'broken' ? 'text-red-600' : 'text-green-600'}`}>
              {streakStatus.message}
            </p>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="mt-6">
          <AnimatedProgressBar 
            progress={progressToNextLevel} 
            label={`Progress to Level ${userStats.level + 1}`}
            color="purple"
          />
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab userStats={userStats} />
        )}
        
        {activeTab === 'quests' && (
          <QuestsTab userStats={userStats} />
        )}
        
        {activeTab === 'achievements' && (
          <AchievementsTab userStats={userStats} />
        )}
        
        {activeTab === 'social' && (
          <SocialTab userStats={userStats} />
        )}
      </div>
    </div>
  );
};

// Overview Tab
const OverviewTab = ({ userStats }) => {
  const stats = [
    {
      label: 'Total Study Time',
      value: `${Math.round(userStats.totalStudyTime / 60)}h`,
      icon: Clock,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Total Sessions',
      value: userStats.totalSessions,
      icon: BookOpen,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Longest Streak',
      value: userStats.longestStreak,
      icon: Fire,
      color: 'from-orange-500 to-orange-600'
    },
    {
      label: 'Achievements',
      value: userStats.achievements.length,
      icon: Award,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

// Quests Tab
const QuestsTab = ({ userStats }) => {
  const allQuests = [...userStats.dailyQuests, ...userStats.weeklyQuests];
  const completedQuests = allQuests.filter(q => q.completed).length;
  const totalQuests = allQuests.length;

  return (
    <div className="space-y-6">
      {/* Quest Progress Overview */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Quest Progress</h2>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-gray-600">
              {completedQuests}/{totalQuests} Completed
            </span>
          </div>
        </div>
        <AnimatedProgressBar 
          progress={(completedQuests / totalQuests) * 100} 
          label="Overall Quest Completion"
          color="blue"
        />
      </div>

      {/* Daily Quests */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-green-500" />
          Daily Quests
        </h3>
        <div className="space-y-3">
          {userStats.dailyQuests.map((quest, index) => (
            <QuestItem key={index} quest={quest} />
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          Weekly Quests
        </h3>
        <div className="space-y-3">
          {userStats.weeklyQuests.map((quest, index) => (
            <QuestItem key={index} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Quest Item Component
const QuestItem = ({ quest }) => {
  const progress = (quest.progress / quest.target) * 100;
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-4 rounded-xl border-2 transition-all ${
        quest.completed 
          ? 'border-green-200 bg-green-50' 
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            quest.completed ? 'bg-green-500' : 'bg-blue-500'
          }`}>
            {quest.completed ? (
              <Target className="w-4 h-4 text-white" />
            ) : (
              <Target className="w-4 h-4 text-white" />
            )}
          </div>
          <div>
            <h4 className={`font-medium ${
              quest.completed ? 'text-green-800' : 'text-gray-800'
            }`}>
              {quest.name}
            </h4>
            <p className="text-sm text-gray-600">{quest.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">+{quest.xp} XP</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${
            quest.completed 
              ? 'bg-green-100 text-green-700' 
              : 'bg-blue-100 text-blue-700'
          }`}>
            {quest.completed ? 'Completed' : `${Math.round(progress)}%`}
          </span>
        </div>
      </div>
      
      {!quest.completed && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
          />
        </div>
      )}
    </motion.div>
  );
};

// Achievements Tab
const AchievementsTab = ({ userStats }) => {
  const { achievements } = useGamification();
  const unlockedAchievements = userStats.achievements;
  const lockedAchievements = Object.values(achievements).filter(
    achievement => !unlockedAchievements.find(u => u.id === achievement.id)
  );

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Achievement Progress</h2>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">
              {unlockedAchievements.length}/{Object.keys(achievements).length} Unlocked
            </span>
          </div>
        </div>
        <AnimatedProgressBar 
          progress={(unlockedAchievements.length / Object.keys(achievements).length) * 100} 
          label="Achievement Completion"
          color="yellow"
        />
      </div>

      {/* Unlocked Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-green-500" />
          Unlocked Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unlockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-green-800">{achievement.name}</h4>
                  <p className="text-sm text-green-700">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-medium text-green-700">+{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-500" />
          Locked Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lockedAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-gray-50 border-2 border-gray-200 opacity-60"
            >
              <div className="flex items-center gap-3">
                <div className="text-3xl filter grayscale">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-600">{achievement.name}</h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500">+{achievement.xp} XP</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Social Tab
const SocialTab = ({ userStats }) => {
  return (
    <div className="space-y-6">
      {/* Leaderboard Placeholder */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          Global Leaderboard
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Coming Soon!</p>
          <p className="text-sm">Compete with students worldwide</p>
        </div>
      </div>

      {/* Friend Challenges */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-500" />
          Friend Challenges
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Challenge Friends!</p>
          <p className="text-sm">7-day or 30-day streak battles</p>
        </div>
      </div>

      {/* Study Rooms */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-500" />
          Study Rooms
        </h3>
        <div className="text-center py-8 text-gray-500">
          <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg font-medium">Virtual Study Groups</p>
          <p className="text-sm">Join live Pomodoro sessions</p>
        </div>
      </div>

      {/* Share Progress */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Share Your Progress!</h3>
            <p className="text-sm opacity-90">Flex your achievements on social media</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default GamifiedDashboard;
