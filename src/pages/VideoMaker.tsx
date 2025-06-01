
import React, { useState } from 'react';
import { VideoMakerProvider } from '@/contexts/VideoMakerContext';
import VideoMakerInterface from '@/components/video/VideoMakerInterface';
import { Video, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const VideoMaker: React.FC = () => {
  return (
    <div className="min-h-screen bg-jarvis-bg text-white">
      {/* Background gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent z-0"></div>
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold neon-purple-text flex items-center">
            <Video className="mr-2 h-6 w-6" />
            JARVIS Video Maker Studio
          </h1>
          <Link to="/interface" className="neon-purple-text hover:text-purple-400 transition-colors">
            Back to Interface
          </Link>
        </div>
        
        <VideoMakerProvider>
          <VideoMakerInterface />
        </VideoMakerProvider>
      </div>
      
      {/* Lower background gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#8B5CF6]/10 to-transparent z-0"></div>
    </div>
  );
};

export default VideoMaker;
