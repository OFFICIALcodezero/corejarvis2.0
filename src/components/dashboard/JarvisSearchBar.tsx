
import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface SearchResult {
  id: string;
  type: 'chat' | 'note' | 'task' | 'reminder' | 'event';
  title: string;
  content: string;
  timestamp: string;
}

interface JarvisSearchBarProps {
  onResultClick?: (result: SearchResult) => void;
}

const JarvisSearchBar: React.FC<JarvisSearchBarProps> = ({ onResultClick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const searchData = (searchQuery: string): SearchResult[] => {
    if (!searchQuery.trim()) return [];

    const allResults: SearchResult[] = [];
    const lowerQuery = searchQuery.toLowerCase();

    // Search chat messages
    try {
      const chatMessages = JSON.parse(localStorage.getItem('jarvis-chat-history') || '[]');
      chatMessages.forEach((msg: any, index: number) => {
        if (msg.content && msg.content.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: `chat-${index}`,
            type: 'chat',
            title: 'Chat Message',
            content: msg.content.substring(0, 100) + '...',
            timestamp: msg.timestamp || new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error searching chat messages:', error);
    }

    // Search notes
    try {
      const notes = JSON.parse(localStorage.getItem('jarvis-notes') || '[]');
      notes.forEach((note: any) => {
        if (note.content && note.content.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: `note-${note.id}`,
            type: 'note',
            title: 'Note',
            content: note.content.substring(0, 100) + '...',
            timestamp: note.timestamp || new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error searching notes:', error);
    }

    // Search tasks
    try {
      const tasks = JSON.parse(localStorage.getItem('jarvis-tasks') || '[]');
      tasks.forEach((task: any) => {
        if (task.title && task.title.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: `task-${task.id}`,
            type: 'task',
            title: 'Task',
            content: task.title,
            timestamp: task.createdAt || new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error searching tasks:', error);
    }

    // Search events
    try {
      const events = JSON.parse(localStorage.getItem('jarvis-events') || '[]');
      events.forEach((event: any) => {
        if (event.title && event.title.toLowerCase().includes(lowerQuery)) {
          allResults.push({
            id: `event-${event.id}`,
            type: 'event',
            title: 'Event',
            content: `${event.title} - ${event.date} at ${event.time}`,
            timestamp: event.createdAt || new Date().toISOString()
          });
        }
      });
    } catch (error) {
      console.error('Error searching events:', error);
    }

    // Sort by timestamp (newest first)
    return allResults.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);
  };

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchData(query);
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (onResultClick) {
      onResultClick(result);
    }
    setIsOpen(false);
    setQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return '💬';
      case 'note': return '📝';
      case 'task': return '✅';
      case 'reminder': return '⏰';
      case 'event': return '📅';
      default: return '📄';
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search Jarvis data..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-10 bg-gray-900/50 border-green-500/30 text-white placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900 border-green-500/30 max-h-80 overflow-y-auto">
          <CardContent className="p-2">
            {results.map((result) => (
              <div
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-2 hover:bg-green-500/10 rounded cursor-pointer border-b border-gray-700 last:border-b-0"
              >
                <div className="flex items-start space-x-2">
                  <span className="text-lg">{getTypeIcon(result.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-green-400">{result.title}</div>
                    <div className="text-xs text-gray-300 truncate">{result.content}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(result.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {isOpen && results.length === 0 && query.trim() && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 bg-gray-900 border-green-500/30">
          <CardContent className="p-4 text-center text-gray-400">
            No results found for "{query}"
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default JarvisSearchBar;
