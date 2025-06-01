
import React, { useState } from 'react';
import { useVideoMaker } from '@/contexts/VideoMakerContext';
import { supabase } from '@/integrations/supabase/client';
import { Search, Play, Plus, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const VideoSearch: React.FC = () => {
  const { 
    searchResults, 
    setSearchResults, 
    isSearching, 
    setIsSearching, 
    searchQuery,
    setSearchQuery,
    addClip,
    setCurrentStep
  } = useVideoMaker();
  
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Query Required",
        description: "Please enter a search term to find videos.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('pexels-video-search', {
        body: { query: searchQuery, per_page: 15 }
      });

      if (error) throw error;

      if (data.videos && data.videos.length > 0) {
        setSearchResults(data.videos);
        toast({
          title: "Videos Found",
          description: `Found ${data.videos.length} videos for "${searchQuery}"`,
        });
      } else {
        setSearchResults([]);
        setError('No videos found for your search query. Try different keywords.');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Failed to search videos. Please try again.');
      toast({
        title: "Search Error",
        description: "Failed to search videos. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddClip = (video: any) => {
    addClip(video);
    toast({
      title: "Clip Added",
      description: "Video clip added to your timeline.",
    });
    setCurrentStep('selection');
  };

  const getVideoThumbnail = (video: any) => {
    return video.video_pictures?.[0]?.picture || '/placeholder.svg';
  };

  const getVideoFile = (video: any, quality = 'hd') => {
    const file = video.video_files?.find(f => f.quality === quality) || video.video_files?.[0];
    return file?.link;
  };

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
        <div className="flex space-x-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for video clips (e.g., nature, business, technology)"
              className="w-full bg-black/20 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>{isSearching ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-4 flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </div>
      )}

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="glass-morphism neon-purple-border p-4 rounded-2xl">
          <h3 className="text-lg font-semibold neon-purple-text mb-4">
            Search Results ({searchResults.length} videos)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((video) => (
              <div key={video.id} className="bg-black/30 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="relative aspect-video">
                  <img
                    src={getVideoThumbnail(video)}
                    alt={`Video ${video.id}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white">
                    {Math.floor(video.duration)}s
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">
                      {video.width}x{video.height}
                    </span>
                    <button
                      onClick={() => handleAddClip(video)}
                      className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoSearch;
