
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, Mail, Users, TrendingUp, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  tasks: {
    total: number;
    pending: number;
    completed: number;
    overdue: number;
  };
  meetings: {
    today: number;
    thisWeek: number;
    upcoming: number;
  };
  clients: {
    total: number;
    active: number;
    newThisWeek: number;
  };
  emails: {
    total: number;
    unread: number;
    drafts: number;
  };
}

const DailyBrief: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    tasks: { total: 0, pending: 0, completed: 0, overdue: 0 },
    meetings: { today: 0, thisWeek: 0, upcoming: 0 },
    clients: { total: 0, active: 0, newThisWeek: 0 },
    emails: { total: 0, unread: 0, drafts: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [todaysMeetings, setTodaysMeetings] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTaskStats(),
        fetchMeetingStats(),
        fetchClientStats(),
        fetchEmailStats(),
        fetchUpcomingTasks(),
        fetchTodaysMeetings()
      ]);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTaskStats = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('jarvis_tasks')
        .select('status, due_date');

      if (error) throw error;

      const today = new Date();
      const taskStats = {
        total: tasks?.length || 0,
        pending: tasks?.filter(t => t.status === 'pending').length || 0,
        completed: tasks?.filter(t => t.status === 'completed').length || 0,
        overdue: tasks?.filter(t => 
          t.due_date && 
          new Date(t.due_date) < today && 
          t.status !== 'completed'
        ).length || 0
      };

      setStats(prev => ({ ...prev, tasks: taskStats }));
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  const fetchMeetingStats = async () => {
    try {
      const { data: meetings, error } = await supabase
        .from('jarvis_meetings')
        .select('start_time, status');

      if (error) throw error;

      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);
      const weekEnd = new Date(todayStart.getTime() + 7 * 24 * 60 * 60 * 1000);

      const meetingStats = {
        today: meetings?.filter(m => {
          const meetingDate = new Date(m.start_time);
          return meetingDate >= todayStart && meetingDate < todayEnd && m.status === 'scheduled';
        }).length || 0,
        thisWeek: meetings?.filter(m => {
          const meetingDate = new Date(m.start_time);
          return meetingDate >= todayStart && meetingDate < weekEnd && m.status === 'scheduled';
        }).length || 0,
        upcoming: meetings?.filter(m => 
          new Date(m.start_time) > today && m.status === 'scheduled'
        ).length || 0
      };

      setStats(prev => ({ ...prev, meetings: meetingStats }));
    } catch (error) {
      console.error('Error fetching meeting stats:', error);
    }
  };

  const fetchClientStats = async () => {
    try {
      const { data: clients, error } = await supabase
        .from('jarvis_clients')
        .select('status, created_at');

      if (error) throw error;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const clientStats = {
        total: clients?.length || 0,
        active: clients?.filter(c => c.status === 'active').length || 0,
        newThisWeek: clients?.filter(c => 
          new Date(c.created_at) >= weekAgo
        ).length || 0
      };

      setStats(prev => ({ ...prev, clients: clientStats }));
    } catch (error) {
      console.error('Error fetching client stats:', error);
    }
  };

  const fetchEmailStats = async () => {
    try {
      const { data: emails, error } = await supabase
        .from('jarvis_emails')
        .select('status, is_draft');

      if (error) throw error;

      const emailStats = {
        total: emails?.length || 0,
        unread: emails?.filter(e => e.status === 'unread').length || 0,
        drafts: emails?.filter(e => e.is_draft || e.status === 'draft').length || 0
      };

      setStats(prev => ({ ...prev, emails: emailStats }));
    } catch (error) {
      console.error('Error fetching email stats:', error);
    }
  };

  const fetchUpcomingTasks = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('jarvis_tasks')
        .select('*')
        .eq('status', 'pending')
        .not('due_date', 'is', null)
        .order('due_date', { ascending: true })
        .limit(5);

      if (error) throw error;
      setUpcomingTasks(tasks || []);
    } catch (error) {
      console.error('Error fetching upcoming tasks:', error);
    }
  };

  const fetchTodaysMeetings = async () => {
    try {
      const today = new Date();
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

      const { data: meetings, error } = await supabase
        .from('jarvis_meetings')
        .select('*')
        .gte('start_time', todayStart.toISOString())
        .lt('start_time', todayEnd.toISOString())
        .eq('status', 'scheduled')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setTodaysMeetings(meetings || []);
    } catch (error) {
      console.error('Error fetching today\'s meetings:', error);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">{getGreeting()}! 👋</h2>
          <p className="text-gray-400 mt-1">Here's your daily business brief</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchDashboardData}
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-200 text-sm">Pending Tasks</p>
                <p className="text-2xl font-bold text-white">{stats.tasks.pending}</p>
                {stats.tasks.overdue > 0 && (
                  <p className="text-red-300 text-xs">
                    {stats.tasks.overdue} overdue
                  </p>
                )}
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-200 text-sm">Today's Meetings</p>
                <p className="text-2xl font-bold text-white">{stats.meetings.today}</p>
                <p className="text-green-300 text-xs">
                  {stats.meetings.thisWeek} this week
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-900 to-purple-800 border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-white">{stats.clients.active}</p>
                {stats.clients.newThisWeek > 0 && (
                  <p className="text-purple-300 text-xs">
                    +{stats.clients.newThisWeek} this week
                  </p>
                )}
              </div>
              <Users className="w-8 h-8 text-purple-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-900 to-orange-800 border-orange-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-200 text-sm">Unread Emails</p>
                <p className="text-2xl font-bold text-white">{stats.emails.unread}</p>
                <p className="text-orange-300 text-xs">
                  {stats.emails.drafts} drafts
                </p>
              </div>
              <Mail className="w-8 h-8 text-orange-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Meetings */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Meetings
            </CardTitle>
            <CardDescription>Your scheduled meetings for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {todaysMeetings.length > 0 ? (
              todaysMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-white">{meeting.title}</h4>
                    <p className="text-sm text-gray-400">
                      {formatTime(meeting.start_time)} - {formatTime(meeting.end_time)}
                    </p>
                  </div>
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No meetings scheduled for today</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>Tasks with upcoming due dates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-white">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">
                        Due: {formatDate(task.due_date)}
                      </span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                    </div>
                  </div>
                  {new Date(task.due_date) < new Date() && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">No upcoming tasks</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and quick links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs">Add Task</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Schedule Meeting</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Users className="w-5 h-5" />
              <span className="text-xs">Add Client</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Mail className="w-5 h-5" />
              <span className="text-xs">Compose Email</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyBrief;
