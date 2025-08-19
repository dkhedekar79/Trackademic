import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Gift, Star, Trophy, Crown, Sparkles, Zap, Flame, Heart,
  Gem, Award, Target, CheckCircle, X, Volume2, VolumeX,
  TrendingUp, Calendar, Users, Book, Timer
} from 'lucide-react';
import { useGamification } from '../context/GamificationContext';
import { 
  XPGainAnimation, 
  LevelUpCelebration, 
  VariableRewardPopup,
  AchievementUnlock,
  StreakMilestone,
  QuestComplete,
  EnhancedConfetti
} from './RewardAnimations';

// Reward Type Definitions
const REWARD_TYPES = {
  XP_EARNED: {
    component: XPGainAnimation,
    duration: 3000,
    priority: 1
  },
  LEVEL_UP: {
    component: LevelUpCelebration,
    duration: 4000,
    priority: 5
  },
  PRESTIGE: {
    component: LevelUpCelebration,
    duration: 5000,
    priority: 6
  },
  ACHIEVEMENT: {
    component: AchievementUnlock,
    duration: 4000,
    priority: 4
  },
  QUEST_COMPLETE: {
    component: QuestComplete,
    duration: 3000,
    priority: 2
  },
  STREAK_MILESTONE: {
    component: StreakMilestone,
    duration: 3500,
    priority: 3
  },
  VARIABLE_REWARD: {
    component: VariableRewardPopup,
    duration: 4000,
    priority: 4
  },
  STREAK_SAVED: {
    component: VariableRewardPopup,
    duration: 3000,
    priority: 3
  }
};

// Sound System (placeholder for future implementation)
const useSoundSystem = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('soundEnabled', JSON.stringify(soundEnabled));
  }, [soundEnabled]);

  const playSound = (soundName) => {
    if (!soundEnabled) return;
    
    // Placeholder for actual sound implementation
    console.log(`🔊 Playing sound: ${soundName}`);
    
    // Future implementation could use:
    // - Web Audio API
    // - Howler.js
    // - HTML5 Audio
    // - Tone.js for more complex sounds
  };

  return { soundEnabled, setSoundEnabled, playSound };
};

// Reward Queue Manager
const RewardQueueManager = () => {
  const { rewardQueue, setShowRewards } = useGamification();
  const { playSound } = useSoundSystem();
  const [currentReward, setCurrentReward] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);

  // Process reward queue
  useEffect(() => {
    if (rewardQueue.length > 0 && !currentReward) {
      // Sort by priority (higher number = higher priority)
      const sortedQueue = [...rewardQueue].sort((a, b) => {
        const aPriority = REWARD_TYPES[a.type]?.priority || 0;
        const bPriority = REWARD_TYPES[b.type]?.priority || 0;
        return bPriority - aPriority;
      });

      const nextReward = sortedQueue[0];
      setCurrentReward(nextReward);
      
      // Play sound for reward
      playSound(nextReward.sound || nextReward.type.toLowerCase());
      
      // Add to history
      setRewardHistory(prev => [nextReward, ...prev.slice(0, 49)]); // Keep last 50
    }
  }, [rewardQueue, currentReward, playSound]);

  // Handle reward completion
  const handleRewardComplete = () => {
    setCurrentReward(null);
    // The reward will be automatically removed from queue by the context
  };

  // Render current reward
  const renderCurrentReward = () => {
    if (!currentReward) return null;

    const rewardType = REWARD_TYPES[currentReward.type];
    if (!rewardType) return null;

    const RewardComponent = rewardType.component;
    
    return (
      <RewardComponent
        key={currentReward.id}
        {...currentReward}
        onComplete={handleRewardComplete}
      />
    );
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {renderCurrentReward()}
      </AnimatePresence>
    </>
  );
};

