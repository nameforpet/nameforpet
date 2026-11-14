'use client';

import React from 'react';

export default function GallerySkeleton() {
  return (
    <div className="w-full space-y-5 sm:space-y-6 overflow-hidden py-4" aria-busy="true" aria-label="Loading running gallery...">
      {/* Row 1 Skeleton (Moving Right) */}
      <div className="flex gap-4 sm:gap-6 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div
            key={idx}
            className="w-52 h-68 sm:w-64 sm:h-80 md:w-72 md:h-92 shrink-0 rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-2xs relative flex flex-col justify-end p-4"
          >
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10 w-28 h-6 rounded-lg bg-stone-300/60" />
          </div>
        ))}
      </div>

      {/* Row 2 Skeleton (Moving Left) */}
      <div className="flex gap-4 sm:gap-6 overflow-hidden">
        {[7, 8, 9, 10, 11, 12].map((idx) => (
          <div
            key={idx}
            className="w-52 h-68 sm:w-64 sm:h-80 md:w-72 md:h-92 shrink-0 rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-2xs relative flex flex-col justify-end p-4"
          >
            <div className="absolute inset-0 animate-shimmer" />
            <div className="relative z-10 w-32 h-6 rounded-lg bg-stone-300/60" />
          </div>
        ))}
      </div>
    </div>
  );
}
