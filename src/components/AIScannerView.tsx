'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, Eye, Database, Sparkles, CheckCircle2 } from 'lucide-react';

interface AIScannerViewProps {
  imageSrc: string;
}

const STEPS = [
  { icon: Eye,       label: 'Reading pixel data',            detail: 'Sampling coat colors & shades…',           color: 'text-sky-500',    bg: 'bg-sky-50',    border: 'border-sky-200' },
  { icon: Cpu,       label: 'Running Vision AI',             detail: 'Verifying pet presence & detecting species…', color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: Database,  label: 'Analyzing features',            detail: 'Evaluating breed, coat colors & vibe…',    color: 'text-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  { icon: Sparkles,  label: 'Ranking perfect matches',       detail: 'Matching 14+ language collections…',        color: 'text-brand-500',  bg: 'bg-orange-50', border: 'border-orange-200' },
];

export default function AIScannerView({ imageSrc }: AIScannerViewProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots] = useState('');

  // Advance steps smoothly
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) {
          setCompletedSteps(c => Array.from(new Set([...c, prev])));
          return prev + 1;
        }
        setCompletedSteps(c => Array.from(new Set([...c, prev])));
        clearInterval(timer);
        return prev;
      });
    }, 450);
    return () => clearInterval(timer);
  }, []);

  // Animated dots
  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 350);
    return () => clearInterval(t);
  }, []);

  const progress = Math.min(98, Math.round(((completedSteps.length + 0.5) / STEPS.length) * 100));

  return (
    <div className="w-full max-w-2xl mx-auto my-4 sm:my-6 animate-fade-in px-1">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 items-center sm:items-start">

        {/* ── LEFT: Pet photo with scanner overlay ── */}
        <div className="relative shrink-0 w-40 h-40 sm:w-52 sm:h-52 rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-lg sm:shadow-xl shadow-stone-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt="Analyzing pet" className="w-full h-full object-cover brightness-90" />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

          {/* Animated laser scan line sweeping bounded viewfinder */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl sm:rounded-3xl">
            {/* Luminous laser line */}
            <div
              className="absolute left-2.5 right-2.5 h-[3px] rounded-full animate-laser-scan"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, #f97316 20%, #fbbf24 50%, #f97316 80%, transparent 100%)',
                boxShadow: '0 0 14px 4px rgba(249,115,22,0.9), 0 0 24px 6px rgba(251,191,36,0.5)',
              }}
            />
            {/* Soft trailing laser veil */}
            <div
              className="absolute left-2.5 right-2.5 h-14 animate-laser-veil pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(249,115,22,0.2) 0%, transparent 100%)',
              }}
            />
          </div>

          {/* Corner HUD brackets */}
          {['top-2 left-2 border-t-2 border-l-2 rounded-tl-lg',
            'top-2 right-2 border-t-2 border-r-2 rounded-tr-lg',
            'bottom-2 left-2 border-b-2 border-l-2 rounded-bl-lg',
            'bottom-2 right-2 border-b-2 border-r-2 rounded-br-lg'].map((cls, i) => (
            <div key={i} className={`absolute w-5 h-5 border-white/80 ${cls}`} />
          ))}

          {/* Pulsing center crosshair */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-ping" />
              <div className="absolute inset-[4px] rounded-full border border-white/80" />
            </div>
          </div>

          {/* Status badge */}
          <div className="absolute bottom-2 inset-x-2 flex justify-center">
            <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest rounded-full flex items-center gap-1.5 border border-white/20 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
              AI VISION ACTIVE
            </span>
          </div>
        </div>

        {/* ── RIGHT: Step progress panel ── */}
        <div className="flex-1 w-full">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-extrabold text-stone-800 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-brand-500 animate-spin" style={{ animationDuration: '2.5s' }} />
              Analysing your pet{dots}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">Our built-in Vision AI is finding the perfect name</p>
          </div>

          {/* Steps */}
          <div className="space-y-2.5">
            {STEPS.map((step, idx) => {
              const done = completedSteps.includes(idx);
              const active = activeStep === idx && !done;
              const Icon = step.icon;

              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all duration-500 ${
                    done
                      ? 'bg-emerald-50 border-emerald-200'
                      : active
                        ? `${step.bg} ${step.border}`
                        : 'bg-stone-50/60 border-stone-200/60 opacity-50'
                  }`}
                >
                  {/* Icon */}
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    done ? 'bg-emerald-500' : active ? step.bg : 'bg-stone-100'
                  } border ${done ? 'border-emerald-400' : active ? step.border : 'border-stone-200'}`}>
                    {done
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <Icon className={`w-4 h-4 ${active ? step.color : 'text-stone-400'} ${active ? 'animate-pulse' : ''}`} />
                    }
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-bold truncate ${done ? 'text-emerald-700' : active ? 'text-stone-800' : 'text-stone-400'}`}>
                      {step.label}
                    </p>
                    {(active || done) && (
                      <p className={`text-[11px] truncate ${done ? 'text-emerald-600' : 'text-stone-500'}`}>
                        {done ? '✓ Complete' : step.detail}
                      </p>
                    )}
                  </div>

                  {/* Active spinner */}
                  {active && (
                    <div className="shrink-0 w-4 h-4 border-2 border-stone-200 border-t-brand-500 rounded-full animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-stone-400 mb-1.5 font-medium">
              <span>Processing</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-amber-400 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(8, progress)}%` }}
              />
            </div>
          </div>

          {/* Neural network dot animation */}
          <div className="mt-4 flex items-center gap-1.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full bg-brand-400 animate-pulse"
                style={{
                  width: `${8 + Math.sin(i * 0.8) * 6}px`,
                  animationDelay: `${i * 0.12}s`,
                  animationDuration: '1.2s',
                  opacity: 0.4 + (i % 3) * 0.2
                }}
              />
            ))}
            <span className="text-[10px] text-stone-400 ml-1 font-medium">Neural processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
