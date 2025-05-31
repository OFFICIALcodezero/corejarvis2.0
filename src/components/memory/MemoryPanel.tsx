
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Brain, Clock } from 'lucide-react';
import { memoryService, PersistentKnowledge, Memory } from '@/services/memoryService';

interface MemoryPanelProps {
  hackerMode?: boolean;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ hackerMode = false }) => {
  const [knowledge, setKnowledge] = useState<PersistentKnowledge[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadRecentMemories();
  }, []);

  const loadRecentMemories = async () => {
    setLoading(true);
    try {
      const recentMemories = await memoryService.getRecentMemories(10);
      setMemories(recentMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const knowledgeResults = await memoryService.searchKnowledge(searchQuery);
      const memoryResults = await memoryService.searchMemories(searchQuery);
      
      setKnowledge(knowledgeResults);
      setMemories(memoryResults);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`${hackerMode ? 'bg-black/40 border-red-500/30' : 'glass-morphism'}`}>
      <CardHeader>
        <CardTitle className={`flex items-center ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>
          <Brain className="h-5 w-5 mr-2" />
          Memory System
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            placeholder="Search memories and knowledge..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className={hackerMode ? 'bg-black/40 border-red-500/30 text-red-400' : ''}
          />
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className={hackerMode ? 'bg-red-600/20 hover:bg-red-600/30 border-red-500' : ''}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className={`animate-spin rounded-full h-6 w-6 border-b-2 mx-auto ${hackerMode ? 'border-red-400' : 'border-jarvis'}`}></div>
          </div>
        )}

        {knowledge.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-semibold text-sm ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>Knowledge</h4>
            {knowledge.map((item) => (
              <div key={item.id} className={`p-3 rounded-lg border ${hackerMode ? 'bg-black/20 border-red-500/20' : 'bg-black/30 border-jarvis/20'}`}>
                <p className="text-white text-sm">{item.content}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-1">
                    {item.related_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Priority: {item.priority_level}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {memories.length > 0 && (
          <div className="space-y-2">
            <h4 className={`font-semibold text-sm ${hackerMode ? 'text-red-400' : 'text-jarvis'}`}>Recent Memories</h4>
            {memories.slice(0, 5).map((memory) => (
              <div key={memory.id} className={`p-3 rounded-lg border ${hackerMode ? 'bg-black/20 border-red-500/20' : 'bg-black/30 border-jarvis/20'}`}>
                <p className="text-white text-sm">{memory.input_text}</p>
                {memory.response_text && (
                  <p className="text-gray-400 text-xs mt-1">{memory.response_text}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-1">
                    {memory.context_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(memory.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MemoryPanel;
