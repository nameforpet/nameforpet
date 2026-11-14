'use client';

import React, { useState, useMemo } from 'react';
import { PetNameRecord, PetSpecies } from '@/lib/types';
import { AVAILABLE_LANGUAGES } from '@/lib/petNamesData';
import { X, Search, Globe } from 'lucide-react';
import NameCard from './NameCard';

interface ExploreModalProps {
  isOpen: boolean;
  onClose: () => void;
  allNames: PetNameRecord[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
}

export default function ExploreModal({
  isOpen,
  onClose,
  allNames,
  savedIds,
  onToggleSave
}: ExploreModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedSpecies, setSelectedSpecies] = useState('all');

  const filteredNames = useMemo(() => {
    return allNames.filter((item) => {
      // Search text
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const nameLower = item.name.toLowerCase().trim();
        if (q.length === 1) {
          // Strictly match names starting with this letter
          if (!nameLower.startsWith(q)) return false;
        } else {
          const matchesName = nameLower.includes(q);
          const matchesMeaning = q.length >= 3 && item.meaning.toLowerCase().includes(q);
          const matchesLang = item.origin_language.toLowerCase().includes(q);
          if (!matchesName && !matchesMeaning && !matchesLang) return false;
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

      return true;
    });
  }, [allNames, searchQuery, selectedLanguage, selectedSpecies]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF6F0] rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[90dvh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-white border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-stone-800">Browse Multilingual Pet Names</h3>
            <p className="text-[11px] sm:text-xs text-stone-500">Explore over 14 languages for your pet</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="p-3 sm:p-4 bg-white/70 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search names, meanings, or culture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-xs text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-start gap-2">
            {/* Language select */}
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial">
              <Globe className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full sm:w-auto text-xs font-semibold bg-white border border-stone-200 rounded-xl px-2.5 py-2 text-stone-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Species tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
              {['all', 'dog', 'cat', 'rabbit', 'bird'].map((sp) => (
                <button
                  key={sp}
                  onClick={() => setSelectedSpecies(sp)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedSpecies === sp
                      ? 'bg-brand-500 text-white'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {sp}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Name Grid */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="text-xs font-semibold text-stone-500 mb-3">
            Showing {filteredNames.length} names
          </div>

          {filteredNames.length === 0 ? (
            <div className="py-16 text-center text-stone-400">
              <p className="text-sm font-medium">No pet names found matching your criteria</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedLanguage('All Languages'); setSelectedSpecies('all'); }}
                className="mt-3 px-3 py-1.5 bg-brand-500 text-white rounded-full text-xs font-semibold"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNames.map((nameItem) => (
                <NameCard
                  key={nameItem.id}
                  nameItem={{
                    ...nameItem,
                    matchScore: 95,
                    matchReasons: [`Beloved ${nameItem.origin_language} name`]
                  }}
                  isSaved={savedIds.includes(nameItem.id)}
                  onToggleSave={onToggleSave}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
