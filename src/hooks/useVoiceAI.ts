
import { useState, useEffect, useRef } from 'react';
import { voiceAI } from '@/services/voiceAIService';

export interface UseVoiceAIReturn {
  isListening: boolean;
  isSupported: boolean;
  currentTranscript: string;
  status: 'listening' | 'idle' | 'processing';
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => Promise<void>;
  clearTranscript: () => void;
}

export const useVoiceAI = (): UseVoiceAIReturn => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [status, setStatus] = useState<'listening' | 'idle' | 'processing'>('idle');
  const isSupported = voiceAI.isSupported();
  const statusRef = useRef(status);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const startListening = () => {
    if (!isSupported || voiceAI.isActive()) return;
    
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

  return {
    isListening,
    isSupported,
    currentTranscript,
    status,
    startListening,
    stopListening,
    speak,
    clearTranscript
  };
};
