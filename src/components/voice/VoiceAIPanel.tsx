
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoiceAI } from '@/hooks/useVoiceAI';

interface VoiceAIPanelProps {
  hackerMode?: boolean;
}

const VoiceAIPanel: React.FC<VoiceAIPanelProps> = ({ hackerMode = false }) => {
  const { 
    isListening, 
    isSupported, 
    currentTranscript, 
    status,
    startListening, 
    stopListening,
    speak,
    clearTranscript 
  } = useVoiceAI();

  const handleTestSpeak = () => {
    speak('Voice AI system is online and ready for commands.');
  };

  if (!isSupported) {
    return (
      <Card className={`${hackerMode ? 'bg-black/40 border-red-500/30' : 'glass-morphism'}`}>
        <CardHeader>
          <CardTitle className={`${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>
            Voice AI Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-sm">
            Voice recognition not supported in this browser
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${hackerMode ? 'bg-black/40 border-red-500/30' : 'glass-morphism'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center justify-between ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>
          <span>Voice AI System</span>
          <Badge variant={status === 'listening' ? 'default' : 'secondary'}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? "destructive" : "default"}
            className={`flex-1 ${hackerMode ? 'bg-red-600/20 hover:bg-red-600/30 border-red-500' : ''}`}
          >
            {isListening ? (
              <>
                <MicOff className="h-4 w-4 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="h-4 w-4 mr-2" />
                Start Listening
              </>
            )}
          </Button>
          
          <Button
            onClick={handleTestSpeak}
            variant="outline"
            size="icon"
            className={hackerMode ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' : ''}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>

        {status === 'listening' && (
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full animate-pulse ${hackerMode ? 'bg-red-400' : 'bg-jarvis'}`}></div>
            <div className={`h-2 w-2 rounded-full animate-pulse ${hackerMode ? 'bg-red-400' : 'bg-jarvis'}`} style={{ animationDelay: '0.2s' }}></div>
            <div className={`h-2 w-2 rounded-full animate-pulse ${hackerMode ? 'bg-red-400' : 'bg-jarvis'}`} style={{ animationDelay: '0.4s' }}></div>
            <span className="text-sm text-gray-400">Listening...</span>
          </div>
        )}

        {currentTranscript && (
          <div className={`bg-black/30 border rounded-md p-3 ${hackerMode ? 'border-red-500/20' : 'border-jarvis/20'}`}>
            <p className="text-sm text-white">{currentTranscript}</p>
            <Button
              onClick={clearTranscript}
              variant="ghost"
              size="sm"
              className="mt-2 text-xs"
            >
              Clear
            </Button>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>Say "remember this", "learn this", or "store this" to add knowledge to memory</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAIPanel;
