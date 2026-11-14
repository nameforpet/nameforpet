'use client';

import React, { useState, useRef } from 'react';
import { PetAnalysisResult, RecommendedName, UserPreferences, PetGender, PetSpecies } from '@/lib/types';
import { AVAILABLE_LANGUAGES } from '@/lib/petNamesData';
import NameCard from './NameCard';
import {
  Sparkles,
  RefreshCw,
  Palette,
  Award,
  AlertTriangle,
  Upload,
  HelpCircle,
  Shuffle,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowRight,
  Filter,
  CheckCircle2,
  Eye,
  Edit3,
  Layers
} from 'lucide-react';
import { SAMPLE_PETS } from './PetPhotoUploader';
import confetti from 'canvas-confetti';

interface ResultsDisplayProps {
  imageSrc: string;
  analysis: PetAnalysisResult;
  recommendedNames: RecommendedName[];
  preferences: UserPreferences;
  onPreferencesChange: (newPrefs: UserPreferences) => void;
  onReset: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectSample?: (url: string) => void;
  onSelectName?: (nameItem: RecommendedName) => void;
  onOverrideAsPet?: () => void;
  onSpeciesChange?: (species: PetSpecies) => void;
  onBreedChange?: (breed: string) => void;
}

const POPULAR_LANGUAGES = [
  { id: 'All Languages', label: 'All Origins', flag: '🌍' },
  { id: 'English', label: 'English', flag: '🇬🇧' },
  { id: 'French', label: 'French', flag: '🇫🇷' },
  { id: 'Spanish', label: 'Spanish', flag: '🇪🇸' },
  { id: 'Italian', label: 'Italian', flag: '🇮🇹' },
  { id: 'German', label: 'German', flag: '🇩🇪' },
  { id: 'Danish', label: 'Danish', flag: '🇩🇰' },
  { id: 'Irish', label: 'Irish', flag: '🇮🇪' },
  { id: 'Japanese', label: 'Japanese', flag: '🇯🇵' },
];

const POPULAR_BREEDS: Record<string, string[]> = {
  cat: ['White Kitten', 'Orange Tabby', 'Tuxedo Cat', 'Calico Cat', 'Siamese Cat', 'Ragdoll Cat', 'British Shorthair', 'Persian Cat', 'Domestic Shorthair'],
  dog: ['Golden Retriever', 'Labrador Retriever', 'German Shepherd', 'French Bulldog', 'Welsh Corgi', 'Siberian Husky', 'Poodle', 'Beagle'],
  rabbit: ['Holland Lop Bunny', 'Netherland Dwarf', 'Fluffy Bunny', 'Lionhead Bunny'],
  bird: ['Canary', 'Budgerigar Parakeet', 'Cockatiel', 'Parrot']
};

export function cleanBreedName(breed: string): string {
  if (!breed) return 'Pet';
  const b = breed.trim();
  // Strip overly specific/obscure flame point Siamese combos to clean White/Cream Kitten
  if (b.toLowerCase().includes('flame point') || (b.toLowerCase().includes('cream') && b.toLowerCase().includes('siamese'))) {
    return b.toLowerCase().includes('kitten') ? 'White Kitten' : 'Flame Point Cat';
  }
  // Remove awkward long slashes like "Domestic Shorthair / Striped Tabby Mix"
  if (b.includes(' / ') && b.length > 20) {
    return b.split(' / ')[0].trim();
  }
  return b;
}

export function cleanDescriptionText(desc?: string, breed?: string): string {
  if (!desc) return `A lovely ${breed || 'companion'} with bright expressive eyes and a sweet personality.`;
  let d = desc.replace(/^Subject Pet Isolated:\s*(Verified a lovely\s*)?/i, '').trim();
  // Clean robotic "Verified a lovely"
  d = d.replace(/^Verified a lovely\s*/i, 'A lovely ').trim();
  if (d.length > 0) {
    d = d.charAt(0).toUpperCase() + d.slice(1);
  }
  return d;
}

