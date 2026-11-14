'use client';

import React, { useState, useEffect } from 'react';
import { RecommendedName, PetAnalysisResult } from '@/lib/types';
import { addGalleryItem, isItemInGallery } from '@/lib/galleryStorage';
import { X, Volume2, Globe, Sparkles, Check, Images, ArrowRight, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import Link from 'next/link';

interface PetNameDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  nameItem: RecommendedName | null;
  petImageSrc: string | null;
  analysis: PetAnalysisResult | null;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function PetNameDetailModal({
  isOpen,
  onClose,
  nameItem,
  petImageSrc,
  analysis,
  isSaved = false,
  onToggleSave,
}: PetNameDetailModalProps) {
  const [addedToGallery, setAddedToGallery] = useState(false);

  useEffect(() => {
    if (nameItem && petImageSrc) {
      setAddedToGallery(isItemInGallery(nameItem.name, petImageSrc));
    }
  }, [nameItem, petImageSrc]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !nameItem || !petImageSrc) return null;

  const cleanName = nameItem.name.split('(')[0].trim();

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(cleanName);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAddToGallery = () => {
    if (!nameItem || !petImageSrc) return;
    addGalleryItem({
      name: nameItem.name,
      meaning: nameItem.meaning,
      language: nameItem.origin_language,
      species: (analysis?.detectedSpecies as string) || 'other',
      breed: analysis?.detectedBreed || 'Pet Companion',
      imageSrc: petImageSrc,
    });
    setAddedToGallery(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#ec4899', '#3b82f6']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      {/* Blurred Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl max-h-[90dvh] overflow-y-auto bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200/90 z-10 flex flex-col">
        
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all duration-200"
          aria-label="Close popup"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* 1. PET IMAGE DISPLAY */}
        <div className="relative w-full h-44 sm:h-72 bg-stone-100 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={petImageSrc}
            alt="Your Pet"
            className="w-full h-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

          {/* Species / Breed Tag */}
          <div className="absolute bottom-2.5 left-3 right-3 sm:bottom-3 sm:left-4 sm:right-4 flex items-center justify-between text-white text-[11px] sm:text-xs font-semibold">
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20">
              🐾 {analysis?.detectedBreed || 'Pet Companion'}
            </span>
            <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-brand-500/90 backdrop-blur-md text-white font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {nameItem.matchScore}% Match
            </span>
          </div>
        </div>

        {/* 2. PET NAME & DETAILS UNDER THE IMAGE */}
        <div className="p-4 sm:p-7 flex flex-col flex-1">
          
          {/* Name Header & Pronunciation */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
                {nameItem.name}
              </h2>
              <button
                type="button"
                onClick={handleSpeak}
                title="Hear pronunciation aloud"
                className="p-1.5 sm:p-2 rounded-full text-stone-400 hover:text-brand-500 hover:bg-brand-50 transition-colors"
              >
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {nameItem.pronunciation && (
              <p className="text-xs text-stone-400 font-mono mt-0.5">
                /{nameItem.pronunciation}/
              </p>
            )}

            {/* Badges: Language & Gender & AI Persona */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-2 sm:mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
                <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-500" />
                {nameItem.origin_language}
              </span>
              <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 capitalize">
                {nameItem.gender === 'unisex' ? 'Unisex' : `${nameItem.gender} name`}
              </span>
              {nameItem.aiPersona && (
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-extrabold border ${nameItem.aiPersona.badgeColor}`}>
                  <span>{nameItem.aiPersona.badgeIcon}</span>
                  <span>{nameItem.aiPersona.label} System</span>
                </span>
              )}
            </div>
          </div>

          {/* AI Persona Classification Explanation */}
          {nameItem.aiPersona && (
            <div className="mb-3 sm:mb-4 text-xs bg-amber-50/70 border border-amber-200/80 rounded-2xl p-2.5 sm:p-3 text-stone-700 flex items-start gap-2 text-left">
              <span className="text-base shrink-0">{nameItem.aiPersona.badgeIcon}</span>
              <div>
                <p className="font-bold text-stone-900">AI Inner Persona System:</p>
                <p className="text-[11px] sm:text-xs text-stone-600 mt-0.5">{nameItem.aiPersona.reasoning}</p>
              </div>
            </div>
          )}

          {/* Meaning Description Card */}
          <div className="bg-stone-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-stone-200/80 mb-4 sm:mb-5 text-center">
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
              &ldquo;{nameItem.meaning}&rdquo;
            </p>
            {nameItem.fun_fact && (
              <p className="text-[11px] sm:text-xs text-brand-700 mt-1.5 font-medium bg-brand-50/70 py-0.5 px-2.5 rounded-lg border border-brand-100 inline-block">
                ✨ {nameItem.fun_fact}
              </p>
            )}
          </div>

          {/* 3. BUTTONS: SAVE TO FAVORITES & ADD TO GALLERY */}
          <div className="space-y-2.5 sm:space-y-3 mt-auto">
            
            {/* Primary Action: Favorite / Bookmark */}
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(nameItem.id)}
                className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-95 shadow-2xs ${
                  isSaved
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
                <span>{isSaved ? 'Saved to Favorites ❤️' : 'Save to Favorites'}</span>
              </button>
            )}

            {/* Secondary Action: Add to Pet Gallery */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddToGallery}
                disabled={addedToGallery}
                className={`flex-1 py-3 px-4 rounded-xl sm:rounded-2xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-2xs active:scale-95 ${
                  addedToGallery
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-stone-900 hover:bg-stone-800 text-white hover:shadow-md'
                }`}
              >
                {addedToGallery ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Added to Gallery!</span>
                  </>
                ) : (
                  <>
                    <Images className="w-4 h-4" />
                    <span>Add to Pet Gallery</span>
                  </>
                )}
              </button>

              {addedToGallery && (
                <Link
                  href="/gallery"
                  onClick={onClose}
                  className="px-3.5 py-3 rounded-xl sm:rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                >
                  <span>View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
