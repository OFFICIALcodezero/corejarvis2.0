
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  CheckSquare, 
  Mail, 
  BarChart3, 
  MessageSquare, 
  Mic,
  Brain,
  Settings,
  Home
} from 'lucide-react';

// Import module components
import ClientManager from './jarvis-pro/ClientManager';
import TaskManager from './jarvis-pro/TaskManager';
import MeetingScheduler from './jarvis-pro/MeetingScheduler';
import EmailAssistant from './jarvis-pro/EmailAssistant';
import DailyBrief from './jarvis-pro/DailyBrief';
import SocialCaptionGenerator from './jarvis-pro/SocialCaptionGenerator';
import VoiceAssistant from './jarvis-pro/VoiceAssistant';

type ActiveModule = 
  | 'dashboard' 
  | 'clients' 
  | 'tasks' 
  | 'meetings' 
  | 'emails' 
  | 'brief' 
  | 'social' 
  | 'voice';

const JarvisProDashboard: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'clients', name: 'Client Manager', icon: Users },
    { id: 'tasks', name: 'Task Manager', icon: CheckSquare },
    { id: 'meetings', name: 'Meeting Scheduler', icon: Calendar },
    { id: 'emails', name: 'Email Assistant', icon: Mail },
    { id: 'brief', name: 'Daily Brief', icon: BarChart3 },
    { id: 'social', name: 'Social Captions', icon: MessageSquare },
    { id: 'voice', name: 'Voice Assistant', icon: Mic },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'clients':
        return <ClientManager />;
      case 'tasks':
        return <TaskManager />;
      case 'meetings':
        return <MeetingScheduler />;
      case 'emails':
        return <EmailAssistant />;
      case 'brief':
        return <DailyBrief />;
      case 'social':
        return <SocialCaptionGenerator />;
      case 'voice':
        return <VoiceAssistant />;
      default:
        return (
          <div className="p-6 space-y-6">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <Brain className="h-12 w-12 text-cyan-500 mr-3" />
                <h1 className="text-4xl font-bold text-white">Jarvis Pro</h1>
              </div>
              <p className="text-xl text-gray-400">Business Automation Suite</p>
              <Badge className="mt-2 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                AI-Powered Business Management
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.slice(1).map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.id}
                    className="bg-black/30 border-white/20 hover:border-cyan-500/50 transition-all cursor-pointer group"
                    onClick={() => setActiveModule(module.id as ActiveModule)}
                  >
                    <CardHeader className="text-center pb-3">
                      <IconComponent className="h-8 w-8 text-cyan-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                      <CardTitle className="text-white text-lg">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        className="w-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500/30"
                        variant="outline"
                      >
                        Open Module
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="bg-black/30 border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button 
                    onClick={() => setActiveModule('clients')}
                    className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border-blue-500/30"
                    variant="outline"
                  >
                    Add Client
                  </Button>
                  <Button 
                    onClick={() => setActiveModule('tasks')}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                    variant="outline"
                  >
                    Create Task
                  </Button>
                  <Button 
                    onClick={() => setActiveModule('meetings')}
                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border-purple-500/30"
                    variant="outline"
                  >
                    Schedule Meeting
                  </Button>
                  <Button 
                    onClick={() => setActiveModule('brief')}
                    className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border-orange-500/30"
                    variant="outline"
                  >
                    Daily Brief
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-black/50 backdrop-blur-lg border-r border-white/10 min-h-screen">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-cyan-500" />
              <div>
                <h2 className="text-xl font-bold text-white">Jarvis Pro</h2>
                <p className="text-sm text-gray-400">Business Suite</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {modules.map((module) => {
              const IconComponent = module.icon;
              const isActive = activeModule === module.id;
              
              return (
                <Button
                  key={module.id}
                  onClick={() => setActiveModule(module.id as ActiveModule)}
                  className={`w-full justify-start gap-3 ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' 
                      : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  variant={isActive ? 'outline' : 'ghost'}
                >
                  <IconComponent className="h-4 w-4" />
                  {module.name}
                </Button>
              );
            })}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default JarvisProDashboard;
