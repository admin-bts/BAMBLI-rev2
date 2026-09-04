/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, LearningPillar, GameProduct } from './types';
import { GAMES_CATALOGUE } from './data/games';
import { AGE_GROUPS } from './data/worlds';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StartPlayingSection } from './components/StartPlayingSection';
import { FeaturedAdventureSection } from './components/FeaturedAdventureSection';
import { WhyBambliSection } from './components/WhyBambliSection';
import { AdventureJourneySection } from './components/AdventureJourneySection';
import { AgeSelectorSection } from './components/AgeSelectorSection';
import { GamesCatalogueSection } from './components/GamesCatalogueSection';
import { ParentTrustSection } from './components/ParentTrustSection';
import { PricingSection } from './components/PricingSection';
import { Footer } from './components/Footer';
import { GameDetailModal } from './components/GameDetailModal';
import { DedicatedGameDetailPage } from './components/DedicatedGameDetailPage';
import { ParentEmailGateModal, NewsletterSubscriberPayload } from './components/ParentEmailGateModal';
import { playPop, playFanfare } from './utils/audio';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [starCount, setStarCount] = useState<number>(3);
  const [selectedPillar, setSelectedPillar] = useState<LearningPillar | null>(null);
  const [selectedAgeId, setSelectedAgeId] = useState<string | null>(null);

  // Modals & Navigation state
  const [activeDetailGame, setActiveDetailGame] = useState<GameProduct | null>(null);
  const [dedicatedPageGame, setDedicatedPageGame] = useState<GameProduct | null>(null);
  const [parentGateGame, setParentGateGame] = useState<GameProduct | null>(null);

  // Flagship game for Section 4
  const flagshipGame =
    GAMES_CATALOGUE.find((g) => g.id === 'little-explorer') ||
    GAMES_CATALOGUE[0];

  // Sync hash routing for dedicated game pages (#game/:slug)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#game/')) {
        const slug = hash.replace('#game/', '').trim();
        const found = GAMES_CATALOGUE.find((g) => g.slug === slug || g.id === slug);
        if (found) {
          setDedicatedPageGame(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
      }
      setDedicatedPageGame(null);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (sectionId: string) => {
    if (dedicatedPageGame) {
      setDedicatedPageGame(null);
      window.location.hash = '';
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadFlow = (gameId: string) => {
    playPop(520);
    const targetGame =
      GAMES_CATALOGUE.find((g) => g.id === gameId || g.slug === gameId) ||
      GAMES_CATALOGUE[0];
    if (targetGame) {
      setParentGateGame(targetGame);
    }
  };

  const handleOpenDetails = (game: GameProduct) => {
    playPop(450);
    // Set dedicated page view and sync hash
    window.location.hash = `game/${game.slug}`;
    setDedicatedPageGame(game);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackFromDedicatedPage = () => {
    playPop(360);
    setDedicatedPageGame(null);
    window.location.hash = 'games';
    setTimeout(() => {
      const el = document.getElementById('games');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleOpenOfflineGate = (game: GameProduct) => {
    playPop(480);
    setParentGateGame(game);
  };

  const handleNewsletterSubmit = (payload: NewsletterSubscriberPayload) => {
    // Clean integration point for future newsletter provider (e.g. Mailchimp / ConvertKit / Klaviyo / Firestore)
    console.log('[Bambli Parent Newsletter Gate Submission]:', payload);
  };

  const handleAddStar = () => {
    setStarCount((prev) => prev + 1);
  };

  const handleSelectWorld = (pillarId: LearningPillar) => {
    setSelectedPillar((prev) => (prev === pillarId ? null : pillarId));
    if (dedicatedPageGame) {
      setDedicatedPageGame(null);
      window.location.hash = '';
    }
    setTimeout(() => {
      handleNavigate('games');
    }, 50);
  };

  const handleSelectAge = (ageId: string | null) => {
    setSelectedAgeId(ageId);
    if (dedicatedPageGame) {
      setDedicatedPageGame(null);
      window.location.hash = '';
    }
    if (ageId) {
      setTimeout(() => {
        handleNavigate('games');
      }, 50);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF0] text-[#191A23] font-['Nunito',sans-serif] flex flex-col selection:bg-[#FFD93D] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        currentLang={currentLang}
        onLangChange={setCurrentLang}
        starCount={starCount}
        onOpenStarterAdventure={() => handleDownloadFlow('little-explorer')}
        onNavigate={handleNavigate}
      />

      {/* Main Content: Either Dedicated Game Detail Page or Full Homepage */}
      <main className="flex-1 flex flex-col">
        {dedicatedPageGame ? (
          /* Dedicated Game Detail Page View */
          <DedicatedGameDetailPage
            game={dedicatedPageGame}
            allGames={GAMES_CATALOGUE}
            currentLang={currentLang}
            onBack={handleBackFromDedicatedPage}
            onOpenOfflineGate={handleOpenOfflineGate}
            onSelectOtherGame={(og) => {
              window.location.hash = `game/${og.slug}`;
              setDedicatedPageGame(og);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : (
          /* Standard Multi-Section Homepage */
          <>
            {/* Section 1: Hero */}
            <HeroSection
              currentLang={currentLang}
              onPlayFree={() => handleDownloadFlow('little-explorer')}
              onExploreGames={() => handleNavigate('games')}
              onAddStar={handleAddStar}
            />

            {/* Section 2: Start Playing — It's FREE! */}
            <StartPlayingSection
              games={GAMES_CATALOGUE}
              currentLang={currentLang}
              onOpenDetails={handleOpenDetails}
              onOpenOfflineGate={handleOpenOfflineGate}
            />

            {/* Section 3: Featured Adventure */}
            <FeaturedAdventureSection
              game={flagshipGame}
              currentLang={currentLang}
              onPlayDemo={() => handleDownloadFlow(flagshipGame.id)}
              onOpenDetails={() => handleOpenDetails(flagshipGame)}
            />

            {/* Section 5: Why Bambli? (More Than Screen Time) */}
            <WhyBambliSection currentLang={currentLang} />

            {/* Section 6: Adventure Journey Flow */}
            <AdventureJourneySection currentLang={currentLang} />

            {/* Section 7: Age Selector */}
            <AgeSelectorSection
              ageGroups={AGE_GROUPS}
              currentLang={currentLang}
              selectedAgeId={selectedAgeId}
              onSelectAge={handleSelectAge}
            />

            {/* Section 8: Game Catalogue (Data-Driven System with Little Explorer & Puzzle Play) */}
            <GamesCatalogueSection
              games={GAMES_CATALOGUE}
              currentLang={currentLang}
              selectedPillar={selectedPillar}
              selectedAgeId={selectedAgeId}
              onSelectPillar={setSelectedPillar}
              onSelectAge={setSelectedAgeId}
              onOpenDemo={(id) => handleDownloadFlow(id)}
              onOpenDetails={handleOpenDetails}
              onOpenOfflineGate={handleOpenOfflineGate}
            />

            {/* Section 9: Parent Trust & FAQ */}
            <ParentTrustSection currentLang={currentLang} />

            {/* Section 10: Pricing & Adventure Packs */}
            <PricingSection
              currentLang={currentLang}
              onSelectFreePlan={() => handleDownloadFlow('little-explorer')}
            />
          </>
        )}
      </main>

      {/* Section 11: Final CTA & Footer */}
      <Footer
        currentLang={currentLang}
        onPlayFree={() => handleDownloadFlow('little-explorer')}
        onNavigate={handleNavigate}
      />

      {/* Modals */}
      {/* 1. Parent-Only Verification & Offline Download Gate Modal */}
      <ParentEmailGateModal
        isOpen={parentGateGame !== null}
        game={parentGateGame}
        currentLang={currentLang}
        onClose={() => setParentGateGame(null)}
        onNewsletterSubmit={handleNewsletterSubmit}
      />

      {/* 2. Quick Game Detail Modal (if used) */}
      <GameDetailModal
        game={activeDetailGame}
        currentLang={currentLang}
        onClose={() => setActiveDetailGame(null)}
        onPlayDemo={(id) => {
          setActiveDetailGame(null);
          handleDownloadFlow(id);
        }}
        onOpenOfflineGate={handleOpenOfflineGate}
      />
    </div>
  );
}
