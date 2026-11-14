import React from 'react';
import Link from 'next/link';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-[#E8DFD4] bg-[#FAF6F0] py-8 sm:py-12 text-stone-600">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          
          <div>
            <div className="flex items-center justify-center md:justify-start">
              <img
                src="/logo.png"
                alt="NameForPet Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-sm">
              Discover the perfect multilingual name for your beloved dog, cat, rabbit, or bird powered by on-device computer vision.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6 text-xs font-bold text-stone-600">
            <Link href="/" className="hover:text-brand-600 transition-colors">
              AI Name Finder
            </Link>
            <Link href="/gallery" className="hover:text-brand-600 transition-colors">
              Pet Gallery
            </Link>
            <Link href="/contact" className="hover:text-brand-600 transition-colors">
              Contact Us
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center gap-1 text-stone-700 hover:text-brand-600 transition-colors px-2.5 py-1 rounded-full bg-white border border-stone-200/90 shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy Policy</span>
            </Link>
          </div>

        </div>

        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-stone-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <p>© {new Date().getFullYear()} nameforpet.com. Crafted with love for pets worldwide.</p>
            <span>·</span>
            <Link href="/privacy" className="hover:text-stone-600 underline">
              Privacy Policy &amp; Terms
            </Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-stone-600 underline">
              Contact Us
            </Link>
          </div>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for furry companions
          </p>
        </div>
      </div>
    </footer>
  );
}
