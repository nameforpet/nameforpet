'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, FileImage, X, RotateCcw, Check, RefreshCw } from 'lucide-react';

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
  
  // Camera Modal States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const MAX_FILE_SIZE_MB = 15;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

  const processFile = useCallback((file: File) => {
    // 1. Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPG, PNG, or WEBP).');
      return;
    }

    // 2. Validate file size (Max 15 MB)
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

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [cameraStream]);

  // Bind video element when stream is ready
  useEffect(() => {
    if (videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
      videoRef.current.play().catch(() => {});
    }
  }, [cameraStream, isCameraOpen]);

  // ── CAMERA ACTIONS ────────────────────────────────────────────────────────
  const startCamera = async (mode: 'environment' | 'user' = 'environment') => {
    setCameraError(null);
    setCapturedImage(null);
    setIsCameraOpen(true);

    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
    }

    // Check if mediaDevices is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      // Fallback directly to native device camera input
      setIsCameraOpen(false);
      nativeCameraInputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      });

      setCameraStream(stream);
      setFacingMode(mode);
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraError('Camera access was blocked or is unavailable. You can take a photo using your device camera below:');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
    setCapturedImage(null);
    setCameraError(null);
  };

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    startCamera(nextMode);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Flip horizontally if front camera for natural mirror preview
    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
  };

  const confirmCapturedPhoto = () => {
    if (!capturedImage) return;
    const photoToUse = capturedImage;
    stopCamera();
    onImageSelected(photoToUse, 'camera-pet-photo.jpg');
  };

  // ── DRAG AND DROP HANDLERS ────────────────────────────────────────────────
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
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSelected(reader.result as string, 'sample-pet.jpg');
      };
      reader.readAsDataURL(blob);
    } catch {
      onImageSelected(url, 'sample-pet.jpg');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      
      {/* Hidden File Inputs */}
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

      {/* Native Mobile Camera Input */}
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
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
            className="text-rose-400 hover:text-rose-700 text-xs font-bold px-1.5 py-0.5 rounded hover:bg-rose-100 transition-colors cursor-pointer"
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
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-10 text-center transition-all duration-300 ${
          isDragging
            ? 'border-brand-500 bg-brand-50/70 scale-[1.01]'
            : 'border-stone-300 hover:border-brand-400 bg-white shadow-xs hover:shadow-md'
        }`}
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mb-3 sm:mb-4 rounded-2xl sm:rounded-3xl bg-brand-100 flex items-center justify-center text-brand-600 shadow-inner group-hover:scale-105 transition-transform">
            <Camera className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.6]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-stone-800 tracking-tight">
            Add Your Pet&apos;s Photo
          </h3>
          <p className="mt-1.5 text-stone-500 text-xs sm:text-sm max-w-md px-2 leading-relaxed">
            Snap a live picture of your pet or upload a photo. Our Vision AI scans coat colors, eye shades, and breed traits to suggest personalized names!
          </p>

          {/* Action Buttons: Take Picture & Choose Photo */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
            {/* Primary: Take Live Picture */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => startCamera('environment')}
              className="w-full sm:w-auto px-6 py-3.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl sm:rounded-full shadow-md shadow-brand-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2.5 text-sm active:scale-95 cursor-pointer"
            >
              <Camera className="w-4 h-4 stroke-[2.2]" />
              <span>Take a Picture</span>
            </button>

            {/* Secondary: Choose / Upload from Device */}
            <button
              type="button"
              disabled={isLoading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-2xl sm:rounded-full shadow-md transition-all flex items-center justify-center gap-2.5 text-sm active:scale-95 cursor-pointer"
            >
              <Upload className="w-4 h-4 stroke-[2.2]" />
              <span>Upload Photo</span>
            </button>
          </div>

          <div className="mt-4 inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 font-medium">
            <FileImage className="w-3.5 h-3.5 text-stone-400" />
            <span>Works with Camera or JPG, PNG, WEBP · Max 15 MB</span>
          </div>
        </div>
      </div>

      {/* ── LIVE CAMERA VIEWFINDER MODAL ── */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in bg-stone-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-stone-900 rounded-3xl overflow-hidden shadow-2xl border border-stone-700 flex flex-col">
            
            {/* Header */}
            <div className="p-4 px-5 flex items-center justify-between border-b border-stone-800 text-white">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Camera className="w-4 h-4 text-brand-400" />
                <span>Take Pet Photo</span>
              </div>
              <button
                type="button"
                onClick={stopCamera}
                className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Camera"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Viewfinder / Capture Box */}
            <div className="relative w-full aspect-4/3 sm:aspect-16/10 bg-black overflow-hidden flex items-center justify-center">
              {cameraError ? (
                <div className="p-6 text-center text-stone-300 space-y-4 max-w-sm">
                  <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
                  <p className="text-xs leading-relaxed">{cameraError}</p>
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      nativeCameraInputRef.current?.click();
                    }}
                    className="w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Open Device Camera</span>
                  </button>
                </div>
              ) : capturedImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={capturedImage}
                  alt="Captured Pet"
                  className="w-full h-full object-cover animate-fade-in"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    playsInline
                    autoPlay
                    muted
                    className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                  />
                  
                  {/* Framing Reticle */}
                  <div className="absolute inset-8 sm:inset-12 border-2 border-white/40 border-dashed rounded-3xl pointer-events-none flex flex-col items-center justify-between p-4">
                    <span className="text-[11px] font-bold text-white/90 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                      🐾 Point at your pet
                    </span>
                    <span className="text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded-full">
                      Ensure good lighting
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="p-4 sm:p-5 bg-stone-900 border-t border-stone-800 flex items-center justify-between gap-3">
              {capturedImage ? (
                /* Post-Capture Confirmation Controls */
                <div className="w-full flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 py-3 px-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-stone-400" />
                    <span>Retake</span>
                  </button>

                  <button
                    type="button"
                    onClick={confirmCapturedPhoto}
                    className="flex-2 py-3 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-brand-500/30 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Use Photo &amp; Analyze</span>
                  </button>
                </div>
              ) : (
                /* Live Shutter Controls */
                <div className="w-full flex items-center justify-between">
                  {/* Switch Camera Button (Front / Rear) */}
                  <button
                    type="button"
                    onClick={switchCamera}
                    disabled={!!cameraError}
                    className="w-11 h-11 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  {/* Big Shutter Button */}
                  <button
                    type="button"
                    disabled={!!cameraError}
                    onClick={takeSnapshot}
                    className="w-16 h-16 rounded-full p-1 bg-white hover:bg-stone-200 transition-all active:scale-95 shadow-lg flex items-center justify-center cursor-pointer disabled:opacity-30"
                    aria-label="Capture Photo"
                  >
                    <div className="w-13 h-13 rounded-full bg-brand-500 border-2 border-white hover:bg-brand-600 transition-colors" />
                  </button>

                  {/* Native Camera Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      stopCamera();
                      nativeCameraInputRef.current?.click();
                    }}
                    className="px-3 py-2 rounded-2xl bg-stone-800 hover:bg-stone-700 text-[11px] font-bold text-stone-300 transition-colors cursor-pointer"
                  >
                    Native App
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

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
