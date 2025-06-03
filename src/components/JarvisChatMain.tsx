
import React, { useState, useRef, useEffect } from "react";
import { Send, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useJarvisChat } from "./JarvisChatContext";
import ChatMode from "./chat/ChatMode";
import { useChatLogic } from "@/hooks/useChatLogic";

interface JarvisChatMainProps {
  hackerMode?: boolean;
  detectedEmotion?: string;
}

const JarvisChatMain: React.FC<JarvisChatMainProps> = ({ 
  hackerMode = false, 
  detectedEmotion 
}) => {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    sendMessage, 
    resetChat,
    isProcessing, 
    suggestions,
    isSpeaking,
    isListening,
    activeAssistant,
    inputMode 
  } = useJarvisChat();

  const {
    input,
    setInput,
    isTyping,
    currentTypingText,
    processUserMessage,
    scrollToBottom
  } = useChatLogic(
    'normal',
    () => {},
    activeAssistant as any,
    inputMode
  );

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;
    
    const message = inputValue.trim();
    setInputValue("");
    
    await sendMessage(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setInputValue(suggestionText);
    handleSendMessage();
  };

  const handleResetChat = () => {
    resetChat();
    setInputValue("");
  };

  return (
    <div className={`flex flex-col h-full ${hackerMode ? 'bg-black/80' : 'bg-black/20'}`}>
      {/* Header with reset button */}
      <div className={`flex justify-between items-center p-3 border-b ${
        hackerMode ? 'border-red-500/20' : 'border-jarvis/20'
      }`}>
        <h3 className={`font-medium ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>
          Chat with {activeAssistant.toUpperCase()}
        </h3>
        <Button
          onClick={handleResetChat}
          variant="ghost"
          size="sm"
          className={`${
            hackerMode 
              ? 'text-red-400 hover:bg-red-500/10 border-red-500/30' 
              : 'text-jarvis hover:bg-jarvis/10 border-jarvis/30'
          } border`}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto">
        <ChatMode 
          messages={messages}
          isTyping={isTyping}
          currentTypingText={currentTypingText}
          isProcessing={isProcessing}
          hackerMode={hackerMode}
        />
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-3 border-t border-jarvis/20">
          <div className="flex flex-wrap gap-2">
            {suggestions.slice(0, 3).map((suggestion) => (
              <Button
                key={suggestion.id}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion.text)}
                className={`text-xs ${
                  hackerMode 
                    ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' 
                    : 'border-jarvis/30 text-jarvis hover:bg-jarvis/10'
                }`}
              >
                {suggestion.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className={`p-3 border-t ${hackerMode ? 'border-red-500/20' : 'border-jarvis/20'}`}>
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isListening ? "Listening..." : "Type your message..."}
            className={`flex-1 ${
              hackerMode 
                ? 'bg-black/40 border-red-500/30 text-white placeholder-red-400/50' 
                : 'bg-black/40 border-jarvis/30 text-white placeholder-gray-400'
            }`}
            disabled={isProcessing}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isProcessing || !inputValue.trim()}
            className={`${
              hackerMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-jarvis hover:bg-jarvis/80'
            } text-white`}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Status indicators */}
        <div className="mt-2 flex justify-between text-xs">
          <span className={hackerMode ? 'text-red-400/70' : 'text-gray-400'}>
            {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
          </span>
          {detectedEmotion && (
            <span className="text-jarvis">
              Emotion: {detectedEmotion}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default JarvisChatMain;
