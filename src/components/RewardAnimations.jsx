import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Zap, Flame, Crown, Target, CheckCircle } from 'lucide-react';

// XP Popup Animation
export const XPPopup = ({ amount, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 0 }}
      animate={{ scale: 1, opacity: 1, y: -50 }}
      exit={{ scale: 0, opacity: 0, y: -100 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-full shadow-2xl border-4 border-white">
        <div className="flex items-center gap-2 text-2xl font-bold">
          <Star className="w-6 h-6 text-yellow-200" />
          <span>+{amount} XP</span>
        </div>
      </div>
    </motion.div>
  );
};

// Level Up Celebration
export const LevelUpCelebration = ({ newLevel, onComplete }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white p-8 rounded-3xl shadow-2xl text-center max-w-md mx-4"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
        >
          <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-400" />
        </motion.div>
        
        <h2 className="text-3xl font-bold mb-2">LEVEL UP!</h2>
        <p className="text-xl mb-4">Congratulations!</p>
        <div className="text-6xl font-bold text-yellow-400 mb-4">{newLevel}</div>
        <p className="text-lg opacity-90">You're getting stronger!</p>
        
        {showConfetti && <Confetti />}
      </motion.div>
    </motion.div>
  );
};

// Achievement Unlock
export const AchievementUnlock = ({ achievement, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      className="fixed top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-2xl z-50 max-w-sm"
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{achievement.icon}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg">{achievement.name}</h3>
          <p className="text-sm opacity-90">{achievement.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <Trophy className="w-4 h-4 text-yellow-300" />
            <span className="text-sm font-semibold">+{achievement.xp} XP</span>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 3, ease: "linear" }}
        className="h-1 bg-yellow-400 rounded-full mt-3"
      />
    </motion.div>
  );
};

// Quest Complete Notification
export const QuestComplete = ({ quest, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-2xl shadow-2xl z-50 max-w-sm text-center"
    >
      <div className="flex items-center justify-center gap-3 mb-2">
        <CheckCircle className="w-6 h-6 text-green-300" />
        <span className="font-bold text-lg">Quest Complete!</span>
      </div>
      <p className="text-sm opacity-90 mb-2">{quest.name}</p>
      <div className="flex items-center justify-center gap-2">
        <Star className="w-4 h-4 text-yellow-300" />
        <span className="text-sm font-semibold">+{quest.xp} XP</span>
      </div>
    </motion.div>
  );
};

// Streak Milestone
export const StreakMilestone = ({ streak, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
    >
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-6 rounded-3xl shadow-2xl text-center border-4 border-yellow-400">
        <motion.div
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
        >
          <Flame className="w-16 h-16 mx-auto mb-3 text-yellow-300" />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-2">🔥 STREAK MILESTONE! 🔥</h2>
        <div className="text-5xl font-bold text-yellow-300 mb-2">{streak}</div>
        <p className="text-lg">Days of consistent studying!</p>
        <p className="text-sm opacity-80 mt-2">Keep the fire burning!</p>
      </div>
    </motion.div>
  );
};

// Confetti Effect
const Confetti = () => {
  const confetti = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    rotation: Math.random() * 360,
    scale: Math.random() * 0.5 + 0.5,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'][Math.floor(Math.random() * 6)]
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ 
            x: piece.x + '%', 
            y: piece.y + '%', 
            opacity: 1,
            rotate: piece.rotation,
            scale: piece.scale
          }}
          animate={{ 
            y: piece.y + 200 + '%', 
            opacity: 0,
            rotate: piece.rotation + 360,
            scale: 0
          }}
          transition={{ 
            duration: 3, 
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
};

// Progress Bar with Animation
export const AnimatedProgressBar = ({ progress, label, color = "blue" }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600",
    red: "from-red-500 to-red-600"
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full shadow-sm`}
        />
      </div>
    </div>
  );
};

// Floating Action Button with Pulse
export const FloatingActionButton = ({ children, onClick, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 ${className}`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-50"
      />
      {children}
    </motion.button>
  );
};

// Notification Badge
export const NotificationBadge = ({ count, children }) => {
  return (
    <div className="relative inline-block">
      {children}
      {count > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
        >
          {count > 99 ? '99+' : count}
        </motion.div>
      )}
    </div>
  );
};
