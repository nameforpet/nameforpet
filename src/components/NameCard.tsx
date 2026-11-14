'use client';

import React, { useState } from 'react';
import { RecommendedName } from '@/lib/types';
import { Heart, Copy, Check, Globe, Sparkles, Volume2, ArrowUpRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NameCardProps {
  nameItem: RecommendedName;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
  onSelect?: (nameItem: RecommendedName) => void;
  rank?: number;
}

export default function NameCard({ nameItem, isSaved = false, onToggleSave, onSelect, rank }: NameCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cleanName = nameItem.name.split('(')[0].trim();
    navigator.clipboard.writeText(cleanName);
    setCopied(true);

    confetti({
      particleCount: 20,
      spread: 40,
      origin: { y: 0.7 },
      colors: ['#f97316', '#fbbf24', '#f87171']
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const speakName = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const cleanName = nameItem.name.split('(')[0].trim();
      const utterance = new SpeechSynthesisUtterance(cleanName);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      onClick={() => onSelect?.(nameItem)}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs hover:shadow-md hover:border-brand-300 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      <div>
        {/* Top Header: Rank, Language & Favorite */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            {typeof rank === 'number' && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-stone-900 text-white leading-none">
                #{rank}
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-700">
              <Globe className="w-2.5 h-2.5 text-stone-400" />
              <span>{nameItem.origin_language}</span>
            </span>

            {nameItem.aiPersona && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${nameItem.aiPersona.badgeColor}`}>
                <span>{nameItem.aiPersona.badgeIcon}</span>
                <span>{nameItem.aiPersona.label}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {typeof nameItem.matchScore === 'number' && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                <span>{Math.round(nameItem.matchScore)}%</span>
              </span>
            )}

            {onToggleSave && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(nameItem.id);
                }}
                className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                  isSaved
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-2xs'
                    : 'bg-white border-stone-200 text-stone-300 hover:text-rose-500 hover:border-rose-200'
                }`}
                title={isSaved ? 'Remove from saved' : 'Save this name'}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Pet Name & Audio */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 group-hover:text-brand-600 transition-colors tracking-tight">
            {nameItem.name}
          </h3>
          <button
            type="button"
            onClick={speakName}
            title="Hear pronunciation"
            className="p-1 text-stone-400 hover:text-brand-500 hover:bg-stone-100 rounded-full transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          {nameItem.pronunciation && (
            <span className="text-[11px] text-stone-400 font-mono">
              /{nameItem.pronunciation}/
            </span>
          )}
        </div>

        {/* Concise Meaning */}
        <p className="text-xs sm:text-sm text-stone-600 leading-snug line-clamp-2 mb-3">
          {nameItem.meaning}
        </p>

        {/* Highlight Reason (1 clear highlight, avoiding heavy stacks of checkmarks) */}
        {nameItem.matchReasons && nameItem.matchReasons.length > 0 && (
          <p className="text-[11px] text-brand-700 bg-brand-50/70 border border-brand-200/60 rounded-lg px-2 py-1 line-clamp-1 mb-2">
            {nameItem.matchReasons[0].startsWith('🌟') ? nameItem.matchReasons[0] : `✓ ${nameItem.matchReasons[0]}`}
          </p>
        )}
      </div>

      {/* Simplified Footer: 1-click Details and Copy */}
      <div className="pt-2.5 mt-1 border-t border-stone-100 flex items-center justify-between text-xs">
        <span className="text-stone-400 group-hover:text-brand-600 font-medium inline-flex items-center gap-0.5 transition-colors text-[11px]">
          View details <ArrowUpRight className="w-3 h-3" />
        </span>

        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500 text-white shadow-2xs'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
