'use client';

import React, { useState } from 'react';
import { RegisteredUser } from '@/lib/types';
import { saveUserLocally, getStoredUsers, setCurrentUser } from '@/lib/userStorage';
import { isDisposableEmail } from '@/lib/disposableEmailBlocker';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  X,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: RegisteredUser) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isEmailMode, setIsEmailMode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  // ── GOOGLE SIGN IN HANDLER ────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        try {
          const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
            }
          });

          if (!oauthError) {
            return; // Browser is navigating to Google OAuth
          }
        } catch {
          // If Supabase OAuth is not active yet, smoothly fallback to email prompt
        }
      }

      // Smooth fallback: open clean Google email input
      setIsEmailMode(true);
      setError('Please enter your Google email address below to sign in:');
    } catch (err: unknown) {
      console.warn('Google sign-in exception:', err);
      setIsEmailMode(true);
    } finally {
      setLoading(false);
    }
  };

  // ── DIRECT EMAIL SIGN IN ──────────────────────────────────────────────────
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();
      if (!cleanEmail || !cleanEmail.includes('@')) {
        setError('Please enter a valid email address.');
        setLoading(false);
        return;
      }

      const dispCheck = isDisposableEmail(cleanEmail);
      if (dispCheck.isDisposable) {
        setError('Temporary or disposable emails are not supported.');
        setLoading(false);
        return;
      }

      const existingUsers = getStoredUsers();
      const existing = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);

      const displayName = name.trim() || (existing ? existing.name : cleanEmail.split('@')[0]);
      const formattedName = displayName
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      const userRecord: RegisteredUser = existing || {
        id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formattedName || 'Pet Lover',
        email: cleanEmail,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        role: 'user',
        savedNamesCount: 0,
        ordersCount: 0,
        provider: cleanEmail.endsWith('@gmail.com') ? 'google' : 'email'
      };

      userRecord.lastLoginAt = new Date().toISOString();
      saveUserLocally(userRecord);
      setCurrentUser(userRecord);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#10b981']
      });

      onAuthSuccess(userRecord);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Blurred Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 overflow-hidden flex flex-col">
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto mb-3 shadow-inner">
            <Sparkles className="w-7 h-7 text-brand-500" />
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            Sign In to NameForPet
          </h2>
          <p className="text-xs text-stone-500 mt-1.5 leading-relaxed max-w-xs mx-auto">
            Save your favorite pet names, create collections, and sync across your devices.
          </p>
        </div>

        {/* Form Body */}
        <div className="px-6 sm:px-8 pb-8 space-y-4">
          
          {error && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-medium">
              {error}
            </div>
          )}

          {/* ── PRIMARY GOOGLE SIGN IN BUTTON ── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 hover:border-stone-400 text-stone-800 font-bold text-sm shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0">
              or use email
            </span>
          </div>

          {/* Direct Email Sign-In (No passwords, No codes needed) */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Your Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Trust Guarantee */}
          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] text-stone-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fast 1-click access · No passwords to remember</span>
          </div>

        </div>

      </div>
    </div>
  );
}
