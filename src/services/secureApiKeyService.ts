
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ApiKeyEntry {
  id: string;
  service: 'groq' | 'elevenlabs' | 'openai' | 'pexels' | 'stability';
  key_value: string;
  label: string;
  is_active: boolean;
  usage_count: number;
  max_usage: number;
  expiry_date?: string;
  created_at: string;
  last_used_at?: string;
  created_by?: string;
}

export class SecureApiKeyService {
  // Admin methods for managing keys
  static async addApiKey(
    service: 'groq' | 'elevenlabs' | 'openai' | 'pexels' | 'stability', 
    key: string, 
    label: string, 
    maxUsage: number = 1000, 
    expiryDate?: string
  ): Promise<boolean> {
    try {
      console.log('SecureApiKeyService.addApiKey called with:', {
        service,
        label,
        maxUsage,
        keyLength: key.length,
        expiryDate
      });

      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error('Error getting user:', userError);
        return false;
      }

      const insertData = {
        service,
        key_value: key,
        label,
        max_usage: maxUsage,
        expiry_date: expiryDate || null,
        created_by: userData.user?.id || null,
        is_active: true,
        usage_count: 0
      };

      console.log('Inserting data into api_keys table:', {
        ...insertData,
        key_value: '[REDACTED]'
      });

      const { data, error } = await supabase
        .from('api_keys')
        .insert(insertData)
        .select();

      if (error) {
        console.error('Supabase error adding API key:', error);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        console.error('Error message:', error.message);
        return false;
      }

      console.log('API key inserted successfully:', data);
      console.log(`Admin added new ${service} API key: ${label}`);
      return true;
    } catch (error) {
      console.error('Exception in addApiKey:', error);
      return false;
    }
  }

  static async updateApiKey(id: string, updates: Partial<ApiKeyEntry>): Promise<boolean> {
    try {
      console.log('Updating API key:', id, updates);
      
      const { error } = await supabase
        .from('api_keys')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating API key:', error);
        return false;
      }

      console.log(`Admin updated API key: ${id}`);
      return true;
    } catch (error) {
      console.error('Error updating API key:', error);
      return false;
    }
  }

  static async deleteApiKey(id: string): Promise<boolean> {
    try {
      console.log('Deleting API key:', id);
      
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting API key:', error);
        return false;
      }

      console.log(`Admin deleted API key: ${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting API key:', error);
      return false;
    }
  }

  static async getAllKeys(): Promise<ApiKeyEntry[]> {
    try {
      console.log('Fetching all API keys...');
      
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching API keys:', error);
        return [];
      }

      console.log(`Fetched ${data?.length || 0} API keys`);
      
      // Type assertion to ensure service field matches our union type
      return (data || []).map(key => ({
        ...key,
        service: key.service as 'groq' | 'elevenlabs' | 'openai' | 'pexels' | 'stability'
      }));
    } catch (error) {
      console.error('Error fetching API keys:', error);
      return [];
    }
  }

  // User methods for accessing keys (internal use only)
  static async getActiveKey(service: 'groq' | 'elevenlabs' | 'openai' | 'pexels' | 'stability'): Promise<string | null> {
    try {
      console.log(`Getting active key for service: ${service}`);
      
      // Use the database function to get and update usage
      const { data, error } = await supabase.rpc('get_active_api_key', {
        service_name: service
      });

      if (error) {
        console.error(`Error getting ${service} API key:`, error);
        this.handleNoValidKeys(service);
        return null;
      }

      if (!data) {
        console.log(`No active key found for ${service}`);
        this.handleNoValidKeys(service);
        return null;
      }

      console.log(`Found active key for ${service}`);
      return data;
    } catch (error) {
      console.error(`Error getting ${service} API key:`, error);
      this.handleNoValidKeys(service);
      return null;
    }
  }

  private static handleNoValidKeys(service: string): void {
    console.error(`No valid ${service} API keys available`);
    
    // Map service to user-friendly interface names
    const serviceInterfaceMap: { [key: string]: string } = {
      'groq': 'Chat Interface',
      'openai': 'Chat Interface', 
      'elevenlabs': 'Voice Interface',
      'pexels': 'Video Maker',
      'stability': 'Image Generation'
    };
    
    const interfaceName = serviceInterfaceMap[service] || service;
    
    toast({
      title: "API Service Unavailable",
      description: `${interfaceName} features require ${service} API keys. Please contact your administrator or configure keys in the admin panel.`,
      variant: "destructive"
    });
  }

  // Get usage statistics for admin
  static async getUsageStats(): Promise<{ [service: string]: { total: number; active: number; expired: number } }> {
    try {
      const keys = await this.getAllKeys();
      const stats: { [service: string]: { total: number; active: number; expired: number } } = {};
      
      keys.forEach(key => {
        if (!stats[key.service]) {
          stats[key.service] = { total: 0, active: 0, expired: 0 };
        }
        
        stats[key.service].total++;
        if (key.is_active && !this.isKeyExpired(key)) {
          stats[key.service].active++;
        } else {
          stats[key.service].expired++;
        }
      });
      
      return stats;
    } catch (error) {
      console.error('Error getting usage stats:', error);
      return {};
    }
  }

  private static isKeyExpired(key: ApiKeyEntry): boolean {
    if (!key.expiry_date) return false;
    const expired = new Date(key.expiry_date) < new Date();
    if (expired && key.is_active) {
      // Automatically deactivate expired keys
      this.updateApiKey(key.id, { is_active: false });
      console.log(`API key ${key.label} expired and was deactivated`);
    }
    return expired;
  }

  // Clean up expired/inactive keys (admin utility)
  static async cleanupInactiveKeys(): Promise<number> {
    try {
      const keys = await this.getAllKeys();
      const inactiveKeys = keys.filter(k => !k.is_active || this.isKeyExpired(k));
      
      for (const key of inactiveKeys) {
        await this.deleteApiKey(key.id);
      }
      
      console.log(`Cleaned up ${inactiveKeys.length} inactive API keys`);
      return inactiveKeys.length;
    } catch (error) {
      console.error('Error cleaning up keys:', error);
      return 0;
    }
  }
}
