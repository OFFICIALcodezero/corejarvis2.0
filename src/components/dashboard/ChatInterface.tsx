import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, RotateCcw, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useVoiceAI } from '@/hooks/useVoiceAI';
import { useVoiceSynthesis } from '@/hooks/useVoiceSynthesis';

interface Message {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
  is_ai?: boolean;
}

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Voice functionality
  const { 
    isListening, 
    isSupported, 
    currentTranscript, 
    isActivated,
    startListening, 
    stopListening,
    activateVoiceAI,
    deactivateVoiceAI,
    clearTranscript 
  } = useVoiceAI();
  
  const { speakText, stopSpeaking, isPlaying } = useVoiceSynthesis('normal');

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('timestamp', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('messages-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          setMessages(current => [...current, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const processAIResponse = async (userMessage: string): Promise<string> => {
    // Simple AI response logic - you can enhance this
    const responses = [
      "I understand you're asking about: " + userMessage,
      "That's an interesting question. Let me help you with that.",
      "I'm processing your request about: " + userMessage,
      "Thank you for your message. I'm here to assist you.",
      "I see you mentioned: " + userMessage + ". How can I help further?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = newMessage.trim() || currentTranscript.trim();
    
    if (!messageText || loading || !user) return;

    setLoading(true);
    clearTranscript();

    try {
      // Send user message
      const { error: userError } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            message: messageText,
            is_ai: false
          }
        ]);

      if (userError) throw userError;

      // Generate AI response
      const aiResponse = await processAIResponse(messageText);
      
      // Send AI response
      const { error: aiError } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            message: aiResponse,
            is_ai: true
          }
        ]);

      if (aiError) throw aiError;

      // Speak AI response
      if (isSupported) {
        await speakText(aiResponse);
      }

      // Log activity
      await supabase.rpc('log_activity', { 
        activity_text: 'Sent a message in chat' 
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const toggleVoiceListening = async () => {
    if (!isActivated) {
      await activateVoiceAI();
      if (isActivated) {
        startListening();
      }
    } else if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const resetChat = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      setMessages([]);
      
      await supabase.rpc('log_activity', { 
        activity_text: 'Reset chat conversation' 
      });

      toast.success('Chat conversation reset');
    } catch (error) {
      console.error('Error resetting chat:', error);
      toast.error('Failed to reset chat');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-black/40 border-blue-500/30 backdrop-blur-lg h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-blue-400">JARVIS Chat Interface</CardTitle>
        <div className="flex items-center gap-2">
          {/* Voice Controls */}
          {isSupported && (
            <>
              <Button
                onClick={toggleVoiceListening}
                disabled={loading}
                variant="outline"
                size="sm"
                className={`border-blue-500/30 ${
                  isListening 
                    ? 'text-red-400 hover:bg-red-500/10' 
                    : 'text-blue-400 hover:bg-blue-500/10'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={isPlaying ? stopSpeaking : undefined}
                disabled={!isPlaying}
                variant="outline"
                size="sm"
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              >
                {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </>
          )}
          
          <Button
            onClick={resetChat}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Chat
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-900/20 rounded border border-blue-500/20">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.is_ai ? 'justify-start' : 'justify-end'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.is_ai
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  {message.is_ai && (
                    <p className="text-xs opacity-75 mb-1">JARVIS</p>
                  )}
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Voice Transcript Display */}
        {currentTranscript && (
          <div className="bg-blue-600/20 border border-blue-500/30 rounded-md p-2">
            <p className="text-sm text-blue-300">Transcript: {currentTranscript}</p>
          </div>
        )}

        {/* Voice Status */}
        {isListening && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="h-2 w-2 bg-red-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Listening...</span>
          </div>
        )}

        {isPlaying && (
          <div className="flex items-center space-x-2 text-blue-400">
            <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Speaking...</span>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isListening ? "Listening..." : "Type your message or use voice..."}
            className="flex-1 bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || (!newMessage.trim() && !currentTranscript.trim())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
