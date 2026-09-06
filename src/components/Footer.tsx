import { useState, type FormEvent } from 'react';
import { Heart, ShieldCheck, Instagram, Facebook, Send } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { BambliMascot, BambliWordmark } from './BambliMascot';
import { BambliBrandBadge } from './BambliBrandBadge';
import { playFanfare } from '../utils/audio';
import { subscribeToNewsletter } from '../utils/newsletter';

interface FooterProps {
  currentLang: Language;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ currentLang, onNavigate }: FooterProps) {
  const [footerEmail, setFooterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = TRANSLATIONS[currentLang];

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (footerEmail.includes('@')) {
      playFanfare();
      setSubscribed(true);
      subscribeToNewsletter({ email: footerEmail, source: 'footer' });
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

            {/* Social Channels: Threads, Instagram & Facebook */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href="https://www.threads.com/@bambli.learning?igshid=NTc4MTIwNjQ2YQ=="
                target="_blank"
                rel="noreferrer"
                className="bg-white border-[2.5px] border-black px-3 py-1.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-white transition-all flex items-center gap-1.5"
                title="Threads @bambli.learning"
              >
                <svg
                  viewBox="0 0 192 192"
                  className="w-4 h-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4457 44.7443 97.3305 44.7443 97.2144 44.7443C82.4051 44.7443 70.0587 51.1409 62.5397 62.7807L75.5637 71.6864C81.1666 63.0068 90.0648 61.1409 97.2202 61.1409C97.2971 61.1409 97.3738 61.1409 97.4494 61.1415C106.361 61.1968 113.081 63.7674 117.428 68.7845C120.598 72.4462 122.712 77.4883 123.732 83.7952C115.983 82.4809 107.6 82.0806 98.6432 82.5851C73.3711 84.0132 57.2003 98.4055 58.3057 118.353C58.8672 128.478 63.8998 137.166 72.4632 143.759C79.7015 149.334 89.0148 152.058 98.7099 151.428C111.573 150.591 121.688 145.688 128.783 136.854C134.161 130.146 137.53 121.437 138.951 110.311C144.755 113.85 149.052 118.503 151.398 124.104C155.395 133.628 155.647 149.334 142.652 162.319C131.279 173.679 117.716 178.617 97.0135 178.77C74.0499 178.598 56.6039 171.104 45.152 156.478C34.4256 142.769 28.8804 123.226 28.6836 96C28.8804 68.7742 34.4256 49.2312 45.152 35.5218C56.6039 20.8956 74.0479 13.402 96.9945 13.2302C120.108 13.4036 137.858 20.9351 149.756 35.6215C155.591 42.8168 159.996 51.7285 162.876 62.0561L178.552 57.7737C175.081 45.1246 169.649 34.1957 162.298 25.1152C147.428 6.75121 125.822 -2.83184 97.05 -3H96.94C68.2276 -2.83184 46.877 6.79018 32.472 25.297C19.626 41.7799 12.999 64.7449 12.7738 95.9294V96V96.0706C12.999 127.255 19.626 150.22 32.472 166.703C46.877 185.21 68.2276 194.832 96.94 195H97.05C121.887 194.815 139.732 188.29 154.649 173.549C174.115 154.291 173.529 130.24 167.15 115.605C162.598 105.147 153.888 96.6558 141.537 88.9883ZM97.9354 135.052C87.3162 135.669 76.2792 130.929 75.7383 120.612C75.3372 112.984 81.1662 104.482 100.203 103.398C102.412 103.273 104.573 103.212 106.687 103.212C114.005 103.212 120.845 103.943 127.076 105.353C124.796 133.667 111.421 134.464 97.9354 135.052Z" />
                </svg>
                <span>Threads</span>
              </a>

              <a
                href="https://www.instagram.com/bambli.online?igsi=b2I3cWR2dWNkdWdr"
                target="_blank"
                rel="noreferrer"
                className="bg-white border-[2.5px] border-black px-3 py-1.5 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FF7096] hover:text-white transition-all flex items-center gap-1.5"
                title="Instagram @bambli.online"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>

              <a
                href="https://www.facebook.com/share/1CsUKJ6ERf/?mibextid=wwXIfr"
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
