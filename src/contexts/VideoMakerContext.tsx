
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PexelsVideo {
  id: number;
  url: string;
  duration: number;
  width: number;
  height: number;
  video_files: Array<{
    id: number;
    quality: string;
    file_type: string;
    width: number;
    height: number;
    link: string;
  }>;
  video_pictures: Array<{
    id: number;
    picture: string;
    nr: number;
  }>;
}

export interface SelectedClip {
  id: string;
  video: PexelsVideo;
  startTime: number;
  endTime: number;
  speed: number;
  textOverlay?: string;
}

interface VideoMakerContextType {
  searchResults: PexelsVideo[];
  setSearchResults: (videos: PexelsVideo[]) => void;
  selectedClips: SelectedClip[];
  setSelectedClips: (clips: SelectedClip[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStep: 'search' | 'selection' | 'editing' | 'export';
  setCurrentStep: (step: 'search' | 'selection' | 'editing' | 'export') => void;
  addClip: (video: PexelsVideo) => void;
  removeClip: (clipId: string) => void;
  updateClip: (clipId: string, updates: Partial<SelectedClip>) => void;
  reorderClips: (fromIndex: number, toIndex: number) => void;
}

const VideoMakerContext = createContext<VideoMakerContextType | undefined>(undefined);

export const VideoMakerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchResults, setSearchResults] = useState<PexelsVideo[]>([]);
  const [selectedClips, setSelectedClips] = useState<SelectedClip[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<'search' | 'selection' | 'editing' | 'export'>('search');

  const addClip = (video: PexelsVideo) => {
    const newClip: SelectedClip = {
      id: `clip-${Date.now()}-${video.id}`,
      video,
      startTime: 0,
      endTime: Math.min(video.duration, 10), // Default to 10 seconds or video duration
      speed: 1,
    };
    setSelectedClips(prev => [...prev, newClip]);
  };

  const removeClip = (clipId: string) => {
    setSelectedClips(prev => prev.filter(clip => clip.id !== clipId));
  };

  const updateClip = (clipId: string, updates: Partial<SelectedClip>) => {
    setSelectedClips(prev => prev.map(clip => 
      clip.id === clipId ? { ...clip, ...updates } : clip
    ));
  };

  const reorderClips = (fromIndex: number, toIndex: number) => {
    setSelectedClips(prev => {
      const clips = [...prev];
      const [movedClip] = clips.splice(fromIndex, 1);
      clips.splice(toIndex, 0, movedClip);
      return clips;
    });
  };

  return (
    <VideoMakerContext.Provider value={{
      searchResults,
      setSearchResults,
      selectedClips,
      setSelectedClips,
      isSearching,
      setIsSearching,
      searchQuery,
      setSearchQuery,
      currentStep,
      setCurrentStep,
      addClip,
      removeClip,
      updateClip,
      reorderClips,
    }}>
      {children}
    </VideoMakerContext.Provider>
  );
};

export const useVideoMaker = () => {
  const context = useContext(VideoMakerContext);
  if (context === undefined) {
    throw new Error('useVideoMaker must be used within a VideoMakerProvider');
  }
  return context;
};
