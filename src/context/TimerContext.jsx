import React, { createContext, useContext, useState, useEffect } from 'react';

const TimerContext = createContext();

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

export const TimerProvider = ({ children }) => {
  const [timerState, setTimerState] = useState({
    secondsLeft: 25 * 60, // 25 minutes default
    isRunning: false,
    subject: 'No Subject',
    mode: 'pomodoro', // pomodoro, custom, stopwatch
    customDuration: 25 * 60,
    stopwatchSeconds: 0, // For stopwatch mode
    isPomodoroBreak: false, // Track if we're in break mode
    pomodoroCount: 0 // Count completed pomodoros
  });

  const [intervalId, setIntervalId] = useState(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
      setTimerState(JSON.parse(savedState));
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('timerState', JSON.stringify(timerState));
  }, [timerState]);

  // Timer countdown effect
  useEffect(() => {
    if (timerState.isRunning && timerState.mode !== 'stopwatch') {
      if (timerState.secondsLeft > 0) {
        const id = setInterval(() => {
          setTimerState(prev => ({
            ...prev,
            secondsLeft: prev.secondsLeft > 0 ? prev.secondsLeft - 1 : 0
          }));
        }, 1000);
        setIntervalId(id);
        return () => clearInterval(id);
      } else if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    } else if (timerState.isRunning && timerState.mode === 'stopwatch') {
      const id = setInterval(() => {
        setTimerState(prev => ({
          ...prev,
          stopwatchSeconds: prev.stopwatchSeconds + 1
        }));
      }, 1000);
      setIntervalId(id);
      return () => clearInterval(id);
    } else if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    // eslint-disable-next-line
  }, [timerState.isRunning, timerState.secondsLeft, timerState.mode, timerState.stopwatchSeconds]);

  // Handle timer completion and pomodoro cycles
  useEffect(() => {
    if (timerState.secondsLeft === 0 && timerState.isRunning && timerState.mode === 'pomodoro') {
      setTimerState(prev => {
        // Don't save study session here - let the Study page handle it with reflection data
        // if (!prev.isPomodoroBreak && prev.subject !== 'No Subject') {
        //   saveStudySession();
        // }

        // Handle pomodoro cycle
        if (!prev.isPomodoroBreak) {
          // Work session completed, start break
          const newState = {
            ...prev,
            isRunning: false,
            isPomodoroBreak: true,
            secondsLeft: 5 * 60, // 5 minute break
            pomodoroCount: prev.pomodoroCount + 1
          };
          
          // Auto-start break timer after a short delay
          setTimeout(() => {
            setTimerState(current => ({ ...current, isRunning: true }));
          }, 1000);
          
          return newState;
        } else {
          // Break completed, start next work session
          const newState = {
            ...prev,
            isRunning: false,
            isPomodoroBreak: false,
            secondsLeft: 25 * 60 // 25 minute work session
          };
          
          // Auto-start work timer after a short delay
          setTimeout(() => {
            setTimerState(current => ({ ...current, isRunning: true }));
          }, 1000);
          
          return newState;
        }
      });
    } else if (timerState.secondsLeft === 0 && timerState.isRunning && timerState.mode === 'custom') {
      setTimerState(prev => {
        // Don't save study session here - let the Study page handle it with reflection data
        // if (prev.subject !== 'No Subject') {
        //   saveStudySession();
        // }
        return { ...prev, isRunning: false };
      });
    }
  }, [timerState.secondsLeft, timerState.isRunning, timerState.mode, timerState.isPomodoroBreak]);

  const saveStudySession = (isPartial = false, customState = null) => {
    const stateToUse = customState || timerState;
    let actualDuration;
    
    if (stateToUse.mode === 'stopwatch') {
      actualDuration = stateToUse.stopwatchSeconds;
    } else {
      const totalDuration = getModeDuration(stateToUse.mode);
      actualDuration = isPartial ? (totalDuration - stateToUse.secondsLeft) : totalDuration;
    }
    
    // Only save if there's actual study time
    if (actualDuration <= 0) return;

    const session = {
      subjectName: stateToUse.subject,
      durationMinutes: actualDuration / 60, // Convert seconds to minutes
      timestamp: new Date().toISOString()
    };

    // Get existing sessions
    const existingSessions = localStorage.getItem('studySessions');
    const sessions = existingSessions ? JSON.parse(existingSessions) : [];
    
    // Add new session
    sessions.push(session);
    
    // Save back to localStorage
    localStorage.setItem('studySessions', JSON.stringify(sessions));
  };

  const getModeDuration = (mode) => {
    switch (mode) {
      case 'pomodoro': return timerState.isPomodoroBreak ? 5 * 60 : 25 * 60;
      case 'custom': return timerState.customDuration;
      case 'stopwatch': return 0; // Stopwatch doesn't have a duration
      default: return 25 * 60;
    }
  };

  const startTimer = () => {
    setTimerState(prev => ({ ...prev, isRunning: true }));
  };

  const stopTimer = () => {
    // Don't save study session here - let the Study page handle it with reflection data
    // if (timerState.subject !== 'No Subject') {
    //   if (timerState.mode === 'stopwatch') {
    //     if (timerState.stopwatchSeconds > 0) {
    //       saveStudySession(false);
    //     }
    //   } else if (timerState.mode === 'pomodoro' && !timerState.isPomodoroBreak) {
    //     if (timerState.secondsLeft < getModeDuration(timerState.mode)) {
    //       saveStudySession(true);
    //     }
    //   } else if (timerState.mode === 'custom') {
    //     if (timerState.secondsLeft < getModeDuration(timerState.mode)) {
    //       saveStudySession(true);
    //     }
    //   }
    // }
    
    setTimerState(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    const duration = getModeDuration(timerState.mode);
    setTimerState(prev => ({ 
      ...prev, 
      isRunning: false,
      secondsLeft: duration,
      stopwatchSeconds: 0,
      isPomodoroBreak: false
    }));
  };

  const setTimerDuration = (seconds) => {
    setTimerState(prev => ({ 
      ...prev, 
      secondsLeft: seconds,
      customDuration: seconds,
      mode: 'custom',
      isPomodoroBreak: false
    }));
  };

  const setTimerSubject = (subject) => {
    setTimerState(prev => ({ ...prev, subject }));
  };

  const setTimerMode = (mode) => {
    const duration = getModeDuration(mode);
    setTimerState(prev => ({ 
      ...prev, 
      mode,
      secondsLeft: duration,
      isRunning: false,
      stopwatchSeconds: 0,
      isPomodoroBreak: false
    }));
  };

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getProgress = () => {
    if (timerState.mode === 'stopwatch') {
      return 0; // Stopwatch doesn't have progress
    }
    const total = getModeDuration(timerState.mode);
    return total > 0 ? ((total - timerState.secondsLeft) / total) * 100 : 0;
  };

  const value = {
    ...timerState,
    startTimer,
    stopTimer,
    resetTimer,
    setTimerDuration,
    setTimerSubject,
    setTimerMode,
    formatTime,
    getProgress,
    getModeDuration
  };

  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}; 