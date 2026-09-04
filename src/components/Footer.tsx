import { useState, type FormEvent } from 'react';
import { Download, Heart, ShieldCheck, Instagram, Facebook, Send } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { BambliMascot, BambliWordmark } from './BambliMascot';
import { BambliBrandBadge } from './BambliBrandBadge';
import { playPop, playFanfare } from '../utils/audio';

interface FooterProps {
  currentLang: Language;
  onPlayFree: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ currentLang, onPlayFree, onNavigate }: FooterProps) {
  const [footerEmail, setFooterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (footerEmail.includes('@')) {
      playFanfare();
      setSubscribed(true);
      setFooterEmail('');
    }
  };

  return (
    <footer className="mt-16 bg-[#FFFDF0] border-t-[5px] border-black">
      {/* Final Big CTA Celebration Section (Section 18) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-12">
        <div className="bg-[#4ECDC4] border-[5px] sm:border-[6px] border-black rounded-[40px] sm:rounded-[56px] p-8 sm:p-12 lg:p-14 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          {/* Subtle Halftone Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:14px_14px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center md:items-start text-center md:text-left gap-4 max-w-xl">
            <span className="bg-white border-[3px] border-black px-4 py-1 rounded-full text-xs sm:text-sm font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] -rotate-1">
              🚀 Ready For Fun?
            </span>

            <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight leading-tight">
              {currentLang === 'ms'
                ? 'Bersedia Untuk Pengembaraan Cilik?'
                : 'Ready for a Little Adventure?'}
            </h2>

            <p className="text-base sm:text-xl font-bold text-black/90">
              {currentLang === 'ms'
                ? 'Pengembaraan hebat bermula dengan cabaran kecil.'
                : 'Big adventures start with little challenges.'}
            </p>

            <button
              onClick={() => {
                playPop(550);
                onPlayFree();
              }}
              className="mt-2 bg-[#FF6B6B] border-[4px] border-black px-8 sm:px-10 py-4 rounded-3xl font-black text-white text-lg sm:text-xl tracking-wide shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center gap-3"
            >
              <Download className="w-6 h-6 stroke-[2.5]" />
              <span>{t.nav_play_free}</span>
            </button>
          </div>

          <div className="relative z-10 shrink-0">
            <BambliMascot size={180} />
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information Architecture (Section 19) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pb-12 border-b-[3px] border-black/20">
          {/* Brand Column */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <BambliBrandBadge size={48} />
              <BambliWordmark size="small" />
            </div>

            <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed max-w-sm">
              {currentLang === 'ms'
                ? 'Taman permainan digital moden dalam buku cerita kanak-kanak. Membantu si cilik belajar, berfikir dan meneroka dengan gembira.'
                : "A modern digital playground wrapped inside a children's storybook. Designed to turn screen time into joyful learning adventures."}
            </p>

            {/* Social Channels: Instagram & Facebook */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com/bambli.learning"
                target="_blank"
                rel="noreferrer"
                className="bg-white border-[2.5px] border-black px-3 py-1.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF7096] hover:text-white transition-all flex items-center gap-1.5"
                title="Instagram @bambli.learning"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href="https://facebook.com/bamblilearning"
                target="_blank"
                rel="noreferrer"
                className="bg-white border-[2.5px] border-black px-3 py-1.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#1877F2] hover:text-white transition-all flex items-center gap-1.5"
                title="Facebook"
              >
                <Facebook className="w-4 h-4" />
                <span>Facebook</span>
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm">
            <h4 className="font-black text-sm uppercase text-[#8054C2] tracking-wider">
              {t.footer_explore}
            </h4>
            <ul className="space-y-2 font-bold text-black/80">
              <li>
                <button
                  onClick={() => onNavigate('games')}
                  className="hover:text-black hover:underline"
                >
                  {t.nav_games}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('age-selector')}
                  className="hover:text-black hover:underline"
                >
                  {t.nav_by_age}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-black hover:underline"
                >
                  {currentLang === 'ms' ? 'Pek' : 'Packs'}
                </button>
              </li>
            </ul>
          </div>

          {/* Parents & Trust */}
          <div className="flex flex-col gap-3 text-xs sm:text-sm">
            <h4 className="font-black text-sm uppercase text-[#FF8E3C] tracking-wider">
              {t.footer_parents}
            </h4>
            <ul className="space-y-2 font-bold text-black/80">
              <li>
                <button
                  onClick={() => onNavigate('why-bambli')}
                  className="hover:text-black hover:underline"
                >
                  Screen Time Philosophy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('for-parents')}
                  className="hover:text-black hover:underline"
                >
                  What Parents Expect
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="hover:text-black hover:underline"
                >
                  Adventure Packs & Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('for-parents')}
                  className="hover:text-black hover:underline"
                >
                  FAQ & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Stay Curious Newsletter Signup */}
          <div className="flex flex-col gap-3">
            <h4 className="font-black text-sm uppercase text-[#FF6B6B] tracking-wider">
              Stay Curious
            </h4>
            <p className="text-xs font-bold text-black/75">
              Get weekly parenting ideas and free puzzle printables.
            </p>

            {!subscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={footerEmail}
                  onChange={(e) => setFooterEmail(e.target.value)}
                  placeholder="parent@email.com"
                  className="w-full bg-white border-2 border-black rounded-xl px-3 py-1.5 text-xs font-bold text-black placeholder:text-black/50 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  type="submit"
                  className="bg-[#4ECDC4] border-2 border-black px-3 py-1.5 rounded-xl font-black text-xs text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#3dbdb4]"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <span className="text-xs font-black text-[#8AC926]">
                ✓ Thanks! Welcome to Bambli!
              </span>
            )}

            <div className="flex items-center gap-1.5 text-[11px] font-bold text-black/60 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8AC926]" />
              <span>100% Privacy • No Spam</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright & child safety guarantee */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-black/70">
          <div>{t.footer_rights} • Made with care for curious minds.</div>
          <div className="flex items-center gap-4">
            <span>🛡️ COPPA & Child-Safe Compliant</span>
            <span>bambli.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
