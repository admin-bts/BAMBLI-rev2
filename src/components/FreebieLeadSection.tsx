import { useState, type FormEvent } from 'react';
import confetti from 'canvas-confetti';
import { Mail, Sparkles, CheckCircle2, Download, Eye, Gift } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playFanfare } from '../utils/audio';

interface FreebieLeadSectionProps {
  currentLang: Language;
  onOpenPreview: () => void;
}

export function FreebieLeadSection({
  currentLang,
  onOpenPreview,
}: FreebieLeadSectionProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = TRANSLATIONS[currentLang];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(currentLang === 'ms' ? 'Sila masukkan alamat emel yang sah' : 'Please enter a valid email address');
      playPop(300);
      return;
    }

    setErrorMsg('');
    setSubmitted(true);
    playFanfare();

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.7 },
        colors: ['#FFE66D', '#FF6B6B', '#4ECDC4', '#8054C2'],
      });
    } catch {
      // Safe fallback
    }
  };

  return (
    <section id="freebies" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FFE66D] border-[5px] sm:border-[6px] border-black rounded-[40px] sm:rounded-[56px] p-6 sm:p-10 lg:p-14 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] sm:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Subtle patterned background */}
        <div className="absolute top-[-40px] right-[-40px] w-64 h-64 bg-[#FF8E3C]/20 rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Value proposition, Form */}
          <div className="lg:col-span-7 flex flex-col gap-4 sm:gap-6">
            <div className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Gift className="w-4 h-4" />
              <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
                {t.lead_badge}
              </span>
            </div>

            <div>
              <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight leading-tight">
                {t.lead_title}
              </h2>
              <p className="text-base sm:text-xl font-bold text-black/90 mt-2 leading-relaxed">
                {t.lead_subtitle}
              </p>
            </div>

            {/* 5 Content Pillars included in the Pack */}
            <div className="flex flex-wrap gap-2 text-xs font-black select-none">
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🐾 Animals
              </span>
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🍉 Fruits
              </span>
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🌸 Bilingual Words
              </span>
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ⚡ Numbers
              </span>
              <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                🧩 Logic Mazes
              </span>
            </div>

            {/* Form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 pt-2">
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.lead_input_placeholder}
                    className="w-full bg-white border-[3.5px] border-black rounded-2xl pl-12 pr-4 py-3.5 font-bold text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#FF6B6B] border-[3.5px] border-black px-6 sm:px-8 py-3.5 rounded-2xl font-black text-white text-sm sm:text-base tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.lead_btn}</span>
                </button>
              </form>
            ) : (
              <div className="bg-[#8AC926] text-white border-[3.5px] border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <div>
                  <h4 className="font-black text-base">Check Your Inbox!</h4>
                  <p className="text-xs font-bold text-white/90">{t.lead_success_msg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="text-xs font-black text-[#E63946] -mt-2">{errorMsg}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs font-bold text-black/75">
              <span>{t.lead_guarantee}</span>
              <button
                type="button"
                onClick={() => {
                  playPop(480);
                  onOpenPreview();
                }}
                className="font-black underline hover:text-black flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{t.lead_preview_btn} →</span>
              </button>
            </div>
          </div>

          {/* Right Column: Illustrated Worksheet Preview Cards */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div
              onClick={() => {
                playPop(480);
                onOpenPreview();
              }}
              className="w-full max-w-sm bg-white border-[5px] border-black rounded-[36px] p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-2 hover:rotate-0 transition-transform cursor-pointer group select-none relative"
            >
              <div className="bg-[#4ECDC4] border-[3px] border-black rounded-2xl p-4 text-center mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <span className="text-5xl group-hover:scale-110 transition-transform inline-block">
                  📑
                </span>
                <h4 className="font-black text-xl text-black mt-2">
                  Bambli 5-Puzzle Pack
                </h4>
                <p className="text-xs font-bold text-black/80">
                  Ready-to-print activity sheets
                </p>
              </div>

              <div className="space-y-2 text-xs font-black text-black/90">
                <div className="flex items-center justify-between bg-[#FFFDF0] p-2 rounded-xl border border-black/20">
                  <span>1. Wonder Woods Maze</span>
                  <span>🐨</span>
                </div>
                <div className="flex items-center justify-between bg-[#FFFDF0] p-2 rounded-xl border border-black/20">
                  <span>2. Tropical Fruit Sudoku</span>
                  <span>🍉</span>
                </div>
                <div className="flex items-center justify-between bg-[#FFFDF0] p-2 rounded-xl border border-black/20">
                  <span>3. Word Garden Search</span>
                  <span>🌸</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-black text-[#8054C2]">
                <span>Tap to Preview Sheets</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
