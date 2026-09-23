import { Sparkles, Play, Star, Lock } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop } from '../utils/audio';

interface PricingSectionProps {
  games: GameProduct[];
  currentLang: Language;
  onSelectPlan: (gameId: string) => void;
}

// Card visuals not modeled on GameProduct (color/textColor) plus per-game
// marketing bullet copy — keyed by game id, extend when adding a new game.
const CARD_META: Record<string, { color: string; textColor: string; features: string[]; featuresMs: string[] }> = {
  'little-explorer': {
    color: '#4ECDC4',
    textColor: 'text-black',
    features: [
      'Wonder Woods visual storytelling & rich soundscape',
      '10 interactive challenge tasks (food, fruits, flowers)',
      'Bilingual audio prompts in English & Bahasa Melayu',
      'Download the game to play 100% offline anytime',
      '100% Safe, zero ads, zero in-app purchases',
    ],
    featuresMs: [
      'Penceritaan visual & audio Hutan Ajaib yang memukau',
      '10 tugasan interaktif (makanan, buah-buahan, bunga)',
      'Audio dwi-bahasa dalam Bahasa Inggeris & BM',
      'Muat turun permainan untuk main 100% luar talian',
      '100% Selamat, tiada iklan langsung',
    ],
  },
  'puzzle-play': {
    color: '#FF7096',
    textColor: 'text-black',
    features: [
      'Word Garden bilingual search puzzles & fun clues',
      'English & Bahasa Melayu vocabulary boost',
      'Interactive word highlight and celebratory chimes',
      'Download the game to play 100% offline anytime',
      '100% Child-safe, COPPA compliant & offline ready',
    ],
    featuresMs: [
      'Teka kata dwibahasa Taman Bunga yang menyeronokkan',
      'Meningkatkan perbendaharaan kata Bahasa Inggeris & BM',
      'Sorotan perkataan interaktif dan kesan bunyi ceria',
      'Muat turun permainan untuk main 100% luar talian',
      '100% Selamat, patuh privasi kanak-kanak',
    ],
  },
  'fun-with-sifir': {
    color: '#FFD93D',
    textColor: 'text-black',
    features: [
      'Number Mountain quest map across sifir 2–12',
      'Collect kawaii toy characters as progress rewards',
      'Playful multiple-choice multiplication challenges',
      'Download the game file — yours to keep and replay offline',
      'Also emailed to you as a backup copy after purchase',
    ],
    featuresMs: [
      'Peta pengembaraan Gunung Nombor merentasi sifir 2–12',
      'Kumpul watak mainan comel sebagai ganjaran kemajuan',
      'Cabaran sifir darab aneka pilihan yang menyeronokkan',
      'Muat turun fail permainan — milik anda untuk dimainkan semula',
      'Turut dihantar ke e-mel anda sebagai salinan sandaran',
    ],
  },
};

export function PricingSection({ games, currentLang, onSelectPlan }: PricingSectionProps) {
  const t = TRANSLATIONS[currentLang];

  return (
    <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-[#FFD93D] border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <Sparkles className="w-4 h-4" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
            {currentLang === 'ms' ? 'Akses Permainan' : 'Game Access'}
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {currentLang === 'ms' ? 'Akses Setiap Permainan' : 'Get Access to Every Game'}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {currentLang === 'ms'
            ? 'Sebahagian permainan kami percuma sepenuhnya; ada juga permainan premium dengan bayaran sekali sahaja. Tiada langganan.'
            : 'Some of our games are completely free; some are one-time premium purchases. No subscriptions, ever.'}
        </p>
      </div>

      {/* Game Cards, driven by GAMES_CATALOGUE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch max-w-6xl mx-auto">
        {games.map((game) => {
          const meta = CARD_META[game.id];
          const features = (currentLang === 'ms' ? meta?.featuresMs : meta?.features) || [];

          return (
            <div
              key={game.id}
              className={`border-[4px] sm:border-[5px] border-black rounded-[36px] p-6 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all relative overflow-hidden ring-4 ring-black ring-offset-2 ${meta?.textColor || 'text-black'}`}
              style={{ backgroundColor: meta?.color || game.themeColor }}
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-white text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {currentLang === 'ms'
                      ? `⭐ Umur ${game.ageMin}–${game.ageMax} Tahun`
                      : `⭐ Ages ${game.ageMin}–${game.ageMax} • ${game.category}`}
                  </span>
                  <Star className="w-6 h-6 fill-[#FFBA08] text-black" />
                </div>

                <h3 className="font-black text-2xl sm:text-3xl leading-tight">
                  {currentLang === 'ms' ? game.titleMs : game.title}
                </h3>

                {/* Status / Price Tag */}
                <div className="my-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight inline-block bg-white text-black border-2 border-black px-3.5 py-1 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {game.isFree
                      ? currentLang === 'ms' ? '100% PERCUMA' : '100% FREE'
                      : `RM ${game.priceMYR.toFixed(2)}`}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold leading-relaxed opacity-90 mb-5">
                  {currentLang === 'ms' ? game.subtitleMs : game.subtitle}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 border-t-2 border-black/20 pt-4 mb-6">
                  {features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs font-bold">
                      <span className="font-black text-base leading-none">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              {game.status === 'coming-soon' ? (
                <span className="w-full text-center bg-gray-200 border-[3.5px] border-black py-3 rounded-2xl font-black text-sm sm:text-base shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  🚀 {currentLang === 'ms' ? 'Akan Datang' : 'Coming Soon'}
                </span>
              ) : (
                <button
                  onClick={() => {
                    playPop(520);
                    onSelectPlan(game.id);
                  }}
                  className={`w-full border-[3.5px] border-black py-3 rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer text-white ${
                    game.isFree ? 'bg-[#8AC926] hover:bg-[#7cb622]' : 'bg-[#8054C2] hover:bg-[#7043b3]'
                  }`}
                >
                  {game.isFree ? (
                    <Play className="w-4 h-4 stroke-[2.5] fill-white" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>
                    {game.isFree
                      ? currentLang === 'ms' ? 'MAIN SEKARANG' : 'PLAY NOW'
                      : currentLang === 'ms' ? 'BUKA PERMAINAN' : 'UNLOCK GAME'}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
