import { AgeGroup, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playJump } from '../utils/audio';

interface AgeSelectorSectionProps {
  ageGroups: AgeGroup[];
  currentLang: Language;
  selectedAgeId: string | null;
  onSelectAge: (ageId: string | null) => void;
}

export function AgeSelectorSection({
  ageGroups,
  currentLang,
  selectedAgeId,
  onSelectAge,
}: AgeSelectorSectionProps) {
  const t = TRANSLATIONS[currentLang];

  const handleAgeClick = (ageId: string) => {
    playJump();
    onSelectAge(selectedAgeId === ageId ? null : ageId);
  };

  return (
    <section id="age-selector" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#FF7096] text-white border-[3.5px] border-black px-4 py-1.5 rounded-full rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-base">🎯</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
            {currentLang === 'ms' ? 'Peringkat Umur' : 'Age Navigator'}
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.age_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {t.age_subtitle}
        </p>

        {/* Coming Soon Notice Banner */}
        <div className="bg-[#FFE66D] border-[3px] border-black rounded-2xl px-5 py-2.5 max-w-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm font-black text-black flex items-center justify-center gap-2">
          <span>⏳</span>
          <span>
            {currentLang === 'ms'
              ? 'Pek permainan berbayar mengikut umur sedang dibangunkan — Nikmati permainan percuma kami dahulu!'
              : 'Paid adventure packs across all age tiers are coming soon — Enjoy our free flagship games in the meantime!'}
          </span>
        </div>

        {/* Clear filter button if an age is active */}
        {selectedAgeId && (
          <button
            onClick={() => {
              playPop(400);
              onSelectAge(null);
            }}
            className="mt-1 bg-black text-white px-4 py-1.5 rounded-full text-xs font-black hover:bg-[#FF6B6B] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            ✕ {t.filter_all}
          </button>
        )}
      </div>

      {/* 5 Age Group Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {ageGroups.map((ag) => {
          const isSelected = selectedAgeId === ag.id;

          return (
            <div
              key={ag.id}
              onClick={() => handleAgeClick(ag.id)}
              className={`border-[4px] border-black rounded-[32px] p-5 flex flex-col justify-between cursor-pointer select-none transition-all relative overflow-hidden ${
                isSelected
                  ? 'scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black ring-offset-2'
                  : 'shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)]'
              }`}
              style={{ backgroundColor: ag.color }}
            >
              {/* Coming Soon Badge on ALL age cards */}
              <div className="absolute -top-1 -right-1 bg-[#FF6B6B] text-white border-2 border-black px-3 py-1 rounded-bl-2xl text-[11px] font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1">
                <span>⏳</span>
                <span>{currentLang === 'ms' ? 'Akan Datang' : 'Coming Soon'}</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-white border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {ag.ageRange}
                  </span>
                  <span className="text-3xl">{ag.emoji}</span>
                </div>

                <h3 className="font-black text-xl sm:text-2xl text-black leading-tight">
                  {currentLang === 'ms' ? ag.titleMs : ag.titleEn}
                </h3>

                <p className="text-xs font-bold text-black/85 mt-2 leading-relaxed">
                  {currentLang === 'ms' ? ag.descriptionMs : ag.descriptionEn}
                </p>
              </div>

              {/* Status indicator button */}
              <div className="mt-5 pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-black text-black">
                <span className="bg-white border-2 border-black px-2.5 py-1 rounded-full text-[11px] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {currentLang === 'ms' ? 'Akan Datang' : 'Coming Soon'}
                </span>
                <span className="w-6 h-6 bg-white border-2 border-black rounded-full flex items-center justify-center font-black">
                  🔒
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
