'use client';

import React, { useState } from 'react';
import { GalleryItem } from '@/lib/galleryStorage';

interface GalleryCardProps {
  item: GalleryItem;
  priority?: boolean;
  onClick?: () => void;
}

export default function GalleryCard({ item, priority = false, onClick }: GalleryCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div
      onClick={onClick}
      className="relative w-52 h-68 sm:w-64 sm:h-80 md:w-72 md:h-92 shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer select-none"
    >
      {/* Shimmer skeleton while image downloads */}
      {!imageLoaded && (
        <div className="absolute inset-0 animate-shimmer z-0" />
      )}

      {/* Pet Image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.imageSrc}
        alt={item.name}
        fetchPriority={priority ? 'high' : undefined}
        loading={priority ? undefined : 'lazy'}
        decoding="async"
        onLoad={() => setImageLoaded(true)}
        className={`w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out ${
          imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Smooth Dark Gradient Overlay for Name Clarity */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none transition-opacity duration-300 group-hover:from-black/90" />

      {/* Pet Name Only */}
      <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 pointer-events-none">
        <h3 className="text-white font-black text-lg sm:text-2xl md:text-3xl tracking-tight drop-shadow-md truncate">
          {item.name}
        </h3>
      </div>
    </div>
  );
}
