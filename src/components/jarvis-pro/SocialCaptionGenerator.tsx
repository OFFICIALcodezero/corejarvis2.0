
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Download, Share2, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Caption {
  id: string;
  topic: string;
  tone: string;
  platform: string;
  generated_caption: string;
  created_at: string;
}

const SocialCaptionGenerator: React.FC = () => {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    platform: 'linkedin'
  });
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchCaptions();
  }, []);

  const fetchCaptions = async () => {
    const { data, error } = await supabase
      .from('social_captions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch captions",
        variant: "destructive"
      });
    } else {
      setCaptions(data || []);
    }
  };

  const generateCaption = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Error",
        description: "Please enter a topic",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate AI-generated captions based on platform and tone
    const templates = {
      linkedin: {
        professional: [
          `Excited to share insights about ${formData.topic}. In today's business landscape, understanding this concept is crucial for growth. What are your thoughts on implementing these strategies? #Leadership #BusinessGrowth #Innovation`,
          `Just wrapped up an amazing discussion about ${formData.topic}. Key takeaway: Success comes from continuous learning and adaptation. Would love to hear your experiences! #ProfessionalDevelopment #Networking`,
          `Reflecting on the importance of ${formData.topic} in our industry. The data shows significant impact on productivity and team engagement. How has this influenced your work? #Industry #Analytics #TeamWork`
        ],
        casual: [
          `Had the most interesting conversation about ${formData.topic} today! 🤔 It's amazing how this topic keeps evolving. Anyone else diving deep into this? #Learning #Curious`,
          `Quick thought on ${formData.topic}: Sometimes the simplest solutions are the most effective. What's your take on this? 💭 #Thoughts #SimpleWins`,
          `Coffee chat topic of the day: ${formData.topic} ☕ Love how this connects to so many aspects of our daily work. Share your stories! #CoffeeChat #WorkLife`
        ],
        funny: [
          `Me trying to explain ${formData.topic} to my team: *confused screaming* 😅 But seriously, this stuff is game-changing once you get it! #WorkHumor #Learning`,
          `${formData.topic}: Because who doesn't love a good challenge on a Monday? 😂 At least it keeps things interesting! #MondayMotivation #WorkLife`,
          `Breaking: Local professional discovers ${formData.topic}, productivity increases by 200%* (*results may vary) 😄 #WorkHumor #ProductivityHacks`
        ]
      },
      instagram: {
        professional: [
          `✨ Diving deep into ${formData.topic} today. Swipe to see key insights that are transforming how we approach this challenge. 📊\n\n#${formData.topic.replace(/\s+/g, '')} #Business #Growth #Professional`,
          `🎯 Focus of the week: ${formData.topic}. Here's what I've learned and how it's changing my perspective.\n\n💡 Key takeaways in the comments!\n\n#Learning #Development #BusinessTips`,
          `📈 Results speak louder than words. Here's how ${formData.topic} has impacted our strategy.\n\n👆 Double tap if you agree!\n\n#Strategy #Results #BusinessGrowth`
        ],
        casual: [
          `Currently obsessing over ${formData.topic} 🤓 Anyone else find this stuff fascinating? Drop your thoughts below! 👇\n\n#Obsessed #Learning #Curious`,
          `Sunday study session: ${formData.topic} edition 📚☕ Sometimes the best ideas come from weekend deep dives!\n\n#SundayVibes #Learning #Ideas`,
          `Plot twist: ${formData.topic} is actually kind of amazing 🤯 Who knew Monday research could be this interesting?\n\n#PlotTwist #Research #MondayVibes`
        ],
        funny: [
          `POV: You're trying to understand ${formData.topic} but your brain said "not today" 🧠🚫😂\n\n#POV #BrainFog #LearningStruggles #Relatable`,
          `Me: I'll just quickly research ${formData.topic}\nAlso me: *3 hours later still reading* 📚😅\n\n#ResearchRabbitHole #Relatable #LearningLife`,
          `${formData.topic}: Exists\nMe: And I took that personally 😤😂\n\n#TookItPersonally #Learning #Funny #Motivated`
        ]
      },
      twitter: {
        professional: [
          `Exploring ${formData.topic} and its impact on modern business strategy. The intersection of innovation and practical application continues to fascinate me. Thoughts? 🧵`,
          `Key insight from today's research on ${formData.topic}: Adaptability remains the most valuable skill in our toolkit. #Innovation #Strategy`,
          `The evolution of ${formData.topic} in the past year has been remarkable. Excited to see where this leads next. #TechTrends #Future`
        ],
        casual: [
          `TIL about ${formData.topic} and honestly, mind blown 🤯 Sometimes the simplest concepts have the biggest impact`,
          `Coffee thoughts: ${formData.topic} is way more interesting than I initially thought ☕ Anyone else diving into this lately?`,
          `Random Tuesday observation: ${formData.topic} keeps popping up everywhere. Universe trying to tell me something? 🤔`
        ],
        funny: [
          `${formData.topic}: *exists*\nMe: "I can fix that" 😂\n\n(Narrator: They could not, in fact, fix that)`,
          `Spent 2 hours reading about ${formData.topic}\nAlso me: "I'm basically an expert now" 🎓😅`,
          `${formData.topic} documentation: "It's simple!"\nThe ${formData.topic}: *Screams in complexity* 😭`
        ]
      }
    };

    // Get random template based on platform and tone
    const platformTemplates = templates[formData.platform as keyof typeof templates];
    const toneTemplates = platformTemplates[formData.tone as keyof typeof platformTemplates];
    const randomTemplate = toneTemplates[Math.floor(Math.random() * toneTemplates.length)];

    // Simulate AI generation delay
    setTimeout(() => {
      setGeneratedCaption(randomTemplate);
      setIsGenerating(false);
    }, 1500);
  };

  const saveCaption = async () => {
    if (!generatedCaption) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('social_captions')
      .insert([{
        user_id: user.id,
        topic: formData.topic,
        tone: formData.tone,
        platform: formData.platform,
        generated_caption: generatedCaption
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save caption",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Caption saved successfully"
      });
      fetchCaptions();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Caption copied to clipboard"
    });
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'linkedin': return 'bg-blue-600';
      case 'instagram': return 'bg-pink-600';
      case 'twitter': return 'bg-sky-500';
      default: return 'bg-gray-600';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'bg-slate-600';
      case 'casual': return 'bg-green-600';
      case 'funny': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Social Media Caption Generator</h3>
          <p className="text-gray-400">Create engaging captions for your social media posts with AI</p>
        </div>
      </div>

      {/* Generator Form */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cyan-500" />
            Generate New Caption
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="topic">Topic or Product *</Label>
            <Input
              id="topic"
              value={formData.topic}
              onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
              className="bg-black/30 border-white/20 text-white"
              placeholder="AI automation, coffee shop launch, team building..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform</Label>
              <Select value={formData.platform} onValueChange={(value) => setFormData({ ...formData, platform: value })}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tone">Tone</Label>
              <Select value={formData.tone} onValueChange={(value) => setFormData({ ...formData, tone: value })}>
                <SelectTrigger className="bg-black/30 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="funny">Funny</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={generateCaption} 
            disabled={isGenerating}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Caption
              </>
            )}
          </Button>

          {/* Generated Caption */}
          {generatedCaption && (
            <div className="space-y-3 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium text-white">Generated Caption</h4>
                <div className="flex gap-2">
                  <Badge className={`${getPlatformColor(formData.platform)} text-white`}>
                    {formData.platform}
                  </Badge>
                  <Badge className={`${getToneColor(formData.tone)} text-white`}>
                    {formData.tone}
                  </Badge>
                </div>
              </div>
              
              <Textarea
                value={generatedCaption}
                onChange={(e) => setGeneratedCaption(e.target.value)}
                className="bg-black/30 border-white/20 text-white"
                rows={6}
              />

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => copyToClipboard(generatedCaption)}
                  className="flex-1 bg-green-500 hover:bg-green-600 gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy
                </Button>
                <Button 
                  size="sm" 
                  onClick={saveCaption}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 gap-2"
                >
                  <Download className="h-3 w-3" />
                  Save
                </Button>
                <Button 
                  size="sm" 
                  onClick={generateCaption}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <RefreshCw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Captions */}
      <Card className="bg-black/30 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Share2 className="h-5 w-5 text-purple-500" />
            Saved Captions ({captions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {captions.map((caption) => (
              <div key={caption.id} className="p-4 bg-white/5 border border-white/10 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-white">{caption.topic}</h4>
                    <span className="text-sm text-gray-400">
                      {new Date(caption.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={`${getPlatformColor(caption.platform)} text-white text-xs`}>
                      {caption.platform}
                    </Badge>
                    <Badge className={`${getToneColor(caption.tone)} text-white text-xs`}>
                      {caption.tone}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm mb-3 whitespace-pre-wrap line-clamp-3">
                  {caption.generated_caption}
                </p>

                <Button
                  size="sm"
                  onClick={() => copyToClipboard(caption.generated_caption)}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 gap-2"
                >
                  <Copy className="h-3 w-3" />
                  Copy Caption
                </Button>
              </div>
            ))}
            {captions.length === 0 && (
              <div className="text-center py-8">
                <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No saved captions yet</p>
                <p className="text-sm text-gray-500">Generate your first caption above</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialCaptionGenerator;
