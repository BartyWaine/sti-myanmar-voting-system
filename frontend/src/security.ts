// Enhanced security module
export class SecurityManager {
  private static instance: SecurityManager;
  private deviceId: string = '';
  private sessionKey: string = '';
  private fingerprint: string = '';

  static getInstance(): SecurityManager {
    if (!SecurityManager.instance) {
      SecurityManager.instance = new SecurityManager();
    }
    return SecurityManager.instance;
  }

  // Generate device fingerprint
  private generateFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency || 0,
      (navigator as any).deviceMemory || 0,
      canvas.toDataURL()
    ].join('|');
    
    return btoa(fingerprint).substring(0, 32);
  }

  // Generate secure session key
  private generateSessionKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Set secure cookie
  private setCookie(name: string, value: string, days: number = 1): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
  }

  // Get cookie
  private getCookie(name: string): string | null {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  // Initialize security
  public initialize(): { deviceId: string; sessionKey: string; fingerprint: string } {
    // Generate fingerprint
    this.fingerprint = this.generateFingerprint();
    
    // Get or create device ID
    this.deviceId = this.getCookie('voting_device_id') || 
                   localStorage.getItem('voting_device_id') || 
                   `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${this.fingerprint.substr(0, 8)}`;
    
    // Generate new session key
    this.sessionKey = this.generateSessionKey();
    
    // Store securely
    this.setCookie('voting_device_id', this.deviceId, 30);
    this.setCookie('voting_session', this.sessionKey, 1);
    localStorage.setItem('voting_device_id', this.deviceId);
    sessionStorage.setItem('voting_session', this.sessionKey);
    
    return {
      deviceId: this.deviceId,
      sessionKey: this.sessionKey,
      fingerprint: this.fingerprint
    };
  }

  // Get security data for API calls
  public getSecurityData(): {
    deviceId: string;
    sessionKey: string;
    fingerprint: string;
    timestamp: number;
  } {
    return {
      deviceId: this.deviceId,
      sessionKey: this.sessionKey,
      fingerprint: this.fingerprint,
      timestamp: Date.now()
    };
  }

  // Validate session
  public isValidSession(): boolean {
    const cookieSession = this.getCookie('voting_session');
    const storageSession = sessionStorage.getItem('voting_session');
    return cookieSession === this.sessionKey && storageSession === this.sessionKey;
  }
}