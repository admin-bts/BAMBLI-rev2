import { ArrowRight, Star, Trophy, Unlock, Gamepad2, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface AdventureJourneySectionProps {
  currentLang: Language;
}

export function AdventureJourneySection({ currentLang }: AdventureJourneySectionProps) {
  const t = TRANSLATIONS[currentLang];

  const steps = [
    {
      num: '01',
      title: t.step_1_title,
      desc: t.step_1_desc,
      emoji: '🗺️',
      color: '#4ECDC4',
    },
    {
      num: '02',
      title: t.step_2_title,
      desc: t.step_2_desc,
      emoji: '🧩',
      color: '#FFD93D',
    },
    {
      num: '03',
      title: t.step_3_title,
      desc: t.step_3_desc,
      emoji: '⭐',
      color: '#FF6B6B',
    },
    {
      num: '04',
      title: t.step_4_title,
      desc: t.step_4_desc,
      emoji: '🗝️',
      color: '#FF8E3C',
    },
    {
      num: '05',
      title: t.step_5_title,
      desc: t.step_5_desc,
      emoji: '🎉',
      color: '#8054C2',
    },
  ];

  return (
    <section id="journey" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FFFDF0] border-[5px] border-black rounded-[40px] sm:rounded-[50px] p-6 sm:p-10 lg:p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-[#FFD93D] border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Sparkles className="w-4 h-4" />
            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
              Ecosystem & Progression
            </span>
          </div>

          <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
            {t.journey_title}
          </h2>

          <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
            {t.journey_subtitle}
          </p>
        </div>

        {/* 5-Step Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 sm:gap-5 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="border-[4px] border-black rounded-[28px] p-5 flex flex-col justify-between shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all text-black relative"
              style={{ backgroundColor: step.color }}
            >
              {/* Step Number Bubble */}
              <div className="flex items-center justify-between mb-3">
                <span className="bg-white border-2 border-black px-2.5 py-0.5 rounded-full text-xs font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  Step {step.num}
                </span>
                <span className="text-3xl">{step.emoji}</span>
              </div>

              <div>
                <h3 className="font-black text-base sm:text-lg leading-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs font-bold opacity-90 leading-snug">
                  {step.desc}
                </p>
              </div>

              {/* Arrow indicator between steps for desktop */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 bg-white border-2 border-black rounded-full items-center justify-center shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] pointer-events-none">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
