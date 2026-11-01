'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetPhotoUploader from '@/components/PetPhotoUploader';
import AIScannerView from '@/components/AIScannerView';
import ResultsDisplay from '@/components/ResultsDisplay';
import ExploreModal from '@/components/ExploreModal';
import SavedModal from '@/components/SavedModal';
import SupabaseSetupBanner from '@/components/SupabaseSetupBanner';
import { PetAnalysisResult, RecommendedName, UserPreferences, PetNameRecord } from '@/lib/types';
import { analyzePetImage, matchPetNames } from '@/lib/petVisionAI';
import { getPetNames, getLocalFavorites, toggleLocalFavorite, isSupabaseConfigured } from '@/lib/supabaseClient';
import { Globe2, ShieldCheck, Zap } from 'lucide-react';

export default function Home() {
  const [allNames, setAllNames] = useState<PetNameRecord[]>([]);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PetAnalysisResult | null>(null);
  const [recommendedNames, setRecommendedNames] = useState<RecommendedName[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    targetLanguage: 'All Languages',
    gender: 'all',
    vibe: 'all'
  });

  // Load pet names from Supabase (or fallback) and local favorites on mount
  useEffect(() => {
    async function loadData() {
      const res = await getPetNames();
      setAllNames(res.names);
      setSavedIds(getLocalFavorites());
    }
    loadData();
  }, []);

  // Handle image upload and trigger Built-in AI Vision analysis
  const handleImageSelected = async (dataUrl: string) => {
    setUploadedImageSrc(dataUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Create a temporary image element for computer vision & canvas processing
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;

    img.onload = async () => {
      try {
        // Run our built-in zero-external-API pet vision analyzer
        const result = await analyzePetImage(img);
        
        // Allow user to experience the scan animation naturally
        setTimeout(() => {
          setAnalysisResult(result);
          const matched = matchPetNames(result, allNames, preferences);
          setRecommendedNames(matched);
          setIsAnalyzing(false);
        }, 1800);
      } catch (err) {
        console.error('Analysis error:', err);
        setIsAnalyzing(false);
      }
    };

    img.onerror = () => {
      alert('Could not load the image for analysis. Please try another photo.');
      setIsAnalyzing(false);
    };
  };

  // Recalculate matches when user updates preferences (e.g. language or gender filter)
  const handlePreferencesChange = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    if (analysisResult) {
      const matched = matchPetNames(analysisResult, allNames, newPrefs);
      setRecommendedNames(matched);
    }
  };

  const handleToggleSave = (id: string) => {
    const next = toggleLocalFavorite(id);
    setSavedIds(next);
  };

  const handleClearSaved = () => {
    localStorage.removeItem('loveforpet_favorites');
    setSavedIds([]);
  };

  const handleReset = () => {
    setUploadedImageSrc(null);
    setAnalysisResult(null);
    setRecommendedNames([]);
    setIsAnalyzing(false);
  };

  const savedNameRecords = allNames.filter((n) => savedIds.includes(n.id));

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900">
      
      {/* Navigation */}
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onOpenExplore={() => setIsExploreOpen(true)}
        onResetHome={handleReset}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        
        {/* Main Hero Header */}
        {!uploadedImageSrc && (
          <div className="text-center max-w-3xl mx-auto mb-10 animate-fade-in">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200/80 shadow-xs mb-5 text-stone-700 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Self-Hosted Vision AI • Zero Cloud API Costs</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-stone-900 tracking-tight leading-[1.15]">
              Give your pet a name as special as their{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-amber-500 to-rose-400">
                true spirit
              </span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
              Upload a picture of your pet. Our built-in vision AI identifies their coat colors, features, and personality to recommend meaningful names across 14+ world languages.
            </p>

            {/* Quick feature pill highlights */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-4 h-4 text-brand-500" />
                14+ World Languages
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                Instant On-Device AI
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Free & Private
              </span>
            </div>

          </div>
        )}

        {/* Dynamic Interactive Stage */}
        <div className="transition-all duration-300">
          {!uploadedImageSrc && (
            <PetPhotoUploader
              onImageSelected={handleImageSelected}
              isLoading={isAnalyzing}
            />
          )}

          {uploadedImageSrc && isAnalyzing && (
            <AIScannerView imageSrc={uploadedImageSrc} />
          )}

          {uploadedImageSrc && !isAnalyzing && analysisResult && (
            <ResultsDisplay
              imageSrc={uploadedImageSrc}
              analysis={analysisResult}
              recommendedNames={recommendedNames}
              preferences={preferences}
              onPreferencesChange={handlePreferencesChange}
              onReset={handleReset}
              savedIds={savedIds}
              onToggleSave={handleToggleSave}
            />
          )}
        </div>

        {/* Supabase Status & Setup Guide Banner */}
        <SupabaseSetupBanner
          isConfigured={isSupabaseConfigured}
          totalNamesCount={allNames.length}
        />

      </main>

      {/* Modals */}
      <ExploreModal
        isOpen={isExploreOpen}
        onClose={() => setIsExploreOpen(false)}
        allNames={allNames}
        savedIds={savedIds}
        onToggleSave={handleToggleSave}
      />

      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedNames={savedNameRecords}
        onRemove={handleToggleSave}
        onClearAll={handleClearSaved}
      />

      {/* Footer */}
      <Footer />

    </div>
  );
}
