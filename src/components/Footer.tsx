import Link from 'next/link';
import { Mail, Phone, MessageSquare, ShieldCheck, Hammer, Flame } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-bronze-950 text-parchment-200 border-t border-bronze-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-bronze-900 border border-gold-500 flex items-center justify-center text-gold-400 font-serif font-bold text-lg">
                HB
              </div>
              <span className="font-serif tracking-widest text-xl font-bold uppercase text-parchment-100">
                Heritage Bronze
              </span>
            </div>
            <p className="text-sm text-parchment-300/80 max-w-md leading-relaxed font-sans">
              Sacred Panchaloha casting and artisanal bronze lifestyle wares hand-forged in the ancient lineage of Swamimalai. Every murti and lifestyle vessel honors the Agamic Shilpa Shastras and centuries of lost-wax casting traditions.
            </p>
            <div className="flex items-center gap-6 pt-2 text-xs text-gold-400/90">
              <span className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-gold-500" />
                Madhuchishtavidhana
              </span>
              <span className="flex items-center gap-1.5">
                <Hammer className="w-4 h-4 text-gold-500" />
                Hand-Forged Bronze
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-500" />
                Authentic Panchaloha
              </span>
            </div>
          </div>

          {/* Direct Communication Seam */}
          <div className="space-y-4">
            <h3 className="font-serif text-gold-400 text-sm tracking-wider uppercase font-semibold">
              Master Craftsperson Contact
            </h3>
            <p className="text-xs text-parchment-300/70">
              All bespoke commissions and order updates are personally handled off-platform by the master artisan:
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tap-target justify-start gap-2.5 text-parchment-200 hover:text-gold-400 transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp: +91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+919876543210"
                  className="tap-target justify-start gap-2.5 text-parchment-200 hover:text-gold-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-gold-400" />
                  <span>Phone: +91 98765 43210</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@heritagebronze.in"
                  className="tap-target justify-start gap-2.5 text-parchment-200 hover:text-gold-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-gold-400" />
                  <span>contact@heritagebronze.in</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-gold-400 text-sm tracking-wider uppercase font-semibold">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm text-parchment-300">
              <li>
                <a href="#shop" className="hover:text-gold-400 transition-colors">
                  Predefined Products (Wares)
                </a>
              </li>
              <li>
                <a href="#custom" className="hover:text-gold-400 transition-colors">
                  Temple Commissions (Portfolio)
                </a>
              </li>
              <li>
                <a href="#craft" className="hover:text-gold-400 transition-colors">
                  Lost-Wax Metallurgy & Care
                </a>
              </li>
              <li>
                <Link href="/orders" className="hover:text-gold-400 transition-colors">
                  My Orders & Tracking
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-gold-400 transition-colors text-xs text-parchment-400">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-bronze-900 flex flex-col sm:flex-row items-center justify-between text-xs text-parchment-400">
          <p>© {new Date().getFullYear()} Heritage Bronze Workshop. All sacred works hand-cast with reverence.</p>
          <p className="mt-2 sm:mt-0">Flat ₹150 shipping across India &bull; Free shipping on orders ₹2,500+</p>
        </div>
      </div>
    </footer>
  );
}
