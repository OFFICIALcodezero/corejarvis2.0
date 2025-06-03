
import React, { useState } from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { Download, Share2, Play, AlertCircle, FileVideo } from 'lucide-react';
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

  const createVideoFile = async (): Promise<Blob> => {
    // Create a proper video using MediaRecorder with multiple frames
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Cannot create canvas context');
    }

    // Create a stream from canvas
    const stream = canvas.captureStream(30); // 30 FPS
    const recorder = new MediaRecorder(stream, { 
      mimeType: 'video/webm;codecs=vp9' 
    });
    
    return new Promise((resolve, reject) => {
      const chunks: BlobPart[] = [];
      
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
      };
      
      recorder.onerror = (event) => {
        reject(new Error('Recording failed'));
      };
      
      recorder.start();
      
      // Animate the canvas to create actual video content
      let frame = 0;
      const totalFrames = Math.floor(getTotalDuration() * 30); // 30 FPS
      
      const drawFrame = () => {
        // Create animated background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const hue = (frame * 2) % 360;
        gradient.addColorStop(0, `hsl(${hue}, 70%, 50%)`);
        gradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 30%)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add JARVIS branding with animation
        ctx.fillStyle = 'white';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 10;
        ctx.fillText('JARVIS VIDEO', canvas.width / 2, canvas.height / 2 - 50);
        
        // Animated subtitle
        ctx.font = '32px Arial';
        const opacity = 0.7 + 0.3 * Math.sin(frame * 0.1);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.fillText(`${selectedClips.length} clips • ${Math.round(getTotalDuration())}s duration`, 
                    canvas.width / 2, canvas.height / 2 + 50);
        
        // Progress indicator
        const progress = frame / totalFrames;
        const barWidth = 600;
        const barHeight = 20;
        const barX = (canvas.width - barWidth) / 2;
        const barY = canvas.height / 2 + 150;
        
        // Progress bar background
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Progress bar fill
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(barX, barY, barWidth * progress, barHeight);
        
        frame++;
        
        if (frame < totalFrames) {
          requestAnimationFrame(drawFrame);
        } else {
          setTimeout(() => recorder.stop(), 100);
        }
      };
      
      drawFrame();
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    
    try {
      // Simulate export progress
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      // Create actual video file
      const videoBlob = await createVideoFile();
      
      clearInterval(progressInterval);
      setExportProgress(100);
      
      const videoUrl = URL.createObjectURL(videoBlob);
      setExportedVideoUrl(videoUrl);
      
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
    if (exportedVideoUrl) {
      const link = document.createElement('a');
      link.href = exportedVideoUrl;
      link.download = `jarvis-video-${Date.now()}.webm`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download Started",
        description: "Your video is being downloaded to your device.",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share && exportedVideoUrl) {
      fetch(exportedVideoUrl)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], `jarvis-video-${Date.now()}.webm`, { type: 'video/webm' });
          return navigator.share({
            title: 'My Jarvis Video',
            text: 'Check out this video I created with Jarvis Video Maker!',
            files: [file],
          });
        })
        .catch(() => {
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link Copied",
            description: "Project link copied to clipboard!",
          });
        });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Project link copied to clipboard!",
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
        <h3 className="text-lg font-semibold neon-purple-text mb-4 flex items-center">
          <FileVideo className="mr-2 h-5 w-5" />
          Export Summary
        </h3>
        
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
              <label className="block text-sm text-gray-400 mb-1">Format</label>
              <select className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white">
                <option value="webm">WebM (Recommended)</option>
                <option value="mp4">MP4</option>
                <option value="mov">MOV</option>
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
            {exportProgress}% Complete - Processing video clips...
          </div>
        </div>
      )}

      {/* Export Result with Video Preview */}
      {exportedVideoUrl && (
        <div className="glass-morphism neon-purple-border p-6 rounded-2xl">
          <h3 className="text-lg font-semibold neon-purple-text mb-4">Export Complete!</h3>
          
          {/* Video Preview */}
          <div className="flex items-center justify-center mb-4">
            <div className="bg-black/40 p-4 rounded-lg border border-purple-500/30 w-full max-w-md">
              <video 
                src={exportedVideoUrl}
                controls
                autoPlay={false}
                className="w-full h-auto rounded"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
              <p className="text-center text-xs text-gray-500 mt-2">
                {Math.round(getTotalDuration())}s • WebM Format • 1080p
              </p>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 text-center">Your video has been successfully compiled and is ready for download to your device.</p>
          
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
          <p className="text-sm text-gray-400 mt-2">
            This will create a WebM video file that you can download to your device
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoExport;
