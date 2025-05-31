
import { useState, useEffect, useRef } from 'react';
import { voiceAI } from '@/services/voiceAIService';

export interface UseVoiceAIReturn {
  isListening: boolean;
  isSupported: boolean;
  currentTranscript: string;
  status: 'listening' | 'idle' | 'processing';
  isActivated: boolean;
  startListening: () => void;
  stopListening: () => void;
  activateVoiceAI: () => void;
  deactivateVoiceAI: () => void;
  speak: (text: string) => Promise<void>;
  clearTranscript: () => void;
}

export const useVoiceAI = (): UseVoiceAIReturn => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [status, setStatus] = useState<'listening' | 'idle' | 'processing'>('idle');
  const [isActivated, setIsActivated] = useState(false);
  const isSupported = voiceAI.isSupported();
  const micActiveRef = useRef(false);

  // Remove auto-initialization - only activate when user requests
  const activateVoiceAI = () => {
    if (!isSupported || micActiveRef.current) return;
    
    micActiveRef.current = true;
    setIsActivated(true);
    console.log('Voice AI activated by user');
  };

  const deactivateVoiceAI = () => {
    if (isListening) {
      voiceAI.stopListening();
    }
    micActiveRef.current = false;
    setIsActivated(false);
    setIsListening(false);
    setStatus('idle');
    setCurrentTranscript('');
    console.log('Voice AI deactivated by user');
  };

  const startListening = () => {
    if (!isSupported || !isActivated || voiceAI.isActive()) return;
    
    setCurrentTranscript('');
    setIsListening(true);
    
    voiceAI.startListening(
      (transcript) => {
        setCurrentTranscript(transcript);
      },
      (newStatus) => {
        setStatus(newStatus);
        setIsListening(newStatus === 'listening' || newStatus === 'processing');
      }
    );
  };

  const stopListening = () => {
    voiceAI.stopListening();
    setIsListening(false);
    setStatus('idle');
  };

  const speak = async (text: string): Promise<void> => {
    await voiceAI.speak(text);
  };

  const clearTranscript = () => {
    setCurrentTranscript('');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (micActiveRef.current) {
        deactivateVoiceAI();
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    currentTranscript,
    status,
    isActivated,
    startListening,
    stopListening,
    activateVoiceAI,
    deactivateVoiceAI,
    speak,
    clearTranscript
  };
};
