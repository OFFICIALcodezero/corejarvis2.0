
import { supabase } from '@/integrations/supabase/client';

export class AdminAuthService {
  private static readonly ADMIN_SESSION_KEY = 'jarvis_admin_session';
  private static readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  static async authenticate(username: string, password: string): Promise<boolean> {
    try {
      console.log('AdminAuthService.authenticate called with:', username);
      
      // For demo purposes, use simple hardcoded credentials first
      if (username === 'admin' && password === 'admin123') {
        const session = {
          authenticated: true,
          timestamp: Date.now(),
          username: username,
          isDemo: true
        };
        
        localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
        console.log('Demo admin authentication successful');
        return true;
      }

      // If not demo credentials, try Supabase authentication as backup
      try {
        // Try direct username/password if it looks like an email
        const emailToTry = username.includes('@') ? username : `${username}@jarvis-admin.local`;
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailToTry,
          password: password
        });

        if (!error && data.user) {
          const session = {
            authenticated: true,
            timestamp: Date.now(),
            username: data.user.email || username,
            userId: data.user.id,
            isDemo: false
          };
          
          localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
          console.log('Supabase admin authentication successful');
          return true;
        } else {
          console.log('Supabase authentication failed:', error?.message);
        }
      } catch (supabaseError) {
        console.log('Supabase auth error:', supabaseError);
      }

      console.log('Admin authentication failed for username:', username);
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  static isAuthenticated(): boolean {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) {
        console.log('No admin session found');
        return false;
      }

      const session = JSON.parse(sessionData);
      const now = Date.now();
      
      // Check if session is expired
      if (now - session.timestamp > this.SESSION_TIMEOUT) {
        console.log('Admin session expired');
        this.logout();
        return false;
      }

      console.log('Admin session valid:', session.username);
      return session.authenticated === true;
    } catch (error) {
      console.error('Error checking authentication:', error);
      return false;
    }
  }

  static logout(): void {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData);
        if (!session.isDemo) {
          // Only sign out from Supabase if it's not a demo session
          supabase.auth.signOut().catch(() => {
            // Ignore errors if Supabase is not available
          });
        }
      }
      
      localStorage.removeItem(this.ADMIN_SESSION_KEY);
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
