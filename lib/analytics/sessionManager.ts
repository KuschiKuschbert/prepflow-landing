export class SessionManager {
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadUserId();
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private loadUserId(): void {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('prepflow_user_id');
      this.userId = storedUserId || undefined;
      if (!this.userId) {
        this.userId = this.generateStableUserId();
        localStorage.setItem('prepflow_user_id', this.userId);
      }
    }
  }

  private generateStableUserId(): string {
    return 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public getUserId(): string | undefined {
    return this.userId;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('prepflow_user_id', userId);
    }
  }
}
