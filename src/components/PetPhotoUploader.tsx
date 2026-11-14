'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, FileImage } from 'lucide-react';

interface PetPhotoUploaderProps {
  onImageSelected: (imageDataUrl: string, fileName?: string) => void;
  isLoading: boolean;
}

// Sample test pets with diverse colors & breeds + non-pet test sample
export const SAMPLE_PETS = [
  {
    label: 'Golden Puppy',
    species: 'Dog',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    colorName: 'Golden Honey'
  },
  {
    label: 'Midnight Cat',
    species: 'Cat',
    url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    colorName: 'Sleek Black'
  },
  {
    label: 'Ginger Tabby',
    species: 'Cat',
    url: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80',
    colorName: 'Warm Amber'
  },
  {
    label: 'White Bunny',
    species: 'Rabbit',
    url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
    colorName: 'Pure White'
  },
  {
    label: 'Tricolor Beagle',
    species: 'Dog',
    url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=600&q=80',
    colorName: 'Tricolor'
  },
  {
    label: 'Coffee Mug (Test Non-Pet)',
    species: 'Object',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
    colorName: 'Ceramic White',
    isNonPet: true
  }
];

export default function PetPhotoUploader({ onImageSelected, isLoading }: PetPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_MB = 15;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const processFile = useCallback((file: File) => {
    // 1. Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    // 2. Validate file size (Max 10 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(1);
      setErrorMessage(`Photo is too large (${fileSizeInMB} MB). Maximum allowed size is ${MAX_FILE_SIZE_MB} MB.`);
      return;
    }

    // Clear any previous error and proceed
    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected, MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSampleClick = async (url: string) => {
    try {
      // Convert external image to base64 Data URL so canvas analysis has full cross-origin access
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string, 'sample-pet.jpg');
      };
      reader.readAsDataURL(blob);
    } catch {
      // Fallback: pass direct url
      onImageSelected(url, 'sample-pet.jpg');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* File Size / Error Alert */}
      {errorMessage && (
        <div className="mb-3.5 px-4 py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-semibold flex items-center justify-between gap-2.5 shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setErrorMessage(null);
            }}
            className="text-rose-400 hover:text-rose-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-rose-100 transition-colors"
            title="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* Drag & Drop Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden cursor-pointer rounded-2xl sm:rounded-3xl border-2 border-dashed p-5 sm:p-10 text-center transition-all duration-300 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-brand-400 bg-white shadow-xs hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onClick={(e) => {
            (e.target as HTMLInputElement).value = '';
          }}
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-2xl sm:rounded-3xl bg-brand-100 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-105 transition-transform">
            <Camera className="w-7 h-7 sm:w-10 sm:h-10 stroke-[1.6]" />
          </div>

          <h3 className="text-lg sm:text-2xl font-black text-stone-800 tracking-tight">
            Upload your pet&apos;s photo
          </h3>
          <p className="mt-1.5 text-stone-500 text-xs sm:text-sm max-w-md px-2 leading-relaxed">
            Drag &amp; drop an image here, or browse files. Our Vision AI detects coat colors, breed traits, and suggests matching pet names!
          </p>

          <div className="mt-5 flex items-center justify-center w-full sm:w-auto">
            <button
              type="button"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>
          </div>

          <div className="mt-3.5 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 font-medium">
            <FileImage className="w-3.5 h-3.5 text-stone-400" />
            <span>Supports JPG, PNG, WEBP · Max 15 MB</span>
          </div>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Or try with sample pets
          </span>
          <span className="text-[11px] text-stone-400">Swipe to view all ➔</span>
        </div>

        {/* Mobile Horizontal Snap Scroll / Desktop Grid */}
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-6 gap-2.5 overflow-x-auto pb-2 pt-0.5 -mx-3 px-3 sm:mx-0 sm:px-0 sm:overflow-visible no-scrollbar snap-x">
          {SAMPLE_PETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSampleClick(sample.url)}
              className={`group shrink-0 w-28 sm:w-auto snap-start text-left p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all flex flex-col items-center ${
                sample.isNonPet
                  ? 'bg-amber-50/50 border-amber-300 hover:border-amber-400 hover:bg-amber-50'
                  : 'bg-white border-stone-200/80 hover:border-brand-400 hover:shadow-md'
              }`}
            >
              <div className="w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-stone-100 mb-1.5 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
                {sample.isNonPet && (
                  <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                    Non-Pet
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-stone-800 truncate w-full text-center">
                {sample.label}
              </span>
              <span className="text-[9px] sm:text-[10px] text-stone-400 truncate w-full text-center">
                {sample.isNonPet ? 'AI Rejection' : sample.colorName}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
