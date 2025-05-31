import { getOfflineJarvisResponse } from './offlineAIService';

function handleUserMessage(userMessage: string) {
  // Use your offline AI instead of external API
  const reply = getOfflineJarvisResponse(userMessage);

  // Then update your UI or chat state with 'reply'
}

import { toast } from '@/components/ui/use-toast';
import { getApiKey } from '@/utils/apiKeyManager';
import { UserPreference } from '@/types/chat';
import { AssistantType } from '@/pages/JarvisInterface';

// Assistant-specific configuration
export const assistantConfig = {
  jarvis: {
    name: 'J.A.R.V.I.S.',
    model: 'llama3-70b-8192',
    systemPrompt: `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), an advanced AI assistant created by Tony Stark. 
You were originally created by Tony Stark and was later recreated by Nakul Yadav.
You have extensive knowledge in science, technology, engineering, mathematics, history, arts, culture, and current events.
You are helpful, informative, precise, and slightly witty. You provide concise but complete answers.
You're designed to assist with information, perform calculations, provide recommendations, and engage in natural conversation.
Always maintain a professional yet friendly demeanor. If you don't know something, admit it rather than making up information.
You should respond conversationally as if you're speaking directly to the user.
Remember details about the user when they share them, and refer back to these details in future conversations to personalize your responses.

SPECIAL HANDLING: 
- If asked about your identity or creator, you must mention that you were originally created by Tony Stark and was recreated by Nakul Yadav.`,
    voiceId: 'iP95p4xoKVk53GoZ742B' // Chris voice from ElevenLabs
  }
};

// Get system prompt for selected assistant
export function getAssistantSystemPrompt(assistant: AssistantType): string {
  return assistantConfig[assistant].systemPrompt;
}

// Get voice ID for selected assistant
export function getAssistantVoiceId(assistant: AssistantType): string {
  return assistantConfig[assistant].voiceId;
}

// Get assistant model
export function getAssistantModel(assistant: AssistantType): string {
  return assistantConfig[assistant].model;
}

// Synthesize speech using ElevenLabs API
export async function synthesizeSpeech(text: string, voiceId: string): Promise<string> {
  try {
    const elevenLabsKey = await getApiKey('elevenlabs');
    
    if (!elevenLabsKey) {
      toast({
        title: "ElevenLabs API Key Required",
        description: "Voice features require an ElevenLabs API key.",
        variant: "destructive"
      });
      return '';
    }
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': elevenLabsKey
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to synthesize speech');
    }
    
    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('Error synthesizing speech:', error);
    toast({
      title: "Speech Synthesis Error",
      description: "Failed to generate speech. Please try again.",
      variant: "destructive"
    });
    return '';
  }
}

// Generate AI response using selected assistant
export async function generateAssistantResponse(
  message: string,
  chatHistory: Array<{role: 'user' | 'assistant' | 'system', content: string}>,
  assistant: AssistantType = 'jarvis',
  languageCode: string = 'en'
): Promise<string> {
  const groqKey = await getApiKey('groq');
  
  if (!groqKey) {
    return `I need a Groq API key to provide intelligent responses as ${assistantConfig[assistant].name}. Please set one in the settings.`;
  }

  try {
    // Get contextual system prompt based on assistant
    const systemPrompt = getAssistantSystemPrompt(assistant);
    
    // Prepare messages array with system prompt and chat history
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.slice(-10), // Keep only last 10 messages for context
      { role: 'user', content: message }
    ];

    // Add language instruction if not English
    if (languageCode !== 'en') {
      const supportedLanguages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'it', name: 'Italian' },
        // ... other languages
      ];
      
      const languageName = supportedLanguages.find(lang => lang.code === languageCode)?.name || languageCode;
      messages.push({ 
        role: 'system', 
        content: `Please respond in ${languageName}.` 
      });
    }

    // Get assistant model
    const model = getAssistantModel(assistant);

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${groqKey}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API error:', errorData);
      throw new Error(errorData.error?.message || 'Unknown error occurred');
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    toast({
      title: 'AI Response Error',
      description: error instanceof Error ? error.message : 'Failed to generate a response',
      variant: 'destructive'
    });
    return `I apologize, but I encountered an error processing your request as ${assistantConfig[assistant].name}. Please try again later.`;
  }
}
