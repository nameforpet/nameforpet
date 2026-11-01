'use client';

import React from 'react';
import { Sparkles, BookOpen, Bookmark } from 'lucide-react';

interface NavbarProps {
  savedCount?: number;
  onOpenSaved?: () => void;
  onOpenExplore?: () => void;
  onResetHome?: () => void;
}

export default function Navbar({ savedCount = 0, onOpenSaved, onOpenExplore, onResetHome }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E8DFD4] transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button 
          onClick={onResetHome}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-800">loveforpet<span className="text-brand-500">.com</span></span>
            </div>
            <p className="text-[11px] text-stone-500 font-medium">Smart AI Pet Name Finder</p>
          </div>
        </button>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenExplore && (
            <button
              onClick={onOpenExplore}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100/70 rounded-full transition-colors"
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Browse Names</span>
            </button>
          )}

          {onOpenSaved && (
            <button
              onClick={onOpenSaved}
              className="relative flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium bg-white text-stone-700 hover:text-brand-600 border border-stone-200/80 rounded-full shadow-sm hover:border-brand-300 transition-all"
            >
              <Bookmark className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-brand-500 text-white text-[11px] font-bold rounded-full">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          <div className="hidden md:flex items-center gap-1 pl-2 text-xs text-stone-400 border-l border-stone-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zero-API Local Vision</span>
          </div>
        </div>

      </div>
    </header>
  );
}
