'use client';

import React, { useState, useEffect } from 'react';
import { Lock, KeyRound, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { isAdminAuthenticated, setAdminAuthenticated } from '@/lib/orderStorage';

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

const DEFAULT_PIN = 'admin2026';

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      setAdminAuthenticated(true);
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPinInput('');
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center text-stone-400 text-sm">
        Loading Admin Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-4 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              nameforpet <span className="text-amber-500">Admin</span>
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Private Order Fulfillment &amp; WhatsApp Alert Manager
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                <span>Enter Admin PIN / Passcode</span>
                <span className="text-[10px] text-stone-500 font-mono">Default: admin2026</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  autoFocus
                  required
                  placeholder="••••••••"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (error) setError(false);
                  }}
                  className="w-full px-4 py-3 pl-11 rounded-xl bg-stone-950 border border-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white font-mono tracking-widest text-sm transition-all"
                />
                <KeyRound className="w-4 h-4 text-stone-500 absolute left-4 top-3.5" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Incorrect passcode. Default PIN is: <strong>admin2026</strong></span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Unlock Admin Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Isolated Admin Zone
            </span>
            <a href="/" className="hover:text-stone-300 transition-colors">
              Return to Website →
            </a>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 sm:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-black text-sm shadow-md shadow-amber-500/20">
            🐾
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">
                nameforpet <span className="text-amber-500 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 uppercase tracking-wider font-mono">Admin Portal</span>
              </span>
            </div>
            <p className="text-[10px] text-stone-400 hidden sm:block">
              Order Fulfillment, WhatsApp Alerts &amp; Store Management
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-stone-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-stone-800 transition-colors hidden sm:inline-flex items-center gap-1"
          >
            <span>Live Site ↗</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="text-xs font-bold text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg border border-rose-500/30 hover:bg-rose-500/10 transition-colors"
          >
            Lock / Log Out
          </button>
        </div>
      </header>

      {/* Admin Content */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-8">
        {children}
      </div>
    </div>
  );
}