export function cleanPatternText(pattern?: string): string {
  if (!pattern) return '';
  if (pattern.toLowerCase().includes('flame point')) {
    return 'Soft White & Cream Fur';
  }
  return pattern;
}

const GENDER_OPTIONS: { id: 'all' | PetGender; label: string; icon: string; desc: string }[] = [
  { id: 'all', label: 'Any / Unisex', icon: '🐾', desc: 'All names' },
  { id: 'male', label: 'Boy', icon: '♂️', desc: 'Male names' },
  { id: 'female', label: 'Girl', icon: '♀️', desc: 'Female names' },
  { id: 'unisex', label: 'Unisex Only', icon: '✨', desc: 'Neutral' },
];

const VIBE_OPTIONS = [
  { id: 'all', label: 'Any Persona', icon: '🌈', desc: 'All AI personas' },
  { id: 'cute', label: 'Cute & Sweet', icon: '🌸', desc: 'Soft & lovely' },
  { id: 'funny', label: 'Funny & Quirky', icon: '😂', desc: 'Witty & playful' },
  { id: 'luxury', label: 'Luxury & Royal', icon: '💎', desc: 'Regal & noble' },
  { id: 'brave', label: 'Brave & Bold', icon: '🦁', desc: 'Strong & fearless' },
  { id: 'gentle', label: 'Calm & Cozy', icon: '🌿', desc: 'Peaceful & sweet' },
  { id: 'mystical', label: 'Mystical & Rare', icon: '🔮', desc: 'Cosmic & magic' },
];

