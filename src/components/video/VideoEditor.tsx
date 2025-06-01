
import React, { useState } from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { Edit, Type, Zap, Clock } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VideoEditor: React.FC = () => {
  const { selectedClips, updateClip, setCurrentStep } = useVideoMaker();
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const selectedClip = selectedClips.find(clip => clip.id === selectedClipId);

  const handleClipUpdate = (updates: any) => {
    if (selectedClipId) {
      updateClip(selectedClipId, updates);
      toast({
        title: "Clip Updated",
        description: "Your changes have been saved.",
      });
    }
  };

  const getVideoThumbnail = (clip: any) => {
    return clip.video.video_pictures?.[0]?.picture || '/placeholder.svg';
  };

  if (selectedClips.length === 0) {
    return (
      <div className="glass-morphism neon-purple-border p-4 rounded-2xl text-center">
        <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-gray-400">No clips to edit. Add some clips first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
        <h3 className="text-lg font-semibold neon-purple-text mb-4">Video Timeline</h3>
        <div className="space-y-2">
          {selectedClips.map((clip, index) => (
            <div
              key={clip.id}
              onClick={() => setSelectedClipId(clip.id)}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedClipId === clip.id ? 'bg-purple-600/30 border border-purple-500' : 'bg-black/30 hover:bg-black/50'
              }`}
            >
              <img
                src={getVideoThumbnail(clip)}
                alt={`Clip ${index + 1}`}
                className="w-20 h-12 object-cover rounded"
              />
              <div className="flex-1">
                <div className="text-sm font-medium">Clip {index + 1}</div>
                <div className="text-xs text-gray-400">
                  Duration: {Math.round(clip.endTime - clip.startTime)}s
                  {clip.speed !== 1 && ` • Speed: ${clip.speed}x`}
                  {clip.textOverlay && ` • Text: "${clip.textOverlay}"`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clip Editor */}
      {selectedClip && (
        <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
          <h3 className="text-lg font-semibold neon-purple-text mb-4 flex items-center">
            <Edit className="mr-2 h-5 w-5" />
            Edit Selected Clip
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Duration Controls */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                Duration & Timing
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Time (seconds)</label>
                  <input
                    type="number"
                    min="0"
                    max={selectedClip.video.duration}
                    step="0.1"
                    value={selectedClip.startTime}
                    onChange={(e) => handleClipUpdate({ startTime: parseFloat(e.target.value) })}
                    className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Time (seconds)</label>
                  <input
                    type="number"
                    min={selectedClip.startTime}
                    max={selectedClip.video.duration}
                    step="0.1"
                    value={selectedClip.endTime}
                    onChange={(e) => handleClipUpdate({ endTime: parseFloat(e.target.value) })}
                    className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
                  />
                </div>
              </div>
            </div>

            {/* Speed & Effects */}
            <div className="space-y-4">
              <h4 className="font-medium flex items-center">
                <Zap className="mr-2 h-4 w-4" />
                Speed & Effects
              </h4>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">Playback Speed</label>
                <select
                  value={selectedClip.speed}
                  onChange={(e) => handleClipUpdate({ speed: parseFloat(e.target.value) })}
                  className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white"
                >
                  <option value={0.5}>0.5x (Slow)</option>
                  <option value={0.75}>0.75x</option>
                  <option value={1}>1x (Normal)</option>
                  <option value={1.25}>1.25x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x (Fast)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Text Overlay */}
          <div className="mt-6">
            <h4 className="font-medium flex items-center mb-3">
              <Type className="mr-2 h-4 w-4" />
              Text Overlay
            </h4>
            <input
              type="text"
              placeholder="Enter text to overlay on this clip (optional)"
              value={selectedClip.textOverlay || ''}
              onChange={(e) => handleClipUpdate({ textOverlay: e.target.value })}
              className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
            />
          </div>
        </div>
      )}

      {/* Export Button */}
      <div className="text-center">
        <button
          onClick={() => setCurrentStep('export')}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition-colors"
        >
          Proceed to Export
        </button>
      </div>
    </div>
  );
};

export default VideoEditor;
