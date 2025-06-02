
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Mail, Plus, Send, RefreshCw, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Email {
  id: string;
  subject: string;
  sender: string;
  recipient: string;
  content: string;
  status: string;
  is_draft: boolean;
  created_at: string;
}

const EmailAssistant: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    recipient: '',
    content: ''
  });

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    const { data, error } = await supabase
      .from('email_threads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch emails",
        variant: "destructive"
      });
    } else {
      setEmails(data || []);
    }
  };

  const handleSendEmail = async (isDraft = false) => {
    if (!formData.subject.trim() || !formData.recipient.trim() || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
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

    const { error } = await supabase
      .from('email_threads')
      .insert([{
        ...formData,
        user_id: user.id,
        sender: user.email || 'me@example.com',
        status: isDraft ? 'draft' : 'sent',
        is_draft: isDraft
      }]);

    if (error) {
      toast({
        title: "Error",
        description: `Failed to ${isDraft ? 'save draft' : 'send email'}`,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: `Email ${isDraft ? 'saved as draft' : 'sent'} successfully`
      });
      setIsComposeOpen(false);
      setFormData({ subject: '', recipient: '', content: '' });
      fetchEmails();
    }
  };

  const generateAIReply = async (originalEmail: Email) => {
    // Simulate AI-generated reply
    const aiSuggestions = [
      "Thank you for your email. I'll review this and get back to you within 24 hours.",
      "I appreciate you reaching out. Let me check on this and provide you with an update shortly.",
      "Thanks for bringing this to my attention. I'll look into this matter and respond with details soon.",
      "I received your message and will address your concerns promptly. Expect a detailed response within the next business day."
    ];
    
    const randomReply = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
    
    setFormData({
      subject: `Re: ${originalEmail.subject}`,
      recipient: originalEmail.sender,
      content: randomReply
    });
    setIsComposeOpen(true);
    
    toast({
      title: "AI Reply Generated",
      description: "Review and customize the generated reply before sending"
    });
  };

  const markAsRead = async (emailId: string) => {
    const { error } = await supabase
      .from('email_threads')
      .update({ status: 'read' })
      .eq('id', emailId);

    if (!error) {
      fetchEmails();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const unreadEmails = emails.filter(email => email.status === 'unread');
  const draftEmails = emails.filter(email => email.is_draft);
  const sentEmails = emails.filter(email => !email.is_draft && email.status === 'sent');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-white mb-2">Email Assistant</h3>
          <p className="text-gray-400">Manage your email communications with AI assistance</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={fetchEmails} variant="outline" className="border-white/20 text-white hover:bg-white/10">
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2">
                <Plus className="h-4 w-4" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Compose Email</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recipient">To</Label>
                  <Input
                    id="recipient"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="bg-black/30 border-white/20 text-white"
                    placeholder="recipient@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-black/30 border-white/20 text-white"
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="content">Message</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="bg-black/30 border-white/20 text-white"
                    rows={8}
                    placeholder="Type your message here..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleSendEmail(false)} 
                    className="flex-1 bg-cyan-500 hover:bg-cyan-600 gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Send
                  </Button>
                  <Button 
                    onClick={() => handleSendEmail(true)} 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Save Draft
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unread</p>
                <p className="text-2xl font-bold text-white">{unreadEmails.length}</p>
              </div>
              <Mail className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Drafts</p>
                <p className="text-2xl font-bold text-white">{draftEmails.length}</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Sent</p>
                <p className="text-2xl font-bold text-white">{sentEmails.length}</p>
              </div>
              <Mail className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inbox */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-orange-500" />
              Inbox ({unreadEmails.length} unread)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {emails.filter(email => !email.is_draft).map((email) => (
                <div
                  key={email.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    email.status === 'unread' 
                      ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => {
                    setSelectedEmail(email);
                    if (email.status === 'unread') {
                      markAsRead(email.id);
                    }
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className={`font-medium ${email.status === 'unread' ? 'text-white' : 'text-gray-300'} line-clamp-1`}>
                        {email.subject}
                      </h4>
                      <p className="text-sm text-gray-400">From: {email.sender}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-gray-400">{formatDate(email.created_at)}</span>
                      {email.status === 'unread' && (
                        <Badge className="bg-orange-500 text-white text-xs">New</Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2">{email.content}</p>
                  {!email.is_draft && (
                    <Button
                      size="sm"
                      className="mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30"
                      onClick={(e) => {
                        e.stopPropagation();
                        generateAIReply(email);
                      }}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Reply
                    </Button>
                  )}
                </div>
              ))}
              {emails.filter(email => !email.is_draft).length === 0 && (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-400">No emails yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Details / Drafts */}
        <Card className="bg-black/30 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {selectedEmail ? 'Email Details' : `Drafts (${draftEmails.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEmail ? (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">{selectedEmail.subject}</h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>From: {selectedEmail.sender}</p>
                    <p>To: {selectedEmail.recipient}</p>
                    <p>Date: {formatDate(selectedEmail.created_at)}</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <p className="text-white whitespace-pre-wrap">{selectedEmail.content}</p>
                </div>
                <Button
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
                  onClick={() => generateAIReply(selectedEmail)}
                >
                  <Sparkles className="h-4 w-4" />
                  Generate AI Reply
                </Button>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {draftEmails.map((draft) => (
                  <div
                    key={draft.id}
                    className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors"
                    onClick={() => {
                      setFormData({
                        subject: draft.subject,
                        recipient: draft.recipient,
                        content: draft.content
                      });
                      setIsComposeOpen(true);
                    }}
                  >
                    <h4 className="font-medium text-white line-clamp-1">{draft.subject}</h4>
                    <p className="text-sm text-gray-400">To: {draft.recipient}</p>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">{draft.content}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{formatDate(draft.created_at)}</span>
                      <Badge className="bg-blue-500 text-white text-xs">Draft</Badge>
                    </div>
                  </div>
                ))}
                {draftEmails.length === 0 && (
                  <div className="text-center py-8">
                    <Mail className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">No drafts saved</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailAssistant;
