'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Scan } from 'lucide-react';

interface AIScannerViewProps {
  imageSrc: string;
}

const SCAN_STEPS = [
  'Extracting dominant coat colors & shades...',
  'Detecting species, breed, and facial features...',
  'Analyzing personality cues and vibe...',
  'Matching multilingual pet names from Supabase...'
];

export default function AIScannerView({ imageSrc }: AIScannerViewProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < SCAN_STEPS.length - 1 ? prev + 1 : prev));
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-md mx-auto my-6 flex flex-col items-center animate-fade-in">
      
      {/* Photo Frame with Animated Laser Scanning Line */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Analyzing Pet"
          className="w-full h-full object-cover filter brightness-[0.95]"
        />

        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-stone-900/20 backdrop-blur-[1px]" />

        {/* Glowing Scanner Line */}
        <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent shadow-[0_0_15px_#f97316] animate-scan-line top-1/2" />

        {/* Corner HUD targeting brackets */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-white/80 rounded-tl-lg" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-white/80 rounded-tr-lg" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-white/80 rounded-bl-lg" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-white/80 rounded-br-lg" />

        {/* Live badge */}
        <div className="absolute top-4 inset-x-0 flex justify-center">
          <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium tracking-wide rounded-full flex items-center gap-1.5 border border-white/20">
            <Scan className="w-3.5 h-3.5 text-brand-400 animate-pulse" />
            <span>AI VISION ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Progress Status Steps */}
      <div className="mt-6 w-full px-4">
        <div className="bg-white/80 backdrop-blur-sm border border-stone-200/80 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-stone-700 font-semibold text-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Analyzing Your Pet...</span>
          </div>

          <p className="text-sm text-stone-600 font-medium h-6 transition-all duration-300">
            {SCAN_STEPS[currentStepIndex]}
          </p>

          {/* Progress bar */}
          <div className="mt-3 w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStepIndex + 1) / SCAN_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}
