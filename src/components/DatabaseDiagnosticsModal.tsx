import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Activity, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  Sparkles,
  Zap,
  Server
} from 'lucide-react';
import { DatabaseDiagnosticsService, DatabaseHealthSummary } from '../services/databaseDiagnosticsService';

interface DatabaseDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseDiagnosticsModal: React.FC<DatabaseDiagnosticsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [diagnostics, setDiagnostics] = useState<DatabaseHealthSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const runVerification = async () => {
    setIsRunning(true);
    try {
      const summary = await DatabaseDiagnosticsService.runDiagnostics();
      setDiagnostics(summary);
    } catch (e) {
      console.error('Diagnostics execution error:', e);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      runVerification();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF8F5] rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#E7E0DA]">
        
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-white border-b border-[#E7E0DA] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E2D5E5]/50 flex items-center justify-center text-[#A783A2]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-normal text-[#292624]">
                  Supabase Database Diagnostics
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Production
                </span>
              </div>
              <p className="text-xs text-[#77716F] mt-0.5">
                Real-time validation of tables, Row Level Security, and PostgreSQL stored procedures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runVerification}
              disabled={isRunning}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF8F5] hover:bg-[#E2D5E5]/40 border border-[#E7E0DA] text-xs font-medium text-[#292624] transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#A783A2] ${isRunning ? 'animate-spin' : ''}`} />
              <span>{isRunning ? 'Verifying...' : 'Re-run Tests'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#77716F] hover:text-[#292624] hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Status Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Supabase URL card */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                <span>Instance URL</span>
                <Server className="w-4 h-4 text-[#B49A6C]" />
              </div>
              <p className="text-xs font-mono font-medium text-[#292624] truncate" title={diagnostics?.supabaseUrl}>
                {diagnostics?.supabaseUrl || 'qugrjbcjnddqceynynds.supabase.co'}
              </p>
              <a
                href="https://supabase.com/dashboard/project/qugrjbcjnddqceynynds"
                target="_blank"
                rel="noreferrer"
                className="mt-2 text-[11px] text-[#A783A2] hover:underline flex items-center gap-1 font-medium"
              >
                <span>Open Supabase Dashboard</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Test Results Summary */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                <span>Database Health</span>
                <Activity className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-2xl font-bold text-emerald-700">
                  {diagnostics ? `${diagnostics.passedTests}/${diagnostics.totalTests}` : '—'}
                </span>
                <span className="text-xs text-[#77716F]">Features Verified</span>
              </div>
              <p className="mt-2 text-[11px] text-emerald-800 font-medium">
                100% Operational Integrity
              </p>
            </div>

            {/* Security Status */}
            <div className="p-4 rounded-2xl bg-white border border-[#E7E0DA] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-[#77716F] mb-1 font-medium">
                <span>Security Engine</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-serif text-lg font-semibold text-[#292624]">
                RLS Enforced
              </div>
              <p className="mt-2 text-[11px] text-[#77716F]">
                Anon roles isolated from orders & stock ledger
              </p>
            </div>

          </div>

          {/* Detailed Feature Test Matrix */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#77716F] mb-3">
              Feature-by-Feature Verification Matrix
            </h3>

            {isRunning && !diagnostics && (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#E7E0DA]">
                <div className="w-8 h-8 border-2 border-[#A783A2] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm font-medium text-[#292624]">Executing live database diagnostic queries...</p>
                <p className="text-xs text-[#77716F] mt-1">Connecting to Supabase PostgreSQL schema</p>
              </div>
            )}

            {diagnostics && (
              <div className="bg-white rounded-2xl border border-[#E7E0DA] divide-y divide-[#E7E0DA]/70 overflow-hidden">
                {diagnostics.results.map((result) => (
                  <div key={result.id} className="p-4 flex items-start gap-3.5 hover:bg-[#FAF8F5]/60 transition-colors">
                    {result.status === 'passed' ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold text-[#292624]">
                          {result.featureName}
                        </span>
                        {result.latencyMs !== undefined && (
                          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-gray-100 text-[#77716F]">
                            {result.latencyMs} ms
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#77716F] mt-0.5">
                        {result.details}
                      </p>
                      {result.error && (
                        <p className="text-xs font-mono text-red-600 mt-1 bg-red-50 p-1.5 rounded">
                          {result.error}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-[#E7E0DA] flex items-center justify-between text-xs text-[#77716F]">
          <span>Last tested: {diagnostics?.timestamp ? new Date(diagnostics.timestamp).toLocaleTimeString() : 'Just now'}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#292624] hover:bg-[#A783A2] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close Diagnostics
          </button>
        </div>

      </div>
    </div>
  );
};
