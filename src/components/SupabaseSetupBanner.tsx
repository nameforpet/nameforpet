'use client';

import React, { useState } from 'react';
import { Database, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';

interface SupabaseSetupBannerProps {
  isConfigured: boolean;
  totalNamesCount: number;
}

export default function SupabaseSetupBanner({ isConfigured, totalNamesCount }: SupabaseSetupBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const envSnippet = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`;

  const copyEnv = () => {
    navigator.clipboard.writeText(envSnippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isConfigured 
          ? 'bg-emerald-50/70 border-emerald-200/80' 
          : 'bg-amber-50/70 border-amber-200/80'
      }`}>
        
        {/* Header Bar */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              isConfigured ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
            }`}>
              <Database className="w-4 h-4" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800">
                  {isConfigured ? 'Supabase Connected' : 'Supabase Database Ready'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isConfigured 
                    ? 'bg-emerald-200 text-emerald-800' 
                    : 'bg-amber-200 text-amber-800'
                }`}>
                  {isConfigured ? 'Live Database Active' : 'Running on Built-in Dataset'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                {totalNamesCount}+ pet names loaded across 14 languages. Ready for thousands more in Supabase!
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg bg-white/70 border border-stone-200/60 hover:bg-white transition-colors"
          >
            <span>{isOpen ? 'Hide Instructions' : 'Supabase Guide'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Collapsible Setup Instructions */}
        {isOpen && (
          <div className="border-t border-stone-200/60 p-4 sm:p-6 bg-white/60 space-y-4 text-xs text-stone-600">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px]">1</span>
                  Create Supabase Project
                </div>
                <p className="text-[11px] text-stone-500 mb-2">
                  Sign up for free at Supabase.com and create a new project.
                </p>
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 hover:underline"
                >
                  <span>Open Supabase</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px]">2</span>
                  Run SQL Scripts
                </div>
                <p className="text-[11px] text-stone-500">
                  Open the SQL Editor in Supabase, paste and run <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">supabase/schema.sql</code>, then run <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">supabase/seed.sql</code>.
                </p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs">
                <div className="font-bold text-stone-800 mb-1 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-[10px]">3</span>
                  Connect Keys
                </div>
                <p className="text-[11px] text-stone-500 mb-2">
                  Copy your Project URL and Anon API key into your <code className="bg-stone-100 px-1 py-0.5 rounded text-[10px]">.env.local</code> and Vercel Environment Variables.
                </p>
                <button
                  onClick={copyEnv}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md transition-colors"
                >
                  {copiedEnv ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedEnv ? 'Copied template' : 'Copy env template'}</span>
                </button>
              </div>

            </div>

            <p className="text-[11px] text-stone-400">
              * Note: The app automatically falls back to the embedded multi-language database whenever Supabase environment variables are not yet populated, ensuring zero downtime!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
