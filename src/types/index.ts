export type Language = 'en' | 'ms';

export type LearningPillar = 'animals-nature' | 'language-words' | 'maths' | 'logic' | 'science-stem';

export type GameStatus = 'available' | 'coming-soon' | 'hidden' | 'retired';

export type DeliveryType = 'web' | 'download' | 'external' | 'coming-soon';

export type Game = GameProduct;

export interface GameProduct {
  id: string;
  title: string;
  titleMs: string;
  slug: string;
  ageMin: number;
  ageMax: number;
  pillar: LearningPillar;
  pillarNameEn: string;
  pillarNameMs: string;
  category: string;
  categoryMs: string;
  shortHook: string;
  shortHookMs: string;
  description: string;
  descriptionMs: string;
  challengeCount: number;
  difficulty: 'Easy' | 'Medium' | 'Challenging' | 'Easy to Advanced';
  difficultyMs: 'Mudah' | 'Sederhana' | 'Mencabar' | 'Mudah ke Mahir';
  isFree: boolean;
  priceMYR: number;
  status: GameStatus;
  deliveryType: DeliveryType;
  deliveryUrl: string;
  downloadUrl?: string;
  coverImage: string;
  coverImagePng?: string;
  coverImageSvg?: string;
  themeColor: string;
  accentColor: string;
  badgeEmoji: string;
  hasOfflineDownload?: boolean;
  offlineDownloadFileName?: string;
  offlineDownloadUrl?: string;
  playInBrowserUrl?: string;
  subtitle?: string;
  subtitleMs?: string;
  languages?: string[];
  whatYouDo: string[];
  whatYouDoMs: string[];
  whatYouLearn: string[];
  whatYouLearnMs: string[];
  screenshots: {
    title: string;
    caption: string;
    emoji: string;
    bg: string;
  }[];
}

export interface LearningWorld {
  id: LearningPillar;
  nameEn: string;
  nameMs: string;
  taglineEn: string;
  taglineMs: string;
  descriptionEn: string;
  descriptionMs: string;
  emoji: string;
  color: string;
  accentBg: string;
  borderColor: string;
  badgeTextEn: string;
  badgeTextMs: string;
}

export interface AgeGroup {
  id: string;
  titleEn: string;
  titleMs: string;
  ageRange: string;
  ageMin: number;
  ageMax: number;
  descriptionEn: string;
  descriptionMs: string;
  emoji: string;
  color: string;
  isPriorityMVP?: boolean;
}
