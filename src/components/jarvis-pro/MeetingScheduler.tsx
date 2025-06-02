
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, Clock, Users, Edit, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
    meeting_notes: ''
  });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meetings",
        variant: "destructive"
      });
    } else {
      setMeetings(data || []);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.start_time || !formData.end_time) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in",
        variant: "destructive"
      });
      return;
    }

    const attendeesArray = formData.attendees.split(',').map(email => email.trim()).filter(Boolean);

    const meetingData = {
      ...formData,
      user_id: user.id,
      attendees: attendeesArray,
      status: 'scheduled'
    };

    if (editingMeeting) {
      const { error } = await supabase
        .from('meetings')
        .update(meetingData)
        .eq('id', editingMeeting.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update meeting",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Meeting updated successfully"
        });
        setEditingMeeting(null);
        fetchMeetings();
      }
    } else {
      const { error } = await supabase
        .from('meetings')
        .insert([meetingData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to schedule meeting",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Meeting scheduled successfully"
        });
        setIsAddDialogOpen(false);
        fetchMeetings();
      }
    }

    setFormData({
      title: '',
      description: '',
      start_time: '',
      end_time: '',
      attendees: '',
      meeting_notes: ''
    });
  };

  const handleDelete = async (meetingId: string) => {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meetingId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete meeting",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Meeting deleted successfully"
      });
      fetchMeetings();
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatTimeRange = (start: string, end: string) => {
    const startTime = new Date(start).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    const endTime = new Date(end).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    return `${startTime} - ${endTime}`;
  };

  const isUpcoming = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  const upcomingMeetings = meetings.filter(meeting => isUpcoming(meeting.start_time));
  const pastMeetings = meetings.filter(meeting => !isUpcoming(meeting.start_time));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Meeting Scheduler</h3>
          <p className="text-gray-400">Manage your meetings and appointments</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Schedule Meeting
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingMeeting ? 'Edit Meeting' : 'Schedule New Meeting'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Meeting Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  placeholder="Weekly team standup"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  rows={3}
                  placeholder="Meeting agenda and details"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time *</Label>
                  <Input
                    id="start_time"
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time *</Label>
                  <Input
                    id="end_time"
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    className="bg-black/30 border-white/20 text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="attendees">Attendees (comma-separated emails)</Label>
                <Input
                  id="attendees"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  placeholder="john@example.com, sarah@example.com"
                />
              </div>
              <div>
                <Label htmlFor="meeting_notes">Meeting Notes</Label>
                <Textarea
                  id="meeting_notes"
                  value={formData.meeting_notes}
                  onChange={(e) => setFormData({ ...formData, meeting_notes: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  rows={3}
                  placeholder="Add notes or action items"
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-cyan-500 hover:bg-cyan-600">
                {editingMeeting ? 'Update Meeting' : 'Schedule Meeting'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Meeting Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Upcoming Meetings</p>
                <p className="text-2xl font-bold text-white">{upcomingMeetings.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Past Meetings</p>
                <p className="text-2xl font-bold text-white">{pastMeetings.length}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meeting Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Meetings */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{meeting.title}</h4>
                      <p className="text-sm text-gray-400">{meeting.description}</p>
                    </div>
                    <Badge className="bg-cyan-500 text-white">
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(meeting.start_time)}
                    </div>
                    <div className="text-sm text-gray-400 ml-5">
                      Duration: {formatTimeRange(meeting.start_time, meeting.end_time)}
                    </div>
                    {meeting.attendees.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-3 w-3" />
                        {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-white/20 text-white hover:bg-white/10"
                      onClick={() => {
                        setEditingMeeting(meeting);
                        setFormData({
                          title: meeting.title,
                          description: meeting.description,
                          start_time: meeting.start_time.slice(0, 16),
                          end_time: meeting.end_time.slice(0, 16),
                          attendees: meeting.attendees.join(', '),
                          meeting_notes: meeting.meeting_notes
                        });
                        setIsAddDialogOpen(true);
                      }}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                      onClick={() => handleDelete(meeting.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No upcoming meetings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Past Meetings */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Past Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {pastMeetings.map((meeting) => (
                <div key={meeting.id} className="p-4 bg-white/5 border border-white/10 rounded-lg opacity-75">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white">{meeting.title}</h4>
                      <p className="text-sm text-gray-400">{meeting.description}</p>
                    </div>
                    <Badge className="bg-gray-500 text-white">
                      Completed
                    </Badge>
                  </div>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatDateTime(meeting.start_time)}
                    </div>
                    {meeting.attendees.length > 0 && (
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Users className="h-3 w-3" />
                        {meeting.attendees.length} attendee{meeting.attendees.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {meeting.meeting_notes && (
                    <div className="text-sm text-gray-400 p-2 bg-black/20 rounded border border-white/10">
                      <strong>Notes:</strong> {meeting.meeting_notes}
                    </div>
                  )}
                </div>
              ))}
              {pastMeetings.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No past meetings</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingScheduler;
