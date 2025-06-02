
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Phone, Mail, Building } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  project_notes: string;
  status: string;
  created_at: string;
  updated_at: string;
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
    try {
      const { data, error } = await supabase
        .from('jarvis_clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Failed to load clients');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      if (editingClient) {
        const { error } = await supabase
          .from('jarvis_clients')
          .update(formData)
          .eq('id', editingClient.id);

        if (error) throw error;
        toast.success('Client updated successfully');
      } else {
        const { error } = await supabase
          .from('jarvis_clients')
          .insert([{ ...formData, user_id: user.id }]);

        if (error) throw error;
        toast.success('Client added successfully');
      }

      setFormData({ name: '', email: '', phone: '', company: '', project_notes: '', status: 'active' });
      setIsAddDialogOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
      toast.error('Failed to save client');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;

    try {
      const { error } = await supabase
        .from('jarvis_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Client deleted successfully');
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Failed to delete client');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      project_notes: client.project_notes || '',
      status: client.status
    });
    setIsAddDialogOpen(true);
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Client Manager</h2>
          <p className="text-gray-400">Manage your client relationships and projects</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Client Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
              />
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Textarea
                placeholder="Project Notes"
                value={formData.project_notes}
                onChange={(e) => setFormData({...formData, project_notes: e.target.value})}
                className="bg-gray-800 border-gray-600 text-white"
                rows={3}
              />
              <Button type="submit" className="w-full">
                {editingClient ? 'Update Client' : 'Add Client'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search clients by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-600 text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{client.name}</CardTitle>
                  {client.company && (
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Building className="w-3 h-3" />
                      {client.company}
                    </CardDescription>
                  )}
                </div>
                <Badge className={`${getStatusColor(client.status)} text-white`}>
                  {client.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {client.email && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Mail className="w-3 h-3" />
                  {client.email}
                </div>
              )}
              {client.phone && (
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Phone className="w-3 h-3" />
                  {client.phone}
                </div>
              )}
              {client.project_notes && (
                <p className="text-sm text-gray-400 line-clamp-2">
                  {client.project_notes}
                </p>
              )}
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-gray-500">
                  Added {new Date(client.created_at).toLocaleDateString()}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(client)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(client.id)}
                    className="border-red-600 text-red-400 hover:bg-red-900"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchTerm ? 'No clients found matching your search.' : 'No clients yet. Add your first client to get started.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientManager;
