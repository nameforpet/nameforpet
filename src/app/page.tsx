'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PetPhotoUploader from '@/components/PetPhotoUploader';
import AIScannerView from '@/components/AIScannerView';
import ResultsDisplay from '@/components/ResultsDisplay';
import PetNameDetailModal from '@/components/PetNameDetailModal';
import AnimatedStats from '@/components/AnimatedStats';
import SavedModal from '@/components/SavedModal';
import HomeSEOSection from '@/components/HomeSEOSection';
import AuthModal from '@/components/AuthModal';
import { getCurrentUser, setCurrentUser, saveUserLocally } from '@/lib/userStorage';
import { PetAnalysisResult, RecommendedName, UserPreferences, PetNameRecord, PetSpecies, RegisteredUser } from '@/lib/types';
import { analyzePetImage, matchPetNames, deriveSpeciesAdjustment } from '@/lib/petVisionAI';
import { getPetNames, getLocalFavorites, toggleLocalFavorite, isSupabaseConfigured, supabase } from '@/lib/supabaseClient';
import { Globe2, ShieldCheck, Zap, Camera, Sparkles } from 'lucide-react';

// ── Floating language chips for the hero decoration ────────────────────────
const LANG_CHIPS = [
  { name: 'Mochi', lang: 'Japanese', emoji: '🇯🇵' },
  { name: 'Luna', lang: 'Spanish', emoji: '🇪🇸' },
  { name: 'Freya', lang: 'Norse', emoji: '🇳🇴' },
  { name: 'Simba', lang: 'Swahili', emoji: '🌍' },
  { name: 'Nabi', lang: 'Korean', emoji: '🇰🇷' },
  { name: 'Bella', lang: 'Italian', emoji: '🇮🇹' },
];