export default function ResultsDisplay({
  imageSrc,
  analysis,
  recommendedNames,
  preferences,
  onPreferencesChange,
  onReset,
  savedIds,
  onToggleSave,
  onSelectSample,
  onSelectName,
  onOverrideAsPet,
  onSpeciesChange,
  onBreedChange
}: ResultsDisplayProps) {
  // State for step-based flow: ask 3 questions first, then reveal 10 names
  const [hasRevealed, setHasRevealed] = useState(false);
  const [showQuestions, setShowQuestions] = useState(true);
  const [pageOffset, setPageOffset] = useState(0);
  const [showAiReasoning, setShowAiReasoning] = useState(false);
  const [isEditingBreed, setIsEditingBreed] = useState(false);
  const [customBreedInput, setCustomBreedInput] = useState('');

  const questionsRef = useRef<HTMLDivElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // ---------------------------------------------------------------------------
  // NON-ANIMAL / UNIDENTIFIABLE SCREEN
  // ---------------------------------------------------------------------------
  if (!analysis.isAnimal) {
    const onlyPets = SAMPLE_PETS.filter(s => !s.isNonPet);

    return (
      <div className="w-full max-w-4xl mx-auto animate-fade-in pb-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 border-2 border-amber-200/90 shadow-lg sm:shadow-xl shadow-amber-500/5 mb-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-4 sm:mb-5">
            <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
            No Animal or Pet Detected
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-5 sm:gap-8">
            
            {/* Image Thumbnail with Warning border */}
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-2xl sm:rounded-3xl overflow-hidden shrink-0 border-3 sm:border-4 border-amber-300 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt="Uploaded non-pet subject"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-stone-900/20" />
              <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg text-center text-[10px] sm:text-xs font-bold truncate">
                ⚠️ {analysis.identifiedObject || 'Non-Animal'}
              </div>
            </div>

            {/* AI Diagnosis Details */}
            <div className="flex-1 text-center md:text-left w-full">
              <h2 className="text-xl sm:text-3xl font-black text-stone-900 tracking-tight leading-snug">
                This image doesn&apos;t look like a pet
              </h2>

              {/* What AI Detected */}
              <div className="mt-3 p-3.5 sm:p-4 bg-amber-50/70 rounded-xl sm:rounded-2xl border border-amber-200 text-left">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-amber-800 mb-1">
                  <span>Vision AI Detection Result</span>
                  <span className="bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-full text-[10px] sm:text-xs">
                    {analysis.confidence}% Confidence
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700">
                  Our model identified: <strong className="text-stone-900 bg-white px-2 py-0.5 rounded-md border border-amber-200">{analysis.identifiedObject || 'Inanimate Object'}</strong>
                </p>
                <p className="text-[11px] sm:text-xs text-stone-600 mt-1.5 leading-relaxed">
                  {analysis.rejectionReason}
                </p>
              </div>

              {/* Extracted Colors */}
              {analysis.dominantColors.length > 0 && (
                <div className="mt-3.5 flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2.5">
                  <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                    <Palette className="w-3 h-3" />
                    Detected Colors:
                  </span>
                  {analysis.dominantColors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 px-2 py-0.5 bg-stone-50 rounded-full border border-stone-200 text-[11px] text-stone-700"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="font-medium">{color.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Helpful Tips */}
              <div className="mt-4 p-3 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200 text-left text-[11px] sm:text-xs text-stone-600 space-y-1">
                <p className="font-bold text-stone-700 flex items-center gap-1 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
                  Tips for best results:
                </p>
                <p>• Upload a clear, centered photo of your dog, cat, bird, rabbit, or other pet.</p>
                <p>• Avoid pictures of everyday objects (cars, cups, electronics, food, furniture).</p>
                <p>• Ensure good lighting so our AI can read coat textures and facial features.</p>
              </div>

              {/* Primary Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button
                  type="button"
                  onClick={onReset}
                  className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Another Photo</span>
                </button>

                {onOverrideAsPet && (
                  <button
                    type="button"
                    onClick={onOverrideAsPet}
                    className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-stone-50 text-stone-800 border-2 border-brand-300 font-extrabold rounded-full shadow-sm hover:border-brand-500 transition-all flex items-center justify-center gap-2 text-sm active:scale-95"
                  >
                    <span>🐾 This is my pet! Show names anyway</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Quick Pet Test Options */}
          {onSelectSample && (
            <div className="mt-6 sm:mt-8 pt-5 border-t border-stone-200">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                Or try one of these pet photos instantly:
              </p>
              <div className="flex sm:grid sm:grid-cols-5 gap-2.5 overflow-x-auto pb-2 no-scrollbar snap-x">
                {onlyPets.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onSelectSample(sample.url)}
                    className="shrink-0 w-28 sm:w-auto snap-start p-1.5 bg-stone-50 hover:bg-white rounded-xl sm:rounded-2xl border border-stone-200 hover:border-brand-400 hover:shadow-md transition-all flex flex-col items-center group text-left"
                  >
                    <div className="w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-stone-200 mb-1">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        crossOrigin="anonymous"
                      />
                    </div>
                    <span className="text-[11px] font-bold text-stone-800 truncate w-full text-center">
                      {sample.label}
                    </span>
                    <span className="text-[9px] text-stone-500 truncate w-full text-center">
                      {sample.colorName}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // HANDLERS FOR 3 QUESTIONS & REVEAL
  // ---------------------------------------------------------------------------
  const handleReveal = () => {
    setHasRevealed(true);
    setShowQuestions(false);
    setPageOffset(0);

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#f97316', '#fbbf24', '#f87171']
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleRandomize = () => {
    const randomLang = AVAILABLE_LANGUAGES[Math.floor(Math.random() * AVAILABLE_LANGUAGES.length)];
    const randomGender = (['all', 'male', 'female', 'unisex'] as const)[Math.floor(Math.random() * 4)];
    const randomVibe = VIBE_OPTIONS[Math.floor(Math.random() * VIBE_OPTIONS.length)].id;

    onPreferencesChange({
      targetLanguage: randomLang,
      gender: randomGender,
      vibe: randomVibe
    });
    setPageOffset(0);
    setHasRevealed(true);

    confetti({
      particleCount: 35,
      spread: 55,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleToggleQuestions = () => {
    const nextState = !showQuestions;
    setShowQuestions(nextState);
    if (nextState) {
      setTimeout(() => {
        questionsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Slice exactly 10 relevant names for display
  const totalNamesCount = recommendedNames.length;
  const maxPages = Math.ceil(totalNamesCount / 10);
  const currentTenNames = recommendedNames.slice(pageOffset * 10, pageOffset * 10 + 10);

  const handleNextTen = () => {
    if (maxPages > 1) {
      setPageOffset(prev => (prev + 1) % maxPages);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  // ---------------------------------------------------------------------------
  // ANIMAL CONFIRMED – RESULTS WITH 3 QUESTIONS & 10 NAMES
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-16">
      
      {/* ── Pet Identification Card (Remade for Clarity, Elegance & 1-Click Correction) ── */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-stone-200/90 shadow-sm mb-5 sm:mb-6">
        {/* Top Control Bar: Species Selector + Verified Tag + New Photo */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider hidden sm:inline">Species:</span>
            <div className="inline-flex items-center gap-1 bg-stone-100/90 p-0.5 rounded-full border border-stone-200/80">
              {(['dog', 'cat', 'rabbit', 'bird'] as const).map(sp => {
                const isSelected = analysis.detectedSpecies === sp;
                const icons: Record<string, string> = { dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦' };
                const labels: Record<string, string> = { dog: 'Dog', cat: 'Cat', rabbit: 'Rabbit', bird: 'Bird' };
                return (
                  <button
                    key={sp}
                    type="button"
                    onClick={() => onSpeciesChange?.(sp)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 ${
                      isSelected
                        ? 'bg-brand-500 text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                    }`}
                    title={`Switch to ${labels[sp]}`}
                  >
                    <span>{icons[sp]}</span>
                    <span>{labels[sp]}</span>
                  </button>
                );
              })}
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-1">
              <span>🎯 Pet Subject Verified</span>
            </span>
          </div>

          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 hover:border-brand-400 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs font-semibold shadow-2xs transition-all active:scale-95 ml-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
            <span>New Photo</span>
          </button>
        </div>

        {/* Hero Identification Body */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          {/* Pet Photo Thumbnail */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-100 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Analyzed Pet"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1.5 right-1.5 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              {analysis.confidence}% Match
            </div>
          </div>

          {/* AI Analysis Details */}
          <div className="flex-1 text-center sm:text-left w-full">
            {/* Headline with Clean Breed and Adjust Button */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-800 tracking-tight">
                Meet Your {cleanBreedName(analysis.detectedBreed)}!
              </h2>

              <div className="relative inline-flex items-center">
                {onBreedChange && (
                  <button
                    type="button"
                    onClick={() => setIsEditingBreed(!isEditingBreed)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-brand-50 text-stone-600 hover:text-brand-600 border border-stone-200 transition-colors"
                    title="Change or refine identified breed"
                  >
                    <Edit3 className="w-3 h-3 text-stone-500" />
                    <span>Adjust Breed</span>
                  </button>
                )}

                {/* Inline Breed Editor Dropdown */}
                {isEditingBreed && onBreedChange && (
                  <div className="absolute top-full left-0 mt-1 z-30 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3 text-left animate-fade-in">
                    <p className="text-[11px] font-bold text-stone-700 mb-2 flex items-center justify-between">
                      <span>Select or Enter Exact Breed:</span>
                      <button
                        onClick={() => setIsEditingBreed(false)}
                        className="text-stone-400 hover:text-stone-700 text-xs"
                      >
                        ✕
                      </button>
                    </p>

                    <div className="flex flex-wrap gap-1 mb-2.5 max-h-36 overflow-y-auto pr-1">
                      {(POPULAR_BREEDS[analysis.detectedSpecies] || POPULAR_BREEDS.cat).map(b => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => {
                            onBreedChange(b);
                            setIsEditingBreed(false);
                          }}
                          className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                            analysis.detectedBreed.toLowerCase().includes(b.toLowerCase())
                              ? 'bg-brand-50 border-brand-400 text-brand-700 font-bold'
                              : 'bg-stone-50 border-stone-200 hover:border-brand-300 text-stone-600'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 pt-1 border-t border-stone-100">
                      <input
                        type="text"
                        placeholder="Type custom breed name..."
                        value={customBreedInput}
                        onChange={(e) => setCustomBreedInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customBreedInput.trim()) {
                            onBreedChange(customBreedInput.trim());
                            setCustomBreedInput('');
                            setIsEditingBreed(false);
                          }
                        }}
                        className="flex-1 text-xs px-2 py-1 rounded-md border border-stone-200 focus:outline-none focus:border-brand-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customBreedInput.trim()) {
                            onBreedChange(customBreedInput.trim());
                            setCustomBreedInput('');
                            setIsEditingBreed(false);
                          }
                        }}
                        className="px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white rounded-md text-xs font-semibold"
                      >
                        Set
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Natural, Warm Bio Description */}
            <p className="mt-1.5 text-xs sm:text-sm text-stone-600 max-w-2xl leading-relaxed">
              {cleanDescriptionText(analysis.description, analysis.detectedBreed)}
            </p>

            {/* Biometric Feature Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 mt-2.5">
              {analysis.coatPattern && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 border border-amber-200/80 text-amber-800 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-amber-600" />
                  <span>{cleanPatternText(analysis.coatPattern)}</span>
                </span>
              )}

              {analysis.eyeColor && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 border border-sky-200/80 text-sky-800 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-sky-600" />
                  <span>Iris: {analysis.eyeColor}</span>
                </span>
              )}

              {analysis.vibe && (
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 border border-rose-200/80 text-rose-700 flex items-center gap-1">
                  <Award className="w-3 h-3 text-rose-500" />
                  <span>Vibe: {analysis.vibe}</span>
                </span>
              )}
            </div>

            {/* Dominant Color Swatches */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <span className="text-[11px] font-semibold text-stone-400 flex items-center gap-1">
                <Palette className="w-3 h-3" />
                Coat Colors:
              </span>
              {analysis.dominantColors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-0.5 bg-stone-50 rounded-full border border-stone-200/80 text-[11px] text-stone-700"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-medium">{color.name}</span>
                  <span className="text-[9px] text-stone-400">({color.percentage}%)</span>
                </div>
              ))}

              {/* Vision AI Deep Reasoning Toggle */}
              {analysis.reasoningNotes && analysis.reasoningNotes.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowAiReasoning(!showAiReasoning)}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold transition-all ml-1"
                >
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  <span>AI Logic ({analysis.reasoningNotes.length})</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showAiReasoning ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* 1-Click Quick-Pick Breed Correction Strip */}
            {onBreedChange && (
              <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap items-center justify-center sm:justify-start gap-1.5 text-xs text-stone-500">
                <span className="text-[11px] font-medium text-stone-400">Quick adjust:</span>
                {(POPULAR_BREEDS[analysis.detectedSpecies] || []).slice(0, 6).map(b => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onBreedChange(b)}
                    className={`text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full border transition-all active:scale-95 ${
                      cleanBreedName(analysis.detectedBreed) === b
                        ? 'bg-brand-50 border-brand-400 text-brand-700 font-bold shadow-2xs'
                        : 'bg-white border-stone-200 hover:border-brand-300 text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            )}

            {/* Collapsible Vision AI Logical Thinking Drawer */}
            {showAiReasoning && analysis.reasoningNotes && (
              <div className="mt-3 p-3 bg-gradient-to-r from-indigo-50/60 to-purple-50/50 rounded-xl border border-indigo-100/80 text-left animate-fade-in max-w-2xl">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  <span>How Our Bio-Morphological Vision Engine Identified Your Pet:</span>
                </div>
                <div className="space-y-1">
                  {analysis.reasoningNotes.map((note, nIdx) => (
                    <div key={nIdx} className="flex items-start gap-1.5 text-[11px] text-stone-700 leading-snug">
                      <span className="text-indigo-500 font-bold shrink-0">✓</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 3 SIMPLE QUESTIONS CARD (Language, Gender, Vibe) ── */}
      <div
        ref={questionsRef}
        className={`bg-white rounded-2xl sm:rounded-3xl border-2 transition-all duration-300 shadow-sm mb-6 ${
          showQuestions
            ? 'border-brand-400/80 p-4 sm:p-7'
            : 'border-stone-200/80 p-3.5 sm:p-5 hover:border-brand-300'
        }`}
      >
        <div className="flex items-center justify-between gap-3 cursor-pointer select-none" onClick={handleToggleQuestions}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              3
            </div>
            <div>
              <h3 className="text-sm sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Customize 3 Things for Your Pet</span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 border border-brand-200">
                  Language · Gender · Vibe
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5">
                Answer these 3 simple questions to reveal the 10 best names tailored to your taste.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
              aria-label="Toggle questions"
            >
              {showQuestions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Question Details when expanded */}
        {showQuestions && (
          <div className="mt-5 pt-5 border-t border-stone-100 space-y-5 animate-fade-in">
            
            {/* ── 1. LANGUAGE ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[11px]">1</span>
                  <span>Preferred Language / Origin</span>
                </label>
                <span className="text-[11px] font-semibold text-brand-600">
                  Selected: {preferences.targetLanguage}
                </span>
              </div>

              {/* Quick Pills */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5">
                {POPULAR_LANGUAGES.map((lang) => {
                  const isSelected = preferences.targetLanguage === lang.id;
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => onPreferencesChange({ ...preferences, targetLanguage: lang.id })}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-brand-500 text-white shadow-xs scale-102'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>

              {/* Full 14+ Languages Dropdown */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-stone-400 font-medium shrink-0">Or choose all 14+ languages:</span>
                <select
                  value={preferences.targetLanguage}
                  onChange={(e) => onPreferencesChange({ ...preferences, targetLanguage: e.target.value })}
                  className="text-xs font-semibold bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {AVAILABLE_LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* ── 2. GENDER ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[11px]">2</span>
                  <span>Pet&apos;s Gender</span>
                </label>
                <span className="text-[11px] font-semibold text-brand-600 capitalize">
                  Selected: {preferences.gender === 'all' ? 'Any / Unisex' : preferences.gender === 'male' ? 'Boy' : preferences.gender === 'female' ? 'Girl' : 'Unisex'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GENDER_OPTIONS.map((g) => {
                  const isSelected = preferences.gender === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => onPreferencesChange({ ...preferences, gender: g.id })}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/70 shadow-2xs ring-1 ring-brand-500'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-base sm:text-lg">{g.icon}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-500" />}
                      </div>
                      <div className="font-bold text-xs sm:text-sm text-stone-900">{g.label}</div>
                      <div className="text-[10px] text-stone-400">{g.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── 3. AI PERSONA SYSTEM (Cute, Funny, Luxury...) ── */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-extrabold text-stone-800 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[11px]">3</span>
                  <span>AI Persona System (Cute, Funny, Luxury...)</span>
                </label>
                <span className="text-[11px] font-semibold text-brand-600 capitalize">
                  Selected: {VIBE_OPTIONS.find(v => v.id === preferences.vibe)?.label || 'Any Persona'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5 sm:gap-2">
                {VIBE_OPTIONS.map((v) => {
                  const isSelected = preferences.vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => onPreferencesChange({ ...preferences, vibe: v.id })}
                      className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-brand-500 bg-brand-50/80 shadow-2xs ring-1 ring-brand-500'
                          : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-lg mb-0.5">{v.icon}</span>
                      <span className="font-bold text-[11px] sm:text-xs text-stone-900 truncate w-full">{v.label}</span>
                      <span className="text-[9px] text-stone-400 truncate w-full hidden sm:block">{v.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Bar inside Questions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleReveal}
                className="w-full sm:w-auto px-7 py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold rounded-full shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Show 10 Relevant Names</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>

              <button
                type="button"
                onClick={handleRandomize}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-stone-200 hover:border-brand-400 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-500" />
                <span>🎲 Surprise Me / Random Option</span>
              </button>
            </div>

          </div>
        )}
      </div>

      {/* ── RESULTS SECTION: 10 RELEVANT NAMES & OPTIONS ── */}
      <div ref={resultsRef} className="pt-2">
        {!hasRevealed ? (
          <div className="bg-white/85 backdrop-blur-sm rounded-3xl p-8 sm:p-12 text-center border-2 border-dashed border-brand-200 animate-fade-in shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-800">
              Ready to meet your 10 perfect names?
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              Answer the 3 quick questions above and click below to reveal the 10 top-matched names for your {analysis.detectedBreed}!
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReveal}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold rounded-full shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base group"
              >
                <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
                <span>Reveal 10 AI Names Now</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </button>
              <button
                type="button"
                onClick={handleRandomize}
                className="w-full sm:w-auto px-5 py-3 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Shuffle className="w-3.5 h-3.5 text-amber-500" />
                <span>🎲 Surprise Me / Random Option</span>
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Navigation & Options Header Bar */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 border border-stone-200/90 mb-5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h3 className="text-sm sm:text-base font-black text-stone-800">
                    Top 10 Relevant Names
                    {totalNamesCount > 0 && (
                      <span className="text-xs font-normal text-stone-500 ml-1.5">
                        ({pageOffset * 10 + 1}-{Math.min(pageOffset * 10 + 10, totalNamesCount)} of {totalNamesCount})
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Ranked for your {analysis.detectedBreed} · {preferences.targetLanguage} · {preferences.gender}
                  </p>
                </div>
              </div>

              {/* Action Options Bar */}
              <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
                
                {/* "Try Any Other Option" button */}
                <button
                  type="button"
                  onClick={handleToggleQuestions}
                  className="px-3.5 py-1.5 rounded-full bg-brand-50 hover:bg-brand-100 border border-brand-200 text-brand-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  title="Change language, gender, or vibe"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{showQuestions ? 'Hide Options' : 'Try Any Other Option'}</span>
                </button>

                {/* Randomize / Surprise me button */}
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="px-3 py-1.5 rounded-full bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                  title="Surprise me with random choices"
                >
                  <Shuffle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Surprise Me</span>
                </button>

                {/* Next 10 Names button */}
                {maxPages > 1 && (
                  <button
                    type="button"
                    onClick={handleNextTen}
                    className="px-3.5 py-1.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 shadow-2xs"
                    title="View next 10 relevant names"
                  >
                    <span>Next 10 Names</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}

              </div>

            </div>

            {/* ── 10 NAMES DISPLAY GRID ── */}
            {currentTenNames.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-stone-200">
                <p className="text-stone-600 text-sm font-semibold">
                  No pet names match your exact filter combination.
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Try choosing &quot;All Languages&quot; or click &quot;Try Any Other Option&quot; above.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => onPreferencesChange({ targetLanguage: 'All Languages', gender: 'all', vibe: 'all' })}
                    className="px-5 py-2.5 bg-brand-500 text-white rounded-full text-xs font-bold hover:bg-brand-600 transition-all"
                  >
                    Reset to All Options
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-xs font-bold"
                  >
                    🎲 Random Option
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {currentTenNames.map((item, idx) => (
                  <NameCard
                    key={item.id}
                    nameItem={item}
                    rank={pageOffset * 10 + idx + 1}
                    isSaved={savedIds.includes(item.id)}
                    onToggleSave={onToggleSave}
                    onSelect={onSelectName}
                  />
                ))}
              </div>
            )}

            {/* ── BOTTOM OPTIONS BAR ── */}
            <div className="mt-8 pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <p className="text-xs font-bold text-stone-700">
                  Want more names or different styles?
                </p>
                <p className="text-[11px] text-stone-400">
                  You can try any other language or vibe, or test another pet photo anytime.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={handleToggleQuestions}
                  className="px-4 py-2 rounded-full border border-brand-300 bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Try Any Other Option</span>
                </button>

                {maxPages > 1 && (
                  <button
                    onClick={handleNextTen}
                    className="px-4 py-2 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>Show Next 10 Names ({pageOffset + 1}/{maxPages})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={onReset}
                  className="px-4 py-2 rounded-full border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Upload New Pet Photo</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
