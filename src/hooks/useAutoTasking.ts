
import { useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

interface RecurringPattern {
  type: 'daily' | 'weekly' | 'monthly';
  value: string;
  description: string;
}

export const useAutoTasking = () => {
  const [detectedPatterns, setDetectedPatterns] = useState<RecurringPattern[]>([]);

  const analyzeForPatterns = useCallback((taskText: string, taskDate?: string) => {
    const lowerText = taskText.toLowerCase();
    const patterns: RecurringPattern[] = [];

    // Weekly patterns
    const weekdays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    weekdays.forEach(day => {
      if (lowerText.includes(day)) {
        patterns.push({
          type: 'weekly',
          value: day,
          description: `${taskText} every ${day.charAt(0).toUpperCase() + day.slice(1)}`
        });
      }
    });

    // Daily patterns
    if (lowerText.includes('daily') || lowerText.includes('every day') || lowerText.includes('everyday')) {
      patterns.push({
        type: 'daily',
        value: 'daily',
        description: `${taskText} every day`
      });
    }

    // Monthly patterns
    if (lowerText.includes('monthly') || lowerText.includes('every month')) {
      patterns.push({
        type: 'monthly',
        value: 'monthly',
        description: `${taskText} every month`
      });
    }

    if (patterns.length > 0) {
      setDetectedPatterns(patterns);
      
      // Ask user if they want to create recurring task
      setTimeout(() => {
        const confirmed = confirm(`I noticed this might be a recurring task: "${patterns[0].description}". Would you like me to set this up as a recurring reminder?`);
        
        if (confirmed) {
          createRecurringTask(patterns[0], taskText);
        }
      }, 1000);
    }

    return patterns;
  }, []);

  const createRecurringTask = useCallback((pattern: RecurringPattern, taskText: string) => {
    const recurringTasks = JSON.parse(localStorage.getItem('jarvis-recurring-tasks') || '[]');
    
    const newRecurringTask = {
      id: Date.now().toString(),
      text: taskText,
      pattern: pattern,
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      active: true
    };

    recurringTasks.push(newRecurringTask);
    localStorage.setItem('jarvis-recurring-tasks', JSON.stringify(recurringTasks));
    
    toast("Recurring Task Created", {
      description: `Auto-task set: ${pattern.description}`,
      duration: 4000
    });
  }, []);

  const checkAndTriggerRecurringTasks = useCallback(() => {
    const recurringTasks = JSON.parse(localStorage.getItem('jarvis-recurring-tasks') || '[]');
    const now = new Date();
    
    recurringTasks.forEach((task: any) => {
      if (!task.active) return;
      
      const lastTriggered = task.lastTriggered ? new Date(task.lastTriggered) : null;
      let shouldTrigger = false;
      
      if (task.pattern.type === 'daily') {
        shouldTrigger = !lastTriggered || now.getDate() !== lastTriggered.getDate();
      } else if (task.pattern.type === 'weekly') {
        const dayName = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        shouldTrigger = dayName === task.pattern.value && (!lastTriggered || now.getTime() - lastTriggered.getTime() > 6 * 24 * 60 * 60 * 1000);
      } else if (task.pattern.type === 'monthly') {
        shouldTrigger = !lastTriggered || now.getMonth() !== lastTriggered.getMonth();
      }
      
      if (shouldTrigger) {
        toast("🤖 Auto-Task Reminder", {
          description: task.text,
          duration: 6000
        });
        
        // Update last triggered
        task.lastTriggered = now.toISOString();
        localStorage.setItem('jarvis-recurring-tasks', JSON.stringify(recurringTasks));
      }
    });
  }, []);

  return { analyzeForPatterns, checkAndTriggerRecurringTasks, detectedPatterns };
};
