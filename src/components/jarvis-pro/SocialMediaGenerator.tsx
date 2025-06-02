
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Copy, Save, Share, Instagram, Linkedin, Twitter } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SocialCaption {
  id: string;
  topic: string;
  platform: string;
  tone: string;
  generated_caption: string;
  created_at: string;
}

const SocialMediaGenerator: React.FC = () => {
  const [captions, setCaptions] = useState<SocialCaption[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    topic: '',
    platform: 'instagram',
    tone: 'professional'
  });
  const [generatedCaption, setGeneratedCaption] = useState('');

  useEffect(() => {
    fetchCaptions();
  }, []);

  const fetchCaptions = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_social_captions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setCaptions(data || []);
    } catch (error) {
      console.error('Error fetching captions:', error);
      toast.error('Failed to load captions');
    }
  };

  const generateCaption = async () => {
    if (!formData.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI caption generation
      const templates = {
        instagram: {
          professional: [
            `🚀 Exciting developments in ${formData.topic}! \n\nAs we continue to innovate and push boundaries, I'm thrilled to share insights about ${formData.topic}. The future looks bright! ✨\n\n#${formData.topic.replace(/\s+/g, '')} #Innovation #Professional #Growth`,
            `💡 Let's talk about ${formData.topic} \n\nThis is revolutionizing the way we think about business and innovation. What are your thoughts? 🤔\n\n#${formData.topic.replace(/\s+/g, '')} #BusinessInnovation #Thoughts #Professional`,
          ],
          casual: [
            `Just discovered something amazing about ${formData.topic}! 😍\n\nCan't believe how cool this is. Anyone else excited about this? Drop your thoughts below! 👇\n\n#${formData.topic.replace(/\s+/g, '')} #Excited #Cool #ShareYourThoughts`,
            `${formData.topic} is absolutely mind-blowing! 🤯\n\nSpent the whole day learning about this and I'm hooked. What's everyone else up to? \n\n#${formData.topic.replace(/\s+/g, '')} #MindBlown #Learning #Fun`,
          ],
          funny: [
            `Me trying to understand ${formData.topic}: 🤔➡️😵‍💫➡️🤓\n\nAnyone else feel like they need a PhD just to keep up? 😂\n\n#${formData.topic.replace(/\s+/g, '')} #Relatable #Funny #LearningStruggles`,
            `${formData.topic} be like: "I'm about to change everything" \nMe: "Cool, but can you also fold my laundry?" 🧺😂\n\n#${formData.topic.replace(/\s+/g, '')} #Funny #Priorities #RealTalk`,
          ]
        },
        linkedin: {
          professional: [
            `🔍 Insights on ${formData.topic}\n\nIn today's rapidly evolving landscape, ${formData.topic} represents a significant opportunity for growth and innovation. Key takeaways:\n\n• Enhanced efficiency\n• Strategic advantages\n• Future-ready solutions\n\nWhat's your experience with ${formData.topic}? I'd love to hear your perspectives.\n\n#${formData.topic.replace(/\s+/g, '')} #Innovation #Strategy #Growth`,
            `💼 The Future of ${formData.topic}\n\nAs industry leaders, we must stay ahead of emerging trends. ${formData.topic} is reshaping how we approach business challenges.\n\nKey benefits I've observed:\n✅ Improved outcomes\n✅ Competitive advantage\n✅ Sustainable growth\n\nHow is your organization adapting?\n\n#${formData.topic.replace(/\s+/g, '')} #Leadership #Innovation #BusinessStrategy`,
          ],
          casual: [
            `Excited to share my thoughts on ${formData.topic}! 🎉\n\nIt's amazing how this field is evolving. The possibilities seem endless!\n\nWhat trends are you most excited about?\n\n#${formData.topic.replace(/\s+/g, '')} #Networking #Excited #Trends`,
            `Just attended a great session on ${formData.topic} 📚\n\nLearned so much and met amazing professionals. The community around this topic is incredible!\n\n#${formData.topic.replace(/\s+/g, '')} #Learning #Networking #Community`,
          ]
        },
        twitter: {
          professional: [
            `${formData.topic} is transforming industries. Key insight: success lies in strategic implementation and continuous adaptation. \n\n#${formData.topic.replace(/\s+/g, '')} #Innovation`,
            `Three things about ${formData.topic}:\n1. Game-changing potential\n2. Strategic importance\n3. Future relevance\n\nThoughts? #${formData.topic.replace(/\s+/g, '')}`,
          ],
          casual: [
            `Can't stop thinking about ${formData.topic}! 🤔 Anyone else diving deep into this lately? What's caught your attention? #${formData.topic.replace(/\s+/g, '')}`,
            `${formData.topic} update: Still fascinating, still learning, still excited! 🚀 What's your take? #${formData.topic.replace(/\s+/g, '')}`,
          ],
          funny: [
            `${formData.topic}: *exists*\nMe: "This is my personality now" 😂 #${formData.topic.replace(/\s+/g, '')} #Relatable`,
            `Plot twist: ${formData.topic} is actually just ${formData.topic} but with extra steps 🤷‍♀️ #${formData.topic.replace(/\s+/g, '')} #ShowerthThoughts`,
          ]
        }
      };

      const platformTemplates = templates[formData.platform as keyof typeof templates];
      const toneTemplates = platformTemplates[formData.tone as keyof typeof platformTemplates];
      const randomTemplate = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
      
      setGeneratedCaption(randomTemplate);
      toast.success('Caption generated successfully!');
    } catch (error) {
      console.error('Error generating caption:', error);
      toast.error('Failed to generate caption');
    } finally {
      setIsGenerating(false);
    }
  };

  const saveCaption = async () => {
    if (!generatedCaption.trim()) {
      toast.error('No caption to save');
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('jarvis_social_captions')
        .insert([{
          topic: formData.topic,
          platform: formData.platform,
          tone: formData.tone,
          generated_caption: generatedCaption,
          user_id: user.id
        }]);

      if (error) throw error;
      
      toast.success('Caption saved successfully!');
      fetchCaptions();
    } catch (error) {
      console.error('Error saving caption:', error);
      toast.error('Failed to save caption');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Caption copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy caption');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      default: return <Share className="w-4 h-4" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-pink-500';
      case 'linkedin': return 'bg-blue-600';
      case 'twitter': return 'bg-blue-400';
      default: return 'bg-gray-500';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'bg-blue-500';
      case 'casual': return 'bg-green-500';
      case 'funny': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Social Media Caption Generator</h2>
          <p className="text-gray-400">Generate engaging captions for your social media posts</p>
        </div>
      </div>

      {/* Caption Generator Form */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate New Caption
          </CardTitle>
          <CardDescription>Enter your topic and preferences to generate a custom caption</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Enter your topic or product (e.g., 'AI technology', 'new product launch')"
            value={formData.topic}
            onChange={(e) => setFormData({...formData, topic: e.target.value})}
            className="bg-gray-700 border-gray-600 text-white"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Platform</label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({...formData, platform: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Tone</label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({...formData, tone: value})}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateCaption} 
            disabled={isGenerating || !formData.topic.trim()}
            className="w-full flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {isGenerating ? 'Generating...' : 'Generate Caption'}
          </Button>

          {/* Generated Caption Display */}
          {generatedCaption && (
            <div className="mt-6 space-y-4">
              <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-white font-semibold">Generated Caption</h4>
                  <div className="flex gap-2">
                    <Badge className={getPlatformColor(formData.platform)}>
                      {getPlatformIcon(formData.platform)}
                      {formData.platform}
                    </Badge>
                    <Badge className={getToneColor(formData.tone)}>
                      {formData.tone}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-200 whitespace-pre-wrap">{generatedCaption}</p>
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedCaption)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={saveCaption}
                    className="flex items-center gap-1"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Captions */}
      {captions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Recent Captions</h3>
          <div className="grid gap-4">
            {captions.map((caption) => (
              <Card key={caption.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                      <Badge className={getPlatformColor(caption.platform)}>
                        {getPlatformIcon(caption.platform)}
                        {caption.platform}
                      </Badge>
                      <Badge className={getToneColor(caption.tone)}>
                        {caption.tone}
                      </Badge>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(caption.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2">
                    <strong>Topic:</strong> {caption.topic}
                  </p>
                  <p className="text-gray-200 whitespace-pre-wrap mb-3">{caption.generated_caption}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(caption.generated_caption)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {captions.length === 0 && !generatedCaption && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No captions generated yet. Create your first caption to get started!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SocialMediaGenerator;
