import { useState } from 'react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { LearningWorld, Language, LearningPillar } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop, playJump } from '../utils/audio';

interface BambliWorldsSectionProps {
  worlds: LearningWorld[];
  currentLang: Language;
  selectedWorldId: LearningPillar | null;
  onSelectWorld: (pillarId: LearningPillar) => void;
}

export function BambliWorldsSection({
  worlds,
  currentLang,
  selectedWorldId,
  onSelectWorld,
}: BambliWorldsSectionProps) {
  const t = TRANSLATIONS[currentLang];
  const [hoveredWorld, setHoveredWorld] = useState<string | null>(null);

  const handleWorldClick = (worldId: LearningPillar) => {
    playJump();
    onSelectWorld(worldId);
  };

  return (
    <section id="worlds" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-12">
        <div className="inline-flex items-center gap-2 bg-[#8054C2] border-[3.5px] border-black px-4 py-1.5 rounded-full -rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-white">
          <Compass className="w-4 h-4" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider">
            {currentLang === 'ms' ? '5 Destinasi Pengembaraan' : '5 Adventure Destinations'}
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.worlds_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {t.worlds_subtitle}
        </p>
      </div>

      {/* 5 Illustrated World Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        {worlds.map((world, index) => {
          const isSelected = selectedWorldId === world.id;
          const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-2', '-rotate-1'];
          const rotationClass = rotations[index % rotations.length];

          return (
            <div
              key={world.id}
              onClick={() => handleWorldClick(world.id)}
              onMouseEnter={() => {
                setHoveredWorld(world.id);
                playPop(400 + index * 50);
              }}
              onMouseLeave={() => setHoveredWorld(null)}
              className={`cursor-pointer border-[4px] border-black rounded-[32px] p-5 flex flex-col justify-between transition-all select-none relative overflow-hidden group ${
                isSelected
                  ? 'scale-105 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ring-4 ring-black ring-offset-2'
                  : 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
              } ${rotationClass}`}
              style={{ backgroundColor: world.color }}
            >
              {/* Top pill */}
              <div className="flex items-center justify-between">
                <span className="bg-white text-black border-2 border-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                  {currentLang === 'ms' ? world.badgeTextMs : world.badgeTextEn}
                </span>
                <span className="text-3xl group-hover:scale-125 group-hover:rotate-12 transition-transform">
                  {world.emoji}
                </span>
              </div>

              {/* Center Content */}
              <div className="my-4">
                <h3 className="font-black text-xl sm:text-2xl text-black leading-tight">
                  {currentLang === 'ms' ? world.nameMs : world.nameEn}
                </h3>
                <p className="text-xs font-black text-black/75 mt-1">
                  {currentLang === 'ms' ? world.taglineMs : world.taglineEn}
                </p>
                <p className="text-xs font-bold text-black/90 mt-2 leading-snug line-clamp-3">
                  {currentLang === 'ms' ? world.descriptionMs : world.descriptionEn}
                </p>
              </div>

              {/* Bottom CTA */}
              <div className="pt-3 border-t-2 border-black/20 flex items-center justify-between text-xs font-black text-black">
                <span>{t.world_explore_btn}</span>
                <div className="w-7 h-7 bg-white border-2 border-black rounded-full flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Bambli Visit Badge if Selected */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1">
                  <span>🌱 Bambli Here</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
