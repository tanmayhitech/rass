import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  KeyRound,
  CheckCircle2
} from 'lucide-react';
import { authService } from '../services/authService';
import { AdminUser } from '../types';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const [email, setEmail] = useState('admin@rassbyriddhima.com');
  const [password, setPassword] = useState('RassAdmin2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await authService.signIn(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Invalid administrative credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemoCredentials = () => {
    setEmail('admin@rassbyriddhima.com');
    setPassword('RassAdmin2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#292624] flex flex-col justify-between items-center px-4 py-8 relative selection:bg-[#E2D5E5]">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#E2D5E5]/30 to-transparent pointer-events-none rounded-b-[40px] blur-2xl" />

      {/* Top Header / Back Button */}
      <header className="w-full max-w-5xl flex items-center justify-between z-10">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#77716F] hover:text-[#292624] transition-colors py-2 px-3 rounded-full hover:bg-white/80 border border-transparent hover:border-[#E7E0DA]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Storefront</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-medium text-[#77716F] bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#E7E0DA]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#B49A6C]" />
          <span>Restricted Portal</span>
        </div>
      </header>

      {/* Central Login Card */}
      <main className="w-full max-w-md my-auto py-8 z-10">
        <div className="bg-white rounded-3xl shadow-xl shadow-[#292624]/5 border border-[#E7E0DA] p-8 sm:p-10 relative overflow-hidden">
          
          {/* Subtle Mauve Top Border Highlight */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#A783A2] via-[#B49A6C] to-[#A783A2]" />

          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E7E0DA] mb-4 text-[#A783A2]">
              <Lock className="w-6 h-6" />
            </div>
            
            <h1 className="font-serif text-3xl font-normal tracking-tight text-[#292624] mb-1.5">
              rass
            </h1>
            <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#77716F]">
              by riddhima • operations portal
            </p>
            <p className="text-xs text-[#77716F] mt-3">
              Enter administrative credentials to access catalog management, inventory ledger, and order fulfillment.
            </p>
          </div>

          {/* Error Alert */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-3 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Authentication Denied</p>
                <p className="mt-0.5 opacity-90">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#292624] mb-2">
                Administrator Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@rassbyriddhima.com"
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A783A2]/20 focus:border-[#A783A2] transition-all text-sm text-[#292624]"
                />
                <Mail className="w-4 h-4 text-[#77716F] absolute left-4 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-[#292624]">
                  Security Passkey
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-[#E7E0DA] bg-[#FAF8F5]/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#A783A2]/20 focus:border-[#A783A2] transition-all text-sm text-[#292624]"
                />
                <KeyRound className="w-4 h-4 text-[#77716F] absolute left-4 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#77716F] hover:text-[#292624] p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#292624] hover:bg-[#A783A2] active:scale-[0.99] text-white text-xs font-semibold uppercase tracking-[0.2em] shadow-md shadow-[#292624]/10 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Verify & Enter Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Pill */}
          <div className="mt-6 pt-6 border-t border-[#E7E0DA]/70 text-center">
            <p className="text-[11px] text-[#77716F] mb-2 font-medium">
              Demo Operations Account
            </p>
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#E2D5E5]/40 border border-[#E7E0DA] text-[11px] text-[#292624] font-medium transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#B49A6C]" />
              <span>Fill Default Admin Credentials</span>
            </button>
          </div>
        </div>

        {/* Security Assurance Badge */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-[#77716F] mt-6">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Connected to Supabase PostgreSQL • 256-bit encrypted</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-5xl text-center text-[11px] text-[#77716F] z-10 py-2">
        <p>© 2026 Rass by Riddhima. Confidential administrative interface.</p>
      </footer>
    </div>
  );
};
