
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CheckSquare, Calendar, Mail, MessageSquare, Newspaper, BarChart3 } from 'lucide-react';
import ClientManager from './ClientManager';
import TaskManager from './TaskManager';
import MeetingScheduler from './MeetingScheduler';
import EmailAssistant from './EmailAssistant';
import SocialMediaGenerator from './SocialMediaGenerator';
import NewsCenter from './NewsCenter';
import DailyBrief from './DailyBrief';

const JarvisProDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Jarvis Pro — Business Suite</h1>
          <p className="text-gray-400 mt-2">Your AI-powered business automation dashboard</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="news" className="flex items-center gap-2">
            <Newspaper className="w-4 h-4" />
            News
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <DailyBrief />
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <ClientManager />
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TaskManager />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <MeetingScheduler />
        </TabsContent>

        <TabsContent value="emails" className="space-y-6">
          <EmailAssistant />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <SocialMediaGenerator />
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          <NewsCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JarvisProDashboard;
