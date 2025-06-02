
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Mail, Send, Reply, Archive, Inbox, Draft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  thread_id: string;
  status: string;
  is_draft: boolean;
  created_at: string;
}

const EmailAssistant: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'drafts'>('all');
  const [formData, setFormData] = useState({
    subject: '',
    recipient: '',
    content: '',
    is_draft: false
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('jarvis_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (error) {
      console.error('Error fetching emails:', error);
      toast.error('Failed to load emails');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('jarvis_emails')
        .insert([{
          ...formData,
          sender: user.email || 'unknown@example.com',
          user_id: user.id,
          status: formData.is_draft ? 'draft' : 'sent'
        }]);

      if (error) throw error;
      
      toast.success(formData.is_draft ? 'Draft saved successfully' : 'Email sent successfully');
      setFormData({ subject: '', recipient: '', content: '', is_draft: false });
      setIsComposeOpen(false);
      fetchEmails();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Failed to send email');
    }
  };

  const generateReply = async (originalEmail: Email) => {
    try {
      // Simulate AI-generated reply
      const replyContent = `Thank you for your email regarding "${originalEmail.subject}". I will review your message and get back to you shortly.

Best regards,
Your Assistant`;

      setFormData({
        subject: `Re: ${originalEmail.subject}`,
        recipient: originalEmail.sender,
        content: replyContent,
        is_draft: true
      });
      setIsComposeOpen(true);
      toast.info('AI reply generated! You can edit it before sending.');
    } catch (error) {
      console.error('Error generating reply:', error);
      toast.error('Failed to generate reply');
    }
  };

  const markAsRead = async (emailId: string) => {
    try {
      const { error } = await supabase
        .from('jarvis_emails')
        .update({ status: 'read' })
        .eq('id', emailId);

      if (error) throw error;
      fetchEmails();
    } catch (error) {
      console.error('Error marking email as read:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unread': return 'bg-blue-500';
      case 'read': return 'bg-gray-500';
      case 'draft': return 'bg-yellow-500';
      case 'sent': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredEmails = emails.filter(email => {
    switch (filter) {
      case 'unread': return email.status === 'unread';
      case 'drafts': return email.is_draft || email.status === 'draft';
      default: return true;
    }
  });

  const emailStats = {
    total: emails.length,
    unread: emails.filter(e => e.status === 'unread').length,
    drafts: emails.filter(e => e.is_draft || e.status === 'draft').length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Email Assistant</h2>
          <p className="text-gray-400">Manage your emails with AI assistance</p>
        </div>
        
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Compose Email
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-white">Compose Email</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <Input
                placeholder="To: recipient@example.com"
                value={formData.recipient}
                onChange={(e) => setFormData({...formData, recipient: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Textarea
                placeholder="Email content..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white min-h-[200px]"
              />
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  onClick={() => setFormData({...formData, is_draft: false})}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
                <Button 
                  type="submit" 
                  variant="outline"
                  onClick={() => setFormData({...formData, is_draft: true})}
                  className="flex items-center gap-2"
                >
                  <Draft className="w-4 h-4" />
                  Save Draft
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Email Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-white">{emailStats.total}</div>
            <p className="text-gray-400 text-sm">Total Emails</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-400">{emailStats.unread}</div>
            <p className="text-gray-400 text-sm">Unread</p>
          </CardContent>
        </Card>
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-400">{emailStats.drafts}</div>
            <p className="text-gray-400 text-sm">Drafts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        {['all', 'unread', 'drafts'].map((filterOption) => (
          <Button
            key={filterOption}
            variant={filter === filterOption ? 'default' : 'outline'}
            onClick={() => setFilter(filterOption as any)}
            className="capitalize flex items-center gap-2"
          >
            {filterOption === 'all' && <Inbox className="w-4 h-4" />}
            {filterOption === 'unread' && <Mail className="w-4 h-4" />}
            {filterOption === 'drafts' && <Draft className="w-4 h-4" />}
            {filterOption}
          </Button>
        ))}
      </div>

      {/* Emails List */}
      <div className="space-y-4">
        {filteredEmails.map((email) => (
          <Card 
            key={email.id} 
            className={`bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-750 ${
              email.status === 'unread' ? 'border-l-4 border-l-blue-500' : ''
            }`}
            onClick={() => {
              setSelectedEmail(email);
              if (email.status === 'unread') markAsRead(email.id);
            }}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold text-white ${email.status === 'unread' ? 'font-bold' : ''}`}>
                      {email.subject}
                    </h4>
                    <Badge className={`${getStatusColor(email.status)} text-white`}>
                      {email.is_draft ? 'Draft' : email.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                    <span><strong>From:</strong> {email.sender}</span>
                    <span><strong>To:</strong> {email.recipient}</span>
                    <span>{new Date(email.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-300 line-clamp-2">{email.content}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      generateReply(email);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Reply className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(email.id);
                    }}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Archive className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Email Detail Dialog */}
      {selectedEmail && (
        <Dialog open={!!selectedEmail} onOpenChange={() => setSelectedEmail(null)}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-white">{selectedEmail.subject}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-400">
                <p><strong>From:</strong> {selectedEmail.sender}</p>
                <p><strong>To:</strong> {selectedEmail.recipient}</p>
                <p><strong>Date:</strong> {new Date(selectedEmail.created_at).toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg">
                <p className="text-white whitespace-pre-wrap">{selectedEmail.content}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => generateReply(selectedEmail)}
                  className="flex items-center gap-2"
                >
                  <Reply className="w-4 h-4" />
                  Generate Reply
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedEmail(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {filteredEmails.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {filter === 'all' ? 'No emails yet.' : `No ${filter} emails.`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailAssistant;
