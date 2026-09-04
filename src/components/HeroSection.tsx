import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Compass, ShieldCheck, Heart, Star } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { BambliMascot, BambliWordmark } from './BambliMascot';
import { playFanfare, playJump } from '../utils/audio';

interface HeroSectionProps {
  currentLang: Language;
  onPlayFree: () => void;
  onExploreGames: () => void;
  onAddStar: () => void;
}

export function HeroSection({
  currentLang,
  onPlayFree,
  onExploreGames,
  onAddStar,
}: HeroSectionProps) {
  const [mascotCheerCount, setMascotCheerCount] = useState(0);
  const t = TRANSLATIONS[currentLang];

  const triggerMascotCheer = () => {
    setMascotCheerCount((prev) => prev + 1);
    playJump();
    if (mascotCheerCount % 3 === 0) {
      playFanfare();
      onAddStar();
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#4ECDC4', '#FF6B6B', '#8054C2', '#8AC926'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  return (
    <section id="hero" className="relative overflow-hidden pt-4 pb-12 sm:pb-16 lg:pb-20">
      {/* Decorative Floating Doodle Stickers in Background */}
      <div className="absolute top-8 left-6 text-4xl opacity-75 -rotate-12 pointer-events-none select-none">
        🧩
      </div>
      <div className="absolute top-20 right-10 text-4xl opacity-75 rotate-12 pointer-events-none select-none">
        🚀
      </div>
      <div className="absolute bottom-12 left-10 text-3xl opacity-75 rotate-6 pointer-events-none select-none">
        🎨
      </div>
      <div className="absolute bottom-16 right-16 text-4xl opacity-75 -rotate-6 pointer-events-none select-none">
        ⭐
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Card styled in Artistic Flair Neo-Brutalist Aesthetic */}
        <div className="bg-[#FFD93D] border-[5px] sm:border-[6px] border-black rounded-[36px] sm:rounded-[48px] lg:rounded-[56px] p-6 sm:p-10 lg:p-14 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          {/* Subtle Halftone / Radial Pattern */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Column: Headings, Value Proposition, Action CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start gap-4 sm:gap-6">
              {/* Category Eyebrow Badge */}
              <div className="inline-flex items-center gap-2 bg-white border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-base sm:text-lg">⭐</span>
                <span className="font-black text-xs sm:text-sm tracking-wider uppercase text-black">
                  {t.hero_badge}
                </span>
              </div>

              {/* Bold Headline */}
              <div className="flex flex-col">
                <h1 className="font-black text-4xl sm:text-6xl lg:text-7xl leading-[1.02] tracking-tight text-black drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)]">
                  <span>{t.hero_title_1}</span>
                  <br />
                  <span className="text-[#8054C2] bg-white px-3 py-0.5 mt-1 inline-block border-[4px] border-black rounded-2xl rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {t.hero_title_2}
                  </span>
                </h1>
              </div>

              {/* Subtitle / Screen Time Value Promise */}
              <p className="text-base sm:text-xl font-bold text-black/90 leading-relaxed max-w-xl">
                {t.hero_subtitle}
              </p>

              {/* Learning Pillar Badges */}
              <div className="flex flex-wrap gap-2 text-xs font-black select-none">
                <span className="bg-[#4ECDC4] text-black border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  🐾 Animals & Nature
                </span>
                <span className="bg-[#FF7096] text-black border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  📖 English & BM 🇲🇾
                </span>
                <span className="bg-[#FFE66D] text-black border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  ⚡ Maths & Logic
                </span>
                <span className="bg-white text-black border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  🚀 Science STEM
                </span>
              </div>

              {/* Call-to-Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2">
                <button
                  onClick={onPlayFree}
                  className="bg-[#FF6B6B] border-[4px] border-black px-7 sm:px-9 py-4 rounded-2xl sm:rounded-3xl font-black text-white text-lg sm:text-xl tracking-wide shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#ff5252] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  <Download className="w-6 h-6 stroke-[2.5]" />
                  <span>{t.hero_cta_play}</span>
                </button>

                <button
                  onClick={onExploreGames}
                  className="bg-white border-[4px] border-black px-6 sm:px-8 py-4 rounded-2xl sm:rounded-3xl font-black text-black text-base sm:text-lg tracking-wide shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:bg-[#4ECDC4] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Compass className="w-5 h-5" />
                  <span>{t.hero_cta_explore}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 pt-1 text-xs sm:text-sm font-black text-black/80">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-black" />
                  <span>{t.hero_pill_safety}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-[#FF6B6B]" />
                  <span>{t.hero_pill_ages}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-[#FF8E3C] fill-[#FF8E3C]" />
                  <span>No Ads • No Distractions</span>
                </div>
              </div>
            </div>

            {/* Right Column: Bambli Mascot Stage & Interactive Discovery Playground */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
              {/* Mascot Stage Card */}
              <div className="w-full max-w-sm sm:max-w-md bg-white border-[5px] border-black rounded-[40px] p-6 sm:p-8 flex flex-col items-center text-center relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-1 hover:rotate-0 transition-transform">
                {/* Speech Bubble from Bambli */}
                <div className="bg-[#4ECDC4] text-black border-[3.5px] border-black px-4 py-2 rounded-2xl font-black text-xs sm:text-sm -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 flex items-center gap-2">
                  <span>👋</span>
                  <span>{t.hero_mascot_prompt}</span>
                </div>

                {/* Animated Bambli Mascot */}
                <div className="my-1">
                  <BambliMascot size={210} onTap={triggerMascotCheer} />
                </div>

                {/* Mini cheer encouragement banner */}
                <div className="mt-4 pt-3 border-t-2 border-black/20 w-full flex items-center justify-between text-xs font-black text-black/70">
                  <span>Adventures Played: 12,400+</span>
                  <span className="text-[#FF6B6B] flex items-center gap-1">
                    <span>❤️</span> 100% Kid Safe
                  </span>
                </div>
              </div>

              {/* Floating Game Item Cards around Stage */}
              <div className="hidden sm:flex absolute -bottom-4 -left-6 bg-[#4ECDC4] border-[3px] border-black px-3.5 py-1.5 rounded-2xl text-xs font-black text-black -rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] items-center gap-1.5">
                <span>🧺</span>
                <span>Little Explorer</span>
              </div>
              <div className="hidden sm:flex absolute -top-4 -right-4 bg-[#FFD93D] border-[3px] border-black px-3.5 py-1.5 rounded-2xl text-xs font-black text-black rotate-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] items-center gap-1.5">
                <span>🧩</span>
                <span>Puzzle Play</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
