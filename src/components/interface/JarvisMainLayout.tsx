
import React from 'react';
import { AssistantType } from '@/pages/JarvisInterface';
import VoiceActivation from '@/components/VoiceActivation';
import JarvisCentralCore from '@/components/JarvisCentralCore';
import JarvisChat from '@/components/JarvisChat';
import HackerMode from '@/components/chat/HackerMode';
import { LocationAwareness } from '@/features/LocationAwareness';
import FaceDetection from '@/features/FaceDetection';
import WeatherDisplay from '@/features/WeatherDisplay';

interface JarvisMainLayoutProps {
  isSpeaking: boolean;
  isListening: boolean;
  isProcessing: boolean;
  activeMode: 'normal' | 'voice' | 'face' | 'satellite';
  hackerModeActive: boolean;
  mode: 'chat' | 'hacker';
  hackerOutput: string;
  setHackerOutput: React.Dispatch<React.SetStateAction<string>>;
  deactivateHackerMode: () => void;
  toggleListening: () => void;
  activeAssistant: AssistantType;
  handleAssistantChange: (assistant: string) => void;
  inputMode: 'voice' | 'text';
  setInputMode: React.Dispatch<React.SetStateAction<'voice' | 'text'>>;
  handleMessageCheck: (message: string) => boolean;
}

const JarvisMainLayout: React.FC<JarvisMainLayoutProps> = ({
  isSpeaking,
  isListening,
  isProcessing,
  activeMode,
  hackerModeActive,
  mode,
  hackerOutput,
  setHackerOutput,
  deactivateHackerMode,
  toggleListening,
  activeAssistant,
  handleAssistantChange,
  inputMode,
  setInputMode,
  handleMessageCheck
}) => {
  // State for device integration
  const [userLocation, setUserLocation] = React.useState<GeolocationPosition | null>(null);
  const [locationLoading, setLocationLoading] = React.useState<boolean>(false);
  const [locationError, setLocationError] = React.useState<string | null>(null);
  
  // Request geolocation when component mounts
  React.useEffect(() => {
    if ('geolocation' in navigator) {
      setLocationLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(position);
          setLocationLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError('Unable to access your location. Please check permissions.');
          setLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col lg:flex-row gap-4 p-4 z-10">
      <div className="lg:w-1/3 order-2 lg:order-1">
        <div className={`${hackerModeActive ? 'bg-black/40 border-red-500/20' : 'glass-morphism'} p-4 rounded-2xl h-full flex flex-col`}>
          <JarvisCentralCore 
            isSpeaking={isSpeaking}
            isListening={isListening}
            isProcessing={isProcessing}
            activeMode={hackerModeActive ? 'hacker' : activeMode}
          />
          <div className="mt-4">
            <VoiceActivation 
              isSpeaking={isSpeaking}
              hackerMode={hackerModeActive}
            />
          </div>
          
          <div className="mt-4 space-y-4">
            <LocationAwareness 
              userLocation={userLocation} 
              isLoading={locationLoading} 
              error={locationError} 
              isHackerMode={hackerModeActive}
            />
            
            <WeatherDisplay isHackerMode={hackerModeActive} />
            
            {activeMode === 'face' && (
              <FaceDetection isHackerMode={hackerModeActive} />
            )}
          </div>
        </div>
      </div>
      
      <div className="lg:w-2/3 order-1 lg:order-2">
        {hackerModeActive && mode === 'hacker' ? (
          <div className="h-full rounded-xl overflow-hidden border border-red-500/30">
            <HackerMode 
              hackerOutput={hackerOutput}
              setHackerOutput={setHackerOutput}
              onDeactivate={deactivateHackerMode}
            />
          </div>
        ) : (
          <JarvisChat 
            activeMode={activeMode}
            setIsSpeaking={value => typeof value === 'function' ? value(isSpeaking) : value}
            isListening={isListening}
            activeAssistant={activeAssistant}
            setActiveAssistant={handleAssistantChange}
            inputMode={inputMode}
            setInputMode={setInputMode}
            onMessageCheck={handleMessageCheck}
            hackerModeActive={hackerModeActive} 
            hackerOutput={hackerOutput}
            setHackerOutput={setHackerOutput}
            onDeactivateHacker={deactivateHackerMode}
          />
        )}
      </div>
    </div>
  );
};

export default JarvisMainLayout;
