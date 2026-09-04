import { useState, useMemo } from 'react';
import { Search, Filter, Play, Download, Lock, Sparkles, ArrowRight } from 'lucide-react';
import { GameProduct, Language, LearningPillar } from '../types';
import { LEARNING_WORLDS } from '../data/worlds';
import { TRANSLATIONS } from '../data/translations';
import { playPop } from '../utils/audio';
import { GameCoverImage } from './GameCoverImage';

interface GamesCatalogueSectionProps {
  games: GameProduct[];
  currentLang: Language;
  selectedPillar: LearningPillar | null;
  selectedAgeId: string | null;
  onSelectPillar: (pillar: LearningPillar | null) => void;
  onSelectAge: (ageId: string | null) => void;
  onOpenDemo: (gameId: string) => void;
  onOpenDetails: (game: GameProduct) => void;
  onOpenOfflineGate?: (game: GameProduct) => void;
}

export function GamesCatalogueSection({
  games,
  currentLang,
  selectedPillar,
  selectedAgeId,
  onSelectPillar,
  onSelectAge,
  onOpenDemo,
  onOpenDetails,
  onOpenOfflineGate,
}: GamesCatalogueSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);

  const t = TRANSLATIONS[currentLang];

  // Filtering games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Hidden or retired
      if (game.status === 'hidden' || game.status === 'retired') return false;

      // Filter by Pillar
      if (selectedPillar && game.pillar !== selectedPillar) return false;

      // Filter by Free Only
      if (freeOnly && !game.isFree) return false;

      // Filter by Age
      if (selectedAgeId) {
        const [minStr, maxStr] = selectedAgeId.split('-');
        const min = parseInt(minStr, 10);
        const max = parseInt(maxStr, 10);
        // check overlap
        if (game.ageMax < min || game.ageMin > max) return false;
      }

      // Filter by Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = game.title.toLowerCase().includes(q) || game.titleMs.toLowerCase().includes(q);
        const matchDesc = game.description.toLowerCase().includes(q) || game.descriptionMs.toLowerCase().includes(q);
        const matchCat = game.category.toLowerCase().includes(q) || game.categoryMs.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCat) return false;
      }

      return true;
    });
  }, [games, selectedPillar, selectedAgeId, freeOnly, searchQuery]);

  return (
    <section id="games" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 bg-[#4ECDC4] border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
            {t.catalogue_title}
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.catalogue_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {t.catalogue_subtitle}
        </p>
      </div>

      {/* Control Bar: Search Input & Filters */}
      <div className="bg-[#FFFDF0] border-[4px] border-black rounded-[32px] p-4 sm:p-5 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-black/60 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search_placeholder}
            className="w-full bg-white border-[3px] border-black rounded-2xl pl-11 pr-4 py-2.5 font-bold text-sm text-black placeholder:text-black/50 focus:outline-none focus:ring-2 focus:ring-[#FFD93D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Free Only Toggle */}
          <button
            onClick={() => {
              playPop(420);
              setFreeOnly(!freeOnly);
            }}
            className={`border-[3px] border-black px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
              freeOnly ? 'bg-[#8AC926] text-white -translate-y-0.5' : 'bg-white hover:bg-gray-100'
            }`}
          >
            {freeOnly ? '✓ Free Games' : t.filter_free_only}
          </button>

          {/* Reset Filters if active */}
          {(selectedPillar || selectedAgeId || freeOnly || searchQuery) && (
            <button
              onClick={() => {
                playPop(350);
                onSelectPillar(null);
                onSelectAge(null);
                setFreeOnly(false);
                setSearchQuery('');
              }}
              className="bg-black text-white px-3.5 py-2 rounded-2xl font-black text-xs hover:bg-[#FF6B6B] transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {/* Learning World Tabs (Filtered to available games) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
        <button
          onClick={() => {
            playPop(400);
            onSelectPillar(null);
          }}
          className={`shrink-0 border-[3px] border-black px-4 py-2 rounded-full font-black text-xs sm:text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
            selectedPillar === null
              ? 'bg-black text-white -translate-y-0.5'
              : 'bg-white hover:bg-gray-100 text-black'
          }`}
        >
          {currentLang === 'ms' ? 'Semua Permainan (2)' : 'All Games (2)'}
        </button>

        {LEARNING_WORLDS.filter((w) => games.some((g) => g.pillar === w.id)).map((world) => {
          const gameInWorld = games.find((g) => g.pillar === world.id);
          return (
            <button
              key={world.id}
              onClick={() => {
                playPop(450);
                onSelectPillar(selectedPillar === world.id ? null : world.id);
              }}
              className={`shrink-0 border-[3px] border-black px-4 py-2 rounded-full font-black text-xs sm:text-sm flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                selectedPillar === world.id
                  ? 'text-black -translate-y-0.5 ring-2 ring-black font-black'
                  : 'bg-white hover:bg-gray-100 text-black'
              }`}
              style={{
                backgroundColor: selectedPillar === world.id ? world.color : undefined,
              }}
            >
              <span>{world.emoji}</span>
              <span>{currentLang === 'ms' ? world.nameMs : world.nameEn}</span>
              {gameInWorld && (
                <span className="text-[11px] bg-black/15 px-2 py-0.5 rounded-full">
                  {gameInWorld.title}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between mb-6 text-xs sm:text-sm font-black text-black/70">
        <span>
          {t.showing_games} {filteredGames.length} of 2 {t.games_count}
        </span>
        {selectedAgeId && (
          <span className="bg-[#FFE66D] border-2 border-black px-2.5 py-0.5 rounded-full text-black">
            Filtered: Ages {selectedAgeId}
          </span>
        )}
      </div>

      {/* Games Cards Grid (Prominently displaying the 2 flagship games) */}
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl mx-auto gap-6 sm:gap-8">
        {filteredGames.map((game, idx) => {
          const cardRotations = ['-rotate-1', 'rotate-1', 'rotate-0', '-rotate-1', 'rotate-1'];
          const rotationClass = cardRotations[idx % cardRotations.length];

          return (
            <div
              key={game.id}
              className={`border-[4px] sm:border-[5px] border-black rounded-[36px] p-6 flex flex-col justify-between shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all relative overflow-hidden group ${rotationClass}`}
              style={{ backgroundColor: game.themeColor }}
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-white text-black border-2 border-black px-3 py-0.5 rounded-full text-[11px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {game.pillarNameEn}
                  </span>
                  <span className="bg-white text-black border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    Ages {game.ageMin}–{game.ageMax}
                  </span>
                </div>

                {/* Cover Poster or Big Illustration Emoji */}
                <div
                  onClick={() => {
                    playPop(400);
                    onOpenDetails(game);
                  }}
                  className="w-full aspect-[16/10] bg-white border-[3px] border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 cursor-pointer hover:scale-[1.02] transition-transform"
                >
                  <GameCoverImage game={game} alt={game.title} />
                </div>

                {/* Short Hook */}
                <div className="text-xs font-black uppercase text-black/75 tracking-wider">
                  {currentLang === 'ms' ? game.shortHookMs : game.shortHook}
                </div>

                {/* Game Title */}
                <h3 className="font-black text-2xl sm:text-3xl text-black leading-tight mt-1 mb-2">
                  {currentLang === 'ms' ? game.titleMs : game.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm font-bold text-black/85 leading-relaxed line-clamp-3">
                  {currentLang === 'ms' ? game.descriptionMs : game.description}
                </p>

                {/* Meta stats */}
                <div className="flex flex-wrap gap-2 mt-4 text-[11px] font-black">
                  <span className="bg-white/90 border-2 border-black px-2 py-0.5 rounded-xl">
                    🎯 {game.challengeCount} Challenges
                  </span>
                  <span className="bg-white/90 border-2 border-black px-2 py-0.5 rounded-xl">
                    ⚡ {currentLang === 'ms' ? game.difficultyMs : game.difficulty}
                  </span>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-6 pt-4 border-t-2 border-black/25 flex items-center justify-between gap-2">
                <div className="text-sm font-black">
                  {game.isFree ? (
                    <span className="bg-white text-black border-2 border-black px-3 py-1 rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      FREE
                    </span>
                  ) : (
                    <span className="bg-[#FF6B6B] text-white border-2 border-black px-3 py-1 rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      RM {game.priceMYR.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-end gap-1.5">
                  <button
                    onClick={() => {
                      playPop(420);
                      onOpenDetails(game);
                    }}
                    className="bg-white border-2 border-black px-2.5 py-1.5 rounded-xl text-xs font-black hover:bg-[#FFD93D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
                  >
                    {t.btn_details}
                  </button>

                  {game.status === 'coming-soon' ? (
                    <span className="bg-gray-200 border-2 border-black px-3 py-1.5 rounded-xl text-[11px] font-black">
                      {t.status_coming_soon}
                    </span>
                  ) : game.isFree ? (
                    <button
                      onClick={() => {
                        playPop(480);
                        if (onOpenOfflineGate) {
                          onOpenOfflineGate(game);
                        }
                      }}
                      className="bg-[#8AC926] text-white border-2 border-black px-3 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-y-0.5 transition-all flex items-center gap-1.5"
                      title={currentLang === 'ms' ? 'Muat Turun Fail Luar Talian .HTML' : 'Download Offline .HTML File'}
                    >
                      <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>{t.btn_play_free}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        playPop(480);
                        onOpenDetails(game);
                      }}
                      className="bg-[#8054C2] text-white border-2 border-black px-3.5 py-1.5 rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7043b3] active:translate-y-0.5 transition-all flex items-center gap-1"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGames.length === 0 && (
        <div className="bg-white border-[4px] border-black rounded-3xl p-10 text-center flex flex-col items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-5xl mb-2">🔍</span>
          <h3 className="font-black text-2xl text-black">
            {currentLang === 'ms' ? 'Tiada permainan sepadan' : 'No matching games found'}
          </h3>
          <p className="text-sm font-bold text-black/70 max-w-md mt-1">
            {currentLang === 'ms'
              ? 'Laman web Bambli menampilkan 2 permainan utama: Little Explorer dan Puzzle Play. Kosongkan tapisan untuk memainkannya!'
              : 'Bambli features 2 flagship learning games: Little Explorer and Puzzle Play. Clear your filters to explore them!'}
          </p>
          <button
            onClick={() => {
              onSelectPillar(null);
              onSelectAge(null);
              setFreeOnly(false);
              setSearchQuery('');
            }}
            className="mt-4 bg-[#FFD93D] border-[3px] border-black px-5 py-2 rounded-2xl font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffcd19] active:translate-y-0.5"
          >
            {currentLang === 'ms' ? 'Tunjuk Kedua-dua Permainan (2)' : 'Show Both Games (2)'}
          </button>
        </div>
      )}
    </section>
  );
}
