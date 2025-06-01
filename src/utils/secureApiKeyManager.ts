
import { SecureApiKeyService } from '@/services/secureApiKeyService';

// Updated API key manager that uses the secure database service
export type ApiServiceType = 'groq' | 'elevenlabs' | 'openai' | 'pexels';

/**
 * Check if an API key exists for a service (for user-facing features)
 */
export const apiKeyExists = async (service: ApiServiceType): Promise<boolean> => {
  const key = await SecureApiKeyService.getActiveKey(service);
  return !!key;
};

/**
 * Get an API key for a service (internal use only)
 */
export const getApiKey = async (service: ApiServiceType): Promise<string | null> => {
  return await SecureApiKeyService.getActiveKey(service);
};

/**
 * User-friendly error message when no keys are available
 */
export const getNoKeyMessage = (service: string): string => {
  return `${service} features are temporarily unavailable. Please contact your administrator to configure API keys.`;
};

/**
 * Get voice ID for the assistant (unchanged)
 */
export function getVoiceId(): string {
  return 'iP95p4xoKVk53GoZ742B'; // Chris voice from ElevenLabs
}

// Remove old functions that allowed direct key management
export const setApiKey = () => {
  throw new Error('Direct API key management is not allowed. Please use the admin panel.');
};

export const removeApiKey = () => {
  throw new Error('Direct API key management is not allowed. Please use the admin panel.');
};
