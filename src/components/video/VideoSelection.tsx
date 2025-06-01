
import React from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { Trash2, ArrowUp, ArrowDown, Play } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VideoSelection: React.FC = () => {
  const { selectedClips, removeClip, reorderClips, setCurrentStep } = useVideoMaker();

  const handleRemoveClip = (clipId: string) => {
    removeClip(clipId);
    toast({
      title: "Clip Removed",
      description: "Video clip removed from timeline.",
    });
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      reorderClips(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < selectedClips.length - 1) {
      reorderClips(index, index + 1);
    }
  };

  const getTotalDuration = () => {
    return selectedClips.reduce((total, clip) => {
      return total + (clip.endTime - clip.startTime) / clip.speed;
    }, 0);
  };

  const getVideoThumbnail = (clip: any) => {
    return clip.video.video_pictures?.[0]?.picture || '/placeholder.svg';
  };

  if (selectedClips.length === 0) {
    return (
      <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
        <h3 className="text-lg font-semibold neon-purple-text mb-4">Selected Clips</h3>
        <div className="text-center py-8 text-gray-400">
          <Play className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No clips selected yet</p>
          <p className="text-sm">Search and add video clips to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold neon-purple-text">
          Selected Clips ({selectedClips.length})
        </h3>
        <div className="text-sm text-gray-400">
          Total: {Math.round(getTotalDuration())}s
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {selectedClips.map((clip, index) => (
          <div key={clip.id} className="bg-black/30 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center space-x-3">
              <img
                src={getVideoThumbnail(clip)}
                alt={`Clip ${index + 1}`}
                className="w-16 h-12 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  Clip {index + 1}
                </div>
                <div className="text-xs text-gray-400">
                  {Math.round(clip.endTime - clip.startTime)}s
                  {clip.speed !== 1 && ` (${clip.speed}x speed)`}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === selectedClips.length - 1}
                  className="p-1 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleRemoveClip(clip.id)}
                  className="p-1 rounded hover:bg-red-600 text-red-400 hover:text-white"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedClips.length > 0 && (
        <button
          onClick={() => setCurrentStep('editing')}
          className="w-full mt-4 bg-purple-600 hover:bg-purple-700 py-2 rounded-lg transition-colors"
        >
          Edit Timeline
        </button>
      )}
    </div>
  );
};

export default VideoSelection;
