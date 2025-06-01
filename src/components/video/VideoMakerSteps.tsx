
import React from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { Search, CheckSquare, Edit, Download } from 'lucide-react';

const VideoMakerSteps: React.FC = () => {
  const { currentStep, setCurrentStep, selectedClips } = useVideoMaker();

  const steps = [
    { id: 'search', label: 'Search Videos', icon: Search },
    { id: 'selection', label: 'Select Clips', icon: CheckSquare },
    { id: 'editing', label: 'Edit Timeline', icon: Edit },
    { id: 'export', label: 'Export Video', icon: Download },
  ];

  const getStepStatus = (stepId: string) => {
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const status = getStepStatus(step.id);
          const isClickable = step.id === 'search' || 
                             (step.id === 'selection' && selectedClips.length > 0) ||
                             (step.id === 'editing' && selectedClips.length > 0) ||
                             (step.id === 'export' && selectedClips.length > 0);
          
          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => isClickable && setCurrentStep(step.id as any)}
                disabled={!isClickable}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  status === 'current' 
                    ? 'bg-purple-600 text-white' 
                    : status === 'completed'
                    ? 'bg-green-600 text-white'
                    : isClickable
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div className="h-px bg-gray-600 flex-1 mx-2" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default VideoMakerSteps;
