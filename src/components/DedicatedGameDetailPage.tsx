import { useState } from 'react';
import { ArrowLeft, Play, Download, ShieldCheck, CheckCircle2, Sparkles, Star, Globe2, Monitor, BatteryCharging, FileCode, Lock } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playFanfare, playChime } from '../utils/audio';
import { GameCoverImage } from './GameCoverImage';

interface DedicatedGameDetailPageProps {
  game: GameProduct;
  allGames: GameProduct[];
  currentLang: Language;
  onBack: () => void;
  onOpenOfflineGate: (game: GameProduct) => void;
  onSelectOtherGame: (game: GameProduct) => void;
}

export function DedicatedGameDetailPage({
  game,
  allGames,
  currentLang,
  onBack,
  onOpenOfflineGate,
  onSelectOtherGame,
}: DedicatedGameDetailPageProps) {
  const [activeScreenshotIdx, setActiveScreenshotIdx] = useState(0);
  const t = TRANSLATIONS[currentLang];

  const activeScreenshot = game.screenshots[activeScreenshotIdx] || game.screenshots[0];
  const otherGames = allGames.filter((g) => g.id !== game.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#FFFDF0] py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Top Back Nav */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={() => {
            playPop(360);
            onBack();
          }}
          className="bg-white border-[3px] border-black px-4 py-2 rounded-2xl font-black text-sm flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FFD93D] active:translate-y-0.5 transition-all"
        >
          <ArrowLeft className="w-4 h-4 font-black" />
          <span>{currentLang === 'ms' ? 'Kembali ke Katalog' : 'Back to Games Catalogue'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="bg-[#FFD93D] border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {game.pillarNameEn}
          </span>
          <span className="bg-white border-2 border-black px-3 py-1 rounded-full text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Ages {game.ageMin}–{game.ageMax}
          </span>
        </div>
      </div>

      {/* Main Hero Header Card */}
      <div
        className="border-[5px] border-black rounded-[40px] p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 flex flex-col lg:flex-row items-center gap-8 relative overflow-hidden"
        style={{ backgroundColor: game.themeColor }}
      >
        {/* Left: Cover Visual */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="w-full max-w-md bg-white border-[4px] border-black rounded-3xl overflow-hidden shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] -rotate-1 hover:rotate-0 transition-transform aspect-[16/10]">
            <GameCoverImage
              game={game}
              alt={game.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2 mt-3 text-xs font-black text-black/80">
            <Globe2 className="w-4 h-4 text-black" />
            <span>Languages: {game.languages ? game.languages.join(' & ') : 'English / Bahasa Melayu'}</span>
          </div>
        </div>

        {/* Right: Info & Dual CTAs */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-white border-2 border-black px-3 py-0.5 rounded-full text-xs font-black">
              ⭐ {game.challengeCount} Challenges
            </span>
            <span className="bg-white border-2 border-black px-3 py-0.5 rounded-full text-xs font-black">
              🎯 {currentLang === 'ms' ? game.difficultyMs : game.difficulty}
            </span>
            <span className="bg-[#8AC926] text-white border-2 border-black px-3 py-0.5 rounded-full text-xs font-black">
              100% Free
            </span>
          </div>

          <div>
            <span className="text-xs font-black uppercase tracking-wider text-black/75">
              {currentLang === 'ms' ? game.shortHookMs : game.shortHook}
            </span>
            <h1 className="font-black text-3xl sm:text-5xl text-black leading-tight mt-1">
              {currentLang === 'ms' ? game.titleMs : game.title}
            </h1>
            {game.subtitle && (
              <p className="font-black text-lg sm:text-xl text-[#8054C2] mt-0.5">
                {currentLang === 'ms' ? game.subtitleMs || game.subtitle : game.subtitle}
              </p>
            )}
          </div>

          <p className="font-bold text-sm sm:text-base text-black/90 leading-relaxed">
            {currentLang === 'ms' ? game.descriptionMs : game.description}
          </p>

          {/* Primary Call To Action - Download Standalone HTML */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => {
                playPop(520);
                onOpenOfflineGate(game);
              }}
              className="flex-1 bg-[#8AC926] text-white border-[3.5px] border-black py-4 px-6 rounded-2xl font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2.5"
            >
              <Download className="w-6 h-6 stroke-[2.5]" />
              <span>{currentLang === 'ms' ? 'MUAT TURUN PERMAINAN (.HTML)' : 'DOWNLOAD GAME (.HTML)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-black/75">
            <ShieldCheck className="w-4 h-4 text-[#8AC926]" />
            <span>Delivered as 1 single .html file • 100% Offline • No Wi-Fi or ads</span>
          </div>
        </div>
      </div>

      {/* Learning Value Sections: What You'll Do & What You'll Learn */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* What You'll Do */}
        <div className="bg-white border-[4px] border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#4ECDC4] border-2 border-black rounded-xl flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎯
            </div>
            <h3 className="font-black text-xl text-black">
              {t.what_you_will_do}
            </h3>
          </div>
          <ul className="space-y-3">
            {(currentLang === 'ms' ? game.whatYouDoMs : game.whatYouDo).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 font-bold text-sm text-black/90">
                <span className="w-5 h-5 bg-[#A7F3D0] border-2 border-black rounded-md flex items-center justify-center text-xs font-black text-[#065F46] shrink-0 mt-0.5">
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What You'll Learn */}
        <div className="bg-white border-[4px] border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-[#FFE66D] border-2 border-black rounded-xl flex items-center justify-center text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🧠
            </div>
            <h3 className="font-black text-xl text-black">
              {t.what_you_will_learn}
            </h3>
          </div>
          <ul className="space-y-3">
            {(currentLang === 'ms' ? game.whatYouLearnMs : game.whatYouLearn).map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 font-bold text-sm text-black/90">
                <span className="w-5 h-5 bg-[#FFD93D] border-2 border-black rounded-md flex items-center justify-center text-xs font-black text-black shrink-0 mt-0.5">
                  ★
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interactive Screenshot Showcase */}
      {game.screenshots.length > 0 && (
        <div className="bg-[#FFFDF0] border-[4px] border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-xl text-black flex items-center gap-2">
              <span>📸</span>
              <span>Game Previews &amp; Highlights</span>
            </h3>
            <span className="text-xs font-black text-black/60">
              {activeScreenshotIdx + 1} of {game.screenshots.length}
            </span>
          </div>

          <div
            className="h-56 sm:h-72 border-[3.5px] border-black rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-4 transition-all"
            style={{ backgroundColor: activeScreenshot.bg }}
          >
            <span className="text-6xl sm:text-7xl mb-3 animate-bounce" style={{ animationDuration: '2.5s' }}>
              {activeScreenshot.emoji}
            </span>
            <h4 className="font-black text-xl sm:text-2xl text-black">
              {activeScreenshot.title}
            </h4>
            <p className="font-bold text-xs sm:text-sm text-black/80 max-w-md mt-1">
              {activeScreenshot.caption}
            </p>
          </div>

          {game.screenshots.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {game.screenshots.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playPop(400 + idx * 30);
                    setActiveScreenshotIdx(idx);
                  }}
                  className={`border-[2.5px] border-black rounded-xl px-4 py-2 text-xs font-black flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
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

      {/* Offline Specification / Parent Guide Box */}
      <div className="bg-[#EBFBFA] border-[4px] border-black rounded-3xl p-6 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-8">
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="w-5 h-5 text-[#1A535C]" />
          <h3 className="font-black text-lg text-black">
            {currentLang === 'ms'
              ? 'Panduan & Spesifikasi Luar Talian (Untuk Ibu Bapa)'
              : 'Parent Guide & Offline Specifications'}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold text-black/80">
          <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <span className="block font-black text-black mb-1">📄 Format Fail:</span>
            <span>Tepat 1 fail .html kendiri (tiada zip, tiada pemasang, tiada iklan luar).</span>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <span className="block font-black text-black mb-1">💻 Keserasian:</span>
            <span>Buka menggunakan Safari, Chrome, Edge pada Mac, iPad, Windows, atau Chromebook.</span>
          </div>

          <div className="bg-white border-2 border-black rounded-xl p-3 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            <span className="block font-black text-black mb-1">✈️ Sesuai Untuk:</span>
            <span>Penerbangan kapal terbang, perjalanan kereta, atau kawasan tanpa capaian internet.</span>
          </div>
        </div>
      </div>

      {/* More Bambli Adventures (Content Driven) */}
      <div>
        <h3 className="font-black text-2xl text-black mb-4 flex items-center gap-2">
          <span>🌟</span>
          <span>{currentLang === 'ms' ? 'Pengembaraan Bambli Lain' : 'More Bambli Adventures'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {otherGames.map((og) => (
            <div
              key={og.id}
              onClick={() => {
                playPop(420);
                onSelectOtherGame(og);
              }}
              className="border-[3px] border-black rounded-2xl p-4 cursor-pointer hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between"
              style={{ backgroundColor: og.themeColor }}
            >
              <div>
                <div className="text-3xl mb-2">{og.coverImage}</div>
                <h4 className="font-black text-lg text-black leading-tight">
                  {currentLang === 'ms' ? og.titleMs : og.title}
                </h4>
                <p className="text-xs font-bold text-black/80 line-clamp-2 mt-1">
                  {currentLang === 'ms' ? og.shortHookMs : og.shortHook}
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-black/20 flex items-center justify-between text-xs font-black">
                <span>Ages {og.ageMin}–{og.ageMax}</span>
                <span className="underline">View Details ➔</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
