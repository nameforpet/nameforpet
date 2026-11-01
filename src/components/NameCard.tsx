'use client';

import React, { useState } from 'react';
import { RecommendedName } from '@/lib/types';
import { Heart, Copy, Check, Globe, Sparkles, Volume2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NameCardProps {
  nameItem: RecommendedName;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function NameCard({ nameItem, isSaved = false, onToggleSave }: NameCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Extract base name without parentheses for copying
    const cleanName = nameItem.name.split('(')[0].trim();
    navigator.clipboard.writeText(cleanName);
    setCopied(true);

    // Fire cute micro-confetti
    confetti({
      particleCount: 25,
      spread: 45,
      origin: { y: 0.7 },
      colors: ['#f97316', '#fbbf24', '#f87171']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const speakName = () => {
    if ('speechSynthesis' in window) {
      const cleanName = nameItem.name.split('(')[0].trim();
      const utterance = new SpeechSynthesisUtterance(cleanName);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/90 shadow-sm hover:shadow-lg hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group">
      
      <div>
        {/* Top Header: Language badge & Match score */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <Globe className="w-3 h-3 text-brand-500" />
            <span>{nameItem.origin_language}</span>
          </span>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>{nameItem.matchScore}% Match</span>
            </span>

            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(nameItem.id)}
                className={`p-1.5 rounded-full border transition-all ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-500'
                    : 'bg-white border-stone-200 text-stone-400 hover:text-rose-500 hover:border-rose-200'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save this name'}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Pet Name Title & Pronunciation */}
        <div className="mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
              {nameItem.name}
            </h3>
            <button
              onClick={speakName}
              title="Hear pronunciation"
              className="p-1 rounded-full text-stone-400 hover:text-brand-500 hover:bg-stone-100 transition-colors"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          {nameItem.pronunciation && (
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              /{nameItem.pronunciation}/
            </p>
          )}
        </div>

        {/* Meaning */}
        <p className="text-sm text-stone-600 leading-relaxed mb-4">
          {nameItem.meaning}
        </p>

        {/* Fun Fact or Origin detail if available */}
        {nameItem.fun_fact && (
          <div className="mb-4 text-xs bg-brand-50/60 border border-brand-100/80 rounded-2xl p-2.5 text-stone-600 flex items-start gap-1.5">
            <span className="text-brand-500 font-bold shrink-0">💡</span>
            <span>{nameItem.fun_fact}</span>
          </div>
        )}

        {/* Why it matches tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {nameItem.matchReasons.map((reason, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2.5 py-0.5 rounded-lg bg-stone-50 border border-stone-200/70 text-stone-500 font-medium"
            >
              ✓ {reason}
            </span>
          ))}
        </div>
      </div>

      {/* Card Action: Copy button */}
      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
        <span className="text-[11px] text-stone-400 capitalize">
          Gender: <strong className="text-stone-600">{nameItem.gender}</strong>
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
            copied
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'bg-stone-100 hover:bg-brand-500 hover:text-white text-stone-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Name</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
