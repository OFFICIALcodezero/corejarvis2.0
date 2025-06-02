
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, Users, MapPin, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Meeting {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  attendees: string[];
  meeting_notes: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const MeetingScheduler: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<Meeting | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
    attendees: '',
    meeting_notes: '',
    status: 'scheduled'
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_meetings')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setMeetings(data || []);
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('Failed to load meetings');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const attendeesList = formData.attendees.split(',').map(a => a.trim()).filter(a => a);
      const meetingData = {
        ...formData,
        attendees: attendeesList,
        user_id: user.id
      };

      if (editingMeeting) {
        const { error } = await supabase
          .from('jarvis_meetings')
          .update(meetingData)
          .eq('id', editingMeeting.id);

        if (error) throw error;
        toast.success('Meeting updated successfully');
      } else {
        const { error } = await supabase
          .from('jarvis_meetings')
          .insert([meetingData]);

        if (error) throw error;
        toast.success('Meeting scheduled successfully');
      }

      setFormData({ title: '', description: '', start_time: '', end_time: '', attendees: '', meeting_notes: '', status: 'scheduled' });
      setIsAddDialogOpen(false);
      setEditingMeeting(null);
      fetchMeetings();
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast.error('Failed to save meeting');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meeting?')) return;

    try {
      const { error } = await supabase
        .from('jarvis_meetings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Meeting deleted successfully');
      fetchMeetings();
    } catch (error) {
      console.error('Error deleting meeting:', error);
      toast.error('Failed to delete meeting');
    }
  };

  const handleEdit = (meeting: Meeting) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      description: meeting.description || '',
      start_time: meeting.start_time ? new Date(meeting.start_time).toISOString().slice(0, 16) : '',
      end_time: meeting.end_time ? new Date(meeting.end_time).toISOString().slice(0, 16) : '',
      attendees: meeting.attendees?.join(', ') || '',
      meeting_notes: meeting.meeting_notes || '',
      status: meeting.status
    });
    setIsAddDialogOpen(true);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const upcomingMeetings = meetings.filter(meeting => 
    new Date(meeting.start_time) > new Date() && meeting.status === 'scheduled'
  );

  const todaysMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.start_time).toDateString();
    const today = new Date().toDateString();
    return meetingDate === today && meeting.status === 'scheduled';
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Meeting Scheduler</h2>
          <p className="text-gray-400">Manage your meetings and calendar events</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Meeting Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Meeting Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Start Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">End Time</label>
                  <Input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                    required
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
              <Input
                placeholder="Attendees (comma separated emails)"
                value={formData.attendees}
                onChange={(e) => setFormData({...formData, attendees: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Meeting Notes"
                value={formData.meeting_notes}
                onChange={(e) => setFormData({...formData, meeting_notes: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
              <Button type="submit" className="w-full">
                {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{todaysMeetings.length}</div>
            <p className="text-gray-400 text-sm">Today's Meetings</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{upcomingMeetings.length}</div>
            <p className="text-gray-400 text-sm">Upcoming</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-400">{meetings.filter(m => m.status === 'completed').length}</div>
            <p className="text-gray-400 text-sm">Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Meetings */}
      {todaysMeetings.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Today's Meetings</h3>
          <div className="grid gap-4">
            {todaysMeetings.map((meeting) => {
              const { date, time } = formatDateTime(meeting.start_time);
              const endTime = formatDateTime(meeting.end_time);
              
              return (
                <Card key={meeting.id} className="bg-gray-800 border-gray-700 border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white text-lg">{meeting.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {time} - {endTime.time}
                          </div>
                          {meeting.attendees && meeting.attendees.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {meeting.attendees.length} attendees
                            </div>
                          )}
                        </div>
                        {meeting.description && (
                          <p className="text-gray-300 mt-2">{meeting.description}</p>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(meeting.status)} text-white ml-4`}>
                        {meeting.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All Meetings */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">All Meetings</h3>
        <div className="grid gap-4">
          {meetings.map((meeting) => {
            const { date, time } = formatDateTime(meeting.start_time);
            const endTime = formatDateTime(meeting.end_time);
            
            return (
              <Card key={meeting.id} className="bg-gray-800 border-gray-700">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white text-lg">{meeting.title}</h4>
                        <Badge className={`${getStatusColor(meeting.status)} text-white`}>
                          {meeting.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {time} - {endTime.time}
                        </div>
                        {meeting.attendees && meeting.attendees.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {meeting.attendees.length} attendees
                          </div>
                        )}
                      </div>
                      {meeting.description && (
                        <p className="text-gray-300 mb-2">{meeting.description}</p>
                      )}
                      {meeting.attendees && meeting.attendees.length > 0 && (
                        <div className="text-sm text-gray-400">
                          <strong>Attendees:</strong> {meeting.attendees.join(', ')}
                        </div>
                      )}
                      {meeting.meeting_notes && (
                        <div className="mt-2 p-2 bg-gray-700 rounded text-sm">
                          <strong className="text-gray-300">Notes:</strong>
                          <p className="text-gray-400 mt-1">{meeting.meeting_notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(meeting)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-700"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(meeting.id)}
                        className="border-red-600 text-red-400 hover:bg-red-900"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {meetings.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No meetings scheduled. Create your first meeting to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MeetingScheduler;
