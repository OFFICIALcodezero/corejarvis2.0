
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
    const { data, error } = await supabase
      .from('persistent_knowledge')
      .insert({
        content,
        type,
        related_tags: tags,
        priority_level: 1
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
    let queryBuilder = supabase
      .from('persistent_knowledge')
      .select('*')
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
    await supabase
      .from('persistent_knowledge')
      .update({ 
        last_used_at: new Date().toISOString(),
        priority_level: supabase.rpc('increment_priority', { knowledge_id: id })
      })
      .eq('id', id);
  },

  // Memory methods
  async storeMemory(inputText: string, responseText?: string, contextTags: string[] = []): Promise<Memory | null> {
    const { data, error } = await supabase
      .from('memory')
      .insert({
        input_text: inputText,
        response_text: responseText,
        context_tags: contextTags
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
    const { data, error } = await supabase
      .from('memory')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching memories:', error);
      return [];
    }
    return data || [];
  },

  async searchMemories(query: string, contextTags?: string[]): Promise<Memory[]> {
    let queryBuilder = supabase
      .from('memory')
      .select('*')
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
    const { data, error } = await supabase
      .from('voice_inputs')
      .insert({
        transcript_text: transcriptText,
        audio_url: audioUrl,
        intent_tag: intentTag
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
    const { data, error } = await supabase
      .from('voice_inputs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching voice inputs:', error);
      return [];
    }
    return data || [];
  }
};
