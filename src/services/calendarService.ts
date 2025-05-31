
import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time?: string;
  location?: string;
  reminder_time?: string;
  created_at: string;
}

export const calendarService = {
  async createEvent(event: Omit<CalendarEvent, 'id' | 'user_id' | 'created_at'>): Promise<CalendarEvent | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        ...event,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return null;
    }
    return data;
  },

  async getEvents(startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .order('start_time', { ascending: true });

    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    if (endDate) {
      query = query.lte('start_time', endDate);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return data || [];
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return null;
    }
    return data;
  },

  async deleteEvent(id: string): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting event:', error);
      return false;
    }
    return true;
  },

  async getUpcomingEvents(limit: number = 10): Promise<CalendarEvent[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', now)
      .order('start_time', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Error fetching upcoming events:', error);
      return [];
    }
    return data || [];
  }
};
