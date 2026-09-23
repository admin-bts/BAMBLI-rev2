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
import { subscribeToNewsletter } from './utils/newsletter';

// Browser-safe counterpart to api/_lib/toyyibpay.ts's encodeReturnToken — kept
// separate (rather than importing that file) since it uses Node's Buffer,
// which isn't available in the browser bundle.
function decodeReturnToken(token: string): { gameId: string; ref: string } | null {
  try {
    const base64 = token.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '=='.slice(0, (4 - (base64.length % 4)) % 4);
    const parsed = JSON.parse(atob(padded));
    if (parsed && typeof parsed.gameId === 'string' && typeof parsed.ref === 'string') {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [starCount, setStarCount] = useState<number>(3);
  const [selectedPillar, setSelectedPillar] = useState<LearningPillar | null>(null);
  const [selectedAgeId, setSelectedAgeId] = useState<string | null>(null);

  // Modals & Navigation state
  const [activeDetailGame, setActiveDetailGame] = useState<GameProduct | null>(null);
  const [dedicatedPageGame, setDedicatedPageGame] = useState<GameProduct | null>(null);
  const [parentGateGame, setParentGateGame] = useState<GameProduct | null>(null);

  // Paid-game payment flow (ToyyibPay): tracks the return-redirect verification
  // for whichever game the buyer just paid for, keyed by gameId so a stale
  // result never gets applied to a different game opened afterward.
  const [paymentReturn, setPaymentReturn] = useState<{
    gameId: string;
    status: 'verifying' | 'paid' | 'error';
    error?: string;
  } | null>(null);

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

  // Detect a return redirect from ToyyibPay's hosted payment page (paid games
  // only) and verify the payment server-side before unlocking anything.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('bambli_pay');
    const billCode = params.get('billcode');
    if (!token || !billCode) return;

    const decoded = decodeReturnToken(token);
    // Always strip our own query params so a page refresh doesn't re-verify —
    // done regardless of whether decoding succeeded.
    window.history.replaceState({}, '', window.location.pathname + window.location.hash);

    if (!decoded) return;
    const targetGame = GAMES_CATALOGUE.find((g) => g.id === decoded.gameId);
    if (!targetGame) return;

    setParentGateGame(targetGame);
    setPaymentReturn({ gameId: decoded.gameId, status: 'verifying' });

    fetch(`/api/verify-payment?billCode=${encodeURIComponent(billCode)}&gameId=${encodeURIComponent(decoded.gameId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data.paid) {
          setPaymentReturn({ gameId: decoded.gameId, status: 'paid' });
        } else {
          setPaymentReturn({
            gameId: decoded.gameId,
            status: 'error',
            error:
              currentLang === 'ms'
                ? 'Pembayaran belum disahkan. Sila cuba lagi atau hubungi kami.'
                : 'Payment could not be confirmed yet. Please try again or contact us.',
          });
        }
      })
      .catch(() => {
        setPaymentReturn({
          gameId: decoded.gameId,
          status: 'error',
          error:
            currentLang === 'ms'
              ? 'Gagal mengesahkan pembayaran. Sila cuba lagi.'
              : 'Failed to verify payment. Please try again.',
        });
      });
    // Only ever runs once on mount for whatever query params were present on load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleCreatePayment = async (game: GameProduct, email: string, phone: string) => {
    try {
      const response = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ gameId: game.id, email, phone }),
      });
      const data = await response.json();
      if (data?.ok && data.paymentUrl) {
        window.location.href = data.paymentUrl;
        return;
      }
      setPaymentReturn({
        gameId: game.id,
        status: 'error',
        error:
          currentLang === 'ms'
            ? 'Gagal menyediakan pembayaran. Sila cuba lagi.'
            : 'Failed to set up payment. Please try again.',
      });
    } catch {
      setPaymentReturn({
        gameId: game.id,
        status: 'error',
        error:
          currentLang === 'ms'
            ? 'Gagal menyediakan pembayaran. Sila cuba lagi.'
            : 'Failed to set up payment. Please try again.',
      });
    }
  };

  const handleNewsletterSubmit = (payload: NewsletterSubscriberPayload) => {
    subscribeToNewsletter({
      email: payload.email,
      source: 'parent_gate',
      gameId: payload.gameId,
      gameTitle: payload.gameTitle,
      consent: payload.consent,
    });
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
              games={GAMES_CATALOGUE}
              currentLang={currentLang}
              onSelectPlan={handleDownloadFlow}
            />
          </>
        )}
      </main>

      {/* Section 11: Final CTA & Footer */}
      <Footer
        currentLang={currentLang}
        onNavigate={handleNavigate}
      />

      {/* Modals */}
      {/* 1. Parent-Only Verification & Offline Download Gate Modal */}
      <ParentEmailGateModal
        isOpen={parentGateGame !== null}
        game={parentGateGame}
        currentLang={currentLang}
        onClose={() => {
          setParentGateGame(null);
          setPaymentReturn(null);
        }}
        onNewsletterSubmit={handleNewsletterSubmit}
        onRequestPayment={handleCreatePayment}
        paymentState={
          parentGateGame && paymentReturn?.gameId === parentGateGame.id
            ? paymentReturn.status === 'error' ? 'idle' : paymentReturn.status
            : 'idle'
        }
        paymentError={
          parentGateGame && paymentReturn?.gameId === parentGateGame.id && paymentReturn.status === 'error'
            ? paymentReturn.error ?? null
            : null
        }
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
