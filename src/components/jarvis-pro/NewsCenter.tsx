
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, ExternalLink, Star, MapPin, Globe, Video, Trophy, Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  urlToImage?: string;
  category: string;
}

const NewsCenter: React.FC = () => {
  const [news, setNews] = useState<{[key: string]: NewsArticle[]}>({
    bangalore: [],
    india: [],
    world: [],
    youtube: [],
    sports: []
  });
  const [loading, setLoading] = useState<{[key: string]: boolean}>({});
  const [lastUpdated, setLastUpdated] = useState<{[key: string]: string}>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadCachedNews();
    fetchFavorites();
  }, []);

  const loadCachedNews = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_news_cache')
        .select('*');

      if (error) throw error;

      const newsData: {[key: string]: NewsArticle[]} = {
        bangalore: [],
        india: [],
        world: [],
        youtube: [],
        sports: []
      };

      const lastUpdatedData: {[key: string]: string} = {};

      data?.forEach(item => {
        newsData[item.category] = item.data as NewsArticle[];
        lastUpdatedData[item.category] = item.last_updated;
      });

      setNews(newsData);
      setLastUpdated(lastUpdatedData);
    } catch (error) {
      console.error('Error loading cached news:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_news_favorites')
        .select('url');

      if (error) throw error;
      setFavorites(data?.map(item => item.url) || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const generateMockNews = (category: string): NewsArticle[] => {
    const categories = {
      bangalore: [
        {
          title: "Bangalore Metro Phase 3 Construction Accelerates",
          description: "New metro lines expected to connect more IT corridors by 2025, reducing traffic congestion in the city.",
          url: "https://example.com/bangalore-metro",
          source: "Bangalore Times",
          publishedAt: new Date().toISOString(),
          category: "bangalore"
        },
        {
          title: "Tech Giants Expand Operations in Electronic City",
          description: "Major technology companies announce new development centers in Bangalore's IT hub.",
          url: "https://example.com/tech-expansion",
          source: "Tech Today",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          category: "bangalore"
        },
        {
          title: "Bangalore Weather: Monsoon Expected Early This Year",
          description: "Meteorological department predicts early monsoon arrival bringing relief from summer heat.",
          url: "https://example.com/weather-update",
          source: "Weather Channel",
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          category: "bangalore"
        }
      ],
      india: [
        {
          title: "India's GDP Growth Exceeds Expectations",
          description: "Economy shows robust growth in latest quarter, outpacing global averages.",
          url: "https://example.com/gdp-growth",
          source: "Economic Times",
          publishedAt: new Date().toISOString(),
          category: "india"
        },
        {
          title: "Digital India Initiative Reaches New Milestone",
          description: "Government's digitization efforts show significant progress in rural connectivity.",
          url: "https://example.com/digital-india",
          source: "India Today",
          publishedAt: new Date(Date.now() - 1800000).toISOString(),
          category: "india"
        }
      ],
      world: [
        {
          title: "Global Climate Summit Announces New Initiatives",
          description: "World leaders commit to ambitious carbon reduction targets for the next decade.",
          url: "https://example.com/climate-summit",
          source: "Reuters",
          publishedAt: new Date().toISOString(),
          category: "world"
        },
        {
          title: "Tech Innovation Breakthrough in AI Research",
          description: "Scientists achieve significant milestone in artificial intelligence development.",
          url: "https://example.com/ai-breakthrough",
          source: "Tech Global",
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          category: "world"
        }
      ],
      youtube: [
        {
          title: "Breaking: Latest Tech Trends Analysis",
          description: "Comprehensive video analysis of emerging technology trends and their impact.",
          url: "https://youtube.com/watch?v=example1",
          source: "TechChannel",
          publishedAt: new Date().toISOString(),
          category: "youtube"
        },
        {
          title: "Bangalore City Tour: Hidden Gems",
          description: "Discover the lesser-known beautiful places in Bangalore through this detailed tour.",
          url: "https://youtube.com/watch?v=example2",
          source: "Travel Vlog",
          publishedAt: new Date(Date.now() - 5400000).toISOString(),
          category: "youtube"
        }
      ],
      sports: [
        {
          title: "Cricket World Cup: India Advances to Finals",
          description: "Team India secures spot in finals with impressive performance against Australia.",
          url: "https://example.com/cricket-finals",
          source: "ESPN Cricinfo",
          publishedAt: new Date().toISOString(),
          category: "sports"
        },
        {
          title: "Football League: Bangalore FC's Winning Streak",
          description: "Local team continues impressive form with fifth consecutive victory.",
          url: "https://example.com/football-streak",
          source: "Sports Today",
          publishedAt: new Date(Date.now() - 2700000).toISOString(),
          category: "sports"
        }
      ]
    };

    return categories[category as keyof typeof categories] || [];
  };

  const refreshNews = async (category: string) => {
    setLoading(prev => ({ ...prev, [category]: true }));
    
    try {
      // Simulate API call with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockNews = generateMockNews(category);
      
      // Update cache in Supabase
      const { error } = await supabase
        .from('jarvis_news_cache')
        .upsert({
          category,
          data: mockNews as any,
          last_updated: new Date().toISOString()
        });

      if (error) throw error;

      setNews(prev => ({ ...prev, [category]: mockNews }));
      setLastUpdated(prev => ({ ...prev, [category]: new Date().toISOString() }));
      
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} news updated!`);
    } catch (error) {
      console.error('Error refreshing news:', error);
      toast.error('Failed to refresh news');
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  };

  const toggleFavorite = async (article: NewsArticle) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const isFavorited = favorites.includes(article.url);

      if (isFavorited) {
        const { error } = await supabase
          .from('jarvis_news_favorites')
          .delete()
          .eq('url', article.url)
          .eq('user_id', user.id);

        if (error) throw error;
        setFavorites(prev => prev.filter(url => url !== article.url));
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('jarvis_news_favorites')
          .insert([{
            title: article.title,
            source: article.source,
            url: article.url,
            category: article.category,
            user_id: user.id
          }]);

        if (error) throw error;
        setFavorites(prev => [...prev, article.url]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bangalore': return <MapPin className="w-4 h-4" />;
      case 'india': return <Heart className="w-4 h-4" />;
      case 'world': return <Globe className="w-4 h-4" />;
      case 'youtube': return <Video className="w-4 h-4" />;
      case 'sports': return <Trophy className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const NewsSection: React.FC<{ category: string; title: string }> = ({ category, title }) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white flex items-center gap-2">
          {getCategoryIcon(category)}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {lastUpdated[category] && (
            <span className="text-xs text-gray-500">
              Updated {formatTimeAgo(lastUpdated[category])}
            </span>
          )}
          <Button
            size="sm"
            variant="outline"
            onClick={() => refreshNews(category)}
            disabled={loading[category]}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading[category] ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {news[category]?.slice(0, 5).map((article, index) => (
          <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-750 transition-colors">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                    {article.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {article.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{article.source}</span>
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleFavorite(article)}
                        className={`p-1 ${favorites.includes(article.url) ? 'text-yellow-400' : 'text-gray-400'}`}
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(article.url) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(article.url, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Read
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!news[category] || news[category].length === 0) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            {getCategoryIcon(category)}
            <p className="text-gray-400 mt-2">No news available. Click refresh to load latest updates.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">📡 Jarvis News Center</h2>
          <p className="text-gray-400">Stay updated with latest news from multiple sources</p>
        </div>
        <Button
          onClick={() => {
            Object.keys(news).forEach(category => {
              refreshNews(category);
            });
          }}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh All
        </Button>
      </div>

      <Tabs defaultValue="bangalore" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="bangalore" className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            Bangalore
          </TabsTrigger>
          <TabsTrigger value="india" className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            India
          </TabsTrigger>
          <TabsTrigger value="world" className="flex items-center gap-1">
            <Globe className="w-3 h-3" />
            World
          </TabsTrigger>
          <TabsTrigger value="youtube" className="flex items-center gap-1">
            <Video className="w-3 h-3" />
            YouTube
          </TabsTrigger>
          <TabsTrigger value="sports" className="flex items-center gap-1">
            <Trophy className="w-3 h-3" />
            Sports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bangalore" className="mt-6">
          <NewsSection category="bangalore" title="Bangalore News" />
        </TabsContent>

        <TabsContent value="india" className="mt-6">
          <NewsSection category="india" title="India News" />
        </TabsContent>

        <TabsContent value="world" className="mt-6">
          <NewsSection category="world" title="International News" />
        </TabsContent>

        <TabsContent value="youtube" className="mt-6">
          <NewsSection category="youtube" title="YouTube News Videos" />
        </TabsContent>

        <TabsContent value="sports" className="mt-6">
          <NewsSection category="sports" title="Sports News" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsCenter;
