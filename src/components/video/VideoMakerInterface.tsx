
import React from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import VideoSearch from './VideoSearch';
import VideoSelection from './VideoSelection';
import VideoEditor from './VideoEditor';
import VideoExport from './VideoExport';
import VideoMakerSteps from './VideoMakerSteps';

const VideoMakerInterface: React.FC = () => {
  const { currentStep } = useVideoMaker();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'search':
        return <VideoSearch />;
      case 'selection':
        return <VideoSelection />;
      case 'editing':
        return <VideoEditor />;
      case 'export':
        return <VideoExport />;
      default:
        return <VideoSearch />;
    }
  };

  return (
    <div className="space-y-6">
      <VideoMakerSteps />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {renderCurrentStep()}
        </div>
        <div className="lg:col-span-1">
          <VideoSelection />
        </div>
      </div>
    </div>
  );
};

export default VideoMakerInterface;
