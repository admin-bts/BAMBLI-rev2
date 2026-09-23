import { useState, useEffect, FormEvent } from 'react';
import { X, Download, Play, ShieldCheck, Mail, Check, Sparkles, FileCode, ArrowRight, Lock } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { playPop, playFanfare, playChime } from '../utils/audio';

export interface NewsletterSubscriberPayload {
  email: string;
  gameId: string;
  gameTitle: string;
  consent: boolean;
  timestamp: string;
}

// iOS Safari can't open a downloaded standalone .html file locally, and a non-gesture
// window/anchor trigger is unreliable there too — so iOS gets Play Online instead of
// an auto-download. iPadOS 13+ reports as 'MacIntel' but has touch support.
function isIOSDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

interface ParentEmailGateModalProps {
  isOpen: boolean;
  game: GameProduct | null;
  currentLang: Language;
  onClose: () => void;
  onNewsletterSubmit?: (payload: NewsletterSubscriberPayload) => void;
  // Paid-game payment flow (ToyyibPay). Unused for free games.
  onRequestPayment?: (game: GameProduct, email: string, phone: string) => void;
  paymentState?: 'idle' | 'verifying' | 'paid';
  paymentError?: string | null;
}

export function ParentEmailGateModal({
  isOpen,
  game,
  currentLang,
  onClose,
  onNewsletterSubmit,
  onRequestPayment,
  paymentState = 'idle',
  paymentError = null,
}: ParentEmailGateModalProps) {
  // Falls back to the last-used parent email so the payment-return flow
  // (a fresh mount of this modal, after the buyer comes back from ToyyibPay)
  // can still show "we've emailed a copy to {email}" correctly.
  const [email, setEmail] = useState(() => {
    try {
      return localStorage.getItem('bambli_parent_email') || '';
    } catch {
      return '';
    }
  });
  const [phone, setPhone] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [parentAnswer, setParentAnswer] = useState('');
  const [parentError, setParentError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);

  // Simple math challenge to ensure it's a parent
  const num1 = 7;
  const num2 = 8;
  const expectedAnswer = num1 + num2; // 15

  // These two effects must run unconditionally (before the early return below)
  // to satisfy the Rules of Hooks — each guards itself with the same
  // `!isOpen || !game` condition as the early return, so they never touch
  // handleDownloadFile (declared further down) on a render that bails out
  // before defining it.
  useEffect(() => {
    if (!isOpen || !game) return;
    // Reflects the payment result App.tsx got back from /api/verify-payment
    // after the buyer returns from the ToyyibPay hosted payment page.
    if (paymentState === 'paid' && !isUnlocked) {
      setAwaitingPayment(false);
      setIsUnlocked(true);
      if (!isIOSDevice()) {
        setTimeout(() => {
          handleDownloadFile();
        }, 300);
      }
    }
  }, [paymentState, isOpen, game?.id]);

  useEffect(() => {
    if (!isOpen) return;
    if (paymentError) {
      // Fall back to the gate form on any payment failure (creation or
      // return-verification) rather than the payment step, since the payment
      // step has no phone field to fix and a fresh modal mount (return from
      // ToyyibPay) never had one filled in to begin with.
      setIsCreatingPayment(false);
      setAwaitingPayment(false);
      setParentError(paymentError);
    }
  }, [paymentError, isOpen]);

  if (!isOpen || !game) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setParentError('');

    // Verify parent check
    if (parseInt(parentAnswer.trim(), 10) !== expectedAnswer) {
      setParentError(
        currentLang === 'ms'
          ? 'Jawapan semakan ibu bapa tidak tepat. Sila cuba lagi!'
          : 'Parent verification answer is incorrect. Please try again!'
      );
      playPop(300);
      return;
    }

    if (!email || !email.includes('@') || !email.includes('.')) {
      setParentError(
        currentLang === 'ms'
          ? 'Sila masukkan alamat e-mel ibu bapa yang sah.'
          : 'Please enter a valid parent email address.'
      );
      playPop(300);
      return;
    }

    if (!newsletterConsent) {
      setParentError(
        currentLang === 'ms'
          ? 'Sila tandakan persetujuan buletin untuk menerima akses muat turun.'
          : 'Please check the newsletter consent to receive offline download access.'
      );
      playPop(300);
      return;
    }

    if (!game.isFree && phone.trim().length < 7) {
      setParentError(
        currentLang === 'ms'
          ? 'Sila masukkan nombor telefon yang sah untuk pembayaran.'
          : 'Please enter a valid phone number for payment.'
      );
      playPop(300);
      return;
    }

    // Clean Integration Point for newsletter service
    const subscriberPayload: NewsletterSubscriberPayload = {
      email: email.trim().toLowerCase(),
      gameId: game.id,
      gameTitle: game.title,
      consent: newsletterConsent,
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for session convenience
    try {
      localStorage.setItem(`bambli_parent_verified_${game.id}`, 'true');
      localStorage.setItem('bambli_parent_email', email.trim().toLowerCase());
    } catch {}

    // Invoke clean integration callback
    if (onNewsletterSubmit) {
      onNewsletterSubmit(subscriberPayload);
    }

    if (!game.isFree) {
      // Paid games: move to the payment step instead of unlocking immediately —
      // the download only unlocks once /api/verify-payment confirms payment.
      playChime();
      setAwaitingPayment(true);
      return;
    }

    playFanfare();
    setIsUnlocked(true);
    // Automatically trigger the download for parent convenience — skip on iOS, where a
    // non-gesture trigger is unreliable and the downloaded file can't be opened locally
    // anyway; iOS users get the explicit Play Online / Download buttons instead.
    if (!isIOSDevice()) {
      setTimeout(() => {
        handleDownloadFile();
      }, 300);
    }
  };

  const handleStartPayment = () => {
    if (!onRequestPayment) return;
    setIsCreatingPayment(true);
    onRequestPayment(game, email.trim().toLowerCase(), phone.trim());
  };

  // A function declaration (not `const ... = () => {}`) so it's hoisted and
  // safely callable from the useEffect above, which is textually declared
  // earlier in this component (see comment there for why that matters).
  async function handleDownloadFile() {
    if (!game.offlineDownloadUrl && !game.deliveryUrl) return;
    setIsDownloading(true);
    playChime();

    const targetUrl = game.offlineDownloadUrl || game.deliveryUrl;
    const downloadFileName = game.offlineDownloadFileName || `${game.slug}.html`;

    try {
      // Fetch the standalone single HTML file and trigger immediate download
      const response = await fetch(targetUrl);
      const htmlText = await response.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: direct window anchor trigger
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = downloadFileName;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsDownloading(false);
    }
  }

  const handlePlayOnline = () => {
    // No deliveryUrl fallback here on purpose — a game with no playInBrowserUrl
    // (e.g. a download-only paid game) genuinely has no online-play option.
    if (!game.playInBrowserUrl) return;
    playChime();
    window.open(game.playInBrowserUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-[#FFFDF0] border-[6px] border-black rounded-[36px] p-5 sm:p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative flex flex-col gap-5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b-[3px] border-black pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 border-[3px] border-black rounded-2xl flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-2 shrink-0"
              style={{ backgroundColor: game.themeColor }}
            >
              {game.coverImage}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="bg-[#FFD93D] border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                  Parent Zone
                </span>
                <span className="bg-white border-2 border-black px-2 py-0.5 rounded-full text-[10px] font-black">
                  {game.playInBrowserUrl ? 'Play or Download' : 'Download'}
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-black leading-tight">
                {game.playInBrowserUrl
                  ? currentLang === 'ms' ? 'Main atau Muat Turun' : 'Play or Download'
                  : currentLang === 'ms' ? 'Muat Turun Permainan' : 'Download Your Game'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playPop(350);
              onClose();
            }}
            className="w-9 h-9 bg-white border-[3px] border-black rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Selected Game Card Banner */}
        <div
          className="border-[3px] border-black rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          style={{ backgroundColor: game.themeColor }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center text-2xl shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
              {game.coverImage}
            </div>
            <div>
              <div className="font-black text-sm text-black">
                {currentLang === 'ms' ? game.titleMs : game.title}
              </div>
              <div className="text-xs font-bold text-black/80">
                {game.subtitle || game.shortHook}
              </div>
            </div>
          </div>
          <span className="bg-white text-black border-2 border-black px-2.5 py-1 rounded-full text-xs font-black shrink-0">
            Ages {game.ageMin}–{game.ageMax}
          </span>
        </div>

        {/* Body State: Verifying (return from payment) vs Locked (Form) vs Payment vs Unlocked */}
        {paymentState === 'verifying' && !isUnlocked ? (
          <div className="bg-white border-[3px] border-black rounded-2xl p-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 border-[3px] border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-black text-black">
              {currentLang === 'ms' ? 'Mengesahkan pembayaran anda...' : 'Verifying your payment...'}
            </p>
          </div>
        ) : !isUnlocked && !awaitingPayment ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <div className="flex items-center gap-2 font-black text-sm text-black">
                <Lock className="w-4 h-4 text-[#8054C2]" />
                <span>
                  {currentLang === 'ms'
                    ? 'Pengesahan Ibu Bapa Diperlukan'
                    : 'Parent-Only Verification Gate'}
                </span>
              </div>
              <p className="text-xs font-bold text-black/75 leading-relaxed">
                {game.isFree
                  ? currentLang === 'ms'
                    ? 'Bambli adalah 100% selamat untuk kanak-kanak. Untuk main dalam talian atau memuat turun fail permainan luar talian percuma ini, sila sahkan bahawa anda adalah ibu bapa dan masukkan e-mel anda.'
                    : 'Bambli is 100% child-safe. To play online or download this free offline standalone game, please confirm you are a parent and enter your email for learning updates.'
                  : currentLang === 'ms'
                  ? `Bambli adalah 100% selamat untuk kanak-kanak. Permainan ini berharga RM ${game.priceMYR.toFixed(2)}. Sila sahkan bahawa anda adalah ibu bapa dan masukkan e-mel serta nombor telefon anda untuk meneruskan ke pembayaran.`
                  : `Bambli is 100% child-safe. This game costs RM ${game.priceMYR.toFixed(2)}. Please confirm you are a parent and enter your email and phone number to proceed to payment.`}
              </p>
            </div>

            {/* Parent Verification Math Gate */}
            <div className="bg-[#FFF7CC] border-[3px] border-black rounded-2xl p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <label className="text-xs font-black uppercase text-black/80">
                {currentLang === 'ms'
                  ? `Semakan Dewasa: Berapakah ${num1} + ${num2} = ?`
                  : `Parent Check: What is ${num1} + ${num2} = ?`}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={parentAnswer}
                  onChange={(e) => setParentAnswer(e.target.value)}
                  placeholder="?"
                  required
                  className="w-24 bg-white border-[3px] border-black rounded-xl px-3 py-2 font-black text-center text-lg text-black focus:outline-none focus:ring-2 focus:ring-[#FFD93D]"
                />
                <span className="text-xs font-bold text-black/70">
                  {currentLang === 'ms'
                    ? '(Mencegah klik tidak sengaja oleh kanak-kanak)'
                    : '(Prevents accidental clicks by young children)'}
                </span>
              </div>
            </div>

            {/* Parent Email Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#4ECDC4]" />
                <span>{currentLang === 'ms' ? 'E-mel Ibu Bapa:' : 'Parent Email Address:'}</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                required
                className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-2.5 font-bold text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            {/* Parent Phone Input — required for paid games (ToyyibPay needs a phone number) */}
            {!game.isFree && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-black uppercase text-black flex items-center gap-1.5">
                  <span>{currentLang === 'ms' ? 'Nombor Telefon Ibu Bapa:' : 'Parent Phone Number:'}</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0123456789"
                  required
                  className="w-full bg-white border-[3px] border-black rounded-2xl px-4 py-2.5 font-bold text-sm text-black placeholder:text-black/40 focus:outline-none focus:ring-2 focus:ring-[#4ECDC4] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                />
              </div>
            )}

            {/* Newsletter Consent Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none bg-white border-[2.5px] border-black rounded-xl p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <input
                type="checkbox"
                checked={newsletterConsent}
                onChange={(e) => setNewsletterConsent(e.target.checked)}
                className="w-5 h-5 accent-[#8AC926] border-2 border-black rounded mt-0.5 shrink-0"
              />
              <span className="text-xs font-bold text-black/90 leading-snug">
                {currentLang === 'ms'
                  ? 'Saya bersetuju menerima aktiviti boleh cetak percuma, panduan pembelajaran mingguan, dan permainan luar talian baharu dari Bambli. (Boleh berhenti langganan bila-bila masa).'
                  : 'I agree to receive free printable activities, weekly learning tips, and newly released offline Bambli games. (Unsubscribe anytime).'}
              </span>
            </label>

            {/* Error message */}
            {parentError && (
              <div className="bg-[#FF6B6B] text-white border-2 border-black rounded-xl px-3 py-2 text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {parentError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#8AC926] text-white border-[3.5px] border-black py-3.5 px-6 rounded-2xl font-black text-base shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7cb622] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 mt-1"
            >
              <span>
                {game.isFree
                  ? currentLang === 'ms' ? 'Sahkan & Buka Muat Turun' : 'Verify & Unlock Download'
                  : currentLang === 'ms' ? 'Sahkan & Teruskan ke Pembayaran' : 'Verify & Continue to Payment'}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-black/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8AC926]" />
              <span>100% Kid Safe • No spam guarantee • Unsubscribe anytime</span>
            </div>
          </form>
        ) : awaitingPayment && !isUnlocked ? (
          /* Payment Step: paid games only, shown after the parent gate passes */
          <div className="flex flex-col gap-4">
            <div className="bg-[#FFD93D] border-[3.5px] border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-2">
              <span className="text-3xl">🔒</span>
              <h4 className="font-black text-xl text-black">
                {currentLang === 'ms' ? 'Satu Langkah Lagi: Pembayaran' : 'One Last Step: Payment'}
              </h4>
              <p className="text-3xl font-black text-black">RM {game.priceMYR.toFixed(2)}</p>
              <p className="text-xs font-bold text-black/80 max-w-sm">
                {currentLang === 'ms'
                  ? `Bayar dengan selamat melalui ToyyibPay untuk membuka "${game.title}". Anda akan diarahkan ke halaman pembayaran selamat.`
                  : `Pay securely via ToyyibPay to unlock "${game.title}". You'll be redirected to a secure payment page.`}
              </p>
            </div>

            <button
              onClick={handleStartPayment}
              disabled={isCreatingPayment}
              className="w-full bg-[#8054C2] text-white border-[4px] border-black py-4 px-6 rounded-2xl font-black text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#7043b3] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              <Lock className="w-5 h-5" />
              <span>
                {isCreatingPayment
                  ? currentLang === 'ms' ? 'Menyediakan Pembayaran...' : 'Preparing Payment...'
                  : currentLang === 'ms' ? 'BAYAR MELALUI TOYYIBPAY' : 'PAY VIA TOYYIBPAY'}
              </span>
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-black/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8AC926]" />
              <span>
                {currentLang === 'ms'
                  ? 'Pembayaran selamat dikendalikan oleh ToyyibPay'
                  : 'Secure payment handled by ToyyibPay'}
              </span>
            </div>
          </div>
        ) : (
          /* Unlocked State: Immediate Download Revealed */
          <div className="flex flex-col gap-4">
            <div className="bg-[#8AC926] text-white border-[3.5px] border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-2 animate-in fade-in">
              <div className="w-12 h-12 bg-white text-[#8AC926] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ✓
              </div>
              <h4 className="font-black text-xl text-white">
                {currentLang === 'ms'
                  ? 'Ibu Bapa Disahkan! Permainan Sedia'
                  : 'Parent Verified! Your Game is Ready'}
              </h4>
              <p className="text-xs font-bold text-white/95 max-w-sm">
                {game.playInBrowserUrl
                  ? currentLang === 'ms'
                    ? `"${game.title}" sedia untuk dimainkan serta-merta dalam talian, atau muat turun permainan untuk main luar talian.`
                    : `"${game.title}" is ready to play instantly online, or download the game to play offline anytime.`
                  : currentLang === 'ms'
                  ? `"${game.title}" sedia dimuat turun untuk dimainkan luar talian pada telefon Android, komputer riba, atau desktop.`
                  : `"${game.title}" is ready to download and play offline on Android, laptop, or desktop.`}
              </p>
            </div>

            {/* Offline File Spec Box */}
            <div className="bg-white border-[3px] border-black rounded-2xl p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="flex items-center gap-1.5 text-black">
                  <FileCode className="w-4 h-4 text-[#FF8E3C]" />
                  <span>{game.offlineDownloadFileName || `${game.slug}.html`}</span>
                </span>
                <span className="bg-[#FFE66D] border-2 border-black px-2 py-0.5 rounded-full text-[10px]">
                  Exactly 1 Standalone File
                </span>
              </div>
              <p className="text-xs font-bold text-black/70">
                {currentLang === 'ms'
                  ? 'Dua kali klik fail permainan yang dimuat turun ini pada telefon Android, komputer riba, atau Chromebook untuk bermain pada bila-bila masa.'
                  : 'Double-click the downloaded game file on your Android phone, laptop, or Chromebook to play anytime without internet.'}
              </p>
            </div>

            {/* Big Play Online Button — only shown when this game actually has an online-play option */}
            {game.playInBrowserUrl && (
              <button
                onClick={handlePlayOnline}
                className="w-full bg-[#FF6B6B] text-white border-[4px] border-black py-4 px-6 rounded-2xl font-black text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ff5252] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                <Play className="w-6 h-6 stroke-[2.5] fill-white" />
                <span>
                  {currentLang === 'ms' ? 'MAIN DALAM TALIAN SEKARANG' : 'PLAY ONLINE NOW'}
                </span>
              </button>
            )}

            {/* Big Download Button */}
            <button
              onClick={handleDownloadFile}
              disabled={isDownloading}
              className="w-full bg-[#FFD93D] text-black border-[4px] border-black py-4 px-6 rounded-2xl font-black text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:bg-[#ffcf1a] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <Download className="w-6 h-6 stroke-[2.5]" />
              <span>
                {isDownloading
                  ? 'Downloading File...'
                  : currentLang === 'ms'
                  ? 'MUAT TURUN PERMAINAN SEKARANG'
                  : 'DOWNLOAD GAME NOW'}
              </span>
            </button>

            {/* Thank You Note — paid games only, shown as the primary "save your
                file" reminder in place of a follow-up email (no dependency on
                Brevo automation, which is not reliably set up yet). */}
            {!game.isFree && (
              <div className="bg-[#FFF7CC] border-[3px] border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-3 text-sm font-bold text-black/90">
                <p>Hi! 👋</p>
                <p>Thank you for purchasing {game.title} by Bambli! 🧸✨</p>
                <p>We hope your little one enjoys playing, practising, and getting better at sifir along the way. 🌟</p>
                <div className="bg-white border-2 border-black rounded-xl p-3 flex flex-col gap-2">
                  <p className="font-black">📥 Important: Save Your Game File</p>
                  <p>Your {game.title} HTML file was made available to you after your successful payment.</p>
                  <p>Please save the .html file somewhere safe on your computer, tablet, or other device.</p>
                  <p>You can open it anytime using a web browser to play again.</p>
                  <p>💡 Tip: Keep a backup copy so you don't accidentally lose your game.</p>
                </div>
                <p>If you experience any problem with the download or the game, please contact us and we'll be happy to help. 💛</p>
                <p>Have fun mastering your sifir! 🔢⭐</p>
                <p className="pt-1">
                  Warmly,<br />
                  Bambli Team<br />
                  <span className="font-normal text-black/70">Play. Learn. Grow.</span>
                </p>
              </div>
            )}

            {/* Platform Compatibility Disclaimer */}
            <div className="bg-[#FFF0E0] border-2 border-[#FF8E3C] rounded-xl p-3 text-xs font-bold text-black/85 flex items-start gap-2">
              <span className="text-base leading-none">⚠️</span>
              <span>
                {game.playInBrowserUrl
                  ? currentLang === 'ms'
                    ? 'Sila ambil perhatian: Muat turun hanya berfungsi pada telefon Android dan komputer riba/desktop. Pengguna iPhone & iPad (iOS) tidak dapat membuka fail yang dimuat turun — sila ketik "MAIN DALAM TALIAN SEKARANG" di atas.'
                    : 'Please note: Downloading only works on Android phones and laptop/desktop computers. iPhone & iPad (iOS) users won\'t be able to open a downloaded file — please tap "PLAY ONLINE NOW" above instead.'
                  : currentLang === 'ms'
                  ? 'Sila ambil perhatian: Permainan ini hanya tersedia untuk telefon Android dan komputer riba/desktop. Ia tidak tersedia untuk pengguna iPhone & iPad (iOS).'
                  : "Please note: This game is only available on Android phones and laptop/desktop computers. It's not available for iPhone & iPad (iOS) users."}
              </span>
            </div>

            {/* How to run guide */}
            <div className="bg-[#FFF7CC] border-2 border-black rounded-xl p-3 text-xs font-bold text-black/85 flex flex-col gap-1">
              <span className="font-black text-black">💡 {currentLang === 'ms' ? 'Cara Membuka Permainan:' : 'How to Play:'}</span>
              <span>
                {currentLang === 'ms'
                  ? '1. Buka folder Muat Turun (Downloads) peranti anda.'
                  : '1. Locate the downloaded file in your device Downloads folder.'}
              </span>
              <span>
                {currentLang === 'ms'
                  ? '2. Klik dua kali pada fail permainan yang dimuat turun. Ia akan dibuka secara luar talian dalam pelayar Chrome tanpa internet!'
                  : '2. Double-click the downloaded game file. It immediately launches in your browser (Chrome, Edge) 100% offline!'}
              </span>
            </div>

            <div className="flex items-center justify-center pt-1">
              <button
                onClick={() => {
                  playPop(350);
                  onClose();
                }}
                className="bg-black text-white px-6 py-2 rounded-xl text-xs font-black hover:bg-gray-800 transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {currentLang === 'ms' ? 'Selesai & Tutup' : 'Done & Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
