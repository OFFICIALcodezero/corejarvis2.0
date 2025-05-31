
/**
 * Custom hook for speech recognition with improved error handling and permissions
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpeechRecognitionOptions {
  continuous?: boolean;
  language?: string;
  interimResults?: boolean;
}

interface SpeechRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  clearTranscript: () => void;
  error: string | null;
  isSupported: boolean;
  hasPermission: boolean;
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  
  // Check if speech recognition is supported
  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  
  // Create a ref for the recognition instance
  const recognitionRef = useRef<any>(null);
  const permissionCheckedRef = useRef(false);
  
  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      if (permissionCheckedRef.current) return;
      permissionCheckedRef.current = true;
      
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setHasPermission(result.state === 'granted');
        
        result.addEventListener('change', () => {
          setHasPermission(result.state === 'granted');
        });
      } catch (err) {
        // Fallback: try to access microphone directly
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setHasPermission(true);
          stream.getTracks().forEach(track => track.stop());
        } catch (micError) {
          setHasPermission(false);
          console.log('Microphone permission not granted:', micError);
        }
      }
    };
    
    checkPermission();
  }, []);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configure options
    recognitionRef.current.continuous = options.continuous ?? true;
    recognitionRef.current.interimResults = options.interimResults ?? true;
    recognitionRef.current.lang = options.language ?? 'en-US';
    
    // Set up event handlers
    recognitionRef.current.onstart = () => {
      console.log('Speech recognition started');
      setIsListening(true);
      setError(null);
    };
    
    recognitionRef.current.onresult = (event: any) => {
      const currentTranscript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join(' ');
      
      console.log('Speech recognized:', currentTranscript);
      setTranscript(currentTranscript);
    };
    
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionRef.current.onend = () => {
      console.log('Speech recognition ended');
      setIsListening(false);
    };
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options.continuous, options.interimResults, options.language, isSupported]);
  
  // Start listening
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    
    // Request microphone permission first
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      setError(null);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access to use voice features.');
      setHasPermission(false);
      return;
    }
    
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start();
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes('already started')) {
        // If already started, stop and restart
        recognitionRef.current.stop();
        setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.start();
          }
        }, 100);
      } else {
        console.error('Failed to start speech recognition:', err);
        setError('Failed to start speech recognition');
      }
    }
  }, [isSupported]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);
  
  // Clear transcript
  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    clearTranscript,
    error,
    isSupported,
    hasPermission
  };
};

export default useSpeechRecognition;
