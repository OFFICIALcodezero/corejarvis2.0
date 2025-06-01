
import React from 'react';
import { Brain, Mic, Tv, Settings, Video } from 'lucide-react';
import { ControlOption } from '@/components/ControlPanel';

interface ControlOptionsProps {
  activeMode: 'normal' | 'voice' | 'face' | 'hacker' | 'satellite' | 'advanced';
  hackerModeActive: boolean;
}

export const useControlOptions = ({ activeMode, hackerModeActive }: ControlOptionsProps) => {
  const controlOptions: ControlOption[] = [
    {
      id: 'normal',
      label: 'Normal Mode',
      icon: <Brain />,
      active: activeMode === 'normal' && !hackerModeActive
    },
    {
      id: 'voice',
      label: 'Voice Mode',
      icon: <Mic />,
      active: activeMode === 'voice' && !hackerModeActive
    },
    {
      id: 'face',
      label: 'Face Mode',
      icon: <Tv />,
      active: activeMode === 'face' && !hackerModeActive
    },
    {
      id: 'videos',
      label: 'Video Maker',
      icon: <Video />,
      active: false
    },
    {
      id: 'advanced',
      label: 'Advanced Mode',
      icon: <Settings />,
      active: activeMode === 'advanced' && !hackerModeActive
    }
    // Satellite and Hacker modes removed - can only be activated via voice commands
  ];
  
  return controlOptions;
};
