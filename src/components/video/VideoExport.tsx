
import React, { useState } from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { Download, Share2, Play, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VideoExport: React.FC = () => {
  const { selectedClips } = useVideoMaker();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedVideoUrl, setExportedVideoUrl] = useState<string | null>(null);

  const getTotalDuration = () => {
    return selectedClips.reduce((total, clip) => {
      return total + (clip.endTime - clip.startTime) / clip.speed;
    }, 0);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Simulate video compilation (in a real implementation, this would be handled by a backend service)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      clearInterval(interval);
      setExportProgress(100);
      
      // In a real implementation, this would be the actual compiled video URL
      setExportedVideoUrl('https://example.com/compiled-video.mp4');
      
      toast({
        title: "Export Complete!",
        description: "Your video has been successfully compiled and is ready for download.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export video. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would trigger the actual download
    toast({
      title: "Download Started",
      description: "Your video download will begin shortly.",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Jarvis Video',
        text: 'Check out this video I created with Jarvis Video Maker!',
        url: exportedVideoUrl || window.location.href,
      });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(exportedVideoUrl || window.location.href);
      toast({
        title: "Link Copied",
        description: "Video link copied to clipboard!",
      });
    }
  };

  if (selectedClips.length === 0) {
    return (
      <div className="glass-morphism neon-purple-border p-4 rounded-2xl text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p className="text-gray-400">No clips to export. Add some clips first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Summary */}
      <div className="glass-morphism neon-purple-border p-6 rounded-2xl">
        <h3 className="text-lg font-semibold neon-purple-text mb-4">Export Summary</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">{selectedClips.length}</div>
            <div className="text-sm text-gray-400">Total Clips</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">{Math.round(getTotalDuration())}s</div>
            <div className="text-sm text-gray-400">Total Duration</div>
          </div>
          <div className="bg-black/30 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-400">1080p</div>
            <div className="text-sm text-gray-400">Export Quality</div>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-4">
          <h4 className="font-medium">Export Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Video Quality</label>
              <select className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
                <option value="1080p">1080p (Recommended)</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Frame Rate</label>
              <select className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
                <option value="30">30 FPS</option>
                <option value="24">24 FPS</option>
                <option value="60">60 FPS</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Export Progress */}
      {isExporting && (
        <div className="glass-morphism neon-purple-border p-6 rounded-2xl">
          <h3 className="text-lg font-semibold neon-purple-text mb-4">Exporting Video...</h3>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${exportProgress}%` }}
            ></div>
          </div>
          <div className="text-center text-gray-400">
            {exportProgress}% Complete
          </div>
        </div>
      )}

      {/* Export Result */}
      {exportedVideoUrl && (
        <div className="glass-morphism neon-purple-border p-6 rounded-2xl">
          <h3 className="text-lg font-semibold neon-purple-text mb-4">Export Complete!</h3>
          <p className="text-gray-400 mb-6">Your video has been successfully compiled and is ready for download.</p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleDownload}
              className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Download className="h-5 w-5" />
              <span>Download Video</span>
            </button>
            <button
              onClick={handleShare}
              className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>Share Video</span>
            </button>
          </div>
        </div>
      )}

      {/* Export Button */}
      {!isExporting && !exportedVideoUrl && (
        <div className="text-center">
          <button
            onClick={handleExport}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-lg font-medium text-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Play className="h-5 w-5" />
            <span>Export Video</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoExport;
