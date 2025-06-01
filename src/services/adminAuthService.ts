
// Admin authentication service
export class AdminAuthService {
  private static readonly ADMIN_USERNAME = 'admin';
  private static readonly ADMIN_PASSWORD = 'adminpower';
  private static readonly ADMIN_SESSION_KEY = 'jarvis_admin_session';
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static login(username: string, password: string): boolean {
    if (username === this.ADMIN_USERNAME && password === this.ADMIN_PASSWORD) {
      const session = {
        timestamp: Date.now(),
        expires: Date.now() + this.SESSION_DURATION
      };
      localStorage.setItem(this.ADMIN_SESSION_KEY, JSON.stringify(session));
      return true;
    }
    return false;
  }

  static logout(): void {
    localStorage.removeItem(this.ADMIN_SESSION_KEY);
  }

  static isAuthenticated(): boolean {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) return false;

      const session = JSON.parse(sessionData);
      if (Date.now() > session.expires) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  static getRemainingTime(): number {
    try {
      const sessionData = localStorage.getItem(this.ADMIN_SESSION_KEY);
      if (!sessionData) return 0;

      const session = JSON.parse(sessionData);
      return Math.max(0, session.expires - Date.now());
    } catch {
      return 0;
    }
  }
}
