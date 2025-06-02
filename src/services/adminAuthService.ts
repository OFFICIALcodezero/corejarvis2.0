
import { supabase } from '@/integrations/supabase/client';

export class AdminAuthService {
  private static readonly ADMIN_SESSION_KEY = 'jarvis_admin_session';
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static async authenticate(username: string, password: string): Promise<boolean> {
    try {
      console.log('AdminAuthService.authenticate called');
      
      // For demo purposes, use simple credentials
      // In production, this should validate against Supabase
      if (username === 'admin' && password === 'admin123') {
        const session = {
          authenticated: true,
          timestamp: Date.now(),
          username: username
        };
        
        localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
        console.log('Admin authentication successful');
        return true;
      }

      // Try Supabase authentication as backup
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: username.includes('@') ? username : `${username}@admin.local`,
          password: password
        });

        if (!error && data.user) {
          const session = {
            authenticated: true,
            timestamp: Date.now(),
            username: data.user.email || username,
            userId: data.user.id
          };
          
          localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
          console.log('Supabase admin authentication successful');
          return true;
        }
      } catch (supabaseError) {
        console.log('Supabase auth not available, using local auth');
      }

      console.log('Admin authentication failed');
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  static isAuthenticated(): boolean {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session is expired
      if (now - session.timestamp > this.SESSION_TIMEOUT) {
        this.logout();
        return false;
      }

      return session.authenticated === true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  static logout(): void {
    try {
      localStorage.removeItem(this.ADMIN_SESSION_KEY);
      
      // Also sign out from Supabase if available
      supabase.auth.signOut().catch(() => {
        // Ignore errors if Supabase is not available
      });
      
      console.log('Admin logged out');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  static getSession(): any {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }
}
