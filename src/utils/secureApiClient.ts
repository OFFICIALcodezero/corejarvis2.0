
import { supabase } from '@/integrations/supabase/client';

// Secure API client that routes through Supabase Edge Functions
export class SecureApiClient {
  
  // Secure AI chat that doesn't expose API keys
  static async sendChatMessage(messages: Array<{role: string, content: string}>, mode: string = 'assistant') {
    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages,
          mode
        }
      });

      if (error) {
        console.error('Secure API error:', error);
        throw new Error('Failed to get AI response');
      }

      return data;
    } catch (error) {
      console.error('SecureApiClient error:', error);
      throw error;
    }
  }

  // Remove any direct API key usage
  static validateSecureUsage() {
    // Check if any API keys are exposed in localStorage or global scope
    const dangerousKeys = ['groq_api_key', 'openai_key', 'GROQ_API_KEY'];
    
    dangerousKeys.forEach(key => {
      if (localStorage.getItem(key)) {
        console.warn(`Removing exposed API key: ${key}`);
        localStorage.removeItem(key);
      }
    });
  }
}

// Initialize security check on module load
SecureApiClient.validateSecureUsage();
