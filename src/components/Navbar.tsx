'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bookmark, 
  User, 
  LogOut, 
  ChevronDown, 
  Images, 
  Mail, 
  BookOpen,
  ShieldCheck
} from 'lucide-react';
import { RegisteredUser } from '@/lib/types';

interface NavbarProps {
  savedCount?: number;
  onOpenSaved?: () => void;
  onOpenExplore?: () => void;
  onResetHome?: () => void;
  currentUser?: RegisteredUser | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

export default function Navbar({
  savedCount = 0,
  onOpenSaved,
  onResetHome,
  currentUser,
  onOpenAuth,
  onSignOut
}: NavbarProps) {
  const pathname = usePathname();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (mobileNavRef.current && !mobileNavRef.current.contains(event.target as Node)) {
        setIsMobileNavOpen(false);
      }
    }
    if (isUserMenuOpen || isMobileNavOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isMobileNavOpen]);

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-[#FAF6F0] border-b border-[#E8DFD4] transition-all">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <Link 
          href="/"
          onClick={onResetHome}
          className="flex items-center group focus:outline-none shrink-0"
          aria-label="NameForPet Home"
        >
          <img
            src="/logo.png"
            alt="NameForPet Logo"
            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-102 transition-transform duration-200"
          />
        </Link>

        {/* Center / Right Navigation Items */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Desktop Navigation Links */}
          <nav className="hidden sm:flex items-center gap-1 sm:gap-1.5">
            <Link
              href="/browse"
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === '/browse'
                  ? 'bg-stone-200/80 text-stone-900 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-stone-500" />
              <span>Browse Names</span>
            </Link>

            <Link
              href="/gallery"
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors flex items-center gap-1.5 ${
                pathname === '/gallery'
                  ? 'bg-brand-500 text-white font-bold shadow-2xs'
                  : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Images className={`w-3.5 h-3.5 ${pathname === '/gallery' ? 'text-white' : 'text-brand-500'}`} />
              <span>Pet Gallery</span>
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors hidden md:inline-flex items-center gap-1.5 ${
                pathname === '/contact'
                  ? 'bg-stone-200/80 text-stone-900 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Mobile Navigation Dropdown Button */}
          <div className="relative sm:hidden" ref={mobileNavRef}>
            <button
              type="button"
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-white text-stone-800 border border-stone-200 hover:border-brand-400 rounded-full shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              aria-label="Pet Gallery Menu"
            >
              <Images className="w-3.5 h-3.5 text-brand-500" />
              <span>Pet Gallery</span>
              <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isMobileNavOpen ? 'rotate-180 text-brand-500' : ''}`} />
            </button>

            {isMobileNavOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-stone-200/90 p-1.5 text-stone-800 z-50">
                <Link
                  href="/gallery"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname === '/gallery'
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-stone-800 hover:bg-stone-50 hover:text-brand-600'
                  }`}
                >
                  <Images className="w-4 h-4 text-brand-500 shrink-0" />
                  <span>Pet Gallery</span>
                </Link>

                <Link
                  href="/browse"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                    pathname === '/browse'
                      ? 'bg-brand-50 text-brand-600'
                      : 'text-stone-800 hover:bg-stone-50 hover:text-brand-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Browse Names</span>
                </Link>

                <div className="h-[1px] bg-stone-100 my-1" />

                <Link
                  href="/contact"
                  onClick={() => setIsMobileNavOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${
                    pathname === '/contact'
                      ? 'bg-stone-100 text-stone-900 font-bold'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Contact</span>
                </Link>
              </div>
            )}
          </div>

          {/* Subtle Vertical Divider */}
          <div className="h-5 w-[1px] bg-stone-300 mx-0.5 sm:mx-1 hidden sm:block" />

          {/* Saved Names Pill Button */}
          {onOpenSaved && (
            <button
              type="button"
              onClick={onOpenSaved}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold bg-white text-stone-700 hover:text-brand-600 border border-stone-200 rounded-full shadow-2xs hover:border-brand-300 hover:shadow-xs transition-all cursor-pointer"
            >
              <Bookmark className="w-3.5 h-3.5 text-brand-500 fill-brand-500/20" />
              <span className="hidden xs:inline">Saved</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 bg-brand-500 text-white text-[10px] font-black rounded-full leading-none">
                  {savedCount}
                </span>
              )}
            </button>
          )}

          {/* User Account / Profile Area */}
          {currentUser ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-white border border-stone-200 hover:border-stone-300 rounded-full text-xs font-bold text-stone-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
              >
                {currentUser.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full object-cover shrink-0"
                  />
                ) : currentUser.provider === 'google' ? (
                  <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="max-w-[75px] sm:max-w-[110px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 text-stone-800 animate-fade-in z-50">
                  <div className="px-3 py-2 border-b border-stone-100">
                    <p className="font-bold text-xs text-stone-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-stone-500 font-mono truncate">{currentUser.email}</p>
                    {currentUser.provider === 'google' && (
                      <span className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.675-5.17 3.675-9.15z"/>
                          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.04c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.25v3.13C3.25 21.3 7.33 24 12 24z"/>
                          <path fill="#FBBC05" d="M5.27 14.25c-.25-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25V6.62H1.25C.45 8.24 0 10.06 0 12s.45 3.76 1.25 5.38l4.02-3.13z"/>
                          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.25 2.7 1.25 6.62l4.02 3.13c.95-2.85 3.6-4.96 6.73-4.96z"/>
                        </svg>
                        <span>Google Account</span>
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    {onOpenSaved && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenSaved();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <Bookmark className="w-3.5 h-3.5 text-brand-500" />
                          <span>Saved Names</span>
                        </span>
                        <span className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[10px] font-bold">
                          {savedCount}
                        </span>
                      </button>
                    )}

                    <Link
                      href="/gallery"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <Images className="w-3.5 h-3.5 text-stone-500" />
                      <span>Pet Gallery</span>
                    </Link>

                    <Link
                      href="/contact"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-stone-700 hover:bg-stone-50 rounded-xl flex items-center gap-2 transition-colors md:hidden"
                    >
                      <Mail className="w-3.5 h-3.5 text-stone-500" />
                      <span>Contact Support</span>
                    </Link>

                    {currentUser && (currentUser.email.includes('hinduwara') || currentUser.email.includes('nameforpet') || currentUser.role === 'admin') && (
                      <Link
                        href="/nameforpet-control-9872"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-amber-600 hover:bg-amber-50 rounded-xl flex items-center gap-2 transition-colors border-t border-stone-100"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                        <span>Owner Console</span>
                      </Link>
                    )}
                  </div>

                  {onSignOut && (
                    <div className="pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onSignOut();
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            onOpenAuth && (
              <button
                type="button"
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold bg-brand-500 hover:bg-brand-600 text-white rounded-full shadow-sm shadow-brand-500/20 hover:shadow-brand-500/30 transition-all active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )
          )}

        </div>

      </div>
    </header>
  );
}
