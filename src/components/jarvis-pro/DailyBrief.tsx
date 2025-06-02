
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  CheckSquare, 
  Mail, 
  Users, 
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardData {
  todayMeetings: any[];
  pendingTasks: any[];
  recentEmails: any[];
  newClients: any[];
  stats: {
    totalClients: number;
    completedTasks: number;
    upcomingMeetings: number;
    unreadEmails: number;
  };
}

const DailyBrief: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    todayMeetings: [],
    pendingTasks: [],
    recentEmails: [],
    newClients: [],
    stats: {
      totalClients: 0,
      completedTasks: 0,
      upcomingMeetings: 0,
      unreadEmails: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
      // Fetch today's meetings
      const { data: meetings } = await supabase
        .from('meetings')
        .select('*')
        .gte('start_time', today.toISOString())
        .lt('start_time', tomorrow.toISOString())
        .order('start_time', { ascending: true });

      // Fetch pending tasks
      const { data: tasks } = await supabase
        .from('business_tasks')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch recent emails
      const { data: emails } = await supabase
        .from('email_threads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch clients added this week
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: clients } = await supabase
        .from('clients')
        .select('*')
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: false });

      // Fetch stats
      const { count: totalClientsCount } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      const { count: completedTasksCount } = await supabase
        .from('business_tasks')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      const { count: upcomingMeetingsCount } = await supabase
        .from('meetings')
        .select('*', { count: 'exact', head: true })
        .gte('start_time', new Date().toISOString());

      const { count: unreadEmailsCount } = await supabase
        .from('email_threads')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'unread');

      setData({
        todayMeetings: meetings || [],
        pendingTasks: tasks || [],
        recentEmails: emails || [],
        newClients: clients || [],
        stats: {
          totalClients: totalClientsCount || 0,
          completedTasks: completedTasksCount || 0,
          upcomingMeetings: upcomingMeetingsCount || 0,
          unreadEmails: unreadEmailsCount || 0
        }
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 
            Your Daily Brief
          </h3>
          <p className="text-gray-400">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
        <Button onClick={fetchDashboardData} className="bg-cyan-500 hover:bg-cyan-600 gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{data.stats.totalClients}</p>
              </div>
              <Users className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Completed Tasks</p>
                <p className="text-2xl font-bold text-white">{data.stats.completedTasks}</p>
              </div>
              <CheckSquare className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Meetings</p>
                <p className="text-2xl font-bold text-white">{data.stats.upcomingMeetings}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread Emails</p>
                <p className="text-2xl font-bold text-white">{data.stats.unreadEmails}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-500" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.todayMeetings.length > 0 ? (
              <div className="space-y-3">
                {data.todayMeetings.map((meeting) => (
                  <div key={meeting.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{meeting.title}</h4>
                        <p className="text-sm text-gray-400">{meeting.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-400">
                            {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                          </span>
                        </div>
                      </div>
                      <Badge className="bg-purple-500 text-white">
                        {meeting.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No meetings scheduled for today</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Tasks */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.pendingTasks.length > 0 ? (
              <div className="space-y-3">
                {data.pendingTasks.map((task) => (
                  <div key={task.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-400 line-clamp-2">{task.description}</p>
                        )}
                        {task.due_date && (
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-400">
                              Due {formatDate(task.due_date)}
                            </span>
                          </div>
                        )}
                      </div>
                      <Badge className={`${
                        task.priority === 'high' ? 'bg-red-500' :
                        task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      } text-white`}>
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No pending tasks</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-500" />
              New Clients This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.newClients.length > 0 ? (
              <div className="space-y-3">
                {data.newClients.map((client) => (
                  <div key={client.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white">{client.name}</h4>
                        {client.company && (
                          <p className="text-sm text-gray-400">{client.company}</p>
                        )}
                        <span className="text-xs text-gray-400">
                          Added {formatDate(client.created_at)}
                        </span>
                      </div>
                      <Badge className="bg-green-500 text-white">
                        New
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No new clients this week</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Email Summary */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-500" />
              Recent Email Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentEmails.length > 0 ? (
              <div className="space-y-3">
                {data.recentEmails.map((email) => (
                  <div key={email.id} className="p-3 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-white line-clamp-1">{email.subject}</h4>
                        <p className="text-sm text-gray-400">From: {email.sender}</p>
                        <span className="text-xs text-gray-400">
                          {formatDate(email.created_at)}
                        </span>
                      </div>
                      <Badge className={`${
                        email.status === 'unread' ? 'bg-orange-500' : 'bg-gray-500'
                      } text-white`}>
                        {email.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No recent email activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyBrief;