export default function Home() {
  const [allNames, setAllNames] = useState<PetNameRecord[]>([]);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<PetAnalysisResult | null>(null);
  const [recommendedNames, setRecommendedNames] = useState<RecommendedName[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedPetName, setSelectedPetName] = useState<RecommendedName | null>(null);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [activeChip, setActiveChip] = useState(0);
  const [currentUser, setCurrentUserSession] = useState<RegisteredUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [preferences, setPreferences] = useState<UserPreferences>({
    targetLanguage: 'All Languages',
    gender: 'all',
    vibe: 'all'
  });

  useEffect(() => {
    setCurrentUserSession(getCurrentUser());

    // Check for Supabase OAuth redirect session (e.g. Google Sign-In redirect)
    if (isSupabaseConfigured && supabase) {
      const syncSessionUser = (user: { id: string; email?: string; created_at?: string; user_metadata?: { full_name?: string; avatar_url?: string } }) => {
        const email = (user.email || 'user@gmail.com').toLowerCase();
        const name = user.user_metadata?.full_name || email.split('@')[0];
        const isOwner = email.includes('hinduwara') || email.includes('nameforpet') || email.startsWith('admin@');
        const oauthUser: RegisteredUser = {
          id: `USR-G${user.id.slice(0, 6)}`,
          name,
          email,
          createdAt: user.created_at || new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          role: isOwner ? 'admin' : 'user',
          savedNamesCount: 0,
          ordersCount: 0,
          provider: 'google',
          avatarUrl: user.user_metadata?.avatar_url
        };
        saveUserLocally(oauthUser);
        setCurrentUser(oauthUser);
        setCurrentUserSession(oauthUser);
      };

      // 1. Initial check
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          syncSessionUser(session.user);
        }
      });

      // 2. Real-time auth state listener (for OAuth redirect hash parsing)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          syncSessionUser(session.user);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    }

    async function loadData() {
      const res = await getPetNames();
      setAllNames(res.names);
      setSavedIds(getLocalFavorites());
    }
    loadData();
  }, []);

  // Rotate language chips
  useEffect(() => {
    const t = setInterval(() => setActiveChip(c => (c + 1) % LANG_CHIPS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const handleImageSelected = async (dataUrl: string) => {
    setUploadedImageSrc(dataUrl);
    try {
      localStorage.setItem('nameforpet_last_uploaded_image', dataUrl);
    } catch {}
    setIsAnalyzing(true);
    setAnalysisResult(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataUrl;

    const triggerAnalysis = async () => {
      try {
        // Run AI analysis with a parallel minimum 1.5s scanner animation so the transition feels smooth
        const [result] = await Promise.all([
          analyzePetImage(img),
          new Promise(r => setTimeout(r, 1400))
        ]);

        setAnalysisResult(result);
        if (result && result.isAnimal) {
          const matched = matchPetNames(result, allNames, preferences);
          setRecommendedNames(matched);
        } else {
          setRecommendedNames([]);
        }
      } catch (err) {
        console.error('Analysis error:', err);
      } finally {
        setIsAnalyzing(false);
      }
    };

    if (img.complete && img.naturalWidth !== 0) {
      triggerAnalysis();
    } else {
      img.onload = () => triggerAnalysis();
      img.onerror = () => {
        alert('Could not load the image. Please try another photo.');
        setIsAnalyzing(false);
      };
    }
  };

  const handleSampleSelect = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageSelected(reader.result as string);
      };
      reader.readAsDataURL(blob);
    } catch {
      handleImageSelected(url);
    }
  };

  const handlePreferencesChange = (newPrefs: UserPreferences) => {
    setPreferences(newPrefs);
    if (analysisResult && analysisResult.isAnimal) {
      setRecommendedNames(matchPetNames(analysisResult, allNames, newPrefs));
    }
  };

  const handleToggleSave = (id: string) => setSavedIds(toggleLocalFavorite(id));
  const handleClearSaved = () => {
    localStorage.removeItem('nameforpet_favorites');
    localStorage.removeItem('loveforpet_favorites');
    setSavedIds([]);
  };
  const handleReset = () => {
    setUploadedImageSrc(null);
    setAnalysisResult(null);
    setRecommendedNames([]);
    setSelectedPetName(null);
    setIsAnalyzing(false);
  };

  const handleOverrideAsPet = () => {
    if (!analysisResult) return;
    const forcedResult: PetAnalysisResult = {
      ...analysisResult,
      isAnimal: true,
      detectedSpecies: 'dog',
      detectedBreed: `${analysisResult.dominantColors[0]?.name ?? 'Warm Coat'} Companion`,
      confidence: 88,
      vibe: 'Warm, Loving & Playful',
      subjectIsolated: true,
      description: 'Confirmed pet companion with beautiful natural coat tones.'
    };
    setAnalysisResult(forcedResult);
    setRecommendedNames(matchPetNames(forcedResult, allNames, preferences));
  };

  const handleSpeciesChange = (newSpecies: PetSpecies) => {
    if (!analysisResult) return;
    const updatedResult = deriveSpeciesAdjustment(analysisResult, newSpecies);
    setAnalysisResult(updatedResult);
    const matched = matchPetNames(updatedResult, allNames, preferences);
    setRecommendedNames(matched);
  };

  const handleBreedChange = (newBreed: string) => {
    if (!analysisResult) return;
    const updatedResult: PetAnalysisResult = {
      ...analysisResult,
      detectedBreed: newBreed,
      description: `Subject Pet Isolated: Verified your ${newBreed} with lovely coat tones.`
    };
    setAnalysisResult(updatedResult);
    const matched = matchPetNames(updatedResult, allNames, preferences);
    setRecommendedNames(matched);
  };

  const savedNameRecords = allNames.filter(n => savedIds.includes(n.id));
  const isHome = !uploadedImageSrc;

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        onResetHome={handleReset}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => {
          setCurrentUser(null);
          setCurrentUserSession(null);
        }}
      />

      <main id="main-content" className="flex-1 w-full">

        {/* ═══════════════════════════════════════════════════
            HERO — only shown when no photo uploaded
        ═══════════════════════════════════════════════════ */}
        {isHome && (
          <section className="max-w-6xl mx-auto px-3 sm:px-6 pt-6 sm:pt-16 pb-6 sm:pb-8">

            {/* ── Badge ── */}
            <div className="flex justify-center mb-3 sm:mb-5">
              <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-[11px] sm:text-xs font-semibold text-stone-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Vision AI · Zero API Costs
              </span>
            </div>

            {/* ── Headline ── */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-900 tracking-tight leading-[1.15] break-words">
                Find your pet&apos;s perfect name{' '}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-amber-500 to-rose-400">
                    with AI
                  </span>
                  {/* underline squiggle */}
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 140 8" fill="none">
                    <path d="M2 5 Q35 1 70 5 Q105 9 138 5" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
                  </svg>
                </span>
              </h1>

              <p className="mt-3 sm:mt-5 text-sm sm:text-lg text-stone-600 leading-relaxed max-w-xl mx-auto px-1">
                Upload your pet&apos;s photo on <strong>nameforpet.com</strong>. Our Vision AI scans their coat and features and suggests meaningful names across <strong>22+ languages</strong>!
              </p>
            </div>

            {/* ── Animated Stats: Languages, Names & Happy Users ── */}
            <AnimatedStats />

            {/* ── Rotating Language Chip ── */}
            <div className="mt-4 sm:mt-6 flex justify-center">
              <div className="flex items-center gap-2 sm:gap-3 px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full border border-stone-200 shadow-2xs text-xs sm:text-sm">
                <span className="text-stone-500 text-[11px] sm:text-xs font-medium">Now showing:</span>
                <span
                  key={activeChip}
                  className="font-bold text-stone-800 animate-fade-in"
                >
                  {LANG_CHIPS[activeChip].emoji} &ldquo;{LANG_CHIPS[activeChip].name}&rdquo;
                </span>
                <span className="text-[11px] sm:text-xs text-stone-400">{LANG_CHIPS[activeChip].lang}</span>
              </div>
            </div>

            {/* ── Feature Pills ── */}
            <div className="mt-4 sm:mt-5 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2.5 text-[11px] sm:text-xs text-stone-500 font-medium overflow-x-auto pb-1 sm:flex-wrap no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full border border-stone-200 shadow-2xs">
                <Globe2 className="w-3.5 h-3.5 text-brand-500" /> 22+ Languages
              </span>
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full border border-stone-200 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500" /> Instant On-Device
              </span>
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full border border-stone-200 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 100% Private
              </span>
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full border border-stone-200 shadow-2xs">
                <Camera className="w-3.5 h-3.5 text-sky-500" /> Dogs · Cats · Birds · Rabbits
              </span>
              <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white rounded-full border border-stone-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" /> 100% Free AI Generator
              </span>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════
            DYNAMIC STAGE
        ═══════════════════════════════════════════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6">
          {isHome && (
            <>
              <div className="mt-4">
                <PetPhotoUploader onImageSelected={handleImageSelected} isLoading={isAnalyzing} />
              </div>
              <HomeSEOSection />
            </>
          )}

          {uploadedImageSrc && isAnalyzing && (
            <div className="py-10">
              <AIScannerView imageSrc={uploadedImageSrc} />
            </div>
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
              onSelectSample={handleSampleSelect}
              onSelectName={(nameItem) => setSelectedPetName(nameItem)}
              onOverrideAsPet={handleOverrideAsPet}
              onSpeciesChange={handleSpeciesChange}
              onBreedChange={handleBreedChange}
            />
          )}

          {/* Modal when user clicks any pet name */}
          <PetNameDetailModal
            isOpen={!!selectedPetName}
            onClose={() => setSelectedPetName(null)}
            nameItem={selectedPetName}
            petImageSrc={uploadedImageSrc}
            analysis={analysisResult}
            isSaved={selectedPetName ? savedIds.includes(selectedPetName.id) : false}
            onToggleSave={handleToggleSave}
          />
        </div>
      </main>

      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedNames={savedNameRecords}
        onRemove={handleToggleSave}
        onClearAll={handleClearSaved}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => setCurrentUserSession(user)}
      />

      <Footer />
    </div>
  );
}
