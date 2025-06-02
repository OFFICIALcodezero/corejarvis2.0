
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceAI } from '@/hooks/useVoiceAI';
import { toast } from '@/components/ui/use-toast';

const VoiceAssistant: React.FC = () => {
  const {
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
  } = useVoiceAI();

  const [lastCommand, setLastCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const handleVoiceCommand = (command: string) => {
    setLastCommand(command);
    setCommandHistory(prev => [command, ...prev.slice(0, 9)]); // Keep last 10 commands
    
    // Process voice commands
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('add client')) {
      toast({
        title: "Voice Command Processed",
        description: "Navigate to Client Manager to add a new client",
      });
    } else if (lowerCommand.includes('schedule meeting') || lowerCommand.includes('book meeting')) {
      toast({
        title: "Voice Command Processed",
        description: "Navigate to Meeting Scheduler to book a new meeting",
      });
    } else if (lowerCommand.includes('add task')) {
      toast({
        title: "Voice Command Processed",
        description: "Navigate to Task Manager to add a new task",
      });
    } else if (lowerCommand.includes('check email') || lowerCommand.includes('show emails')) {
      toast({
        title: "Voice Command Processed",
        description: "Navigate to Email Assistant to check your emails",
      });
    } else if (lowerCommand.includes('daily brief') || lowerCommand.includes('show overview')) {
      toast({
        title: "Voice Command Processed",
        description: "Navigate to Daily Brief for your business overview",
      });
    } else {
      toast({
        title: "Voice Command Received",
        description: `Processed: "${command}"`,
      });
    }
  };

  // Handle transcript changes
  React.useEffect(() => {
    if (currentTranscript && currentTranscript !== lastCommand) {
      const hasWakeWord = /\b(jarvis|hey jarvis)\b/i.test(currentTranscript);
      if (hasWakeWord) {
        handleVoiceCommand(currentTranscript);
        clearTranscript();
      }
    }
  }, [currentTranscript, lastCommand, clearTranscript]);

  const testSpeech = async () => {
    await speak("Voice assistant is working correctly. How can I help you with your business tasks today?");
  };

  if (!isSupported) {
    return (
      <div className="p-6">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-8 text-center">
            <MicOff className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Voice Assistant Unavailable</h3>
            <p className="text-gray-400">Your browser doesn't support speech recognition</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Voice Assistant</h3>
          <p className="text-gray-400">Control your business dashboard with voice commands</p>
        </div>
      </div>

      {/* Voice Controls */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mic className="h-5 w-5 text-cyan-500" />
            Voice Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div>
              <h4 className="font-medium text-white">Voice Assistant Status</h4>
              <p className="text-sm text-gray-400">
                {isActivated ? 'Activated and ready' : 'Click activate to enable voice commands'}
              </p>
            </div>
            <Badge className={`${isActivated ? 'bg-green-500' : 'bg-gray-500'} text-white`}>
              {isActivated ? 'Active' : 'Inactive'}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Button
                onClick={isActivated ? deactivateVoiceAI : activateVoiceAI}
                className={`w-full gap-2 ${
                  isActivated 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-cyan-500 hover:bg-cyan-600'
                } text-white`}
              >
                {isActivated ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isActivated ? 'Deactivate' : 'Activate'} Voice Assistant
              </Button>
              
              {isActivated && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant="outline"
                  className={`w-full gap-2 border-white/20 text-white hover:bg-white/10 ${
                    isListening ? 'bg-red-500/20 border-red-500/50' : ''
                  }`}
                >
                  <Mic className={`h-4 w-4 ${isListening ? 'animate-pulse' : ''}`} />
                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Button
                onClick={testSpeech}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 gap-2"
              >
                <Volume2 className="h-4 w-4" />
                Test Speech Output
              </Button>

              <Button
                onClick={clearTranscript}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                Clear Transcript
              </Button>
            </div>
          </div>

          {/* Current Status */}
          {isActivated && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Mic className={`h-4 w-4 text-cyan-400 ${isListening ? 'animate-pulse' : ''}`} />
                <span className="font-medium text-cyan-400">
                  Status: {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
              {currentTranscript && (
                <p className="text-white text-sm">
                  <strong>Current:</strong> {currentTranscript}
                </p>
              )}
              {lastCommand && (
                <p className="text-gray-300 text-sm">
                  <strong>Last Command:</strong> {lastCommand}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Voice Commands Guide */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Available Voice Commands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-cyan-400">Client Management</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">"Hey Jarvis, add client named John from TechNova"</p>
                <p className="text-gray-300">"Hey Jarvis, search client by company name"</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-cyan-400">Task Management</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">"Hey Jarvis, add task: Finish client proposal"</p>
                <p className="text-gray-300">"Hey Jarvis, mark design task as completed"</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-cyan-400">Meeting Scheduler</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">"Hey Jarvis, schedule call with Sarah at 3 PM Friday"</p>
                <p className="text-gray-300">"Hey Jarvis, what meetings do I have this week?"</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-cyan-400">Email Assistant</h4>
              <div className="space-y-2 text-sm">
                <p className="text-gray-300">"Hey Jarvis, summarize latest emails"</p>
                <p className="text-gray-300">"Hey Jarvis, check my unread emails"</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Command History */}
      {commandHistory.length > 0 && (
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Recent Commands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {commandHistory.map((command, index) => (
                <div key={index} className="p-2 bg-white/5 rounded border border-white/10">
                  <p className="text-sm text-gray-300">{command}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoiceAssistant;
