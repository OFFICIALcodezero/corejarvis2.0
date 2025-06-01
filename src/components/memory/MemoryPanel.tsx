
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Brain, Search, Plus, Trash2, Edit } from 'lucide-react';
import { memoryService, PersistentKnowledge, Memory } from '@/services/memoryService';
import { toast } from '@/components/ui/use-toast';

export const MemoryPanel = () => {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [knowledge, setKnowledge] = useState<PersistentKnowledge[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newKnowledge, setNewKnowledge] = useState({ content: '', type: 'general', tags: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMemories();
    loadKnowledge();
  }, []);

  const loadMemories = async () => {
    try {
      const recentMemories = await memoryService.getRecentMemories(10);
      setMemories(recentMemories);
    } catch (error) {
      console.error('Error loading memories:', error);
      toast({
        title: "Error",
        description: "Failed to load memories",
        variant: "destructive"
      });
    }
  };

  const loadKnowledge = async () => {
    try {
      // Since we don't have a direct "get all" method, we'll search with empty query
      const allKnowledge = await memoryService.searchKnowledge('');
      setKnowledge(allKnowledge);
    } catch (error) {
      console.error('Error loading knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to load knowledge base",
        variant: "destructive"
      });
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadKnowledge();
      return;
    }

    setIsLoading(true);
    try {
      const results = await memoryService.searchKnowledge(searchQuery);
      setKnowledge(results);
    } catch (error) {
      console.error('Error searching knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to search knowledge base",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKnowledge = async () => {
    if (!newKnowledge.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter knowledge content",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const tags = newKnowledge.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      await memoryService.storePersistentKnowledge(
        newKnowledge.content,
        newKnowledge.type,
        tags
      );
      
      setNewKnowledge({ content: '', type: 'general', tags: '' });
      loadKnowledge();
      toast({
        title: "Success",
        description: "Knowledge added successfully"
      });
    } catch (error) {
      console.error('Error adding knowledge:', error);
      toast({
        title: "Error",
        description: "Failed to add knowledge",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Memory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/40 border-jarvis/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-jarvis" />
              <div>
                <div className="text-sm text-gray-400">Recent Memories</div>
                <div className="text-xl font-bold text-white">{memories.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-jarvis/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-jarvis" />
              <div>
                <div className="text-sm text-gray-400">Knowledge Base</div>
                <div className="text-xl font-bold text-white">{knowledge.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/40 border-jarvis/30">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-jarvis" />
              <div>
                <div className="text-sm text-gray-400">Active Learning</div>
                <div className="text-xl font-bold text-green-400">Online</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Add Knowledge */}
      <Card className="bg-black/40 border-jarvis/30">
        <CardHeader>
          <CardTitle className="text-jarvis">Knowledge Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="flex space-x-2">
            <Input
              placeholder="Search knowledge base..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="bg-black/20 border-jarvis/30 text-white"
            />
            <Button 
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {/* Add Knowledge */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add new knowledge to JARVIS memory..."
              value={newKnowledge.content}
              onChange={(e) => setNewKnowledge({...newKnowledge, content: e.target.value})}
              className="bg-black/20 border-jarvis/30 text-white"
              rows={3}
            />
            <div className="flex space-x-2">
              <Input
                placeholder="Type (e.g., personal, work, technical)"
                value={newKnowledge.type}
                onChange={(e) => setNewKnowledge({...newKnowledge, type: e.target.value})}
                className="bg-black/20 border-jarvis/30 text-white flex-1"
              />
              <Input
                placeholder="Tags (comma separated)"
                value={newKnowledge.tags}
                onChange={(e) => setNewKnowledge({...newKnowledge, tags: e.target.value})}
                className="bg-black/20 border-jarvis/30 text-white flex-1"
              />
              <Button 
                onClick={handleAddKnowledge}
                disabled={isLoading}
                className="bg-jarvis/20 text-jarvis hover:bg-jarvis/30"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Base */}
      <Card className="bg-black/40 border-jarvis/30">
        <CardHeader>
          <CardTitle className="text-jarvis">Knowledge Base</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {knowledge.map((item) => (
              <div key={item.id} className="bg-black/30 p-3 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-jarvis border-jarvis/30">
                    {item.type}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    Priority: {item.priority_level}
                  </span>
                </div>
                <p className="text-white text-sm mb-2">{item.content}</p>
                {item.related_tags && item.related_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {item.related_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {knowledge.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No knowledge entries found. Add some knowledge to get started!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Memories */}
      <Card className="bg-black/40 border-jarvis/30">
        <CardHeader>
          <CardTitle className="text-jarvis">Recent Memories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {memories.map((memory) => (
              <div key={memory.id} className="bg-black/30 p-3 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  {new Date(memory.timestamp).toLocaleString()}
                </div>
                <div className="text-white text-sm mb-1">
                  <strong>Input:</strong> {memory.input_text}
                </div>
                {memory.response_text && (
                  <div className="text-gray-300 text-sm">
                    <strong>Response:</strong> {memory.response_text}
                  </div>
                )}
                {memory.context_tags && memory.context_tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {memory.context_tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {memories.length === 0 && (
              <div className="text-center text-gray-400 py-8">
                No recent memories found.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
