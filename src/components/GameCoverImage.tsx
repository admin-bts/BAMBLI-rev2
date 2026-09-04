import React, { useState } from 'react';
import { Game } from '../types';

interface GameCoverImageProps {
  game: Game;
  className?: string;
  alt?: string;
}

export const GameCoverImage: React.FC<GameCoverImageProps> = ({
  game,
  className = 'w-full h-full object-cover',
  alt,
}) => {
  // Ordered list of candidate image sources:
  // 1. User uploaded PNG with original name (e.g., "/games/puzzle play.png")
  // 2. User uploaded PNG with hyphenated name (e.g., "/games/puzzle-play.png")
  // 3. Fallback SVG vector illustration (e.g., "/games/puzzle-play-cover.svg")
  const candidates: string[] = [];

  const addCandidate = (path: string) => {
    if (path && !candidates.includes(path)) {
      candidates.push(path);
    }
  };

  if (game.coverImagePng) {
    addCandidate(encodeURI(game.coverImagePng));
    addCandidate(game.coverImagePng.replace(/\s+/g, '-'));
    addCandidate(game.coverImagePng);
    // Also root /public/ folder
    const filenameOnly = game.coverImagePng.replace(/^\/games\//, '/');
    addCandidate(encodeURI(filenameOnly));
    addCandidate(filenameOnly.replace(/\s+/g, '-'));
    addCandidate(filenameOnly);
  }

  // Also check based on slug
  addCandidate(`/games/${game.slug}.png`);
  addCandidate(`/${game.slug}.png`);

  if (game.coverImageSvg) {
    addCandidate(game.coverImageSvg);
  }

  const [candidateIndex, setCandidateIndex] = useState<number>(0);
  const [allFailed, setAllFailed] = useState<boolean>(candidates.length === 0);

  const currentSrc = candidates[candidateIndex];

  const handleError = () => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex(candidateIndex + 1);
    } else {
      setAllFailed(true);
    }
  };

  if (allFailed || !currentSrc) {
    return (
      <div
        className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl font-black select-none"
        style={{ backgroundColor: game.themeColor || '#F3F4F6' }}
      >
        <span>{game.coverImage}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt || game.title}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};
