
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, RotateCcw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Message {
  id: string;
  user_id: string;
  message: string;
  timestamp: string;
}

const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || loading || !user) return;

    setLoading(true);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            user_id: user.id,
            message: newMessage.trim()
          }
        ]);

      if (error) throw error;

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

  const resetChat = async () => {
    try {
      setLoading(true);
      
      // Clear messages from database (only for current user's session)
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      // Clear local messages
      setMessages([]);
      
      // Log activity
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
                className={`flex ${message.user_id === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.user_id === user?.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-100'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={sendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400"
            disabled={loading}
          />
          <Button 
            type="submit" 
            disabled={loading || !newMessage.trim()}
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
