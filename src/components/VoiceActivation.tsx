
import React from 'react';
import IronManBackground from './chat/IronManBackground';

interface VoiceActivationProps {
  onCommandReceived?: (command: string) => void;
  isSpeaking?: boolean;
  hackerMode?: boolean;
}

const VoiceActivation: React.FC<VoiceActivationProps> = ({
  onCommandReceived,
  isSpeaking = false,
  hackerMode = false
}) => {
  // Iron Man should only glow when Jarvis is speaking
  const isJarvisActive = isSpeaking;
  
  return (
    <div className="flex flex-col items-center gap-3 relative">
      {/* Iron Man Background positioned to fill the space */}
      <div className="mb-4 relative w-full h-40">
        <IronManBackground isGlowing={isJarvisActive} hackerMode={hackerMode} />
      </div>
      
      <div className={`text-xs ${hackerMode ? 'text-red-400/70' : 'text-white/70'}`}>
        {isSpeaking ? "Speaking..." : "Text input only"}
      </div>
    </div>
  );
};

export default VoiceActivation;
