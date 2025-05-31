
import { supabase } from '@/integrations/supabase/client';

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_date?: string;
  progress: number;
  status: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  habit_name: string;
  streak_count: number;
  last_logged?: string;
  created_at: string;
}

export const goalService = {
  // Goal methods
  async createGoal(goal: Omit<Goal, 'id' | 'user_id' | 'created_at'>): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .insert(goal)
      .select()
      .single();

    if (error) {
      console.error('Error creating goal:', error);
      return null;
    }
    return data;
  },

  async getGoals(): Promise<Goal[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
    return data || [];
  },

  async updateGoalProgress(id: string, progress: number): Promise<Goal | null> {
    const { data, error } = await supabase
      .from('goals')
      .update({ progress })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating goal progress:', error);
      return null;
    }
    return data;
  },

  // Habit methods
  async createHabit(habitName: string): Promise<Habit | null> {
    const { data, error } = await supabase
      .from('habits')
      .insert({ habit_name: habitName })
      .select()
      .single();

    if (error) {
      console.error('Error creating habit:', error);
      return null;
    }
    return data;
  },

  async getHabits(): Promise<Habit[]> {
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
    return data || [];
  },

  async logHabit(id: string): Promise<Habit | null> {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current habit to check streak
    const { data: currentHabit } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .single();

    if (!currentHabit) return null;

    let newStreakCount = 1;
    if (currentHabit.last_logged) {
      const lastLogged = new Date(currentHabit.last_logged);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastLogged.toDateString() === yesterday.toDateString()) {
        newStreakCount = currentHabit.streak_count + 1;
      }
    }

    const { data, error } = await supabase
      .from('habits')
      .update({ 
        last_logged: today,
        streak_count: newStreakCount
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error logging habit:', error);
      return null;
    }
    return data;
  }
};
