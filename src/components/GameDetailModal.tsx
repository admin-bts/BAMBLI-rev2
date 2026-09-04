import { useState } from 'react';
import { X, Play, Download, Lock, Check, Sparkles, Star, ShieldCheck } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playFanfare } from '../utils/audio';
import { GameCoverImage } from './GameCoverImage';

interface GameDetailModalProps {
  game: GameProduct | null;
  currentLang: Language;
  onClose: () => void;
  onPlayDemo: (gameId: string) => void;
  onOpenOfflineGate?: (game: GameProduct) => void;
}

export function GameDetailModal({
  game,
  currentLang,
  onClose,
  onPlayDemo,
  onOpenOfflineGate,
}: GameDetailModalProps) {
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const [purchasedDemo, setPurchasedDemo] = useState(false);

  if (!game) return null;

  const t = TRANSLATIONS[currentLang];
  const activeScreenshot = game.screenshots[activeScreenshotIdx] || game.screenshots[0];

  const handleUnlockDemo = () => {
    playFanfare();
    setPurchasedDemo(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div
        className="w-full max-w-3xl bg-[#FFFDF0] border-[6px] border-black rounded-[40px] p-5 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        style={{ borderColor: '#000000' }}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b-[3px] border-black pb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 sm:w-16 sm:h-16 border-[3.5px] border-black rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -rotate-2"
              style={{ backgroundColor: game.themeColor }}
            >
              {game.coverImage}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="bg-[#FFD93D] border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase">
                  {game.pillarNameEn}
                </span>
                <span className="bg-white border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black">
                  Ages {game.ageMin}–{game.ageMax}
                </span>
                {game.isFree ? (
                  <span className="bg-[#4ECDC4] border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    FREE STARTER
                  </span>
                ) : (
                  <span className="bg-[#FF6B6B] text-white border-2 border-black px-2.5 py-0.5 rounded-full text-[11px] font-black">
                    RM {game.priceMYR.toFixed(2)}
                  </span>
                )}
              </div>

              <h2 className="font-black text-2xl sm:text-4xl text-black leading-tight">
                {currentLang === 'ms' ? game.titleMs : game.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              playPop(350);
              onClose();
            }}
            className="w-10 h-10 bg-white border-[3px] border-black rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Cover Banner */}
        <div className="w-full bg-white border-[3.5px] border-black rounded-3xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <GameCoverImage
            game={game}
            alt={game.title}
            className="w-full h-auto object-cover max-h-64 sm:max-h-80 aspect-[16/10]"
          />
        </div>

        {/* Short Hook & Description */}
        <div>
          <p className="text-base sm:text-lg font-black text-[#8054C2]">
            {currentLang === 'ms' ? game.shortHookMs : game.shortHook}
          </p>
          <p className="text-sm sm:text-base font-bold text-black/85 mt-1 leading-relaxed">
            {currentLang === 'ms' ? game.descriptionMs : game.description}
          </p>
        </div>

        {/* Screenshot Showcase */}
        {game.screenshots.length > 0 && (
          <div className="flex flex-col gap-3">
            <div
              className="h-48 sm:h-60 border-[4px] border-black rounded-3xl p-5 flex flex-col items-center justify-center text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative"
              style={{ backgroundColor: activeScreenshot.bg }}
            >
              <span className="text-6xl sm:text-7xl animate-bounce" style={{ animationDuration: '3s' }}>
                {activeScreenshot.emoji}
              </span>
              <h4 className="font-black text-xl sm:text-2xl text-black mt-2">
                {activeScreenshot.title}
              </h4>
              <p className="text-xs sm:text-sm font-bold text-black/85 max-w-sm">
                {activeScreenshot.caption}
              </p>
            </div>

            {game.screenshots.length > 1 && (
              <div className="flex gap-2">
                {game.screenshots.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      playPop(420 + idx * 30);
                      setActiveScreenshotIdx(idx);
                    }}
                    className={`border-[2.5px] border-black rounded-xl px-3 py-1.5 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                      activeScreenshotIdx === idx
                        ? 'bg-[#FFD93D] -translate-y-0.5'
                        : 'bg-white hover:bg-gray-100'
                    }`}
                  >
                    <span>{s.emoji}</span>
                    <span>{s.title}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* What You'll Do and What You'll Learn (Section 26) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border-[3.5px] border-black rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-black text-sm uppercase text-[#8054C2] mb-2 flex items-center gap-1.5">
              <span>🎯</span> {t.what_you_will_do}
            </h4>
            <ul className="space-y-1.5 text-xs font-bold text-black/90">
              {(currentLang === 'ms' ? game.whatYouDoMs : game.whatYouDo).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#4ECDC4] font-black">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white border-[3.5px] border-black rounded-3xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <h4 className="font-black text-sm uppercase text-[#FF8E3C] mb-2 flex items-center gap-1.5">
              <span>🧠</span> {t.what_you_will_learn}
            </h4>
            <ul className="space-y-1.5 text-xs font-bold text-black/90">
              {(currentLang === 'ms' ? game.whatYouLearnMs : game.whatYouLearn).map((item, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-[#FF7096] font-black">★</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* What's Inside & Parent Value */}
        <div className="flex flex-wrap gap-2 text-xs font-black">
          <span className="bg-[#FFE66D] border-2 border-black px-3 py-1 rounded-full">
            🏆 {game.challengeCount} Progressive Challenges
          </span>
          <span className="bg-[#4ECDC4] border-2 border-black px-3 py-1 rounded-full">
            🌟 Difficulty: {currentLang === 'ms' ? game.difficultyMs : game.difficulty}
          </span>
          <span className="bg-white border-2 border-black px-3 py-1 rounded-full">
            🛡️ 100% Ad-Free • Child-Safe
          </span>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-4 border-t-[3px] border-black flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-black/80">
            <ShieldCheck className="w-4 h-4 text-[#8AC926]" />
            <span>Instant web play or offline pack • No subscriptions</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {game.status === 'coming-soon' ? (
              <span className="w-full sm:w-auto text-center bg-gray-200 border-[3.5px] border-black px-6 py-3 rounded-2xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                🚀 {t.status_coming_soon}
              </span>
            ) : game.isFree ? (
              <div className="w-full sm:w-auto">
                <button
                  onClick={() => {
                    onClose();
                    if (onOpenOfflineGate) {
                      onOpenOfflineGate(game);
                    }
                  }}
                  className="w-full sm:w-auto bg-[#8AC926] border-[3.5px] border-black px-7 py-3 rounded-2xl font-black text-white text-sm sm:text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5 stroke-[2.5]" />
                  <span>{currentLang === 'ms' ? 'MUAT TURUN PERMAINAN (.HTML)' : 'DOWNLOAD GAME (.HTML)'}</span>
                </button>
              </div>
            ) : purchasedDemo ? (
              <div className="bg-[#8AC926] text-white border-[3.5px] border-black px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Check className="w-4 h-4" />
                <span>Unlocked! Loading Game...</span>
              </div>
            ) : (
              <button
                onClick={handleUnlockDemo}
                className="w-full sm:w-auto bg-[#8054C2] border-[3.5px] border-black px-7 py-3 rounded-2xl font-black text-white text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7043b3] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{t.btn_unlock} (RM {game.priceMYR.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
