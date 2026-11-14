import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GallerySkeleton from '@/components/GallerySkeleton';
import { ArrowLeft, Images } from 'lucide-react';
import Link from 'next/link';

export default function GalleryLoading() {
  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full py-5 sm:py-8 flex flex-col justify-between">
        {/* Navigation Breadcrumb */}
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to AI Name Finder</span>
            </Link>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-stone-200 shadow-2xs text-[11px] sm:text-xs font-bold text-stone-700 mb-2.5">
              <Images className="w-3.5 h-3.5 text-brand-500" />
              <span>Live Running Pet Showcase</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
              Pet Name{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-amber-500 to-rose-400">
                Gallery
              </span>
            </h1>
          </div>
        </div>

        {/* Skeleton Running Rows */}
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-6">
          <GallerySkeleton />
        </div>
      </main>

      <Footer />
    </div>
  );
}
