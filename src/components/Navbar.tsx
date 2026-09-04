import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Star,
  Sparkles,
  Music,
  Download,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import {
  playPop,
  isBgmPlaying,
  toggleBgm,
  subscribeBgm,
} from '../utils/audio';
import { BambliBrandBadge } from './BambliBrandBadge';

interface NavbarProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  starCount: number;
  onOpenStarterAdventure: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Navbar({
  currentLang,
  onLangChange,
  starCount,
  onOpenStarterAdventure,
  onNavigate,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(isBgmPlaying());
  const t = TRANSLATIONS[currentLang];

  useEffect(() => {
    const unsub = subscribeBgm((playing) => {
      setMusicOn(playing);
    });
    return unsub;
  }, []);

  const handleMusicToggle = () => {
    playPop(520);
    const newBgmState = toggleBgm();
    setMusicOn(newBgmState);
  };

  const handleNavClick = (sectionId: string) => {
    playPop(480);
    setMobileMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FFFDF0]/95 backdrop-blur-sm border-b-[4px] border-black px-4 sm:px-6 lg:px-8 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Official Bambli Brand Badge Logo & Lockup */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
          title="Bambli — Playful Learning"
        >
          <BambliBrandBadge
            size={46}
            showTagline={false}
            className="group-hover:scale-105 group-hover:rotate-3 transition-transform"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-0.5 font-black text-2xl sm:text-3xl tracking-tight leading-none">
              <span className="text-[#8054C2] -rotate-2 inline-block">B</span>
              <span className="text-[#FF7096] rotate-1 inline-block">a</span>
              <span className="text-[#2DD4BF] -rotate-1 inline-block">m</span>
              <span className="text-[#FFBA08] rotate-2 inline-block">b</span>
              <span className="text-[#8054C2] -rotate-1 inline-block">l</span>
              <span className="text-[#2DD4BF] rotate-1 inline-block">i</span>
            </div>
            <span className="text-[9.5px] sm:text-[10px] font-black uppercase text-[#191A23]/80 tracking-wider">
              Big Learning for Little Minds
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 font-black text-sm">
          <button
            onClick={() => handleNavClick('games')}
            className="bg-white border-[3px] border-black px-4 py-1.5 rounded-full hover:bg-[#4ECDC4] hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {t.nav_games}
          </button>
          <button
            onClick={() => handleNavClick('age-selector')}
            className="bg-white border-[3px] border-black px-4 py-1.5 rounded-full hover:bg-[#FF8E3C] hover:text-white hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {t.nav_by_age}
          </button>
          <button
            onClick={() => handleNavClick('why-bambli')}
            className="bg-white border-[3px] border-black px-4 py-1.5 rounded-full hover:bg-[#A78BFA] hover:text-white hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {t.nav_for_parents}
          </button>
          <button
            onClick={() => handleNavClick('pricing')}
            className="bg-white border-[3px] border-black px-4 py-1.5 rounded-full hover:bg-[#2DD4BF] hover:-translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            {currentLang === 'ms' ? 'Pek' : 'Packs'}
          </button>
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cute Music Toggle Button (Point 4) */}
          <button
            onClick={handleMusicToggle}
            aria-label={musicOn ? 'Cute music is playing - Click to mute' : 'Cute music is muted - Click to play'}
            title={musicOn ? 'Cute Music: Playing (Click to Mute)' : 'Cute Music: Muted (Click to Play)'}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 border-[2.5px] border-black rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all cursor-pointer ${
              musicOn
                ? 'bg-[#FFD93D] text-black animate-pulse'
                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-black'
            }`}
          >
            <Music
              className={`w-4 h-4 ${musicOn ? 'text-black fill-black animate-bounce' : 'text-gray-400'}`}
            />
            <span className="hidden sm:inline">
              {musicOn ? 'Music ON 🎵' : 'Music OFF 🔇'}
            </span>
          </button>

          {/* Star Counter Pill */}
          <div
            title={`${starCount} ${t.stars_earned}`}
            className="hidden sm:flex items-center gap-1 bg-white border-[2.5px] border-black rounded-full px-2.5 py-1 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <Star className="w-3.5 h-3.5 text-[#FFBA08] fill-[#FFBA08]" />
            <span>{starCount}</span>
          </div>

          {/* Bilingual Language Switcher */}
          <div className="flex items-center bg-white border-[2.5px] border-black rounded-full p-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-xs font-black">
            <button
              onClick={() => {
                playPop(450);
                onLangChange('en');
              }}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                currentLang === 'en'
                  ? 'bg-[#2DD4BF] text-black shadow-inner'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => {
                playPop(500);
                onLangChange('ms');
              }}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                currentLang === 'ms'
                  ? 'bg-[#FF7096] text-white shadow-inner'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              BM 🇲🇾
            </button>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => {
              playPop(600);
              onOpenStarterAdventure();
            }}
            className="hidden sm:inline-flex items-center gap-1.5 bg-[#FF6B6B] border-[3px] border-black px-4 py-1.5 rounded-2xl font-black text-white text-xs sm:text-sm tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:bg-[#ff5252] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{t.nav_play_free}</span>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 bg-white border-[2.5px] border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 pt-3 border-t-[3px] border-black flex flex-col gap-2.5 pb-2">
          <div className="grid grid-cols-3 gap-2 font-black text-xs sm:text-sm">
            <button
              onClick={() => handleNavClick('games')}
              className="bg-white border-[3px] border-black p-2.5 rounded-xl text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            >
              🎮 {t.nav_games}
            </button>
            <button
              onClick={() => handleNavClick('age-selector')}
              className="bg-white border-[3px] border-black p-2.5 rounded-xl text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            >
              🎯 {t.nav_by_age}
            </button>
            <button
              onClick={() => handleNavClick('why-bambli')}
              className="bg-white border-[3px] border-black p-2.5 rounded-xl text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5"
            >
              💡 {t.nav_for_parents}
            </button>
          </div>

          <button
            onClick={() => handleNavClick('pricing')}
            className="w-full bg-[#FFE66D] border-[3px] border-black p-2.5 rounded-xl font-black text-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
          >
            <span>⭐</span>
            <span>{currentLang === 'ms' ? 'Pek Permainan (Akan Datang)' : 'Game Packs (Coming Soon)'}</span>
          </button>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStarterAdventure();
            }}
            className="w-full bg-[#FF6B6B] border-[3.5px] border-black p-3 rounded-2xl font-black text-white text-base tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2 active:translate-y-0.5 active:shadow-none"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>{t.nav_play_free}</span>
          </button>
        </div>
      )}
    </header>
  );
}
