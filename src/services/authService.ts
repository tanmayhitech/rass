import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AdminUser } from '../types';

const ADMIN_STORAGE_KEY = 'rass_admin_session';

// Master administrator fallback credentials
const MASTER_ADMIN_CREDENTIALS = [
  {
    email: 'admin@rassbyriddhima.com',
    password: 'RassAdmin2026!',
    name: 'Riddhima Singhania (Head of Design)',
    role: 'superadmin' as const,
  },
  {
    email: 'rass.admin.riddhima@gmail.com',
    password: 'RassAdmin2026!',
    name: 'Rass Operations Lead',
    role: 'admin' as const,
  }
];

type AuthChangeListener = (user: AdminUser | null) => void;

class AuthService {
  private currentUser: AdminUser | null = null;
  private listeners: Set<AuthChangeListener> = new Set();
  private initialized = false;

  constructor() {
    this.restoreSession();
    this.setupSupabaseListener();
  }

  private restoreSession() {
    try {
      const stored = localStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    } catch (e) {
      this.currentUser = null;
    }
    this.initialized = true;
  }

  private setupSupabaseListener() {
    if (!isSupabaseConfigured) return;

    try {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const user: AdminUser = {
            id: session.user.id,
            email: session.user.email || 'admin@rassbyriddhima.com',
            role: (session.user.user_metadata?.role as any) || 'admin',
            name: session.user.user_metadata?.full_name || 'Verified Administrator',
            authProvider: 'supabase',
            lastLogin: new Date().toISOString(),
          };
          this.currentUser = user;
          this.persistSession(user);
          this.notifyListeners();
        } else if (event === 'SIGNED_OUT') {
          // Only clear if the current session was backed by Supabase
          if (this.currentUser?.authProvider === 'supabase') {
            this.currentUser = null;
            this.clearSession();
            this.notifyListeners();
          }
        }
      });
    } catch (e) {
      console.warn('Supabase auth state listener error:', e);
    }
  }

  private persistSession(user: AdminUser) {
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      console.error('Failed to persist admin session:', e);
    }
  }

  private clearSession() {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear admin session:', e);
    }
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      try {
        listener(this.currentUser);
      } catch (e) {
        console.error('Auth listener error:', e);
      }
    }
  }

  public subscribe(listener: AuthChangeListener): () => void {
    this.listeners.add(listener);
    // Initial call
    listener(this.currentUser);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public isAuthenticated(): boolean {
    return Boolean(this.currentUser);
  }

  public getCurrentUser(): AdminUser | null {
    return this.currentUser;
  }

  /**
   * Primary Admin Sign In
   * Supports:
   * 1. Supabase Auth (live cloud identity)
   * 2. Master Administrative Credentials (failsafe boutique access)
   */
  public async signIn(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { success: false, error: 'Please enter both an administrative email and password.' };
    }

    // Step 1: Attempt Supabase Auth if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (!error && data?.user) {
          const user: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            role: (data.user.user_metadata?.role as any) || 'admin',
            name: data.user.user_metadata?.full_name || 'Verified Administrator',
            authProvider: 'supabase',
            lastLogin: new Date().toISOString(),
          };
          this.currentUser = user;
          this.persistSession(user);
          this.notifyListeners();
          return { success: true, user };
        }

        // If email confirmation is pending in Supabase, check master credentials fallback
        if (error?.message && error.message.toLowerCase().includes('email not confirmed')) {
          console.warn('Supabase auth: Email not confirmed yet, checking master credentials...');
        }
      } catch (err: any) {
        console.warn('Supabase auth signIn error:', err?.message);
      }
    }

    // Step 2: Check Master Admin Credentials
    const matchedMaster = MASTER_ADMIN_CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email && c.password === password
    );

    if (matchedMaster) {
      const user: AdminUser = {
        id: `master-${matchedMaster.role}`,
        email: matchedMaster.email,
        role: matchedMaster.role,
        name: matchedMaster.name,
        authProvider: 'master_credential',
        lastLogin: new Date().toISOString(),
      };
      this.currentUser = user;
      this.persistSession(user);
      this.notifyListeners();
      return { success: true, user };
    }

    return { 
      success: false, 
      error: 'Invalid administrative credentials. Access restricted to authorized personnel.' 
    };
  }

  /**
   * Admin Sign Out
   */
  public async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Error signing out of Supabase auth:', e);
      }
    }
    this.currentUser = null;
    this.clearSession();
    this.notifyListeners();
  }
}

export const authService = new AuthService();