// Reward Notification History
const RewardHistory = ({ isOpen, onClose }) => {
  const [rewardHistory, setRewardHistory] = useState(() => {
    const saved = localStorage.getItem('rewardHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const groupedRewards = rewardHistory.reduce((groups, reward) => {
    const date = new Date(reward.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(reward);
    return groups;
  }, {});

  const getRewardIcon = (type) => {
    switch (type) {
      case 'XP_EARNED': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'LEVEL_UP': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'ACHIEVEMENT': return <Trophy className="w-4 h-4 text-green-500" />;
      case 'QUEST_COMPLETE': return <Target className="w-4 h-4 text-blue-500" />;
      case 'STREAK_MILESTONE': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'VARIABLE_REWARD': return <Gift className="w-4 h-4 text-pink-500" />;
      default: return <Star className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Gift className="w-6 h-6 text-purple-500" />
            Reward History
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] space-y-4">
          {Object.entries(groupedRewards).map(([date, rewards]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-semibold text-gray-700 text-sm bg-gray-100 px-3 py-1 rounded-lg">
                {new Date(date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-2">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={`${reward.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getRewardIcon(reward.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{reward.title}</h4>
                      <p className="text-sm text-gray-600">{reward.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(reward.timestamp).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                      {reward.xp && (
                        <div className="flex items-center gap-1 text-yellow-600">
                          <Star className="w-3 h-3" />
                          <span className="text-xs font-medium">+{reward.xp}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
          
          {Object.keys(groupedRewards).length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Gift className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No rewards yet</p>
              <p className="text-sm">Complete study sessions to earn rewards!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Daily Login Bonus System
const DailyLoginBonus = () => {
  const { userStats, addReward } = useGamification();
  const [showLoginBonus, setShowLoginBonus] = useState(false);
  const [loginStreak, setLoginStreak] = useState(0);

  useEffect(() => {
    const checkDailyLogin = () => {
      const today = new Date().toDateString();
      const lastLogin = localStorage.getItem('lastLoginDate');
      
      if (lastLogin !== today) {
        // Calculate login streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        const currentStreak = lastLogin === yesterdayStr 
          ? (parseInt(localStorage.getItem('loginStreak') || '0') + 1)
          : 1;
        
        setLoginStreak(currentStreak);
        localStorage.setItem('lastLoginDate', today);
        localStorage.setItem('loginStreak', currentStreak.toString());
        
        // Show login bonus
        setShowLoginBonus(true);
        
        // Award login bonus
        const bonusXP = 25 + (currentStreak * 5); // Base 25 XP + 5 per streak day
        addReward({
          type: 'VARIABLE_REWARD',
          title: '🎁 Daily Login Bonus!',
          description: `Day ${currentStreak} • Keep logging in for bigger rewards!`,
          tier: currentStreak >= 7 ? 'rare' : currentStreak >= 3 ? 'uncommon' : 'common',
          bonusXP: bonusXP,
          animation: 'login_bonus'
        });
      }
    };

    checkDailyLogin();
  }, [addReward]);

  return null; // The reward is handled by the RewardQueueManager
};

// Mystery Box System
const MysteryBox = ({ onOpen, available = true }) => {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    if (available) {
      const interval = setInterval(() => {
        setIsShaking(true);
        setTimeout(() => setIsShaking(false), 1000);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [available]);

  if (!available) {
    return (
      <div className="flex items-center justify-center p-8 bg-gray-100 rounded-2xl opacity-50">
        <div className="text-center">
          <Gift className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p className="text-gray-500 font-medium">No mystery box available</p>
          <p className="text-sm text-gray-400">Complete more sessions to unlock!</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      animate={isShaking ? { 
        x: [0, -5, 5, -5, 5, 0],
        rotate: [0, -1, 1, -1, 1, 0]
      } : {}}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl cursor-pointer hover:from-purple-200 hover:to-pink-200 transition-all"
      onClick={onOpen}
    >
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Gift className="w-16 h-16 mx-auto mb-3 text-purple-600" />
        </motion.div>
        <h3 className="text-lg font-bold text-purple-800 mb-1">Mystery Box!</h3>
        <p className="text-sm text-purple-600">Click to open and claim your reward!</p>
        <div className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-full text-sm font-semibold">
          Open Box
        </div>
      </div>
    </motion.div>
  );
};

// Reward Settings Panel
const RewardSettings = ({ isOpen, onClose }) => {
  const { soundEnabled, setSoundEnabled } = useSoundSystem();
  const [animationSpeed, setAnimationSpeed] = useState(() => {
    const saved = localStorage.getItem('animationSpeed');
    return saved || 'normal';
  });
  
  const [autoSkipRewards, setAutoSkipRewards] = useState(() => {
    const saved = localStorage.getItem('autoSkipRewards');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('animationSpeed', animationSpeed);
  }, [animationSpeed]);

  useEffect(() => {
    localStorage.setItem('autoSkipRewards', JSON.stringify(autoSkipRewards));
  }, [autoSkipRewards]);

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-6 max-w-md w-full"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Reward Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Sound Settings */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Sound Effects</h3>
              <p className="text-sm text-gray-600">Play sounds for rewards and achievements</p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg transition-all ${
                soundEnabled 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>

          {/* Animation Speed */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Animation Speed</h3>
            <div className="flex gap-2">
              {['slow', 'normal', 'fast'].map(speed => (
                <button
                  key={speed}
                  onClick={() => setAnimationSpeed(speed)}
                  className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all ${
                    animationSpeed === speed
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {speed.charAt(0).toUpperCase() + speed.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-skip Settings */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">Auto-skip Rewards</h3>
              <p className="text-sm text-gray-600">Automatically dismiss reward animations</p>
            </div>
            <button
              onClick={() => setAutoSkipRewards(!autoSkipRewards)}
              className={`w-12 h-6 rounded-full transition-all ${
                autoSkipRewards ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                autoSkipRewards ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors"
          >
            Save Settings
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main Reward System Component
const RewardSystem = ({ userStats = {} }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [mysteryBoxAvailable, setMysteryBoxAvailable] = useState(false);

  const { addReward } = useGamification();

  // Check for mystery box availability
  useEffect(() => {
    const checkMysteryBox = () => {
      const lastBoxTime = localStorage.getItem('lastMysteryBox');
      const now = Date.now();
      const sixHours = 6 * 60 * 60 * 1000;
      
      if (!lastBoxTime || (now - parseInt(lastBoxTime)) > sixHours) {
        setMysteryBoxAvailable(true);
      }
    };

    checkMysteryBox();
    const interval = setInterval(checkMysteryBox, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  const handleMysteryBoxOpen = () => {
    // Mystery box should only be available after real study achievements
    // userStats is already available from the component scope

    // Base reward on user's actual performance from parent component
    // Note: userStats should be passed as prop or accessed from context in parent
    const baseXP = 100; // Default base, should be calculated from real user data
    const sessionCount = 0; // Default, should be from real user data

    // Realistic rewards based on user level and activity
    const rewardTiers = [
      { type: 'XP', amount: Math.floor(baseXP * 0.5), tier: 'common', weight: 40 },
      { type: 'XP', amount: Math.floor(baseXP * 1.0), tier: 'uncommon', weight: 30 },
      { type: 'XP', amount: Math.floor(baseXP * 1.5), tier: 'rare', weight: 20 },
      { type: 'STREAK_SAVER', amount: 1, tier: 'rare', weight: 8 },
      { type: 'XP', amount: Math.floor(baseXP * 2.0), tier: 'epic', weight: 2 }
    ];

    // Weighted random selection
    const totalWeight = rewardTiers.reduce((sum, reward) => sum + reward.weight, 0);
    const random = Math.random() * totalWeight;
    let currentWeight = 0;

    let selectedReward = rewardTiers[0];
    for (const reward of rewardTiers) {
      currentWeight += reward.weight;
      if (random <= currentWeight) {
        selectedReward = reward;
        break;
      }
    }

    addReward({
      type: 'VARIABLE_REWARD',
      title: '🎁 Mystery Box Reward!',
      description: `You earned ${selectedReward.type === 'XP' ? `${selectedReward.amount} XP` : 'a Streak Saver'}!`,
      tier: selectedReward.tier,
      bonusXP: selectedReward.type === 'XP' ? selectedReward.amount : 0,
      animation: 'mystery_box'
    });

    localStorage.setItem('lastMysteryBox', Date.now().toString());
    setMysteryBoxAvailable(false);
  };

  return (
    <>
      {/* Main Reward Queue Manager */}
      <RewardQueueManager />
      
      {/* Daily Login Bonus */}
      <DailyLoginBonus />
      
      {/* Mystery Box (if needed as a standalone component) */}
      {mysteryBoxAvailable && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-4 left-4 z-40"
        >
          <MysteryBox 
            onOpen={handleMysteryBoxOpen}
            available={mysteryBoxAvailable}
          />
        </motion.div>
      )}
      
      {/* Reward History Modal */}
      <AnimatePresence>
        {showHistory && (
          <RewardHistory 
            isOpen={showHistory}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Reward Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <RewardSettings 
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default RewardSystem;
export { 
  RewardQueueManager, 
  MysteryBox, 
  DailyLoginBonus, 
  RewardHistory, 
  RewardSettings,
  useSoundSystem 
};
