'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GalleryRow from '@/components/GalleryRow';
import { getGalleryItems, INITIAL_SHOWCASE_PETS, GalleryItem } from '@/lib/galleryStorage';
import { ArrowLeft, Images, PlusCircle, Sparkles, User, AlertCircle, Camera } from 'lucide-react';
import Link from 'next/link';

const MAX_IMAGES_PER_ROW = 15;

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>(INITIAL_SHOWCASE_PETS);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

  // "Show My Image" modal state
  const [isMyImageModalOpen, setIsMyImageModalOpen] = useState(false);
  const [myPetInfo, setMyPetInfo] = useState<{ imageSrc: string; name: string } | null>(null);

  useEffect(() => {
    // Sync with local storage
    const stored = getGalleryItems();
    if (stored && stored.length > 0) {
      setItems(stored);
    }
  }, []);

  // Partition items into rows of up to 15 images each
  const rows = useMemo(() => {
    if (items.length === 0) return [];
    const chunks: GalleryItem[][] = [];
    for (let i = 0; i < items.length; i += MAX_IMAGES_PER_ROW) {
      chunks.push(items.slice(i, i + MAX_IMAGES_PER_ROW));
    }
    return chunks;
  }, [items]);

  // Handler for "Show My Image" button
  const handleShowMyImage = () => {
    if (typeof window === 'undefined') return;

    // 1. Check if user added a pet to gallery
    const userAddedInGallery = items.find(item => item.isUserAdded);

    // 2. Check if user uploaded an image on the site during this session
    const lastUploadedImage = localStorage.getItem('nameforpet_last_uploaded_image');
    const lastUploadedName = localStorage.getItem('nameforpet_last_uploaded_name');

    if (userAddedInGallery) {
      setMyPetInfo({
        imageSrc: userAddedInGallery.imageSrc,
        name: userAddedInGallery.name,
      });
    } else if (lastUploadedImage) {
      setMyPetInfo({
        imageSrc: lastUploadedImage,
        name: lastUploadedName || 'Your Lovely Pet',
      });
    } else {
      setMyPetInfo(null);
    }

    setIsMyImageModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 w-full py-5 sm:py-8 flex flex-col justify-between">
        
        {/* Top Header Section */}
        <div className="max-w-6xl w-full mx-auto px-3 sm:px-6 mb-4 sm:mb-6">
          
          {/* Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 mb-4 sm:mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-brand-600 transition-colors px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to AI Name Finder</span>
            </Link>

            <div className="flex items-center gap-2">
              {/* Show My Image Button */}
              <button
                type="button"
                onClick={handleShowMyImage}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-200/90 font-extrabold text-xs shadow-2xs transition-all active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-brand-500" />
                <span>Show My Image</span>
              </button>

              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Your Pet</span>
              </Link>
            </div>
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

            <p className="mt-1.5 text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Each row stores up to 15 pets. Use the arrow keys on each row to manually explore every photo.
            </p>
          </div>

        </div>

        {/* ── RUNNING ROWS (Max 15 images per row, adding newer rows as needed) ── */}
        <div className="w-full space-y-6 sm:space-y-8 py-2">
          {rows.map((rowChunk, idx) => (
            <GalleryRow
              key={`gallery-row-${idx}`}
              rowItems={rowChunk}
              rowIndex={idx}
              direction={idx % 2 === 0 ? 'right' : 'left'}
              onSelectPet={setPreviewItem}
            />
          ))}
        </div>

        {/* Bottom Quick Callout */}
        <div className="max-w-md mx-auto text-center px-4 mt-6">
          <p className="text-[11px] text-stone-400">
            {items.length} happy pets featured across {rows.length} row{rows.length > 1 ? 's' : ''} · Max 15 per row
          </p>
        </div>

      </main>

      {/* ── "SHOW MY IMAGE" MODAL ── */}
      {isMyImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div
            onClick={() => setIsMyImageModalOpen(false)}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 overflow-hidden flex flex-col p-6 text-center">
            <button
              onClick={() => setIsMyImageModalOpen(false)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            {myPetInfo ? (
              /* User Uploaded Pet Exists */
              <div className="animate-fade-in">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Your Uploaded Pet</span>
                </div>

                <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 mb-3.5 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={myPetInfo.imageSrc}
                    alt={myPetInfo.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3 left-4 text-white">
                    <h3 className="text-2xl font-black drop-shadow-md">
                      {myPetInfo.name}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-stone-500 mb-4">
                  Here is the pet image you uploaded to <strong>nameforpet.com</strong>!
                </p>

                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMyImageModalOpen(false)}
                    className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors"
                  >
                    Close
                  </button>
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                  >
                    Upload Another Pet
                  </Link>
                </div>
              </div>
            ) : (
              /* User Did NOT Upload Image */
              <div className="py-2 animate-fade-in">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 border border-amber-200 flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <AlertCircle className="w-7 h-7" />
                </div>

                <h3 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight mb-2">
                  unfortunately you did&apos;t uploaded your pet image
                </h3>

                <p className="text-xs sm:text-sm text-stone-500 mb-6 max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t uploaded a photo of your pet yet. Snap or select a picture on our homepage to find their perfect AI name and feature them here!
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <Link
                    href="/"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Upload Your Pet Now</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => setIsMyImageModalOpen(false)}
                    className="w-full sm:w-auto px-5 py-3 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CARD CLICK DETAIL PREVIEW MODAL ── */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in">
          <div
            onClick={() => setPreviewItem(null)}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 z-10 overflow-hidden flex flex-col">
            <button
              onClick={() => setPreviewItem(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            >
              ✕
            </button>

            {/* Pet Image */}
            <div className="relative w-full aspect-[4/3] bg-stone-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewItem.imageSrc}
                alt={previewItem.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 text-white">
                <h2 className="text-2xl sm:text-3xl font-black drop-shadow-md">
                  {previewItem.name}
                </h2>
              </div>
            </div>

            {/* Pet Info */}
            <div className="p-5 text-center">
              {previewItem.meaning && (
                <p className="text-xs sm:text-sm text-stone-600 mb-4 bg-stone-50 rounded-2xl p-3 border border-stone-100">
                  &ldquo;{previewItem.meaning}&rdquo;
                </p>
              )}

              <div className="flex items-center gap-2 justify-center">
                <Link
                  href="/"
                  className="px-5 py-2.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Name Your Pet</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
