'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Camera, Upload, Sparkles } from 'lucide-react';

interface PetPhotoUploaderProps {
  onImageSelected: (imageDataUrl: string, fileName?: string) => void;
  isLoading: boolean;
}

// Sample test pets with diverse colors & breeds
const SAMPLE_PETS = [
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
  }
];

export default function PetPhotoUploader({ onImageSelected, isLoading }: PetPhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageSelected(result, file.name);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

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
      
      {/* Drag & Drop Card */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`relative overflow-hidden cursor-pointer rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-brand-400 bg-white shadow-sm hover:shadow-md'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              processFile(e.target.files[0]);
            }
          }}
        />

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 mb-4 rounded-3xl bg-brand-100 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-110 transition-transform">
            <Camera className="w-10 h-10 stroke-[1.6]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
            Upload your pet&apos;s photo
          </h3>
          <p className="mt-2 text-stone-500 text-sm max-w-md">
            Drag & drop an image here, or browse files. Our built-in vision AI will analyze their coat colors, features, and vibe to find perfect matching names!
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              disabled={isLoading}
              className="px-6 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-full shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              <span>Choose Photo</span>
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
            <span>Supports JPG, PNG, WEBP</span>
            <span>•</span>
            <span>Zero cloud API fees</span>
          </div>
        </div>
      </div>

      {/* Quick Test Samples */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Or try with sample pets
          </span>
          <span className="text-xs text-stone-400">Click to test instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {SAMPLE_PETS.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => handleSampleClick(sample.url)}
              className="group text-left p-2 bg-white rounded-2xl border border-stone-200/80 hover:border-brand-400 hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className="w-full aspect-square rounded-xl overflow-hidden bg-stone-100 mb-2 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.url}
                  alt={sample.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  crossOrigin="anonymous"
                />
              </div>
              <span className="text-xs font-semibold text-stone-700 truncate w-full text-center">
                {sample.label}
              </span>
              <span className="text-[10px] text-stone-400 truncate w-full text-center">
                {sample.colorName}
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
