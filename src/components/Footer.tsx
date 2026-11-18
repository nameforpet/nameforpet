import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-12 sm:mt-20 border-t border-[#E8DFD4] bg-[#FAF6F0] py-8 sm:py-12 text-stone-600">
      <div className="max-w-6xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center">
              <Image
                src="/logo.png"
                alt="NameForPet – AI Pet Name Generator"
                width={120}
                height={36}
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </div>
            <p className="mt-2 text-xs sm:text-sm text-stone-500 leading-relaxed">
              Free AI pet name generator. Upload your dog or cat photo and get 17,900+ personalized name suggestions across 22 languages — powered by Vision AI.
            </p>
          </div>

          {/* Nav Columns */}
          <div className="flex flex-wrap gap-8 text-xs font-semibold text-stone-600">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Tools</p>
              <ul className="space-y-1.5">
                <li><Link href="/" className="hover:text-brand-600 transition-colors">AI Pet Name Generator</Link></li>
                <li><Link href="/browse" className="hover:text-brand-600 transition-colors">Browse 17,900+ Names</Link></li>
                <li><Link href="/gallery" className="hover:text-brand-600 transition-colors">Pet Photo Gallery</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Popular</p>
              <ul className="space-y-1.5">
                <li><Link href="/browse?species=dog" className="hover:text-brand-600 transition-colors">Dog Name Finder</Link></li>
                <li><Link href="/browse?species=cat" className="hover:text-brand-600 transition-colors">Cat Name Generator</Link></li>
                <li><Link href="/browse?lang=Japanese" className="hover:text-brand-600 transition-colors">Japanese Pet Names</Link></li>
                <li><Link href="/browse?vibe=cute" className="hover:text-brand-600 transition-colors">Cute Pet Names</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-2 font-bold">Company</p>
              <ul className="space-y-1.5">
                <li><Link href="/contact" className="hover:text-brand-600 transition-colors">Contact Us</Link></li>
                <li>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-1 hover:text-brand-600 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Privacy Policy</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-5 border-t border-stone-200/60 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-[11px] sm:text-xs text-stone-400">
          <p>© {new Date().getFullYear()} <a href="https://www.nameforpet.com" className="hover:text-stone-600">nameforpet.com</a> — Free AI Pet Name Generator. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for furry companions worldwide
          </p>
        </div>
      </div>
    </footer>
  );
}
