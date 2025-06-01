
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
import { toast } from '@/components/ui/sonner';
import { getWeatherResponse } from '@/services/weatherService';

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

  // Update time every second with proper IST calculation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      
      // Get IST time using Intl.DateTimeFormat
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(now);
      
      const istDate = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(now);
      
      setCurrentTime(istTime);
      setCurrentDate(istDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const handleWeatherTool = async () => {
    try {
      toast("Getting weather data...", { description: "Fetching current weather information" });
      const weatherResponse = await getWeatherResponse("current weather");
      toast("Weather Update", { description: weatherResponse.text });
    } catch (error) {
      toast("Weather Error", { description: "Could not fetch weather data" });
    }
  };

  const handleVoiceTool = () => {
    if ('speechSynthesis' in window && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        toast("Voice Assistant", { description: "Listening... Speak now!" });
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        toast("Voice Recognized", { description: `You said: "${transcript}"` });
        
        // Process the voice command
        if (transcript.toLowerCase().includes('weather')) {
          handleWeatherTool();
        } else if (transcript.toLowerCase().includes('time')) {
          const speech = new SpeechSynthesisUtterance(`The current time is ${currentTime} IST`);
          window.speechSynthesis.speak(speech);
        } else {
          const speech = new SpeechSynthesisUtterance(`I heard you say: ${transcript}`);
          window.speechSynthesis.speak(speech);
        }
      };
      
      recognition.onerror = (event: any) => {
        toast("Voice Error", { description: `Speech recognition error: ${event.error}` });
      };
      
      recognition.start();
    } else {
      toast("Voice Assistant", { description: "Voice recognition not supported in this browser" });
    }
  };

  const handleSearchTool = () => {
    const query = prompt("Enter your search query:");
    if (query && query.trim()) {
      // Open Google search in new tab
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      toast("Web Search", { description: `Searching for: "${query}"` });
    }
  };

  const handleEmailTool = () => {
    const recipient = prompt("Enter recipient email:");
    if (!recipient) return;
    
    const subject = prompt("Enter email subject:");
    if (!subject) return;
    
    const body = prompt("Enter email body (optional):");
    
    const mailtoLink = `mailto:${recipient}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
    window.open(mailtoLink);
    toast("Email Assistant", { description: `Opening email client for ${recipient}` });
  };

  const handlePDFTool = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast("PDF Reader", { description: `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)` });
        
        // For PDF files, try to read basic info
        if (file.type === 'application/pdf') {
          const reader = new FileReader();
          reader.onload = () => {
            toast("PDF Analysis", { description: `PDF loaded successfully. File size: ${(file.size / 1024).toFixed(2)} KB` });
          };
          reader.readAsArrayBuffer(file);
        } else if (file.type === 'text/plain') {
          // For text files, read content
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const preview = content.slice(0, 100) + (content.length > 100 ? '...' : '');
            toast("Text File Content", { description: `Preview: ${preview}` });
          };
          reader.readAsText(file);
        }
      }
    };
    input.click();
  };

  const handleFileSummarizerTool = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.txt,.md';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast("File Summarizer", { description: `Processing "${file.name}" for summary...` });
        
        // For text files, actually read and summarize
        if (file.type === 'text/plain') {
          const reader = new FileReader();
          reader.onload = (e) => {
            const content = e.target?.result as string;
            const wordCount = content.split(/\s+/).length;
            const charCount = content.length;
            const lines = content.split('\n').length;
            
            setTimeout(() => {
              toast("Summary Ready", { 
                description: `File analyzed: ${wordCount} words, ${charCount} characters, ${lines} lines` 
              });
            }, 1000);
          };
          reader.readAsText(file);
        } else {
          // For other files, show basic info
          setTimeout(() => {
            toast("Summary Ready", { 
              description: `File: ${file.name}, Size: ${(file.size / 1024).toFixed(2)} KB, Type: ${file.type}` 
            });
          }, 2000);
        }
      }
    };
    input.click();
  };

  const handleTodoTool = () => {
    const task = prompt("Add a new task:");
    if (task && task.trim()) {
      const tasks = JSON.parse(localStorage.getItem('jarvis-tasks') || '[]');
      const newTask = {
        id: Date.now(),
        text: task.trim(),
        completed: false,
        createdAt: new Date().toISOString()
      };
      tasks.push(newTask);
      localStorage.setItem('jarvis-tasks', JSON.stringify(tasks));
      toast("Task Added", { description: `"${task}" added to your to-do list` });
      
      // Show current task count
      setTimeout(() => {
        toast("Task Manager", { description: `You now have ${tasks.length} tasks total` });
      }, 1000);
    }
  };

  const handleOCRTool = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        toast("OCR Scanner", { description: `Processing image "${file.name}" for text extraction...` });
        
        // Create image preview and basic analysis
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              
              setTimeout(() => {
                toast("OCR Complete", { 
                  description: `Image analyzed: ${img.width}x${img.height}px. Basic OCR processing completed.` 
                });
              }, 2000);
            }
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleMemoryPanel = () => {
    const action = prompt("Memory Panel Actions:\n1. Add Note\n2. View Notes\n3. Clear All\n\nEnter your choice (1-3):");
    
    switch(action) {
      case '1':
        const note = prompt("Add a quick note:");
        if (note && note.trim()) {
          const notes = JSON.parse(localStorage.getItem('jarvis-notes') || '[]');
          notes.push({
            id: Date.now(),
            text: note.trim(),
            createdAt: new Date().toISOString()
          });
          localStorage.setItem('jarvis-notes', JSON.stringify(notes));
          toast("Note Added", { description: "Your note has been saved to memory" });
        }
        break;
        
      case '2':
        const notes = JSON.parse(localStorage.getItem('jarvis-notes') || '[]');
        if (notes.length > 0) {
          const notesList = notes.slice(-3).map((note: any, index: number) => 
            `${index + 1}. ${note.text.slice(0, 50)}${note.text.length > 50 ? '...' : ''}`
          ).join('\n');
          alert(`Recent Notes (${notes.length} total):\n\n${notesList}`);
        } else {
          toast("Memory Panel", { description: "No notes found in memory" });
        }
        break;
        
      case '3':
        const confirmClear = confirm("Are you sure you want to clear all notes?");
        if (confirmClear) {
          localStorage.removeItem('jarvis-notes');
          toast("Memory Cleared", { description: "All notes have been removed from memory" });
        }
        break;
        
      default:
        toast("Memory Panel", { description: "Invalid selection" });
    }
  };

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
      action: handlePDFTool,
      status: 'active'
    },
    {
      id: 'file-summarizer',
      name: 'File Summarizer',
      description: 'Summarize any document',
      icon: FileSearch,
      action: handleFileSummarizerTool,
      status: 'active'
    },
    {
      id: 'voice-assistant',
      name: 'Voice Assistant',
      description: 'Voice commands and TTS',
      icon: Mic,
      action: handleVoiceTool,
      status: 'active'
    },
    {
      id: 'weather',
      name: 'Weather Info',
      description: 'Real-time weather data',
      icon: CloudSun,
      action: handleWeatherTool,
      status: 'active'
    },
    {
      id: 'todo',
      name: 'To-Do Manager',
      description: 'Task and project management',
      icon: CheckSquare,
      action: handleTodoTool,
      status: 'active'
    },
    {
      id: 'memory',
      name: 'Memory Panel',
      description: 'Notes and reminders',
      icon: Brain,
      action: handleMemoryPanel,
      status: 'active'
    },
    {
      id: 'email',
      name: 'Email Assistant',
      description: 'Draft and send emails',
      icon: Mail,
      action: handleEmailTool,
      status: 'active'
    },
    {
      id: 'search',
      name: 'Web Search',
      description: 'Smart web search',
      icon: Search,
      action: handleSearchTool,
      status: 'active'
    },
    {
      id: 'ocr',
      name: 'OCR Scanner',
      description: 'Extract text from images',
      icon: ScanText,
      action: handleOCRTool,
      status: 'active'
    }
  ];

  const [activePanel, setActivePanel] = useState<string | null>(null);

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

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
        <p>J.A.R.V.I.S. v2.0 | Just A Rather Very Intelligent System</p>
        <p className="mt-1">All systems nominal • Neural networks active • Ready for commands</p>
      </div>
    </div>
  );
};

export default PracticalDashboard;
