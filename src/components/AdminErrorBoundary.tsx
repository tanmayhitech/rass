import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBackToStore: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Portal Error Boundary caught:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  handleResetData = () => {
    if (window.confirm('Reset admin local cache and reload fresh verified data? This resolves any corrupted temporary browser storage.')) {
      localStorage.removeItem('rass_orders');
      localStorage.removeItem('rass_products_custom');
      localStorage.removeItem('rass_inventory_variants');
      localStorage.removeItem('rass_inventory_movements');
      localStorage.removeItem('rass_coupons');
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#292624] font-sans flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[#E7E0DA] shadow-modal p-6 text-center space-y-5">
            <div className="flex justify-center">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E7E0DA]">
                <img
                  src="/images/Rass by Ridhima Wordmark.png"
                  alt="Rass by Riddhima"
                  className="h-8 w-auto object-contain select-none"
                />
              </div>
            </div>

            <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF5EC] border border-[#EFE3CF] flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-[#B49A6C]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#292624]">Atelier Console Recovery</h2>
              <p className="text-xs text-[#77716F] mt-1.5 leading-relaxed">
                The operations console encountered an unexpected rendering interrupt. You can reload the portal or reset the local cache.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E7E0DA] text-left">
                <span className="text-[10px] font-mono text-[#8F3B30] block break-all">
                  {this.state.error.message || String(this.state.error)}
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-[#292624] hover:bg-[#1C1A18] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-[#B49A6C]" />
                <span>Reload Atelier Portal</span>
              </button>

              <button
                onClick={this.handleResetData}
                className="w-full inline-flex items-center justify-center space-x-2 py-2 px-4 rounded-lg border border-[#E7E0DA] bg-white hover:bg-[#FAF8F5] text-[#77716F] hover:text-[#292624] text-xs font-medium cursor-pointer transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 text-[#8F3B30]" />
                <span>Clear Local Cache & Reset Defaults</span>
              </button>

              <button
                onClick={this.props.onBackToStore}
                className="w-full inline-flex items-center justify-center space-x-1.5 py-2 text-xs text-[#77716F] hover:text-[#292624] cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Storefront</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
