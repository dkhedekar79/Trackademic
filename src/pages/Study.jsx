import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTimer } from '../context/TimerContext';
import Sidebar from '../components/Sidebar';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  BookOpen, 
  Target, 
  Clock, 
  Flame,
  CheckCircle,
  Edit3,
  Volume2,
  VolumeX,
  Award,
  TrendingUp,
  Calendar,
  Zap,
  Trash2
} from 'lucide-react';

const Study = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    getProgress,
    getModeDuration
  } = useTimer();

  // State for study session
  const [sessionNotes, setSessionNotes] = useState('');
  const [currentTask, setCurrentTask] = useState('');
  const [isTaskComplete, setIsTaskComplete] = useState(false);
  const [showEndSession, setShowEndSession] = useState(false);
  const [sessionMood, setSessionMood] = useState('');
  const [sessionReflection, setSessionReflection] = useState('');
  const [sessionDifficulty, setSessionDifficulty] = useState(2);
  const [isDistractionFree, setIsDistractionFree] = useState(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [studySessions, setStudySessions] = useState([]);
  const [customMinutes, setCustomMinutes] = useState('25');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    const savedTasks = localStorage.getItem('tasks');
    const savedSessions = localStorage.getItem('studySessions');
    
    if (savedSubjects) setSubjects(JSON.parse(savedSubjects));
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedSessions) setStudySessions(JSON.parse(savedSessions));
  }, []);

  // Get context from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const subjectParam = params.get('subject');
    const taskParam = params.get('task');
    
    if (subjectParam) {
      setTimerSubject(subjectParam);
    }
    if (taskParam) {
      setCurrentTask(taskParam);
    }
  }, [location, setTimerSubject]);

  // Get tasks for current subject
  const getSubjectTasks = () => {
    return tasks.filter(task => task.subject === subject && !task.done);
  };

  // Calculate stats
  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todaySessions = studySessions.filter(session => 
      new Date(session.timestamp).toDateString() === today
    );
    const totalMinutes = todaySessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    return { sessions: todaySessions.length, minutes: totalMinutes };
  };

  const getStreak = () => {
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toDateString();
      
      const hasSession = studySessions.some(session => 
        new Date(session.timestamp).toDateString() === dateString
      );
      
      if (hasSession) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getWeeklyProgress = () => {
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const weekSessions = studySessions.filter(session => 
      new Date(session.timestamp) >= startOfWeek && session.subjectName === subject
    );
    
    const totalMinutes = weekSessions.reduce((sum, session) => sum + session.durationMinutes, 0);
    const currentSubject = subjects.find(s => s.name === subject);
    const subjectGoal = currentSubject ? currentSubject.goalHours * 60 : 0;
    
    return {
      studied: totalMinutes,
      goal: subjectGoal,
      percentage: subjectGoal > 0 ? Math.round((totalMinutes / subjectGoal) * 100) : 0
    };
  };

  const todayStats = getTodayStats();
  const streak = getStreak();
  const weeklyProgress = getWeeklyProgress();
  const subjectTasks = getSubjectTasks();

  const handleEndSession = () => {
    stopTimer();
    setShowEndSession(true);
  };

  const handleSaveSession = () => {
    // Save session data
    const sessionData = {
      subjectName: subject,
      durationMinutes: mode === 'stopwatch' ? stopwatchSeconds / 60 : (getModeDuration(mode) - secondsLeft) / 60,
      timestamp: new Date().toISOString(),
      notes: sessionNotes,
      task: currentTask,
      mood: sessionMood,
      reflection: sessionReflection,
      difficulty: sessionDifficulty,
      isTaskComplete
    };

    // Update study sessions
    const updatedSessions = [...studySessions, sessionData];
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    setStudySessions(updatedSessions); // Update the state immediately

    // Update task if completed
    if (isTaskComplete && currentTask) {
      const updatedTasks = tasks.map(task => 
        task.name === currentTask ? { ...task, done: true, doneAt: Date.now() } : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    }

    // Reset session state
    setSessionNotes('');
    setCurrentTask('');
    setIsTaskComplete(false);
    setShowEndSession(false);
    setSessionMood('');
    setSessionReflection('');
    setSessionDifficulty(2);
    
    // Reset timer and subject to pre-study mode
    resetTimer();
    setTimerSubject('No Subject');

    // Navigate back or to dashboard
    // navigate('/dashboard'); // Removed navigation
  };

  const deleteStudySession = (index) => {
    const updatedSessions = studySessions.filter((_, i) => i !== index);
    localStorage.setItem('studySessions', JSON.stringify(updatedSessions));
    setStudySessions(updatedSessions);
  };

  const handleTaskSelection = (taskName) => {
    setCurrentTask(taskName);
    // Automatically check the completion checkbox when a task is selected
    if (taskName) {
      setIsTaskComplete(true);
    }
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

  const MODES = [
    { key: 'pomodoro', label: 'Pomodoro', duration: 25 * 60 },
    { key: 'custom', label: 'Custom', duration: null },
    { key: 'stopwatch', label: 'Stopwatch', duration: 0 },
  ];

  const moods = [
    { emoji: '😄', label: 'Great', value: 'great' },
    { emoji: '🙂', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😫', label: 'Struggled', value: 'struggled' }
  ];

  if (showEndSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] flex items-center justify-center p-4 mt-20">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Session Complete! 🎉</h2>
          
          {/* Mood Tracker */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-3">How did it go?</label>
            <div className="flex justify-center gap-4">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => setSessionMood(mood.value)}
                  className={`p-3 rounded-xl transition-all ${
                    sessionMood === mood.value 
                      ? 'bg-[#6C5DD3] text-white shadow-lg scale-110' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <div className="text-2xl mb-1">{mood.emoji}</div>
                  <div className="text-xs">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Reflection */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">What did you work on?</label>
            <textarea
              value={sessionReflection}
              onChange={(e) => setSessionReflection(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-[#6C5DD3] resize-none"
              rows="3"
              placeholder="Briefly describe what you studied..."
            />
          </div>

          {/* Difficulty Rating */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Difficulty Level</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((level) => (
                <button
                  key={level}
                  onClick={() => setSessionDifficulty(level)}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    sessionDifficulty === level
                      ? 'bg-[#FEC260] text-[#23234a] font-bold'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowEndSession(false)}
              className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition"
            >
              Continue Studying
            </button>
            <button
              onClick={handleSaveSession}
              className="flex-1 px-4 py-3 rounded-lg bg-[#6C5DD3] text-white font-semibold hover:bg-[#7A6AD9] transition"
            >
              Save & Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show subject selection if no subject is selected
  if (subject === 'No Subject') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] mt-20 flex">
        <Sidebar />
        <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
          <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-4">Ready to Study? 📚</h1>
              <p className="text-gray-300 text-lg">Select a subject to begin your study session</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjects.map((subj) => (
                <div
                  key={subj.id}
                  className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10 hover:border-[#6C5DD3]/50 transition-all cursor-pointer group"
                  onClick={() => setTimerSubject(subj.name)}
                >
                  <div 
                    className="w-full h-32 rounded-xl mb-4 flex items-center justify-center"
                    style={{ backgroundColor: subj.color }}
                  >
                    <BookOpen className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{subj.name}</h3>
                  <p className="text-gray-300 text-sm mb-4">Goal: {subj.goalHours}h/week</p>
                  <button className="w-full px-4 py-2 rounded-lg bg-[#6C5DD3] text-white font-semibold hover:bg-[#7A6AD9] transition">
                    Start Studying
                  </button>
                </div>
              ))}
            </div>

            {subjects.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Subjects Added</h3>
                <p className="text-gray-300 mb-6">Add some subjects to get started with your study sessions</p>
                <button
                  onClick={() => navigate('/subjects')}
                  className="px-6 py-3 rounded-lg bg-[#6C5DD3] text-white font-semibold hover:bg-[#7A6AD9] transition"
                >
                  Add Subjects
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] mt-20 flex">
      <Sidebar />
      <div className="flex-1 ml-16 transition-all duration-300 ease-in-out [body>div>aside:hover_+_div&]:ml-64">
        {/* Top Bar - Context Panel */}
        <div className="bg-white/5 backdrop-blur border-b border-white/10 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-bold text-white">{subject || 'Select Subject'}</h1>
                {currentTask && (
                  <p className="text-sm text-gray-300">{currentTask}</p>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{todayStats.minutes}min today</span>
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="w-4 h-4 text-[#FEC260]" />
                  <span>{streak} day streak</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-300">Weekly Progress</div>
              <div className="text-lg font-bold text-white">
                {Math.round(weeklyProgress.studied / 60)}h / {Math.round(weeklyProgress.goal / 60)}h
              </div>
              <div className="text-xs text-gray-400">{weeklyProgress.percentage}% complete</div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main Study Panel */}
            <div className="space-y-6">
              {/* Timer Card */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
                <div className="flex flex-col items-center">
                  {/* Custom Duration Input */}
                  {showCustomInput && (
                    <div className="w-full mb-6 p-4 bg-white/5 rounded-lg border border-[#6C5DD3]/30">
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
                  <div className="flex gap-2 mb-6">
                    {MODES.map(m => (
                      <button
                        key={m.key}
                        className={`px-4 py-2 rounded-full font-semibold transition-all ${
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

                  {/* Mode Status */}
                  {mode === 'pomodoro' && (
                    <div className="text-center mb-6">
                      <div className="text-sm text-white font-medium">
                        {isPomodoroBreak ? 'Break Time' : 'Work Time'}
                      </div>
                      <div className="text-xs text-gray-300">
                        {pomodoroCount} pomodoros completed
                      </div>
                    </div>
                  )}

                  {/* Timer Display */}
                  <div className="relative mb-8">
                    {mode !== 'stopwatch' && (
                      <svg width="200" height="200" className="absolute top-0 left-0">
                        <circle
                          cx="100" cy="100" r="90"
                          stroke="#6C5DD3"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={2 * Math.PI * 90}
                          strokeDashoffset={2 * Math.PI * 90 * (1 - getProgress() / 100)}
                          style={{ transition: 'stroke-dashoffset 0.5s' }}
                        />
                      </svg>
                    )}
                    <div className="w-[160px] h-[160px] rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-6xl font-mono text-white drop-shadow-lg">
                        {getDisplayTime()}
                      </span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex gap-4 mb-6">
                    {isRunning ? (
                      <button
                        onClick={stopTimer}
                        className="px-8 py-3 rounded-xl bg-[#FEC260] text-[#23234a] font-bold shadow hover:bg-[#FFD580] transition flex items-center gap-2"
                      >
                        <Pause className="w-5 h-5" />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={startTimer}
                        disabled={mode !== 'stopwatch' && secondsLeft === 0}
                        className="px-8 py-3 rounded-xl bg-[#6C5DD3] text-white font-bold shadow hover:bg-[#7A6AD9] transition flex items-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Start
                      </button>
                    )}
                    <button
                      onClick={resetTimer}
                      className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold shadow hover:bg-white/20 transition flex items-center gap-2"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Reset
                    </button>
                    <button
                      onClick={handleEndSession}
                      className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold shadow hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Square className="w-5 h-5" />
                      End
                    </button>
                  </div>

                  {/* Focus Mode Toggle */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsDistractionFree(!isDistractionFree)}
                      className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                        isDistractionFree
                          ? 'bg-[#6C5DD3] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      Focus Mode
                    </button>
                    <button
                      onClick={() => setIsAmbientSoundOn(!isAmbientSoundOn)}
                      className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                        isAmbientSoundOn
                          ? 'bg-[#6C5DD3] text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {isAmbientSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                      Ambient Sound
                    </button>
                  </div>
                </div>
              </div>

              {/* Current Task Input */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Current Task/Topic
                </h3>
                
                <div className="mb-4">
                  <select
                    value={currentTask}
                    onChange={(e) => handleTaskSelection(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-[#6C5DD3]"
                    disabled={isRunning}
                  >
                    <option value="">Select a task or enter custom topic</option>
                    {subjectTasks.length > 0 ? (
                      subjectTasks.map((task) => (
                        <option key={task.id} value={task.name}>
                          {task.name} ({task.time} min - {task.priority})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No tasks available for {subject}</option>
                    )}
                  </select>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#1a1a2e] text-white border border-[#6C5DD3]"
                    placeholder="Or type a custom topic..."
                  />
                </div>

                {/* Task Completion */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="taskComplete"
                    checked={isTaskComplete}
                    onChange={(e) => setIsTaskComplete(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="taskComplete" className="text-white text-sm">
                    Mark task as complete
                  </label>
                </div>
              </div>
            </div>

            {/* Sidebar - Stats Panel */}
            <div className="space-y-6">
              {/* Today's Stats */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Today's Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Sessions</span>
                    <span className="text-white font-bold">{todayStats.sessions}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Time Studied</span>
                    <span className="text-white font-bold">{Math.round(todayStats.minutes)} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Streak</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Flame className="w-4 h-4 text-[#FEC260]" />
                      {streak} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Progress */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Weekly Goal
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Studied</span>
                    <span className="text-white font-bold">{Math.round(weeklyProgress.studied / 60)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Goal</span>
                    <span className="text-white font-bold">{Math.round(weeklyProgress.goal / 60)}h</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-[#6C5DD3] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(weeklyProgress.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-center text-sm text-gray-300">
                    {weeklyProgress.percentage}% complete
                  </div>
                </div>
              </div>

              {/* Recent Study Logs */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Recent Study Logs
                </h3>
                <div className="max-h-[300px] overflow-y-auto">
                  {studySessions.filter(session => session.subjectName === subject).length > 0 ? (
                    <div className="space-y-3">
                      {studySessions
                        .filter(session => session.subjectName === subject)
                        .slice(0, 5)
                        .map((session, index) => (
                          <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#6C5DD3]" />
                                <span className="text-sm font-medium text-white">
                                  {session.durationMinutes.toFixed(1)} min
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {new Date(session.timestamp).toLocaleDateString("en-US", { 
                                  month: "short", 
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </div>
                            
                            {session.task && (
                              <div className="text-xs text-gray-300 mb-1">
                                Task: {session.task}
                              </div>
                            )}
                            
                            {session.reflection && (
                              <div className="text-xs text-gray-300 mb-2">
                                "{session.reflection}"
                              </div>
                            )}
                            
                            <div className="flex items-center gap-3 text-xs">
                              {session.mood && (
                                <span className="text-gray-400">
                                  Mood: {session.mood}
                                </span>
                              )}
                              {session.difficulty && (
                                <span className="text-gray-400">
                                  Difficulty: {session.difficulty}/4
                                </span>
                              )}
                            </div>
                            
                            <button
                              onClick={() => deleteStudySession(studySessions.indexOf(session))}
                              className="mt-2 p-1 rounded hover:bg-red-600/20 transition text-red-400 hover:text-red-300"
                              title="Delete session"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No study logs yet for this subject</p>
                      <p className="text-gray-500 text-xs">Complete a session to see your logs here!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {streak >= 3 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6C5DD3]/20 border border-[#6C5DD3]/30">
                      <Flame className="w-5 h-5 text-[#FEC260]" />
                      <div>
                        <div className="text-white text-sm font-medium">Streak Master</div>
                        <div className="text-gray-300 text-xs">{streak} day streak!</div>
                      </div>
                    </div>
                  )}
                  {todayStats.minutes >= 120 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6C5DD3]/20 border border-[#6C5DD3]/30">
                      <Zap className="w-5 h-5 text-[#FEC260]" />
                      <div>
                        <div className="text-white text-sm font-medium">Study Warrior</div>
                        <div className="text-gray-300 text-xs">2+ hours today!</div>
                      </div>
                    </div>
                  )}
                  {weeklyProgress.percentage >= 80 && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[#6C5DD3]/20 border border-[#6C5DD3]/30">
                      <Target className="w-5 h-5 text-[#FEC260]" />
                      <div>
                        <div className="text-white text-sm font-medium">Goal Crusher</div>
                        <div className="text-gray-300 text-xs">80%+ weekly goal!</div>
                      </div>
                    </div>
                  )}
                  {studySessions.length === 0 && (
                    <div className="text-center py-4">
                      <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Complete your first session to unlock achievements!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Study; 

