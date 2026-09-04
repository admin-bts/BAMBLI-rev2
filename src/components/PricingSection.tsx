import { Sparkles, Download, Star } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop } from '../utils/audio';

interface PricingSectionProps {
  currentLang: Language;
  onSelectFreePlan: () => void;
}

export function PricingSection({ currentLang, onSelectFreePlan }: PricingSectionProps) {
  const t = TRANSLATIONS[currentLang];

  const games = [
    {
      id: 'little-explorer',
      title: 'Little Explorer',
      isFree: true,
      price: '100% FREE',
      badge: currentLang === 'ms' ? '⭐ Umur 3–7 Tahun' : '⭐ Ages 3–7 • Nature',
      subtitle:
        currentLang === 'ms'
          ? 'Pengembaraan Berkelah Yang Hilang di Hutan Ajaib bersama Bambli.'
          : 'The Lost Picnic Adventure in Wonder Woods with Bambli.',
      color: '#4ECDC4',
      textColor: 'text-black',
      cta: currentLang === 'ms' ? 'MUAT TURUN LITTLE EXPLORER' : 'DOWNLOAD LITTLE EXPLORER',
      features: [
        'Wonder Woods visual storytelling & rich soundscape',
        '10 interactive challenge tasks (food, fruits, flowers)',
        'Bilingual audio prompts in English & Bahasa Melayu',
        'Single standalone .HTML file for 100% offline play',
        '100% Safe, zero ads, zero in-app purchases',
      ],
      featuresMs: [
        'Penceritaan visual & audio Hutan Ajaib yang memukau',
        '10 tugasan interaktif (makanan, buah-buahan, bunga)',
        'Audio dwi-bahasa dalam Bahasa Inggeris & BM',
        'Satu fail .HTML kendiri untuk mainan luar talian 100%',
        '100% Selamat, tiada iklan langsung',
      ],
    },
    {
      id: 'puzzle-play',
      title: 'Puzzle Play',
      isFree: true,
      price: '100% FREE',
      badge: currentLang === 'ms' ? '⭐ Umur 5–10 Tahun' : '⭐ Ages 5–10 • Word & Logic',
      subtitle:
        currentLang === 'ms'
          ? 'Cari kata dwibahasa di Taman Bunga dan asah daya pemikiran cilik.'
          : 'Bilingual word search puzzles in Word Garden to sharpen young minds.',
      color: '#FF7096',
      textColor: 'text-black',
      cta: currentLang === 'ms' ? 'MUAT TURUN PUZZLE PLAY' : 'DOWNLOAD PUZZLE PLAY',
      features: [
        'Word Garden bilingual search puzzles & fun clues',
        'English & Bahasa Melayu vocabulary boost',
        'Interactive word highlight and celebratory chimes',
        'Single standalone .HTML file for 100% offline play',
        '100% Child-safe, COPPA compliant & offline ready',
      ],
      featuresMs: [
        'Teka kata dwibahasa Taman Bunga yang menyeronokkan',
        'Meningkatkan perbendaharaan kata Bahasa Inggeris & BM',
        'Sorotan perkataan interaktif dan kesan bunyi ceria',
        'Satu fail .HTML kendiri untuk mainan luar talian 100%',
        '100% Selamat, patuh privasi kanak-kanak',
      ],
    },
  ];

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
          {currentLang === 'ms' ? '100% Percuma Untuk Dimainkan' : '100% Free to Play'}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {currentLang === 'ms'
            ? 'Kedua-dua permainan kami sedia dimainkan secara percuma. Tiada langganan, tiada bayaran tersembunyi.'
            : 'Both of our featured games are completely free to enjoy. No subscriptions, no paywalls.'}
        </p>
      </div>

      {/* 2 Games Cards: Little Explorer & Puzzle Play */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-stretch max-w-4xl mx-auto">
        {games.map((game, idx) => {
          return (
            <div
              key={game.id}
              className={`border-[4px] sm:border-[5px] border-black rounded-[36px] p-6 sm:p-7 flex flex-col justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1.5 transition-all relative overflow-hidden ring-4 ring-black ring-offset-2 ${game.textColor}`}
              style={{ backgroundColor: game.color }}
            >
              <div>
                {/* Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-white text-black border-2 border-black px-3 py-1 rounded-full text-xs font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {game.badge}
                  </span>
                  <Star className="w-6 h-6 fill-[#FFBA08] text-black" />
                </div>

                <h3 className="font-black text-2xl sm:text-3xl leading-tight">
                  {game.title}
                </h3>

                {/* Status / Price Tag */}
                <div className="my-3 py-1">
                  <span className="text-2xl sm:text-3xl font-black tracking-tight inline-block bg-white text-black border-2 border-black px-3.5 py-1 rounded-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {game.price}
                  </span>
                </div>

                <p className="text-xs sm:text-sm font-bold leading-relaxed opacity-90 mb-5">
                  {game.subtitle}
                </p>

                {/* Features List */}
                <div className="space-y-2.5 border-t-2 border-black/20 pt-4 mb-6">
                  {(currentLang === 'ms' ? game.featuresMs : game.features).map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs font-bold">
                      <span className="font-black text-base leading-none">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  playPop(520);
                  onSelectFreePlan();
                }}
                className="w-full bg-[#8AC926] text-white border-[3.5px] border-black py-3 rounded-2xl font-black text-sm sm:text-base tracking-wide shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{game.cta}</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
