import React, { useState, useEffect } from 'react';
import { useTimer } from '../context/TimerContext';

const TimerCard = ({ variant = 'full', className = '' }) => {
  const [subjects, setSubjects] = useState([]);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const {
    secondsLeft,
    isRunning,
    subject,
    mode,
    stopwatchSeconds,
    isPomodoroBreak,
    pomodoroCount,
    startTimer,
    stopTimer,
    resetTimer,
    setTimerMode,
    setTimerSubject,
    setTimerDuration,
    formatTime,
    getProgress
  } = useTimer();

  const MODES = [
    { key: 'pomodoro', label: 'Pomodoro', duration: 25 * 60 },
    { key: 'custom', label: 'Custom', duration: null },
    { key: 'stopwatch', label: 'Stopwatch', duration: 0 },
  ];

  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem("subjects");
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  const handleSubjectChange = (e) => {
    setTimerSubject(e.target.value);
  };

  const handleCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (minutes > 0) {
      setTimerDuration(minutes * 60);
      setShowCustomInput(false);
    }
  };

  const handleModeChange = (modeKey) => {
    if (modeKey === 'custom') {
      setShowCustomInput(true);
    } else {
      setTimerMode(modeKey);
      setShowCustomInput(false);
    }
  };

  const getDisplayTime = () => {
    if (mode === 'stopwatch') {
      return formatTime(stopwatchSeconds);
    }
    return formatTime(secondsLeft);
  };

  const getModeLabel = () => {
    if (mode === 'pomodoro') {
      return isPomodoroBreak ? 'Break' : 'Work';
    }
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white/10 rounded-lg p-3 backdrop-blur ${className}`}>
        <div className="flex flex-col items-center">
          <span className="text-xs text-white/80 mb-1">{subject}</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-mono text-white drop-shadow">
              {getDisplayTime()}
            </span>
            {isRunning ? (
              <button
                className="px-3 py-1 rounded bg-[#FEC260] text-[#23234a] font-bold shadow hover:bg-[#FFD580] transition text-xs"
                onClick={stopTimer}
              >
                Stop
              </button>
            ) : (
              <button
                className="px-3 py-1 rounded bg-[#6C5DD3] text-white font-bold shadow hover:bg-[#7A6AD9] transition text-xs"
                onClick={startTimer}
                disabled={mode !== 'stopwatch' && secondsLeft === 0}
              >
                Start
              </button>
            )}
            <button
              className="px-2 py-1 rounded bg-white/10 text-white font-bold shadow hover:bg-white/20 transition text-xs"
              onClick={resetTimer}
            >
              Reset
            </button>
          </div>
          {mode === 'pomodoro' && (
            <div className="text-xs text-white/60 mt-1">
              {isPomodoroBreak ? 'Break' : 'Work'} • {pomodoroCount} completed
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur shadow-xl ${className}`}>
      <div className="flex flex-col items-center">
        {/* Subject Selection */}
        <div className="w-full mb-4">
          <label className="block text-white text-sm font-medium mb-2">Subject</label>
          <select
            className="w-full p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] text-sm"
            value={subject}
            onChange={handleSubjectChange}
            disabled={isRunning}
          >
            <option value="No Subject">Select Subject</option>
            {subjects.map((subj) => (
              <option key={subj.id} value={subj.name}>{subj.name}</option>
            ))}
          </select>
        </div>

        {/* Custom Duration Input */}
        {showCustomInput && (
          <div className="w-full mb-4 p-3 bg-white/5 rounded-lg border border-[#6C5DD3]/30">
            <label className="block text-white text-sm font-medium mb-2">Custom Duration (minutes)</label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                max="480"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                className="flex-1 p-2 rounded bg-[#1a1a2e] text-white border border-[#6C5DD3] text-sm"
                placeholder="25"
              />
              <button
                onClick={handleCustomDuration}
                className="px-4 py-2 rounded bg-[#6C5DD3] text-white font-semibold hover:bg-[#7A6AD9] transition text-sm"
              >
                Set
              </button>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className="flex gap-2 mb-4">
          {MODES.map(m => (
            <button
              key={m.key}
              className={`px-4 py-1 rounded-full font-semibold transition-all duration-200 text-sm ${
                mode === m.key 
                  ? 'bg-[#6C5DD3] text-white shadow' 
                  : 'bg-white/10 text-white/70 hover:bg-[#6C5DD3]/70'
              }`}
              onClick={() => handleModeChange(m.key)}
              disabled={isRunning}
            >
              {m.label}
            </button>
          ))}
        </div>
        
        {/* Timer Display */}
        <div className="relative flex flex-col items-center justify-center mb-4">
          {mode !== 'stopwatch' && (
            <svg width="140" height="140" className="absolute top-0 left-0">
              <circle
                cx="70" cy="70" r="62"
                stroke="#6C5DD3" 
                strokeWidth="10" 
                fill="none"
                strokeDasharray={2 * Math.PI * 62}
                strokeDashoffset={2 * Math.PI * 62 * (1 - getProgress() / 100)}
                style={{ transition: 'stroke-dashoffset 0.5s' }}
              />
            </svg>
          )}
          <div className="w-[120px] h-[120px] rounded-full bg-white/10 flex items-center justify-center z-10">
            <span className="text-5xl font-mono text-white drop-shadow-lg">
              {getDisplayTime()}
            </span>
          </div>
        </div>

        {/* Mode Status */}
        {mode === 'pomodoro' && (
          <div className="text-center mb-4">
            <div className="text-sm text-white font-medium">
              {isPomodoroBreak ? 'Break Time' : 'Work Time'}
            </div>
            <div className="text-xs text-gray-300">
              {pomodoroCount} 
            </div>
          </div>
        )}
        
        {/* Timer Controls */}
        <div className="flex gap-4 mt-2">
          {isRunning ? (
            <button
              className="px-6 py-2 rounded-xl bg-[#FEC260] text-[#23234a] font-bold shadow hover:bg-[#FFD580] transition"
              onClick={stopTimer}
            >
              Pause
            </button>
          ) : (
            <button
              className="px-6 py-2 rounded-xl bg-[#6C5DD3] text-white font-bold shadow hover:bg-[#7A6AD9] transition"
              onClick={startTimer}
              disabled={mode !== 'stopwatch' && secondsLeft === 0}
            >
              Start
            </button>
          )}
          <button
            className="px-6 py-2 rounded-xl bg-white/10 text-white font-bold shadow hover:bg-white/20 transition"
            onClick={resetTimer}
          >
            Reset
          </button>
        </div>
        
        {/* Mode Messages */}
        <div className="mt-4 text-xs text-gray-300">
          {mode === 'pomodoro' && (isPomodoroBreak ? 'Take a short break!' : 'Focus on your work!')}
          {mode === 'custom' && 'Custom timer mode'}
          {mode === 'stopwatch' && 'Counting up...'}
        </div>
      </div>
    </div>
  );
};

export default TimerCard;