'use client';

import React, { useRef, useState, useEffect } from 'react';
import { GalleryItem } from '@/lib/galleryStorage';
import GalleryCard from './GalleryCard';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface GalleryRowProps {
  rowItems: GalleryItem[];
  rowIndex: number;
  direction: 'right' | 'left';
  onSelectPet: (item: GalleryItem) => void;
}

export default function GalleryRow({
  rowItems,
  rowIndex,
  direction,
  onSelectPet
}: GalleryRowProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isManualPaused, setIsManualPaused] = useState(false);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Repeat items to ensure smooth infinite running without empty ends
  const displayItems = React.useMemo(() => {
    if (rowItems.length === 0) return [];
    // If fewer items, repeat more times; otherwise repeat enough to fill marquee
    const repeatCount = Math.max(3, Math.ceil(15 / rowItems.length) * 2);
    const repeated: GalleryItem[] = [];
    for (let i = 0; i < repeatCount; i++) {
      repeated.push(...rowItems);
    }
    return repeated;
  }, [rowItems]);

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, []);

  const handleScroll = (offset: number) => {
    if (!containerRef.current) return;
    
    // Pause auto animation so user can manually watch images
    setIsManualPaused(true);
    
    containerRef.current.scrollBy({
      left: offset,
      behavior: 'smooth'
    });

    // Auto resume motion after 6 seconds of inactivity
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setIsManualPaused(false);
    }, 6000);
  };

  const togglePause = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsManualPaused(prev => !prev);
  };

  return (
    <div className="w-full relative group/row py-1 sm:py-2">
      
      {/* Row Header with Label & Manual Controls */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-stone-700 bg-white px-3 py-1 rounded-full border border-stone-200/90 shadow-2xs">
            Row {rowIndex + 1}
          </span>
          <span className="text-[11px] font-semibold text-stone-400">
            {rowItems.length} / 15 Images · Running {direction === 'right' ? '➔ Right' : '⬅ Left'}
          </span>
        </div>

        {/* Arrow Keys & Play/Pause Controls */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePause}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-600 text-[11px] font-bold shadow-2xs transition-all active:scale-95"
            title={isManualPaused ? 'Resume auto-run' : 'Pause auto-run'}
          >
            {isManualPaused ? (
              <>
                <Play className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span className="hidden sm:inline">Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span className="hidden sm:inline">Pause</span>
              </>
            )}
          </button>

          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll(-320)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 shadow-2xs flex items-center justify-center text-stone-700 hover:text-brand-600 transition-all active:scale-90"
            aria-label={`Scroll Row ${rowIndex + 1} Left`}
            title="Watch previous image"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => handleScroll(320)}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-stone-100 border border-stone-200 shadow-2xs flex items-center justify-center text-stone-700 hover:text-brand-600 transition-all active:scale-90"
            aria-label={`Scroll Row ${rowIndex + 1} Right`}
            title="Watch next image"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Track Container */}
      <div className="relative w-full overflow-hidden">
        
        {/* Subtle left & right edge fades */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-r from-[#FAF6F0] to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-20 bg-gradient-to-l from-[#FAF6F0] to-transparent z-20" />

        {/* Floating Arrow Keys on sides */}
        <button
          type="button"
          onClick={() => handleScroll(-320)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-stone-200/90 flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95 backdrop-blur-sm"
          title="Watch previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll(320)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-white text-stone-800 shadow-md border border-stone-200/90 flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 hover:scale-110 active:scale-95 backdrop-blur-sm"
          title="Watch next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Scrollable / Marquee container */}
        <div
          ref={containerRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth"
        >
          <div
            className={`flex gap-3.5 sm:gap-6 py-1 ${
              isManualPaused
                ? 'w-max'
                : direction === 'right'
                ? 'animate-marquee-right'
                : 'animate-marquee-left'
            }`}
          >
            {displayItems.map((item, idx) => (
              <GalleryCard
                key={`r${rowIndex}-${item.id}-${idx}`}
                item={item}
                priority={idx < 2}
                onClick={() => onSelectPet(item)}
              />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
