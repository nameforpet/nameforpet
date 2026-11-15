'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NameCard from '@/components/NameCard';
import PetNameDetailModal from '@/components/PetNameDetailModal';
import SavedModal from '@/components/SavedModal';
import AuthModal from '@/components/AuthModal';
import { PetNameRecord, RecommendedName, PetSpecies, RegisteredUser } from '@/lib/types';
import { getPetNames, getLocalFavorites, toggleLocalFavorite } from '@/lib/supabaseClient';
import { getCurrentUser, setCurrentUser } from '@/lib/userStorage';
import { classifyNamePersona } from '@/lib/namePersonaAI';
import { AVAILABLE_LANGUAGES } from '@/lib/petNamesData';
import { Search, Globe, Sparkles, X, ChevronDown, RotateCcw } from 'lucide-react';

const PAGE_SIZE = 24;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const SPECIES_OPTIONS: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'All Pets', icon: '🐾' },
  { id: 'dog', label: 'Dogs', icon: '🐕' },
  { id: 'cat', label: 'Cats', icon: '🐈' },
  { id: 'rabbit', label: 'Rabbits', icon: '🐇' },
  { id: 'bird', label: 'Birds', icon: '🦜' },
];

const GENDER_OPTIONS = [
  { id: 'all', label: 'All Genders' },
  { id: 'male', label: 'Male ♂' },
  { id: 'female', label: 'Female ♀' },
  { id: 'unisex', label: 'Unisex ⚥' },
];

const PERSONA_OPTIONS = [
  { id: 'all', label: 'All Styles', icon: '✨' },
  { id: 'cute', label: 'Cute & Sweet', icon: '🌸' },
  { id: 'luxury', label: 'Luxury & Royal', icon: '💎' },
  { id: 'funny', label: 'Funny & Playful', icon: '😂' },
  { id: 'brave', label: 'Brave & Bold', icon: '🦁' },
  { id: 'gentle', label: 'Gentle & Cozy', icon: '🌿' },
];

