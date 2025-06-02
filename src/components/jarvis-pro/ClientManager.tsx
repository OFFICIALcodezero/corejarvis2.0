
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus, Search, Edit, Trash2, Building2, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_notes: string;
  status: string;
  created_at: string;
}

const ClientManager: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    project_notes: '',
    status: 'active'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch clients",
        variant: "destructive"
      });
    } else {
      setClients(data || []);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
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

    if (editingClient) {
      const { error } = await supabase
        .from('clients')
        .update(formData)
        .eq('id', editingClient.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update client",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Client updated successfully"
        });
        setEditingClient(null);
        fetchClients();
      }
    } else {
      const { error } = await supabase
        .from('clients')
        .insert([{ ...formData, user_id: user.id }]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to add client",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Client added successfully"
        });
        setIsAddDialogOpen(false);
        fetchClients();
      }
    }

    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      project_notes: '',
      status: 'active'
    });
  };

  const handleDelete = async (clientId: string) => {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete client",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
      fetchClients();
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search clients by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/30 border-white/20 text-white"
          />
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger className="bg-black/30 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Project Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.project_notes}
                  onChange={(e) => setFormData({ ...formData, project_notes: e.target.value })}
                  className="bg-black/30 border-white/20 text-white"
                  rows={3}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full bg-cyan-500 hover:bg-cyan-600">
                Add Client
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-black/30 border-white/20 hover:border-cyan-500/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{client.name}</CardTitle>
                  {client.company && (
                    <div className="flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3 text-gray-400" />
                      <span className="text-sm text-gray-400">{client.company}</span>
                    </div>
                  )}
                </div>
                <Badge className={`${getStatusColor(client.status)} text-white text-xs`}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail className="h-3 w-3" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="h-3 w-3" />
                  {client.phone}
                </div>
              )}
              {client.project_notes && (
                <p className="text-sm text-gray-400 line-clamp-3">
                  {client.project_notes}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                  onClick={() => {
                    setEditingClient(client);
                    setFormData({
                      name: client.name,
                      email: client.email,
                      phone: client.phone,
                      company: client.company,
                      project_notes: client.project_notes,
                      status: client.status
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
                  onClick={() => handleDelete(client.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="bg-black/30 border-white/20">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
            <p className="text-gray-400 text-center mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white"
              >
                Add Your First Client
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientManager;
