'use client';

import React from 'react';
import { PetNameRecord } from '@/lib/types';
import { X, Bookmark, Trash2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SavedModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedNames: PetNameRecord[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

export default function SavedModal({
  isOpen,
  onClose,
  savedNames,
  onRemove,
  onClearAll
}: SavedModalProps) {
  const [copiedAll, setCopiedAll] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyAll = () => {
    const text = savedNames.map((n) => `${n.name} (${n.origin_language}) - ${n.meaning}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    confetti({ particleCount: 30, spread: 60, origin: { y: 0.6 } });
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-xl max-h-[90dvh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center shrink-0">
              <Bookmark className="w-4 h-4 fill-brand-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-stone-800">Your Saved Names</h3>
              <p className="text-[11px] sm:text-xs text-stone-400">{savedNames.length} names bookmarked</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-2.5 sm:space-y-3 flex-1">
          {savedNames.length === 0 ? (
            <div className="py-12 text-center text-stone-400">
              <Bookmark className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm font-medium">No saved names yet</p>
              <p className="text-xs text-stone-400 mt-1">
                Click the heart icon on any pet name card to save it here!
              </p>
            </div>
          ) : (
            savedNames.map((item) => (
              <div
                key={item.id}
                className="p-3 sm:p-3.5 bg-stone-50 rounded-xl sm:rounded-2xl border border-stone-200/70 flex items-start justify-between gap-2.5 hover:bg-stone-100/60 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-stone-800 text-sm sm:text-base">{item.name}</span>
                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-white border border-stone-200 text-stone-600 font-medium">
                      {item.origin_language}
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-stone-600 mt-1 leading-relaxed">{item.meaning}</p>
                </div>

                <button
                  onClick={() => onRemove(item.id)}
                  className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-white transition-colors shrink-0"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {savedNames.length > 0 && (
          <div className="p-3 sm:p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-2">
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-stone-400 hover:text-rose-600 transition-colors"
            >
              Clear all
            </button>

            <button
              onClick={handleCopyAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-full text-xs font-semibold transition-all shadow-xs active:scale-95"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied list!' : 'Copy all to clipboard'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
