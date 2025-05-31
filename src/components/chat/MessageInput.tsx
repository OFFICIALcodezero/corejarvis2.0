
import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

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
  
  // Create visual feedback for voice recognition only when manually activated
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

  return (
    <div className="p-3 bg-black/30 border-t border-jarvis/20">
      <div className="flex items-center">
        {onToggleListen && (
          <Button
            variant="ghost"
            size="icon"
            className={`mr-2 ${isListening ? 'text-jarvis bg-jarvis/20 hover:bg-jarvis/30' : 'text-gray-500 hover:text-jarvis'}`}
            onClick={onToggleListen}
            disabled={isProcessing || isDisabled}
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
    </div>
  );
};

export default MessageInput;
