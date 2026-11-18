'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ChevronDown,
  Globe2,
  Palette,
  HelpCircle,
  Camera
} from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does the AI name generator identify my pet from a photo?',
    a: 'nameforpet.com uses intelligent Vision AI. It isolates your pet subject from background grass, furniture, or sky, determines the dominant coat palette (such as pure white, amber gold, warm chocolate, or silver mist), scans facial indicators (like feline pink nose pads or alert ears), and computes match scores across 17,900+ curated pet names.'
  },
  {
    q: 'Is my pet’s photo stored safely and privately?',
    a: 'Yes! All uploaded pet photos are processed using secure Vision AI and stored with encrypted cloud object storage. Your data is private, never shared with third-party advertisers, and used solely for personalized pet naming.'
  },
  {
    q: 'Can the AI name both dogs and cats?',
    a: 'Yes! Our AI includes specialized canine and feline classifiers. Kittens and adult cats are recognized by characteristic facial morphology, upright triangular ears, and eye pigmentation. You also have a 1-click Species Switcher on the results card to toggle between Dog, Cat, Rabbit, and Bird at any time.'
  },
  {
    q: 'Which languages and cultural origins are supported?',
    a: 'Our unified database features names from 22+ languages and traditions, including Japanese (with Kanji), French, Spanish, Italian, German, Danish, Irish, Scottish, Norse, Swahili, Korean, and English, each with cultural origins, meanings, and fun facts.'
  },
  {
    q: 'What are the AI Name Personas (Cute, Luxury, Funny)?',
    a: 'Our Inner AI Name Classifier evaluates phonetics, syllables, and historical definitions to assign badges like Cute & Sweet (🌸), Luxury & Royal (💎), Funny & Quirky (😂), Brave & Bold (🦁), and Calm & Cozy (🌿), making it easy to filter names matching your pet’s unique character.'
  }
];

const POPULAR_STYLES = [
  {
    title: '🌸 Cute & Sweet',
    desc: 'Soft, melodious names like Mochi, Peanut, Mimi, and Daisy for gentle cuddlers.',
    vibe: 'cute'
  },
  {
    title: '💎 Luxury & Royal',
    desc: 'Regal, noble names like Duchess, Winston, Cleo, and Sterling for dignified companions.',
    vibe: 'luxury'
  },
  {
    title: '😂 Funny & Quirky',
    desc: 'Playful, memorable names like Waffles, Sir Paws-a-Lot, and Ziggy for mischievous furballs.',
    vibe: 'funny'
  },
  {
    title: '🦁 Brave & Bold',
    desc: 'Strong, heroic names like Thor, Luna, Bruno, and Titan for adventurous protectors.',
    vibe: 'brave'
  }
];

const POPULAR_LINKS = [
  { label: '🐕 Dog Names', href: '/browse?species=dog' },
  { label: '🐈 Cat Names', href: '/browse?species=cat' },
  { label: '🐰 Rabbit Names', href: '/browse?species=rabbit' },
  { label: '🐦 Bird Names', href: '/browse?species=bird' },
  { label: '🇯🇵 Japanese Names', href: '/browse?lang=Japanese' },
  { label: '🇫🇷 French Names', href: '/browse?lang=French' },
  { label: '🇪🇸 Spanish Names', href: '/browse?lang=Spanish' },
  { label: '🇰🇷 Korean Names', href: '/browse?lang=Korean' },
  { label: '🌸 Cute & Sweet', href: '/browse?vibe=cute' },
  { label: '💎 Luxury & Royal', href: '/browse?vibe=luxury' },
  { label: '🦁 Brave & Bold', href: '/browse?vibe=brave' },
  { label: '😂 Funny & Quirky', href: '/browse?vibe=funny' },
];

export default function HomeSEOSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => (prev === idx ? null : idx));
  };

  return (
    <section className="mt-14 sm:mt-20 pt-10 border-t border-stone-200/80">
      
      {/* ── Section Header ── */}
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Multilingual Pet Naming Guide</span>
        </span>
        <h2 className="text-2xl sm:text-4xl font-black text-stone-900 tracking-tight">
          How Our AI Finds the Perfect Name for Your Pet
        </h2>
        <p className="mt-2.5 text-sm sm:text-base text-stone-600 leading-relaxed">
          Naming a new puppy, kitten, bunny, or rescue pet is a once-in-a-lifetime moment. Here is how our on-device Vision AI turns your pet’s photo into personalized, meaningful names.
        </p>
      </div>

      {/* ── 3-Step Process Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm relative group hover:border-brand-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center font-black text-base mb-4 group-hover:scale-105 transition-transform">
            1
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-2 flex items-center gap-2">
            <Camera className="w-4 h-4 text-brand-500" />
            Upload Any Pet Photo
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Take a quick snap of your dog, cat, rabbit, or bird. Our privacy-first engine processes the photo with fast Vision AI and encrypted cloud storage.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm relative group hover:border-brand-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-base mb-4 group-hover:scale-105 transition-transform">
            2
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-2 flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-500" />
            Coat &amp; Facial Feature Analysis
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            The scanner isolates your pet from background grass or rooms, extracts exact coat pigments, and detects facial geometry (ear posture, nose pad, eye hues).
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-sm relative group hover:border-brand-300 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base mb-4 group-hover:scale-105 transition-transform">
            3
          </div>
          <h3 className="text-base font-bold text-stone-800 mb-2 flex items-center gap-2">
            <Globe2 className="w-4 h-4 text-emerald-600" />
            17,900+ Multilingual Match
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Names are scored by color resonance, species suitability, origin meaning, and persona type across 22 worldwide languages.
          </p>
        </div>
      </div>

      {/* ── AI Persona Styles Grid ── */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-sm mb-14">
        <div className="text-center sm:text-left mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Explore Styles</span>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
            Pet Names by Personality &amp; AI Persona
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Every name in our database is categorized using our Inner AI Persona Engine:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_STYLES.map((style, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 hover:bg-stone-100/70 transition-colors"
            >
              <h4 className="font-bold text-sm text-stone-800 mb-1">{style.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{style.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ Section (Google Rich Snippets Target) ── */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Got Questions?</span>
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Everything you need to know about our AI naming engine, vision privacy, and database.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-stone-800 hover:text-brand-600 font-bold text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-500' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-stone-500">
            Have a suggestion or special pet name to add?{' '}
            <Link href="/contact" className="text-brand-600 font-bold underline hover:text-brand-700">
              Contact our team
            </Link>
          </p>
        </div>
      </div>

      {/* ── Popular Searches (SEO internal link grid) ── */}
      <div className="max-w-3xl mx-auto mt-10 mb-6">
        <h3 className="text-center text-sm font-bold text-stone-500 uppercase tracking-widest mb-4">
          Popular Pet Name Categories
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {POPULAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border border-stone-200 text-stone-700 hover:border-brand-400 hover:text-brand-700 transition-colors shadow-2xs"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-center text-[11px] text-stone-400 mt-4">
          Browse all <Link href="/browse" className="text-brand-600 font-bold hover:underline">17,900+ pet names</Link> in our free database →
        </p>
      </div>

    </section>
  );
}
