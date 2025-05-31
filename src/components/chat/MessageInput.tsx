
import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface MessageInputProps {
  input?: string;
  setInput?: (value: string) => void;
  handleSendMessage?: () => void;
  onSendMessage?: (text: string) => void;
  isProcessing?: boolean;
  isDisabled?: boolean;
  enableVoice?: boolean;
  context?: 'dashboard' | 'interface';
}

const MessageInput: React.FC<MessageInputProps> = ({
  input = '',
  setInput = () => {},
  handleSendMessage,
  onSendMessage,
  isProcessing = false,
  isDisabled = false,
  enableVoice = false,
  context = 'interface'
}) => {
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
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-black/40 border-jarvis/30 text-white focus-visible:ring-jarvis/50"
          placeholder="Type your message..."
          disabled={isProcessing || isDisabled}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className={`ml-2 ${
            input.trim() ? 'text-jarvis hover:bg-jarvis/20' : 'text-gray-500'
          }`}
          onClick={handleSubmit}
          disabled={isProcessing || isDisabled || !input.trim()}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
