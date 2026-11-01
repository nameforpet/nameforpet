import React from 'react';
import { Heart, Database, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-[#E8DFD4] bg-[#FAF6F0] py-12 text-stone-600">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-stone-800">
              <span>🐾 loveforpet.com</span>
            </div>
            <p className="mt-1 text-sm text-stone-500 max-w-sm">
              Discover the perfect multilingual name for your beloved dog, cat, rabbit, or bird powered by on-device computer vision.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              Supabase Ready
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Self-Hosted AI (0 API Cost)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-stone-200">
              Next.js 14 + Tailwind CSS
            </span>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} loveforpet.com. Crafted with love for pets worldwide.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for furry companions
          </p>
        </div>
      </div>
    </footer>
  );
}
