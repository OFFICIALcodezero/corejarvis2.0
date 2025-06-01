
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

export const useSleepMode = () => {
  const [isSleepMode, setIsSleepMode] = useState(false);
  const [sleepTimeout, setSleepTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sleepMinutes, setSleepMinutes] = useState(5); // Default 5 minutes
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // Load sleep timeout from localStorage
    const savedTimeout = localStorage.getItem('jarvis-sleep-mode');
    if (savedTimeout) {
      setSleepMinutes(parseInt(savedTimeout));
    }
  }, []);

  const resetSleepTimer = useCallback(() => {
    setLastActivity(Date.now());
    
    if (sleepTimeout) {
      clearTimeout(sleepTimeout);
    }
    
    if (isSleepMode) {
      setIsSleepMode(false);
      toast("Jarvis Awakened", {
        description: "Welcome back! All systems online.",
        duration: 2000
      });
    }
    
    const newTimeout = setTimeout(() => {
      setIsSleepMode(true);
      toast("Sleep Mode Activated", {
        description: "Say 'Jarvis, wake up' to reactivate.",
        duration: 3000
      });
    }, sleepMinutes * 60 * 1000);
    
    setSleepTimeout(newTimeout);
  }, [sleepTimeout, isSleepMode, sleepMinutes]);

  const wakeUp = useCallback(() => {
    if (isSleepMode) {
      setIsSleepMode(false);
      resetSleepTimer();
    }
  }, [isSleepMode, resetSleepTimer]);

  const checkWakeWord = useCallback((text: string) => {
    const wakeWords = ['jarvis wake up', 'jarvis awake', 'wake up jarvis', 'jarvis activate'];
    const lowerText = text.toLowerCase();
    
    return wakeWords.some(word => lowerText.includes(word));
  }, []);

  const updateSleepTimeout = useCallback((minutes: number) => {
    setSleepMinutes(minutes);
    localStorage.setItem('jarvis-sleep-mode', minutes.toString());
    resetSleepTimer();
  }, [resetSleepTimer]);

  // Set up activity listeners
  useEffect(() => {
    const handleActivity = () => {
      if (!isSleepMode) {
        resetSleepTimer();
      }
    };

    // Listen for various user activities
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Initial timer setup
    resetSleepTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      if (sleepTimeout) {
        clearTimeout(sleepTimeout);
      }
    };
  }, [resetSleepTimer, isSleepMode]);

  return {
    isSleepMode,
    sleepMinutes,
    lastActivity,
    wakeUp,
    checkWakeWord,
    updateSleepTimeout,
    resetSleepTimer
  };
};
