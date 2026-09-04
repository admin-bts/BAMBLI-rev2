import { useState } from 'react';
import { playPop, playChime } from '../utils/audio';

interface BambliMascotProps {
  size?: number;
  className?: string;
  interactive?: boolean;
  onTap?: () => void;
}

export function BambliMascot({
  size = 180,
  className = '',
  interactive = true,
  onTap,
}: BambliMascotProps) {
  const [isExcited, setIsExcited] = useState(false);

  const handleClick = () => {
    if (!interactive) return;
    setIsExcited(true);
    playPop(520);
    setTimeout(() => playChime(), 120);
    setTimeout(() => setIsExcited(false), 800);
    if (onTap) {
      onTap();
    }
  };

  return (
    <div
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label="Bambli Mascot"
      className={`relative inline-block select-none transition-transform duration-300 ${
        interactive
          ? 'cursor-pointer hover:scale-105 active:scale-95 active:rotate-2'
          : ''
      } ${isExcited ? 'animate-bounce' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src="/assets/bambli-badge.svg"
        alt="Bambli Mascot"
        className="w-full h-full object-contain select-none filter drop-shadow-[5px_7px_0px_rgba(0,0,0,0.85)]"
        referrerPolicy="no-referrer"
        draggable={false}
      />

      {/* Floating Sparkle Stars */}
      <div className="absolute -top-1 -right-2 text-xl animate-spin pointer-events-none" style={{ animationDuration: '6s' }}>
        ✨
      </div>
      <div className="absolute top-10 -left-3 text-lg animate-pulse pointer-events-none">
        ⭐
      </div>
    </div>
  );
}

/**
 * Wordmark logo matching the authentic Bambli brand
 * Colorful letters: B (Purple), a (Pink), m (Teal), b (Yellow), l (Purple), i (Teal)
 */
export function BambliWordmark({
  size = 'large',
  className = '',
}: {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}) {
  const textSizes = {
    small: 'text-2xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-5xl md:text-6xl',
  };

  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <span
        className={`font-black tracking-tight ${textSizes[size]} flex items-center gap-0.5 leading-none`}
        style={{
          textShadow: '3px 3px 0px #000000',
          WebkitTextStroke: '2px #000000',
        }}
      >
        <span className="text-[#8054C2] -rotate-3 inline-block">B</span>
        <span className="text-[#FF7096] rotate-2 inline-block">a</span>
        <span className="text-[#2DD4BF] -rotate-1 inline-block">m</span>
        <span className="text-[#FFBA08] rotate-3 inline-block">b</span>
        <span className="text-[#8054C2] -rotate-2 inline-block">l</span>
        <span className="text-[#2DD4BF] rotate-1 inline-block">i</span>
      </span>
      <span className="text-[11px] md:text-xs font-black tracking-wider text-[#191A23] mt-1 uppercase opacity-90">
        Big Learning for Little Minds
      </span>
    </div>
  );
}
