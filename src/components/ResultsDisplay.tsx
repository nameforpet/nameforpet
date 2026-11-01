'use client';

import React from 'react';
import { PetAnalysisResult, RecommendedName, UserPreferences } from '@/lib/types';
import { AVAILABLE_LANGUAGES } from '@/lib/petNamesData';
import NameCard from './NameCard';
import { Sparkles, RefreshCw, Filter, Palette, Award } from 'lucide-react';

interface ResultsDisplayProps {
  imageSrc: string;
  analysis: PetAnalysisResult;
  recommendedNames: RecommendedName[];
  preferences: UserPreferences;
  onPreferencesChange: (newPrefs: UserPreferences) => void;
  onReset: () => void;
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export default function ResultsDisplay({
  imageSrc,
  analysis,
  recommendedNames,
  preferences,
  onPreferencesChange,
  onReset,
  savedIds,
  onToggleSave
}: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-5xl mx-auto animate-fade-in pb-12">
      
      {/* Pet Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Pet Photo Thumbnail */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-stone-100 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Analyzed Pet"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
              {analysis.confidence}% Conf.
            </div>
          </div>

          {/* AI Analysis Details */}
          <div className="flex-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-700">
                {analysis.detectedSpecies}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
                {analysis.detectedBreed}
              </span>
              <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                Vibe: {analysis.vibe}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-800 tracking-tight">
              We identified your {analysis.detectedBreed}!
            </h2>

            <p className="mt-1 text-sm text-stone-500 max-w-2xl">
              {analysis.description}
            </p>

            {/* Dominant Color Swatches */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
                <Palette className="w-3.5 h-3.5" />
                Coat Colors:
              </span>
              {analysis.dominantColors.map((color, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-stone-50 rounded-full border border-stone-200/80 text-xs text-stone-700"
                >
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="font-medium">{color.name}</span>
                  <span className="text-[10px] text-stone-400">({color.percentage}%)</span>
                </div>
              ))}
            </div>

            {/* Traits */}
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
              {analysis.traits.map((trait, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-md bg-stone-100 text-[11px] font-medium text-stone-600"
                >
                  ✨ {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Reset / New Photo Button */}
          <div className="sm:self-start">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-stone-200 hover:border-brand-400 text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 text-xs font-semibold shadow-sm transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span>New Photo</span>
            </button>
          </div>

        </div>
      </div>

      {/* Filter Preferences Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-stone-200/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Language Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-brand-500 shrink-0" />
          <span className="text-xs font-bold text-stone-600 shrink-0">Language:</span>
          <select
            value={preferences.targetLanguage}
            onChange={(e) => onPreferencesChange({ ...preferences, targetLanguage: e.target.value })}
            className="w-full sm:w-auto text-xs font-medium bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5 text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {AVAILABLE_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
          <span className="text-xs font-bold text-stone-600 mr-1">Gender:</span>
          {(['all', 'male', 'female', 'unisex'] as const).map((genderOption) => (
            <button
              key={genderOption}
              onClick={() => onPreferencesChange({ ...preferences, gender: genderOption })}
              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                preferences.gender === genderOption
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-stone-100 hover:bg-stone-200/70 text-stone-600'
              }`}
            >
              {genderOption === 'all' ? 'All' : genderOption === 'male' ? 'Boy' : genderOption === 'female' ? 'Girl' : 'Unisex'}
            </button>
          ))}
        </div>

      </div>

      {/* Recommended Names Grid */}
      <div className="mb-4 flex items-center justify-between px-1">
        <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Top AI Matched Names ({recommendedNames.length})</span>
        </h3>
        <span className="text-xs text-stone-400">Ranked by coat & breed traits</span>
      </div>

      {recommendedNames.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <p className="text-stone-500 text-sm">
            No pet names match your specific filter combination. Try selecting &quot;All Languages&quot; or &quot;All Genders&quot;.
          </p>
          <button
            onClick={() => onPreferencesChange({ targetLanguage: 'All Languages', gender: 'all', vibe: 'all' })}
            className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-full text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {recommendedNames.map((item) => (
            <NameCard
              key={item.id}
              nameItem={item}
              isSaved={savedIds.includes(item.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}

    </div>
  );
}