export default function BrowsePage() {
  const [allNames, setAllNames] = useState<PetNameRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [selectedPetName, setSelectedPetName] = useState<RecommendedName | null>(null);
  const [isSavedOpen, setIsSavedOpen] = useState(false);
  const [currentUser, setCurrentUserSession] = useState<RegisteredUser | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSpecies, setSelectedSpecies] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [selectedPersona, setSelectedPersona] = useState('all');
  const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

  useEffect(() => {
    setCurrentUserSession(getCurrentUser());
    setSavedIds(getLocalFavorites());

    async function loadNames() {
      setLoading(true);
      const res = await getPetNames();
      setAllNames(res.names);
      setLoading(false);
    }
    loadNames();
  }, []);

  const handleToggleSave = (id: string) => {
    setSavedIds(toggleLocalFavorite(id));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedLetter(null);
    setSelectedLanguage('All Languages');
    setSelectedSpecies('all');
    setSelectedGender('all');
    setSelectedPersona('all');
    setDisplayCount(PAGE_SIZE);
  };

  // Filter and Enrich Names
  const filteredNames: RecommendedName[] = useMemo(() => {
    if (!allNames.length) return [];

    const q = searchQuery.toLowerCase().trim();
    // When user types 1 letter or clicks an alphabet button, strictly match names that START with that letter
    const activeLetter = selectedLetter ? selectedLetter.toLowerCase() : (q.length === 1 ? q : null);

    const filtered = allNames.filter((item) => {
      const nameLower = item.name.toLowerCase().trim();

      // 1. Single-letter / Alphabet filter
      if (activeLetter) {
        if (!nameLower.startsWith(activeLetter)) {
          return false;
        }
      } else if (q) {
        // 2. Multi-letter search query (e.g. "go", "gold")
        const nameStarts = nameLower.startsWith(q);
        const wordStarts = nameLower.split(/\s+/).some(w => w.startsWith(q));
        const nameContains = nameLower.includes(q);
        const meaningContains = q.length >= 3 && item.meaning.toLowerCase().includes(q);

        if (!nameStarts && !wordStarts && !nameContains && !meaningContains) {
          return false;
        }
      }

      // Language
      if (selectedLanguage !== 'All Languages') {
        if (!item.origin_language.toLowerCase().includes(selectedLanguage.toLowerCase())) {
          return false;
        }
      }

      // Species
      if (selectedSpecies !== 'all') {
        const speciesList = Array.isArray(item.species) ? item.species : [item.species];
        if (!speciesList.includes(selectedSpecies as PetSpecies) && !speciesList.includes('any')) {
          return false;
        }
      }

      // Gender
      if (selectedGender !== 'all') {
        if (item.gender !== selectedGender && item.gender !== 'unisex') {
          return false;
        }
      }

      // Persona Vibe
      if (selectedPersona !== 'all') {
        const persona = classifyNamePersona(item);
        if (persona.primaryCategory !== selectedPersona) {
          const hasVibe = (item.vibe_tags || []).some(v => v.toLowerCase().includes(selectedPersona));
          if (!hasVibe) return false;
        }
      }

      return true;
    });

    // If multi-character search query, prioritize names that start with the query
    if (q && q.length > 1) {
      filtered.sort((a, b) => {
        const aStarts = a.name.toLowerCase().startsWith(q) ? 1 : 0;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 1 : 0;
        if (aStarts !== bStarts) return bStarts - aStarts;
        return (b.popularity || 80) - (a.popularity || 80);
      });
    }

    return filtered.map((item) => {
      const aiPersona = classifyNamePersona(item);
      return {
        ...item,
        matchScore: item.popularity || 85,
        matchReasons: [`Beloved ${item.origin_language} origin`, `${item.species?.[0] || 'pet'} friendly`],
        aiPersona
      };
    });
  }, [allNames, searchQuery, selectedLetter, selectedLanguage, selectedSpecies, selectedGender, selectedPersona]);

  const visibleNames = filteredNames.slice(0, displayCount);
  const hasMore = displayCount < filteredNames.length;

  const isFiltered = Boolean(
    searchQuery ||
    selectedLetter ||
    selectedLanguage !== 'All Languages' ||
    selectedSpecies !== 'all' ||
    selectedGender !== 'all' ||
    selectedPersona !== 'all'
  );

  return (
    <div className="min-h-screen bg-pet-pattern flex flex-col selection:bg-brand-100 selection:text-brand-900">
      <Navbar
        savedCount={savedIds.length}
        onOpenSaved={() => setIsSavedOpen(true)}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onSignOut={() => {
          setCurrentUser(null);
          setCurrentUserSession(null);
        }}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-10">
        
        {/* ── Page Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-brand-500" />
            <span>Multilingual Pet Name Directory</span>
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Browse 17,900+ Pet Names
          </h1>
          <p className="mt-2 text-sm sm:text-base text-stone-600 leading-relaxed">
            Search by culture, language, species, or personality to discover the perfect name for your companion.
          </p>
        </div>

        {/* ── Filter Bar ── */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-stone-200/90 shadow-sm space-y-4 mb-8">
          
          {/* Row 1: Search & Language Dropdown */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, meaning, or culture (e.g. Mochi, brave, French)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDisplayCount(PAGE_SIZE);
                }}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="relative sm:w-56 shrink-0">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-stone-400">
                <Globe className="w-4 h-4 text-brand-500" />
              </div>
              <select
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setDisplayCount(PAGE_SIZE);
                }}
                className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:border-brand-500 focus:bg-white appearance-none transition-all cursor-pointer"
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Row 2: Alphabet Quick Jump (A - Z) */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] pt-1">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Letters:
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedLetter(null);
                setSearchQuery('');
                setDisplayCount(PAGE_SIZE);
              }}
              className={`px-2 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                !selectedLetter && (!searchQuery || searchQuery.length > 1)
                  ? 'bg-stone-900 text-white shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All
            </button>
            {ALPHABET.map((letter) => {
              const active = selectedLetter === letter || (searchQuery.trim().toUpperCase() === letter);
              return (
                <button
                  key={letter}
                  type="button"
                  onClick={() => {
                    if (active) {
                      setSelectedLetter(null);
                      setSearchQuery('');
                    } else {
                      setSelectedLetter(letter);
                      setSearchQuery(letter.toLowerCase());
                    }
                    setDisplayCount(PAGE_SIZE);
                  }}
                  className={`w-7 h-7 rounded-lg font-bold transition-all shrink-0 flex items-center justify-center cursor-pointer ${
                    active
                      ? 'bg-brand-500 text-white shadow-2xs scale-105'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {letter}
                </button>
              );
            })}
          </div>

          {/* Row 3: Species Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
              Species:
            </span>
            {SPECIES_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setSelectedSpecies(opt.id);
                  setDisplayCount(PAGE_SIZE);
                }}
                className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  selectedSpecies === opt.id
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200/70'
                }`}
              >
                <span>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Row 3: Gender & Persona Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-stone-100 text-xs">
            {/* Gender Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Gender:
              </span>
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedGender(opt.id);
                    setDisplayCount(PAGE_SIZE);
                  }}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                    selectedGender === opt.id
                      ? 'bg-brand-500 text-white shadow-2xs'
                      : 'bg-stone-50 border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Persona Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Style:
              </span>
              {PERSONA_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setSelectedPersona(opt.id);
                    setDisplayCount(PAGE_SIZE);
                  }}
                  className={`px-2.5 py-1 rounded-full font-bold transition-all shrink-0 flex items-center gap-1 cursor-pointer ${
                    selectedPersona === opt.id
                      ? 'bg-amber-500 text-white shadow-2xs'
                      : 'bg-stone-50 border border-stone-200/80 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Status & Active Filters Bar ── */}
        <div className="flex items-center justify-between gap-3 mb-6 text-xs sm:text-sm text-stone-600">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-stone-900">{visibleNames.length}</strong> of{' '}
              <strong className="text-stone-900">{filteredNames.length.toLocaleString()}</strong> names
            </span>
          </div>

          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 underline cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset all filters</span>
            </button>
          )}
        </div>

        {/* ── Names Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-stone-200/80 animate-pulse space-y-3">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-20 bg-stone-200 rounded-full" />
                  <div className="h-5 w-5 bg-stone-200 rounded-full" />
                </div>
                <div className="h-7 w-32 bg-stone-200 rounded-lg" />
                <div className="h-4 w-full bg-stone-100 rounded" />
                <div className="h-4 w-2/3 bg-stone-100 rounded" />
              </div>
            ))}
          </div>
        ) : filteredNames.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-lg mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-stone-800">No matching pet names found</h3>
            <p className="mt-1 text-xs sm:text-sm text-stone-500 leading-relaxed">
              We couldn’t find names matching your current search or filters. Try clearing your search query or choosing &quot;All Languages&quot;.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-full transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleNames.map((item, idx) => (
                <NameCard
                  key={item.id}
                  nameItem={item}
                  rank={idx + 1}
                  isSaved={savedIds.includes(item.id)}
                  onToggleSave={handleToggleSave}
                  onSelect={(selected) => setSelectedPetName(selected)}
                />
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
                  className="px-6 py-3 rounded-full bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm border border-stone-200 shadow-2xs hover:shadow-xs hover:border-brand-300 transition-all cursor-pointer"
                >
                  Load More Names ({filteredNames.length - displayCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Name Detail Modal */}
      <PetNameDetailModal
        isOpen={!!selectedPetName}
        onClose={() => setSelectedPetName(null)}
        nameItem={selectedPetName}
        petImageSrc={null}
        analysis={null}
        isSaved={selectedPetName ? savedIds.includes(selectedPetName.id) : false}
        onToggleSave={handleToggleSave}
      />

      {/* Saved Modal */}
      <SavedModal
        isOpen={isSavedOpen}
        onClose={() => setIsSavedOpen(false)}
        savedNames={allNames.filter(n => savedIds.includes(n.id))}
        onRemove={handleToggleSave}
        onClearAll={() => setSavedIds([])}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          setCurrentUserSession(user);
        }}
      />

      <Footer />
    </div>
  );
}
