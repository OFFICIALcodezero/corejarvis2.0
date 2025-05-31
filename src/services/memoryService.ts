
import { supabase } from '@/integrations/supabase/client';

export interface PersistentKnowledge {
  id: string;
  user_id: string;
  content: string;
  type: string;
  related_tags: string[];
  last_used_at: string;
  priority_level: number;
  source_type: string;
  source_ref?: string;
  created_at: string;
}

export interface Memory {
  id: string;
  user_id: string;
  input_text: string;
  response_text?: string;
  timestamp: string;
  context_tags: string[];
  mood_context?: string;
  emotion_analysis?: any;
}

export interface VoiceInput {
  id: string;
  user_id: string;
  audio_url?: string;
  transcript_text?: string;
  intent_tag?: string;
  is_learned: boolean;
  created_at: string;
}

export const memoryService = {
  // Persistent Knowledge methods
  async storePersistentKnowledge(content: string, type: string = 'general', tags: string[] = []): Promise<PersistentKnowledge | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('persistent_knowledge')
      .insert({
        content,
        type,
        related_tags: tags,
        priority_level: 1,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing persistent knowledge:', error);
      return null;
    }
    return data;
  },

  async searchKnowledge(query: string, tags?: string[]): Promise<PersistentKnowledge[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let queryBuilder = supabase
      .from('persistent_knowledge')
      .select('*')
      .eq('user_id', user.id)
      .textSearch('content', query);

    if (tags && tags.length > 0) {
      queryBuilder = queryBuilder.overlaps('related_tags', tags);
    }

    const { data, error } = await queryBuilder
      .order('priority_level', { ascending: false })
      .order('last_used_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error searching knowledge:', error);
      return [];
    }
    return data || [];
  },

  async updateKnowledgePriority(id: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Get current priority level and increment it
    const { data: currentKnowledge } = await supabase
      .from('persistent_knowledge')
      .select('priority_level')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (currentKnowledge) {
      await supabase
        .from('persistent_knowledge')
        .update({ 
          last_used_at: new Date().toISOString(),
          priority_level: currentKnowledge.priority_level + 1
        })
        .eq('id', id)
        .eq('user_id', user.id);
    }
  },

  // Memory methods
  async storeMemory(inputText: string, responseText?: string, contextTags: string[] = []): Promise<Memory | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('memory')
      .insert({
        input_text: inputText,
        response_text: responseText,
        context_tags: contextTags,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing memory:', error);
      return null;
    }
    return data;
  },

  async getRecentMemories(limit: number = 10): Promise<Memory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('memory')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
    return data || [];
  },

  async searchMemories(query: string, contextTags?: string[]): Promise<Memory[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let queryBuilder = supabase
      .from('memory')
      .select('*')
      .eq('user_id', user.id)
      .textSearch('input_text', query);

    if (contextTags && contextTags.length > 0) {
      queryBuilder = queryBuilder.overlaps('context_tags', contextTags);
    }

    const { data, error } = await queryBuilder
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error searching memories:', error);
      return [];
    }
    return data || [];
  },

  // Voice Input methods
  async storeVoiceInput(transcriptText: string, audioUrl?: string, intentTag?: string): Promise<VoiceInput | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user');
      return null;
    }

    const { data, error } = await supabase
      .from('voice_inputs')
      .insert({
        transcript_text: transcriptText,
        audio_url: audioUrl,
        intent_tag: intentTag,
        user_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing voice input:', error);
      return null;
    }
    return data;
  },

  async getVoiceInputs(limit: number = 20): Promise<VoiceInput[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('voice_inputs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching voice inputs:', error);
      return [];
    }
    return data || [];
  }
};
