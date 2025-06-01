
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageSquare, 
  FileText, 
  FileSearch, 
  Mic, 
  CloudSun, 
  CheckSquare, 
  Brain, 
  Mail, 
  Search, 
  ScanText 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ToolCard {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  route?: string;
  action?: () => void;
  status: 'active' | 'beta' | 'coming-soon';
}

const PracticalDashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // IST time (UTC+5:30)
      const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      
      const timeString = istTime.toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      
      const dateString = istTime.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      setCurrentTime(timeString);
      setCurrentDate(dateString);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const tools: ToolCard[] = [
    {
      id: 'chat',
      name: 'Chat with Jarvis',
      description: 'AI conversation interface',
      icon: MessageSquare,
      route: '/interface',
      status: 'active'
    },
    {
      id: 'pdf-reader',
      name: 'PDF & Doc Reader',
      description: 'Read and analyze documents',
      icon: FileText,
      action: () => handleToolClick('PDF Reader - Upload documents to analyze'),
      status: 'beta'
    },
    {
      id: 'file-summarizer',
      name: 'File Summarizer',
      description: 'Summarize any document',
      icon: FileSearch,
      action: () => handleToolClick('File Summarizer - Upload files for AI summary'),
      status: 'beta'
    },
    {
      id: 'voice-assistant',
      name: 'Voice Assistant',
      description: 'Voice commands and TTS',
      icon: Mic,
      action: () => handleToolClick('Voice Assistant - Click to start voice interaction'),
      status: 'active'
    },
    {
      id: 'weather',
      name: 'Weather Info',
      description: 'Real-time weather data',
      icon: CloudSun,
      action: () => handleToolClick('Weather - Getting your location weather...'),
      status: 'active'
    },
    {
      id: 'todo',
      name: 'To-Do Manager',
      description: 'Task and project management',
      icon: CheckSquare,
      action: () => handleToolClick('To-Do Manager - Manage your tasks and projects'),
      status: 'beta'
    },
    {
      id: 'memory',
      name: 'Memory Panel',
      description: 'Notes and reminders',
      icon: Brain,
      action: () => setActivePanel('memory'),
      status: 'active'
    },
    {
      id: 'email',
      name: 'Email Assistant',
      description: 'Draft and send emails',
      icon: Mail,
      action: () => handleToolClick('Email Assistant - Draft professional emails'),
      status: 'beta'
    },
    {
      id: 'search',
      name: 'Web Search',
      description: 'Smart web search',
      icon: Search,
      action: () => handleToolClick('Web Search - Search the internet intelligently'),
      status: 'active'
    },
    {
      id: 'ocr',
      name: 'OCR Scanner',
      description: 'Extract text from images',
      icon: ScanText,
      action: () => handleToolClick('OCR Scanner - Upload images to extract text'),
      status: 'beta'
    }
  ];

  const [activePanel, setActivePanel] = useState<string | null>(null);

  const handleToolClick = (message: string) => {
    console.log('Tool activated:', message);
    // You can add actual implementations here
    alert(message + '\n\nThis tool is ready for implementation!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'beta': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'coming-soon': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-mono">
      {/* Header with time */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-400 mb-2">
            J.A.R.V.I.S
          </h1>
          <p className="text-sm text-gray-400">Personal AI Assistant Dashboard</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-mono text-green-400 mb-1">
            {currentTime} IST
          </div>
          <div className="text-sm text-gray-400">
            {currentDate}
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-4 text-sm">
          <span className="text-gray-400">System Status:</span>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            ● ONLINE
          </Badge>
          <span className="text-gray-400">|</span>
          <span className="text-blue-400">Neural Networks Active</span>
          <span className="text-gray-400">|</span>
          <span className="text-green-400">All Systems Operational</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {tools.map((tool) => {
          const IconComponent = tool.icon;
          
          return (
            <Card 
              key={tool.id}
              className="bg-gray-900/50 border-green-500/20 hover:border-green-500/40 hover:bg-gray-800/60 transition-all duration-300 cursor-pointer group"
              onClick={() => {
                if (tool.route) {
                  navigate(tool.route);
                } else if (tool.action) {
                  tool.action();
                }
              }}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="p-3 rounded-lg bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                    <IconComponent className="h-6 w-6 text-green-400" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-white text-sm mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">
                      {tool.description}
                    </p>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getStatusColor(tool.status)}`}
                  >
                    {tool.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Memory Panel */}
      {activePanel === 'memory' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-gray-900 border-green-500/30 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-400">Memory Panel</h2>
                <Button 
                  variant="ghost" 
                  onClick={() => setActivePanel(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-black/40 p-4 rounded-lg border border-green-500/20">
                  <h3 className="text-green-400 font-semibold mb-2">Quick Notes</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Store and manage your notes and reminders here.
                  </p>
                  <Button 
                    className="bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30"
                    onClick={() => navigate('/dashboard')}
                  >
                    Open Memory Manager
                  </Button>
                </div>
                
                <div className="bg-black/40 p-4 rounded-lg border border-blue-500/20">
                  <h3 className="text-blue-400 font-semibold mb-2">Recent Activities</h3>
                  <div className="space-y-2 text-sm text-gray-400">
                    <div>• Dashboard accessed at {currentTime}</div>
                    <div>• System status checked</div>
                    <div>• All tools scanned and ready</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>J.A.R.V.I.S. v2.0 | Just A Rather Very Intelligent System</p>
        <p className="mt-1">All systems nominal • Neural networks active • Ready for commands</p>
      </div>
    </div>
  );
};

export default PracticalDashboard;
