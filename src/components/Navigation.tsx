'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ShoppingBag, Sparkles, User, Phone } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { href: '#shop', label: 'Shop Collection' },
    { href: '#custom', label: 'Temple Commissions' },
    { href: '#craft', label: 'Craft & Metallurgy' },
    { href: '/orders', label: 'My Orders' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-parchment-100/95 backdrop-blur-md shadow-sm border-b border-parchment-300'
            : 'bg-parchment-100 border-b border-parchment-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo / Monogram */}
            <Link
              href="/"
              className="flex items-center gap-3 text-bronze-950 group"
              aria-label="Heritage Bronze Home"
            >
              <div className="w-10 h-10 rounded-full bg-bronze-900 border border-gold-500 flex items-center justify-center text-gold-400 font-serif font-bold text-lg shadow-inner group-hover:scale-105 transition-transform">
                HB
              </div>
              <div className="flex flex-col">
                <span className="font-serif tracking-widest text-lg sm:text-xl font-bold uppercase text-bronze-950">
                  Heritage Bronze
                </span>
                <span className="text-[10px] tracking-widest uppercase text-bronze-500 font-sans font-medium">
                  Artisanal Panchaloha &bull; Swamimalai
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium tracking-wide text-bronze-800 hover:text-gold-600 transition-colors py-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target px-4 text-xs font-semibold uppercase tracking-wider text-bronze-700 bg-parchment-200 hover:bg-parchment-300 rounded-full transition-colors flex items-center gap-2"
                title="Direct WhatsApp with Master Artisan"
              >
                <Phone className="w-3.5 h-3.5 text-gold-600" />
                <span>Craft Inquiries</span>
              </a>

              <Link
                href="/auth/signin"
                className="tap-target px-4 text-xs font-semibold uppercase tracking-wider text-parchment-100 bg-bronze-900 hover:bg-bronze-800 rounded-full transition-colors flex items-center gap-2 shadow-sm"
              >
                <User className="w-3.5 h-3.5 text-gold-400" />
                <span>Sign In</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center md:hidden gap-2">
              <a
                href="#shop"
                className="tap-target text-bronze-800 p-2"
                aria-label="View Shop"
              >
                <ShoppingBag className="w-6 h-6" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="tap-target p-2 text-bronze-900 rounded-lg hover:bg-parchment-200 transition-colors"
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-bronze-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer content */}
          <div className="relative bg-parchment-50 border-t-2 border-gold-500 rounded-t-2xl shadow-2xl p-6 z-10 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-parchment-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-bronze-900 border border-gold-500 flex items-center justify-center text-gold-400 font-serif font-bold text-sm">
                  HB
                </div>
                <span className="font-serif font-bold text-bronze-900 text-base uppercase">
                  Heritage Bronze
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target p-2 text-bronze-700 hover:text-bronze-950 rounded-full"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="mt-6 flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="tap-target w-full justify-start px-4 text-base font-medium text-bronze-900 hover:bg-parchment-200 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-parchment-200 space-y-3">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target w-full bg-parchment-200 text-bronze-900 hover:bg-parchment-300 font-semibold text-sm rounded-xl px-4 flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-gold-600" />
                <span>WhatsApp Master Artisan</span>
              </a>

              <Link
                href="/auth/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="tap-target w-full bg-bronze-900 text-parchment-100 hover:bg-bronze-800 font-semibold text-sm rounded-xl px-4 flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>Sign In with Google</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
