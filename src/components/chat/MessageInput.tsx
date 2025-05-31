
import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '../ui/use-toast';

interface MessageInputProps {
  input?: string;
  setInput?: (value: string) => void;
  handleSendMessage?: () => void;
  onSendMessage?: (text: string) => void;
  isProcessing?: boolean;
  isListening?: boolean;
  isDisabled?: boolean;
  onToggleListen?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  input = '',
  setInput = () => {},
  handleSendMessage,
  onSendMessage,
  isProcessing = false,
  isListening = false,
  isDisabled = false,
  onToggleListen,
}) => {
  const [visualFeedback, setVisualFeedback] = useState<'idle' | 'listening' | 'speaking'>('idle');
  const [dotCount, setDotCount] = useState(1);
  const [micPermission, setMicPermission] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  
  // Check microphone permission on component mount
  useEffect(() => {
    const checkMicPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setMicPermission(result.state === 'granted' ? 'granted' : 'denied');
        
        result.addEventListener('change', () => {
          setMicPermission(result.state === 'granted' ? 'granted' : 'denied');
        });
      } catch (err) {
        // Fallback for browsers that don't support permissions API
        setMicPermission('unknown');
      }
    };
    
    checkMicPermission();
  }, []);
  
  // Create visual feedback for voice recognition
  useEffect(() => {
    let interval: number;
    
    if (isListening) {
      setVisualFeedback('listening');
      // Animate the dots when listening
      interval = window.setInterval(() => {
        setDotCount(prev => prev >= 3 ? 1 : prev + 1);
      }, 500);
    } else {
      setVisualFeedback('idle');
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isListening]);
  
  const listeningText = `Listening${'.'.repeat(dotCount)}`;
  
  const handleSubmit = () => {
    if (handleSendMessage) {
      handleSendMessage();
    } else if (onSendMessage && input.trim()) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleMicClick = async () => {
    if (!onToggleListen) return;
    
    // If microphone permission is denied, request it
    if (micPermission === 'denied' || micPermission === 'unknown') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermission('granted');
        toast({
          title: "Microphone Access Granted",
          description: "You can now use voice input.",
        });
      } catch (err) {
        setMicPermission('denied');
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice features.",
          variant: "destructive"
        });
        return;
      }
    }
    
    onToggleListen();
  };

  return (
    <div className="p-3 bg-black/30 border-t border-jarvis/20">
      <div className="flex items-center">
        {onToggleListen && (
          <Button
            variant="ghost"
            size="icon"
            className={`mr-2 ${
              isListening 
                ? 'text-jarvis bg-jarvis/20 hover:bg-jarvis/30' 
                : micPermission === 'denied' 
                  ? 'text-red-500 hover:text-red-400' 
                  : 'text-gray-500 hover:text-jarvis'
            }`}
            onClick={handleMicClick}
            disabled={isProcessing || isDisabled}
            title={
              micPermission === 'denied' 
                ? 'Microphone access denied. Click to request permission.' 
                : isListening 
                  ? 'Stop listening' 
                  : 'Start voice input'
            }
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
        )}
      
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 bg-black/40 border-jarvis/30 text-white focus-visible:ring-jarvis/50 ${
            isListening ? 'border-jarvis/50 bg-jarvis/5' : ''
          }`}
          placeholder={isListening ? listeningText : "Type your message..."}
          disabled={isProcessing || (isListening && !input) || isDisabled}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        
        {isListening && (
          <div className="absolute right-16 flex items-center justify-center">
            <Mic className="h-4 w-4 text-jarvis animate-pulse" />
          </div>
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`ml-2 ${
            input.trim() ? 'text-jarvis hover:bg-jarvis/20' : 'text-gray-500'
          }`}
          onClick={handleSubmit}
          disabled={isProcessing || isDisabled || (!input.trim() && !isListening)}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      {micPermission === 'denied' && (
        <div className="mt-2 text-xs text-red-400 text-center">
          Microphone access is required for voice input. Click the mic button to enable.
        </div>
      )}
    </div>
  );
};

export default MessageInput;
