
import { toast } from '@/components/ui/use-toast';

export interface ApiKeyEntry {
  id: string;
  service: 'groq' | 'elevenlabs' | 'openai';
  key: string;
  label: string;
  isActive: boolean;
  usageCount: number;
  maxUsage: number;
  expiryDate?: string;
  addedAt: string;
  lastUsed?: string;
}

export class SecureApiKeyService {
  private static readonly STORAGE_KEY = 'jarvis_secure_api_keys';
  private static readonly USAGE_LOG_KEY = 'jarvis_api_usage_log';

  // Admin methods for managing keys
  static addApiKey(service: 'groq' | 'elevenlabs' | 'openai', key: string, label: string, maxUsage: number = 1000, expiryDate?: string): void {
    const keys = this.getAllKeys();
    const newKey: ApiKeyEntry = {
      id: Date.now().toString(),
      service,
      key,
      label,
      isActive: true,
      usageCount: 0,
      maxUsage,
      expiryDate,
      addedAt: new Date().toISOString()
    };
    
    keys.push(newKey);
    this.saveKeys(keys);
    console.log(`Admin added new ${service} API key: ${label}`);
  }

  static updateApiKey(id: string, updates: Partial<ApiKeyEntry>): void {
    const keys = this.getAllKeys();
    const keyIndex = keys.findIndex(k => k.id === id);
    if (keyIndex !== -1) {
      keys[keyIndex] = { ...keys[keyIndex], ...updates };
      this.saveKeys(keys);
      console.log(`Admin updated API key: ${id}`);
    }
  }

  static deleteApiKey(id: string): void {
    const keys = this.getAllKeys().filter(k => k.id !== id);
    this.saveKeys(keys);
    console.log(`Admin deleted API key: ${id}`);
  }

  static getAllKeys(): ApiKeyEntry[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // User methods for accessing keys (internal use only)
  static getActiveKey(service: 'groq' | 'elevenlabs' | 'openai'): string | null {
    const keys = this.getAllKeys()
      .filter(k => k.service === service && k.isActive)
      .filter(k => !this.isKeyExpired(k))
      .filter(k => k.usageCount < k.maxUsage)
      .sort((a, b) => a.usageCount - b.usageCount); // Use least used key first

    if (keys.length === 0) {
      this.handleNoValidKeys(service);
      return null;
    }

    const selectedKey = keys[0];
    this.incrementUsage(selectedKey.id);
    return selectedKey.key;
  }

  static incrementUsage(keyId: string): void {
    const keys = this.getAllKeys();
    const keyIndex = keys.findIndex(k => k.id === keyId);
    if (keyIndex !== -1) {
      keys[keyIndex].usageCount++;
      keys[keyIndex].lastUsed = new Date().toISOString();
      
      // Check if key reached limit
      if (keys[keyIndex].usageCount >= keys[keyIndex].maxUsage) {
        keys[keyIndex].isActive = false;
        console.log(`API key ${keys[keyIndex].label} has reached usage limit and was deactivated`);
      }
      
      this.saveKeys(keys);
    }
  }

  private static isKeyExpired(key: ApiKeyEntry): boolean {
    if (!key.expiryDate) return false;
    const expired = new Date(key.expiryDate) < new Date();
    if (expired) {
      // Automatically deactivate expired keys
      this.updateApiKey(key.id, { isActive: false });
      console.log(`API key ${key.label} expired and was deactivated`);
    }
    return expired;
  }

  private static handleNoValidKeys(service: string): void {
    console.error(`No valid ${service} API keys available`);
    
    // Log for admin notification
    const log = {
      timestamp: new Date().toISOString(),
      service,
      message: `No valid ${service} API keys available. Admin intervention required.`
    };
    
    const logs = JSON.parse(localStorage.getItem(this.USAGE_LOG_KEY) || '[]');
    logs.push(log);
    localStorage.setItem(this.USAGE_LOG_KEY, JSON.stringify(logs.slice(-100))); // Keep last 100 logs
  }

  private static saveKeys(keys: ApiKeyEntry[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(keys));
  }

  // Get usage statistics for admin
  static getUsageStats(): { [service: string]: { total: number; active: number; expired: number } } {
    const keys = this.getAllKeys();
    const stats: { [service: string]: { total: number; active: number; expired: number } } = {};
    
    keys.forEach(key => {
      if (!stats[key.service]) {
        stats[key.service] = { total: 0, active: 0, expired: 0 };
      }
      
      stats[key.service].total++;
      if (key.isActive && !this.isKeyExpired(key)) {
        stats[key.service].active++;
      } else {
        stats[key.service].expired++;
      }
    });
    
    return stats;
  }

  // Get recent logs for admin
  static getRecentLogs(): any[] {
    return JSON.parse(localStorage.getItem(this.USAGE_LOG_KEY) || '[]');
  }

  // Clean up expired/inactive keys (admin utility)
  static cleanupInactiveKeys(): number {
    const keys = this.getAllKeys();
    const activeKeys = keys.filter(k => k.isActive && !this.isKeyExpired(k));
    const removedCount = keys.length - activeKeys.length;
    
    this.saveKeys(activeKeys);
    console.log(`Cleaned up ${removedCount} inactive API keys`);
    return removedCount;
  }
}
