/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const env = ((import.meta as any).env || {}) as Record<string, string | undefined>;

// Production Supabase Project Defaults (Protected by PostgreSQL Row Level Security)
const DEFAULT_SUPABASE_URL = 'https://ukgjkmjhhxtaedxyhaeu.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_aQvzTF6diderDC1UqoMROQ_DXBGZaNg';

const supabaseUrl = 
  env.VITE_SUPABASE_URL || 
  env.NEXT_PUBLIC_SUPABASE_URL || 
  DEFAULT_SUPABASE_URL;

const supabaseAnonKey = 
  env.VITE_SUPABASE_ANON_KEY || 
  env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  !supabaseAnonKey.includes('your-supabase') &&
  !supabaseAnonKey.includes('mock-anon-key')
);

// Fallback dummy client if credentials are not configured yet
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://mock.supabase.co', 'mock-anon-key');
