import { Sparkles, Play, Download, BookOpen } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playChime } from '../utils/audio';
import { GameCoverImage } from './GameCoverImage';

interface StartPlayingSectionProps {
  games: GameProduct[];
  currentLang: Language;
  onOpenDemo?: (gameId: string) => void;
  onOpenDetails: (game: GameProduct) => void;
  onOpenOfflineGate: (game: GameProduct) => void;
}

export function StartPlayingSection({
  games,
  currentLang,
  onOpenDetails,
  onOpenOfflineGate,
}: StartPlayingSectionProps) {
  const t = TRANSLATIONS[currentLang];

  // The 2 featured free games
  const littleExplorer = games.find((g) => g.id === 'little-explorer') || games[0];
  const puzzlePlay = games.find((g) => g.id === 'puzzle-play') || games[1];

  const featuredList = [littleExplorer, puzzlePlay].filter(Boolean);

  return (
    <section id="start-playing" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#FFD93D] border-[3.5px] border-black px-4 py-1.5 rounded-full rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-base">⭐</span>
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
            {currentLang === 'ms' ? 'Permainan Percuma Kami' : 'Our Free Interactive Games'}
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.start_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {currentLang === 'ms'
            ? 'Dua permainan interaktif istimewa sedia untuk dimainkan secara percuma dalam pelayar atau dimuat turun untuk dimainkan luar talian!'
            : 'Two flagship interactive learning games ready to play free in your browser or download for offline play!'}
        </p>
      </div>

      {/* 2 Flagship Interactive Games Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {featuredList.map((game, idx) => {
          const isExplorer = game.id === 'little-explorer';
          const cardBg = isExplorer ? 'bg-[#4ECDC4]' : 'bg-[#FFD93D]';
          const accentBadgeBg = isExplorer ? 'bg-[#FFE66D]' : 'bg-[#FF7096]';
          const accentBadgeText = isExplorer ? 'text-black' : 'text-white';

          return (
            <div
              key={game.id}
              className={`${cardBg} border-[5px] border-black rounded-[40px] p-6 sm:p-8 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group hover:-translate-y-1 transition-all`}
            >
              {/* Background decorative blob */}
              <div
                className="absolute top-[-30px] right-[-30px] w-48 h-48 rounded-full pointer-events-none opacity-20"
                style={{ backgroundColor: game.accentColor }}
              />

              <div className="relative z-10 flex flex-col gap-4">
                {/* Badges Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span
                    className={`${accentBadgeBg} ${accentBadgeText} border-[3px] border-black px-3.5 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    {isExplorer ? '🧺 WONDER WOODS' : '🧩 WORD GARDEN'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="bg-white border-[3px] border-black px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      Ages {game.ageMin}–{game.ageMax}
                    </span>
                    <span className="bg-[#8AC926] text-white border-[2.5px] border-black px-2.5 py-1 rounded-full text-[11px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      100% FREE
                    </span>
                  </div>
                </div>

                {/* Game Artwork Poster */}
                <div
                  onClick={() => {
                    playPop(480);
                    onOpenDetails(game);
                  }}
                  className="w-full aspect-[16/9] bg-white border-[4px] border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer group/art relative"
                >
                  <GameCoverImage
                    game={game}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover/art:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-xs text-white px-2.5 py-1 rounded-xl text-[11px] font-black flex items-center gap-1 border border-white/40">
                    <Sparkles className="w-3 h-3 text-[#FFE66D]" />
                    <span>{game.challengeCount} Challenges</span>
                  </div>
                </div>

                {/* Title & Hook */}
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-black/70">
                    {currentLang === 'ms' ? game.shortHookMs : game.shortHook}
                  </span>
                  <h3 className="font-black text-2xl sm:text-4xl text-black mt-0.5 leading-tight">
                    {currentLang === 'ms' ? game.titleMs : game.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-black text-black/80">
                    {currentLang === 'ms' ? game.subtitleMs : game.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm font-bold text-black/90 leading-relaxed">
                  {currentLang === 'ms' ? game.descriptionMs : game.description}
                </p>

                {/* Feature Highlights */}
                <div className="flex flex-wrap gap-2 text-xs font-black">
                  <span className="bg-white/95 border-2 border-black px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    🎯 {game.challengeCount} Puzzles
                  </span>
                  <span className="bg-white/95 border-2 border-black px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    🇲🇾 English & Bahasa Melayu
                  </span>
                  <span className="bg-white/95 border-2 border-black px-2.5 py-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    💾 Offline .HTML Available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="relative z-10 mt-6 pt-4 border-t-[3px] border-black flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      playChime();
                      onOpenOfflineGate(game);
                    }}
                    className="bg-[#8AC926] text-white border-[3.5px] border-black px-5 py-2.5 rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>{currentLang === 'ms' ? 'MUAT TURUN (.HTML)' : 'DOWNLOAD GAME (.HTML)'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    playPop(420);
                    onOpenDetails(game);
                  }}
                  className="bg-white border-[3px] border-black px-3.5 py-2 rounded-2xl font-black text-black text-xs sm:text-sm hover:bg-[#FFE66D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center gap-1"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.btn_details}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
