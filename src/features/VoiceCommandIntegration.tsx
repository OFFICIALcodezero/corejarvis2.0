
import React, { useEffect, useState, useRef } from 'react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceCommandIntegrationProps {
  isActive: boolean;
  userActivated?: boolean; // Only start if user explicitly activated
}

const VoiceCommandIntegration: React.FC<VoiceCommandIntegrationProps> = ({ 
  isActive,
  userActivated = false
}) => {
  const { 
    transcript, 
    isListening, 
    startListening, 
    stopListening, 
    clearTranscript,
    isSupported,
    hasPermission 
  } = useSpeechRecognition();
  
  const [lastProcessedTranscript, setLastProcessedTranscript] = useState('');
  const [realtimeChannel, setRealtimeChannel] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const commandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const activeCommandsRef = useRef<Set<string>>(new Set());
  
  // Safe fallback for sendMessage without causing import errors
  const sendMessage = async (message: string) => {
    console.log("Voice command received:", message);
    toast({
      title: "Voice Command",
      description: `Received: "${message}"`,
    });
  };
  
  // Set up and connect to Supabase Realtime for command broadcasting
  useEffect(() => {
    if (!isActive || !userActivated) return;
    
    // Create a realtime channel for voice commands
    const channel = supabase.channel('voice_commands', {
      config: {
        broadcast: { self: true },
        presence: { key: 'user_' + Math.random().toString(36).substring(2, 9) },
      }
    });

    // Handle incoming voice commands from other clients
    channel
      .on('broadcast', { event: 'voice_command' }, (payload) => {
        console.log('Received broadcast voice command:', payload);
        if (payload.payload && payload.payload.command) {
          toast({
            title: "Remote Voice Command",
            description: `Processing: "${payload.payload.command}"`,
          });
          
          processCommand(payload.payload.command, false);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Connected to voice commands channel');
          setRealtimeChannel(channel);
        }
      });

    return () => {
      if (channel) {
        console.log('Removing voice commands channel');
        supabase.removeChannel(channel);
      }
    };
  }, [isActive, userActivated]);
  
  // Only start listening if user explicitly activated AND has permissions
  useEffect(() => {
    if (isActive && userActivated && !isListening && isSupported && hasPermission) {
      console.log("Starting voice recognition with user permission");
      startListening();
    } else if (!isActive && isListening) {
      console.log("Stopping voice recognition");
      stopListening();
    }
    
    return () => {
      if (isListening) {
        stopListening();
        console.log("Voice recognition cleanup");
      }
      
      if (commandTimeoutRef.current) {
        clearTimeout(commandTimeoutRef.current);
        commandTimeoutRef.current = null;
      }
    };
  }, [isActive, userActivated, isListening, startListening, stopListening, isSupported, hasPermission]);
  
  // Process transcript when it changes
  useEffect(() => {
    if (!transcript || transcript === lastProcessedTranscript || isProcessing || !userActivated) return;
    
    // Check for wake word "Jarvis"
    const hasWakeWord = /\b(jarvis|hey jarvis|hey j.a.r.v.i.s|j.a.r.v.i.s)\b/i.test(transcript);
    
    if (hasWakeWord) {
      console.log("Wake word detected:", transcript);
      
      processCommand(transcript, true);
      setLastProcessedTranscript(transcript);
      clearTranscript();
    }
  }, [transcript, lastProcessedTranscript, isProcessing, userActivated]);
  
  // Function to process voice commands with debouncing and broadcasting
  const processCommand = async (command: string, shouldBroadcast: boolean = true) => {
    if (activeCommandsRef.current.has(command)) {
      return;
    }
    
    activeCommandsRef.current.add(command);
    setIsProcessing(true);
    
    toast({
      title: "Voice Command Detected",
      description: `Processing: "${command}"`,
    });
    
    if (shouldBroadcast && realtimeChannel) {
      try {
        await realtimeChannel.send({
          type: 'broadcast',
          event: 'voice_command',
          payload: { command }
        });
        console.log("Voice command broadcast to other clients");
      } catch (error) {
        console.error("Error broadcasting voice command:", error);
      }
    }
    
    try {
      await sendMessage(command);
    } catch (error) {
      console.error("Error processing voice command:", error);
    } finally {
      commandTimeoutRef.current = setTimeout(() => {
        activeCommandsRef.current.delete(command);
        setIsProcessing(false);
      }, 2000);
    }
  };
  
  return null;
};

export default VoiceCommandIntegration;
