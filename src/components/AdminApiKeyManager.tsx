import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AdminAuthService } from '@/services/adminAuthService';
import { SecureApiKeyService, ApiKeyEntry } from '@/services/secureApiKeyService';
import { toast } from './ui/use-toast';
import { Plus, Trash2, Key, LogOut, Shield, AlertTriangle } from 'lucide-react';

const AdminApiKeyManager: React.FC = () => {
  const [keys, setKeys] = useState<ApiKeyEntry[]>([]);
  const [newKey, setNewKey] = useState({
    service: 'groq' as 'groq' | 'elevenlabs' | 'openai' | 'pexels' | 'stability',
    key: '',
    label: '',
    maxUsage: 1000,
    expiryDate: ''
  });
  const [usageStats, setUsageStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingKey, setIsAddingKey] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [keysData, statsData] = await Promise.all([
        SecureApiKeyService.getAllKeys(),
        SecureApiKeyService.getUsageStats()
      ]);
      setKeys(keysData);
      setUsageStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load API key data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKey = async () => {
    if (!newKey.key || !newKey.label) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsAddingKey(true);

    try {
      const success = await SecureApiKeyService.addApiKey(
        newKey.service,
        newKey.key,
        newKey.label,
        newKey.maxUsage,
        newKey.expiryDate || undefined
      );

      if (success) {
        setNewKey({
          service: 'groq',
          key: '',
          label: '',
          maxUsage: 1000,
          expiryDate: ''
        });

        await loadData();
        toast({
          title: "API Key Added",
          description: `${newKey.service} key "${newKey.label}" has been added successfully`
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to add API key. Please check your inputs and try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error adding key:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while adding the API key.",
        variant: "destructive"
      });
    } finally {
      setIsAddingKey(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      const success = await SecureApiKeyService.deleteApiKey(id);
      
      if (success) {
        await loadData();
        toast({
          title: "API Key Deleted",
          description: "The API key has been removed from the system"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete API key",
          variant: "destructive"
        });
      }
    }
  };

  const handleToggleKey = async (id: string, currentStatus: boolean) => {
    const success = await SecureApiKeyService.updateApiKey(id, { is_active: !currentStatus });
    
    if (success) {
      await loadData();
      toast({
        title: currentStatus ? "Key Deactivated" : "Key Activated",
        description: `API key has been ${currentStatus ? 'deactivated' : 'activated'}`
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive"
      });
    }
  };

  const handleCleanup = async () => {
    const removed = await SecureApiKeyService.cleanupInactiveKeys();
    await loadData();
    toast({
      title: "Cleanup Complete",
      description: `Removed ${removed} inactive API keys`
    });
  };

  const handleLogout = () => {
    AdminAuthService.logout();
    window.location.reload();
  };

  const getStatusColor = (key: ApiKeyEntry) => {
    if (!key.is_active) return 'text-red-500';
    if (key.expiry_date && new Date(key.expiry_date) < new Date()) return 'text-orange-500';
    if (key.usage_count >= key.max_usage * 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getUsagePercentage = (key: ApiKeyEntry) => {
    return Math.round((key.usage_count / key.max_usage) * 100);
  };

  const getServiceDisplayInfo = (service: string) => {
    const serviceInfo: { [key: string]: { name: string; interface: string; color: string } } = {
      'groq': { name: 'Groq AI', interface: 'Chat Interface', color: 'text-blue-400' },
      'openai': { name: 'OpenAI', interface: 'Chat Interface', color: 'text-green-400' },
      'elevenlabs': { name: 'ElevenLabs', interface: 'Voice Interface', color: 'text-purple-400' },
      'pexels': { name: 'Pexels', interface: 'Video Maker', color: 'text-orange-400' },
      'stability': { name: 'Stability AI', interface: 'Image Generation', color: 'text-pink-400' }
    };
    return serviceInfo[service] || { name: service, interface: 'Unknown', color: 'text-gray-400' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-red-400">JARVIS Admin Panel</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-red-500/30 text-red-400">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          {Object.entries(usageStats).map(([service, stats]: [string, any]) => {
            const serviceInfo = getServiceDisplayInfo(service);
            return (
              <Card key={service} className="bg-black/40 border-green-500/30">
                <CardHeader className="pb-2">
                  <CardTitle className={`${serviceInfo.color} text-sm capitalize`}>
                    {serviceInfo.name}
                  </CardTitle>
                  <p className="text-xs text-gray-500">{serviceInfo.interface}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Total: {stats.total}</span>
                    <span className="text-green-400">Active: {stats.active}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add New Key */}
        <Card className="bg-black/40 border-blue-500/30 mb-6">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New API Key
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <Label className="text-blue-400">Service</Label>
                <Select value={newKey.service} onValueChange={(value: any) => setNewKey({...newKey, service: value})}>
                  <SelectTrigger className="bg-gray-900/50 border-blue-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="groq">Groq AI (Chat)</SelectItem>
                    <SelectItem value="openai">OpenAI (Chat)</SelectItem>
                    <SelectItem value="elevenlabs">ElevenLabs (Voice)</SelectItem>
                    <SelectItem value="pexels">Pexels (Video)</SelectItem>
                    <SelectItem value="stability">Stability AI (Images)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-blue-400">Label</Label>
                <Input
                  value={newKey.label}
                  onChange={(e) => setNewKey({...newKey, label: e.target.value})}
                  placeholder="e.g., Primary Groq Key"
                  className="bg-gray-900/50 border-blue-500/30 text-white"
                />
              </div>
              
              <div>
                <Label className="text-blue-400">API Key</Label>
                <Input
                  type="password"
                  value={newKey.key}
                  onChange={(e) => setNewKey({...newKey, key: e.target.value})}
                  placeholder="Enter API key"
                  className="bg-gray-900/50 border-blue-500/30 text-white font-mono"
                />
              </div>
              
              <div>
                <Label className="text-blue-400">Max Usage</Label>
                <Input
                  type="number"
                  value={newKey.maxUsage}
                  onChange={(e) => setNewKey({...newKey, maxUsage: parseInt(e.target.value) || 1000})}
                  className="bg-gray-900/50 border-blue-500/30 text-white"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  onClick={handleAddKey} 
                  disabled={isAddingKey || !newKey.key || !newKey.label}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAddingKey ? (
                    <div className="flex items-center">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Adding...
                    </div>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Key
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Keys List */}
        <Card className="bg-black/40 border-green-500/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-green-400 flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Database-Managed API Keys
            </CardTitle>
            <Button onClick={handleCleanup} variant="outline" size="sm" className="border-orange-500/30 text-orange-400">
              <Trash2 className="h-4 w-4 mr-2" />
              Cleanup Inactive
            </Button>
          </CardHeader>
          <CardContent>
            {keys.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-yellow-500" />
                <p>No API keys configured</p>
                <p className="text-sm">Add your first API key above to get started</p>
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((key) => {
                  const serviceInfo = getServiceDisplayInfo(key.service);
                  return (
                    <div key={key.id} className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-white font-medium">{key.label}</h4>
                          <p className={`text-sm ${serviceInfo.color}`}>
                            {serviceInfo.name} → {serviceInfo.interface}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleToggleKey(key.id, key.is_active)}
                            size="sm"
                            variant="outline"
                            className={`border-${key.is_active ? 'red' : 'green'}-500/30 text-${key.is_active ? 'red' : 'green'}-400`}
                          >
                            {key.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            onClick={() => handleDeleteKey(key.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-500/30 text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">Status: </span>
                          <span className={getStatusColor(key)}>
                            {key.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Usage: </span>
                          <span className="text-white">
                            {key.usage_count}/{key.max_usage} ({getUsagePercentage(key)}%)
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Added: </span>
                          <span className="text-white">
                            {new Date(key.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Used: </span>
                          <span className="text-white">
                            {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Usage Progress Bar */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              getUsagePercentage(key) >= 90 ? 'bg-red-500' : 
                              getUsagePercentage(key) >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${getUsagePercentage(key)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminApiKeyManager;
