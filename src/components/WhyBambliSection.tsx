import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface WhyBambliSectionProps {
  currentLang: Language;
}

export function WhyBambliSection({ currentLang }: WhyBambliSectionProps) {
  const t = TRANSLATIONS[currentLang];

  const pillars = [
    {
      title: t.pillar_playful_title,
      desc: t.pillar_playful_desc,
      emoji: '🎨',
      color: '#FF6B6B',
      textColor: 'text-white',
      badge: '01 • Joyful',
    },
    {
      title: t.pillar_purposeful_title,
      desc: t.pillar_purposeful_desc,
      emoji: '🎯',
      color: '#4ECDC4',
      textColor: 'text-black',
      badge: '02 • Cognitive',
    },
    {
      title: t.pillar_progressive_title,
      desc: t.pillar_progressive_desc,
      emoji: '📈',
      color: '#FFD93D',
      textColor: 'text-black',
      badge: '03 • Growth',
    },
    {
      title: t.pillar_parent_title,
      desc: t.pillar_parent_desc,
      emoji: '🛡️',
      color: '#8054C2',
      textColor: 'text-white',
      badge: '04 • Safe & Ad-Free',
    },
  ];

  return (
    <section id="why-bambli" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-white border-[3.5px] border-black px-4 py-1.5 rounded-full rotate-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-base">💡</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
            Bambli Philosophy
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.why_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {t.why_subtitle}
        </p>
      </div>

      {/* 4 Illustrated Value Pillar Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {pillars.map((pillar, idx) => {
          const rotationClasses = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2'];
          return (
            <div
              key={idx}
              className={`border-[4px] sm:border-[5px] border-black rounded-[36px] p-6 sm:p-7 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all ${pillar.textColor} ${rotationClasses[idx]}`}
              style={{ backgroundColor: pillar.color }}
            >
              <div>
                {/* Top Badge & Illustrated Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-white text-black border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {pillar.badge}
                  </span>
                  <span className="text-4xl select-none">{pillar.emoji}</span>
                </div>

                <h3 className="font-black text-2xl sm:text-3xl tracking-tight leading-tight">
                  {pillar.title}
                </h3>

                <p className="text-xs sm:text-sm font-bold mt-2.5 leading-relaxed opacity-95">
                  {pillar.desc}
                </p>
              </div>

              {/* Bottom Decorative Element */}
              <div className="mt-6 pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-black opacity-80">
                <span>Certified Child-Safe</span>
                <span>⭐</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
