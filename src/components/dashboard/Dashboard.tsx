import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Home, 
  Files, 
  FileText, 
  Terminal, 
  LogOut,
  ChevronDown,
  ChevronRight,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ChatInterface from './ChatInterface';
import NotesManager from './NotesManager';
import TaskManager from './TaskManager';
import FileManager from './FileManager';
import ConsoleInterface from './ConsoleInterface';
import ProfilePage from './ProfilePage';

interface ActivityLog {
  id: string;
  activity: string;
  timestamp: string;
}

interface Profile {
  id: string;
  email: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchActivityLogs();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivityLogs(data || []);
    } catch (error) {
      console.error('Error fetching activity logs:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  const handleChatNavigation = () => {
    navigate('/interface');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'Chat', icon: FileText, onClick: handleChatNavigation },
    { id: 'files', label: 'Files', icon: Files },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'tasks', label: 'Tasks', icon: FileText },
    { id: 'console', label: 'Console', icon: Terminal },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatInterface />;
      case 'files':
        return <FileManager />;
      case 'notes':
        return <NotesManager />;
      case 'tasks':
        return <TaskManager />;
      case 'console':
        return <ConsoleInterface />;
      case 'profile':
        return <ProfilePage />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-blue-400 mb-2 animate-pulse">
                Welcome to JARVIS
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                Hello, {user?.email}
              </p>
              {profile && (
                <p className="text-gray-400">
                  Member since {formatDate(profile.created_at)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-black/40 border-blue-500/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-blue-400">System Status</CardTitle>
                  <CardDescription className="text-gray-400">
                    All systems operational
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-300">AI Core:</span>
                      <span className="text-green-400">Online</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Database:</span>
                      <span className="text-green-400">Connected</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Security:</span>
                      <span className="text-green-400">Secure</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-blue-500/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-blue-400">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your latest system interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activityLogs.length > 0 ? (
                      activityLogs.map((log) => (
                        <div key={log.id} className="text-sm">
                          <span className="text-gray-300">{log.activity}</span>
                          <br />
                          <span className="text-xs text-gray-500">
                            {formatDate(log.timestamp)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">No recent activity</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-black/40 border-blue-500/30 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-blue-400">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button 
                    onClick={handleChatNavigation}
                    className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30"
                  >
                    Start Chat
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('files')}
                    className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30"
                  >
                    Upload Files
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('notes')}
                    className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30"
                  >
                    Create Note
                  </Button>
                  <Button 
                    onClick={() => setActiveSection('tasks')}
                    className="bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30"
                  >
                    Add Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black/50 backdrop-blur-lg border-r border-blue-500/30 min-h-screen`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-xl font-bold text-blue-400 ${!sidebarOpen && 'hidden'}`}>
                JARVIS
              </h2>
              <Collapsible open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-blue-400">
                    {sidebarOpen ? <ChevronDown /> : <ChevronRight />}
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>

            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    onClick={() => item.onClick ? item.onClick() : setActiveSection(item.id)}
                    variant={activeSection === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start text-left ${
                      activeSection === item.id 
                        ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' 
                        : 'text-gray-300 hover:text-blue-400 hover:bg-blue-600/10'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {sidebarOpen && item.label}
                  </Button>
                );
              })}
              
              <Button
                onClick={handleSignOut}
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-600/10"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {sidebarOpen && 'Logout'}
              </Button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
