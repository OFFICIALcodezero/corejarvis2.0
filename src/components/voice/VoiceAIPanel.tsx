
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Info } from 'lucide-react';

interface VoiceAIPanelProps {
  hackerMode?: boolean;
}

const VoiceAIPanel: React.FC<VoiceAIPanelProps> = ({ hackerMode = false }) => {
  return (
    <Card className={`${hackerMode ? 'bg-black/40 border-red-500/30' : 'glass-morphism'}`}>
      <CardHeader>
        <CardTitle className={`${hackerMode ? 'text-red-400' : 'text-jarvis'} flex items-center`}>
          <Shield className="h-5 w-5 mr-2" />
          Voice AI System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-blue-400" />
          <span className="text-sm text-gray-400">Voice controls moved to chat interface</span>
        </div>
        
        <div className="bg-black/30 border border-blue-500/20 rounded-md p-4">
          <h4 className="font-medium text-blue-400 mb-2">Voice Features Available</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Voice input via microphone button in chat</li>
            <li>• Text-to-speech responses</li>
            <li>• Real-time voice transcription</li>
            <li>• Voice activity indicators</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500">
          <p>Voice commands are now integrated directly into the chat interface for better user experience.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceAIPanel;
