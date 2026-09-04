import { Download } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { GameCoverImage } from './GameCoverImage';

interface FeaturedAdventureSectionProps {
  game: GameProduct;
  currentLang: Language;
  onPlayDemo: () => void;
  onOpenDetails: () => void;
}

export function FeaturedAdventureSection({
  game,
  currentLang,
  onPlayDemo,
  onOpenDetails,
}: FeaturedAdventureSectionProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="featured-adventure" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#FFFDF0] border-[5px] sm:border-[6px] border-black rounded-[40px] sm:rounded-[50px] p-6 sm:p-10 lg:p-12 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
        {/* Top Header Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8 border-b-[3px] border-black pb-5">
          <div className="flex items-center gap-2">
            <span className="bg-[#FF6B6B] text-white border-[3px] border-black px-4 py-1 rounded-full text-xs sm:text-sm font-black uppercase shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
              ⭐ {t.featured_badge}
            </span>
            <span className="bg-[#FFD93D] border-[3px] border-black px-3.5 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Ages {game.ageMin}–{game.ageMax}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-black">
            <span className="bg-white border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎯 {game.challengeCount} Challenges
            </span>
            <span className="bg-[#4ECDC4] border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {currentLang === 'ms' ? game.difficultyMs : game.difficulty}
            </span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Title, Hook, What You Do & Learn */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            <div>
              <p className="text-xs sm:text-sm font-black uppercase text-[#8054C2] tracking-wider">
                {currentLang === 'ms' ? game.shortHookMs : game.shortHook}
              </p>
              <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black mt-1 leading-tight">
                {currentLang === 'ms' ? game.titleMs : game.title}
              </h2>
              <p className="text-xl sm:text-2xl font-black text-[#FF6B6B] mt-2">
                "{t.featured_hook}"
              </p>
              <p className="text-sm sm:text-base font-bold text-black/85 mt-2 leading-relaxed">
                {currentLang === 'ms' ? game.descriptionMs : game.description}
              </p>
            </div>

            {/* What You'll Do & Learn Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-[3.5px] border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div>
                <h4 className="font-black text-xs sm:text-sm uppercase text-[#8054C2] mb-2 flex items-center gap-1.5">
                  <span>🎯</span> {t.what_you_will_do}
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-black/90">
                  {(currentLang === 'ms' ? game.whatYouDoMs : game.whatYouDo).slice(0, 2).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#4ECDC4] font-black">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black text-xs sm:text-sm uppercase text-[#FF8E3C] mb-2 flex items-center gap-1.5">
                  <span>🧠</span> {t.what_you_will_learn}
                </h4>
                <ul className="space-y-1.5 text-xs font-bold text-black/90">
                  {(currentLang === 'ms' ? game.whatYouLearnMs : game.whatYouLearn).slice(0, 2).map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-[#FF7096] font-black">★</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={onPlayDemo}
                className="bg-[#4ECDC4] border-[4px] border-black px-6 sm:px-8 py-3.5 rounded-2xl font-black text-black text-base sm:text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#3dbdb4] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span>{t.btn_play_free}</span>
              </button>

              <button
                onClick={onOpenDetails}
                className="bg-white border-[3.5px] border-black px-5 sm:px-6 py-3.5 rounded-2xl font-black text-black text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFE66D] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                {t.btn_details}
              </button>
            </div>
          </div>

          {/* Right Column: Game Cover Showcase */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="w-full relative group">
              <div className="w-full aspect-[4/3] sm:aspect-[16/10] border-[4px] sm:border-[5px] border-black rounded-[32px] overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[#FFD93D] relative">
                <GameCoverImage
                  game={game}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  alt={currentLang === 'ms' ? game.titleMs : game.title}
                />
                <div className="absolute top-3.5 left-3.5 bg-black text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]">
                  {currentLang === 'ms' ? '💾 Muat Turun Fail .HTML' : '💾 Standalone .HTML Download'}
                </div>
                <div className="absolute bottom-3.5 right-3.5 bg-[#4ECDC4] text-black px-3.5 py-1.5 rounded-full text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {currentLang === 'ms' ? '100% Percuma Luar Talian' : '100% Free Offline Play'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
