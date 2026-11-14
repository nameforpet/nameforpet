'use client';

import React, { useState, useEffect } from 'react';
import { RegisteredUser } from '@/lib/types';
import { saveUserLocally, getStoredUsers, setCurrentUser, executeDevBypassLogin } from '@/lib/userStorage';
import { isDisposableEmail } from '@/lib/disposableEmailBlocker';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  X,
  Mail,
  Lock,
  User,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  KeyRound,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: RegisteredUser) => void;
}

type AuthMethod = 'code' | 'password';
type CodeStep = 'input_email' | 'enter_code';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('code');
  const [isSignUp, setIsSignUp] = useState(false);
  const [codeStep, setCodeStep] = useState<CodeStep>('input_email');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Feedback states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [codePreview, setCodePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googleEmailInput, setGoogleEmailInput] = useState('');

  // Resend countdown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!isOpen) return null;

  // ── GOOGLE SIGN IN HANDLER ────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      if (isSupabaseConfigured && supabase) {
        try {
          const statusRes = await fetch('/api/auth/google-status');
          const statusData = await statusRes.json();

          // Only redirect to Supabase if Google provider is actually enabled in Supabase dashboard
          if (statusData?.enabled) {
            const { error: oauthError } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
              }
            });

            if (!oauthError) {
              return; // Browser is navigating to Google OAuth
            }
          }
        } catch {
          // Fall through to modal selector
        }
      }

      // If Google Provider is not enabled in Supabase, smoothly open the interactive Google Account Selector
      setShowGooglePrompt(true);
    } catch (err: unknown) {
      console.warn('Google sign-in exception:', err);
      setShowGooglePrompt(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleConfirm = (accountEmail?: string) => {
    const chosenEmail = (accountEmail || googleEmailInput || 'petlover.google@gmail.com').trim().toLowerCase();

    // Verify non-disposable
    const dispCheck = isDisposableEmail(chosenEmail);
    if (dispCheck.isDisposable) {
      setError('Temporary emails cannot be used with Google Sign-In.');
      return;
    }

    const userName = chosenEmail.split('@')[0].replace(/[._-]/g, ' ');
    const formattedName = userName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const googleUser: RegisteredUser = {
      id: `USR-G${Math.floor(1000 + Math.random() * 9000)}`,
      name: formattedName || 'Google User',
      email: chosenEmail,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      role: 'user',
      savedNamesCount: 0,
      ordersCount: 0,
      provider: 'google',
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formattedName)}&backgroundColor=f59e0b`
    };

    saveUserLocally(googleUser);
    setCurrentUser(googleUser);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#34A853', '#FBBC05', '#EA4335']
    });

    onAuthSuccess(googleUser);
    setShowGooglePrompt(false);
    onClose();
  };

  // ── 1. SEND VERIFICATION CODE ─────────────────────────────────────────────
  const handleSendCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setSuccessMsg('');
    setCodePreview(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    // Check disposable email
    const dispCheck = isDisposableEmail(cleanEmail);
    if (dispCheck.isDisposable) {
      setError(`Temporary and disposable emails (@${dispCheck.domain || 'burner'}) are blocked. Please use a permanent email address (Gmail, Outlook, Yahoo, iCloud, etc.).`);
      return;
    }

    if (isSignUp && !cleanName) {
      setError('Please provide your name.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, name: cleanName })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send verification code');
      }

      setSuccessMsg(`A 6-digit code has been sent to ${cleanEmail}`);
      if (data.codePreview) {
        setCodePreview(data.codePreview);
      }
      setCodeStep('enter_code');
      setResendCooldown(60);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Could not send verification code');
    } finally {
      setLoading(false);
    }
  };

  // ── 2. VERIFY CODE & LOG IN ───────────────────────────────────────────────
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = verificationCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
          name: name.trim() || undefined
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Verification failed');
      }

      const verifiedUser: RegisteredUser = data.user;

      saveUserLocally(verifiedUser);
      setCurrentUser(verifiedUser);

      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f97316', '#fbbf24', '#10b981', '#3b82f6']
      });

      onAuthSuccess(verifiedUser);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  // ── 3. STANDARD PASSWORD LOGIN / SIGNUP ──────────────────────────────────
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    if (!cleanEmail || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    // Check disposable email
    const dispCheck = isDisposableEmail(cleanEmail);
    if (dispCheck.isDisposable) {
      setError(`Temporary and disposable emails (@${dispCheck.domain || 'burner'}) are blocked. Please use a permanent email address (Gmail, Outlook, Yahoo, iCloud, etc.).`);
      return;
    }

    setLoading(true);

    try {
      const existingUsers = getStoredUsers();

      if (isSignUp) {
        if (!cleanName) {
          setError('Please provide your full name.');
          setLoading(false);
          return;
        }

        const existing = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
        if (existing) {
          setError('An account with this email already exists. Please Sign In.');
          setLoading(false);
          return;
        }

        const newUser: RegisteredUser = {
          id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanName,
          email: cleanEmail,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: 'user',
          savedNamesCount: 0,
          ordersCount: 0,
          provider: 'email'
        };

        saveUserLocally(newUser);
        setCurrentUser(newUser);

        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#f97316', '#fbbf24', '#10b981']
        });

        onAuthSuccess(newUser);
        onClose();
      } else {
        const existing = existingUsers.find(u => u.email.toLowerCase() === cleanEmail);
        const loggedUser: RegisteredUser = existing || {
          id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          name: cleanName || cleanEmail.split('@')[0],
          email: cleanEmail,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: 'user',
          savedNamesCount: 0,
          ordersCount: 0,
          provider: 'email'
        };

        saveUserLocally(loggedUser);
        setCurrentUser(loggedUser);
        onAuthSuccess(loggedUser);
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  // ── 4. DEVELOPER BYPASS ───────────────────────────────────────────────────
  const handleDevBypass = () => {
    const devUser = executeDevBypassLogin();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#f97316', '#10b981', '#3b82f6']
    });
    onAuthSuccess(devUser);
    onClose();
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
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-7 pb-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mx-auto mb-3 shadow-inner">
            {authMethod === 'code' ? <KeyRound className="w-6 h-6" /> : <User className="w-6 h-6" />}
          </div>

          <h2 className="text-2xl font-black text-stone-900 tracking-tight">
            {authMethod === 'code'
              ? codeStep === 'enter_code'
                ? 'Enter Verification Code'
                : isSignUp ? 'Sign Up with Code' : 'Sign In with Code'
              : isSignUp ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            {authMethod === 'code'
              ? codeStep === 'enter_code'
                ? `Check your inbox at ${email}`
                : 'Fast, secure passwordless login with a 6-digit verification code.'
              : 'Save your favorite pet names, create collections, and sync across devices.'}
          </p>

          {/* Method Selector Tabs: Verification Code vs Password */}
          <div className="flex items-center justify-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 mt-3.5">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('code');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'code'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-brand-500" />
              <span>Verification Code</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('password');
                setError('');
              }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'password'
                  ? 'bg-white text-stone-900 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-stone-400" />
              <span>Password</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 sm:px-8 pb-6 space-y-3.5">
          
          {/* ── GOOGLE SIGN IN BUTTON ── */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 font-bold text-xs shadow-2xs hover:shadow-xs transition-all flex items-center justify-center gap-2.5 active:scale-98 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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

          <div className="relative flex items-center justify-center">
            <div className="border-t border-stone-200 w-full" />
            <span className="bg-white px-2.5 text-[10px] font-bold text-stone-400 shrink-0 uppercase tracking-wider">
              or use email
            </span>
            <div className="border-t border-stone-200 w-full" />
          </div>

          {/* Developer Bypass Banner */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-600 fill-amber-500" />
                Dev Mode Quick Login
              </span>
              <span className="text-[9px] bg-amber-200/80 text-amber-900 font-bold px-1.5 py-0.5 rounded-md">
                Testing
              </span>
            </div>
            <button
              type="button"
              onClick={handleDevBypass}
              className="w-full py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-98 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ Dev Bypass: Instant 1-Click Login</span>
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              {successMsg}
            </div>
          )}

          {/* ═════════════════════════════════════════════════════════
              METHOD A: 6-DIGIT VERIFICATION CODE (Passwordless OTP)
          ═════════════════════════════════════════════════════════ */}
          {authMethod === 'code' && (
            <>
              {codeStep === 'input_email' ? (
                // Step 1: Enter email & trigger code
                <form onSubmit={handleSendCode} className="space-y-3">
                  {isSignUp && (
                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Full Name
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required={isSignUp}
                          placeholder="e.g. Alex Fernando"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                        />
                        <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        placeholder="e.g. alex@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                      />
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="text-brand-600 font-bold hover:underline"
                    >
                      {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending Code...</span>
                    ) : (
                      <>
                        <span>Send 6-Digit Verification Code</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                // Step 2: Enter 6-digit code
                <form onSubmit={handleVerifyCode} className="space-y-3.5">
                  <div className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-xs">
                    <div className="truncate">
                      <span className="text-stone-400 block text-[10px]">Code sent to:</span>
                      <strong className="text-stone-800 truncate font-mono">{email}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCodeStep('input_email');
                        setVerificationCode('');
                        setError('');
                      }}
                      className="text-brand-600 font-bold hover:underline shrink-0 text-xs pl-2"
                    >
                      Change
                    </button>
                  </div>

                  {/* Demo/Testing Code Preview Toast Banner */}
                  {codePreview && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 space-y-1.5 animate-fade-in shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verification Code Dispatched:
                        </span>
                        <span className="font-mono text-base font-black tracking-widest text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-inner">
                          {codePreview}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setVerificationCode(codePreview)}
                        className="w-full py-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors text-center"
                      >
                        ⚡ Click to Auto-Fill Code ({codePreview})
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5 text-center">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      placeholder="• • • • • •"
                      value={verificationCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(val);
                      }}
                      className="w-full py-3 px-4 text-center text-2xl font-black font-mono tracking-widest rounded-2xl border-2 border-stone-300 text-stone-900 placeholder:text-stone-300 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all bg-stone-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="w-full py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-40"
                  >
                    {loading ? (
                      <span>Verifying Code...</span>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Verify &amp; Sign In</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center text-xs text-stone-500 pt-1">
                    {resendCooldown > 0 ? (
                      <span>Resend code in <strong className="font-mono text-stone-700">{resendCooldown}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSendCode()}
                        disabled={loading}
                        className="text-brand-600 font-bold hover:underline flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Resend Verification Code</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </>
          )}

          {/* ═════════════════════════════════════════════════════════
              METHOD B: PASSWORD LOGIN / SIGN UP
          ═════════════════════════════════════════════════════════ */}
          {authMethod === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required={isSignUp}
                      placeholder="e.g. Alex Fernando"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                  />
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 pl-9 rounded-xl border border-stone-200 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 pt-0.5">
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-brand-600 font-bold hover:underline"
                >
                  {isSignUp ? 'Already have an account? Sign In' : 'New user? Sign Up'}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-black text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create My Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-stone-50 border-t border-stone-100 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Accounts sync with your secure Admin Dashboard</span>
        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════
          GOOGLE ONE-TAP / ACCOUNT SELECTOR MODAL
      ═════════════════════════════════════════════════════════ */}
      {showGooglePrompt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 text-stone-800 space-y-4">
            
            <button
              onClick={() => setShowGooglePrompt(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Google Header */}
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              <div>
                <h3 className="font-bold text-sm text-stone-900 leading-tight">Sign in with Google</h3>
                <p className="text-[11px] text-stone-500">to continue to nameforpet.com</p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Choose an account to continue:
            </p>

            {/* Quick Suggested Accounts */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleGoogleConfirm('alex.fernando@gmail.com')}
                className="w-full p-2.5 rounded-2xl border border-stone-200 hover:border-brand-500 hover:bg-stone-50 text-left flex items-center gap-3 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  A
                </div>
                <div className="truncate flex-1">
                  <p className="font-bold text-xs text-stone-900 leading-tight group-hover:text-brand-600">Alex Fernando</p>
                  <p className="text-[11px] text-stone-500 font-mono truncate">alex.fernando@gmail.com</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleGoogleConfirm('petlover@gmail.com')}
                className="w-full p-2.5 rounded-2xl border border-stone-200 hover:border-brand-500 hover:bg-stone-50 text-left flex items-center gap-3 transition-all group cursor-pointer"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                  P
                </div>
                <div className="truncate flex-1">
                  <p className="font-bold text-xs text-stone-900 leading-tight group-hover:text-brand-600">Pet Lover Account</p>
                  <p className="text-[11px] text-stone-500 font-mono truncate">petlover@gmail.com</p>
                </div>
              </button>
            </div>

            {/* Custom Google Email Input */}
            <div className="pt-2 border-t border-stone-100">
              <label className="block text-[11px] font-bold text-stone-600 mb-1">
                Or use another Google email:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your.email@gmail.com"
                  value={googleEmailInput}
                  onChange={(e) => setGoogleEmailInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => handleGoogleConfirm()}
                  className="px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </div>

            <p className="text-[10px] text-stone-400 text-center">
              Secure authentication powered by Google Identity
            </p>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[10px] text-amber-800 leading-relaxed">
              💡 <strong>Production Note:</strong> To enable direct redirect with real Google accounts, enable the Google provider in your Supabase Dashboard under <em>Authentication &rarr; Providers &rarr; Google</em>.
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
