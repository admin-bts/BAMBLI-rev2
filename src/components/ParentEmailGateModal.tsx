import { useState, FormEvent } from 'react';
import { X, Download, ShieldCheck, Mail, Check, Sparkles, FileCode, ArrowRight, Lock } from 'lucide-react';
import { GameProduct, Language } from '../types';
import { playPop, playFanfare, playChime } from '../utils/audio';

export interface NewsletterSubscriberPayload {
  email: string;
  gameId: string;
  gameTitle: string;
  consent: boolean;
  timestamp: string;
}

interface ParentEmailGateModalProps {
  isOpen: boolean;
  game: GameProduct | null;
  currentLang: Language;
  onClose: () => void;
  onNewsletterSubmit?: (payload: NewsletterSubscriberPayload) => void;
}

export function ParentEmailGateModal({
  isOpen,
  game,
  currentLang,
  onClose,
  onNewsletterSubmit,
}: ParentEmailGateModalProps) {
  const [email, setEmail] = useState('');
  const [newsletterConsent, setNewsletterConsent] = useState(true);
  const [parentAnswer, setParentAnswer] = useState('');
  const [parentError, setParentError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Simple math challenge to ensure it's a parent
  const num1 = 7;
  const num2 = 8;
  const expectedAnswer = num1 + num2; // 15

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

    playFanfare();
    setIsUnlocked(true);
    // Automatically trigger the download for parent convenience
    setTimeout(() => {
      handleDownloadFile();
    }, 300);
  };

  const handleDownloadFile = async () => {
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
                  Standalone .HTML
                </span>
              </div>
              <h3 className="font-black text-xl sm:text-2xl text-black leading-tight">
                {currentLang === 'ms' ? 'Muat Turun Luar Talian' : 'Download Offline Game'}
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

        {/* Body State: Locked (Form) vs Unlocked (Instant Download) */}
        {!isUnlocked ? (
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
                {currentLang === 'ms'
                  ? 'Bambli adalah 100% selamat untuk kanak-kanak. Untuk memuat turun fail permainan luar talian percuma, sila sahkan bahawa anda adalah ibu bapa dan masukkan e-mel anda.'
                  : 'Bambli is 100% child-safe. To download this free offline standalone game, please confirm you are a parent and enter your email for learning updates.'}
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
              <span>{currentLang === 'ms' ? 'Sahkan & Buka Muat Turun' : 'Verify & Unlock Download'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-black/60">
              <ShieldCheck className="w-3.5 h-3.5 text-[#8AC926]" />
              <span>100% Kid Safe • No spam guarantee • Unsubscribe anytime</span>
            </div>
          </form>
        ) : (
          /* Unlocked State: Immediate Download Revealed */
          <div className="flex flex-col gap-4">
            <div className="bg-[#8AC926] text-white border-[3.5px] border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-2 animate-in fade-in">
              <div className="w-12 h-12 bg-white text-[#8AC926] border-2 border-black rounded-full flex items-center justify-center text-2xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                ✓
              </div>
              <h4 className="font-black text-xl text-white">
                {currentLang === 'ms'
                  ? 'Ibu Bapa Disahkan! Fail Sedia Dimuat Turun'
                  : 'Parent Verified! Your Offline Game is Ready'}
              </h4>
              <p className="text-xs font-bold text-white/95 max-w-sm">
                {currentLang === 'ms'
                  ? `Fail standalone .html untuk "${game.title}" sedia untuk anda main tanpa internet.`
                  : `The standalone single .html file for "${game.title}" is ready. No internet or Wi-Fi required!`}
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
                  ? 'Dua kali klik fail .html ini pada komputer riba, iPad, atau Chromebook untuk bermain pada bila-bila masa.'
                  : 'Double-click the downloaded .html file on your laptop, iPad, or Chromebook to play anytime without internet.'}
              </p>
            </div>

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
                  ? 'MUAT TURUN LAGI (.HTML)'
                  : 'DOWNLOAD AGAIN (.HTML)'}
              </span>
            </button>

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
                  ? '2. Klik dua kali pada fail .html tersebut. Ia akan dibuka secara luar talian dalam pelayar Chrome/Safari tanpa internet!'
                  : '2. Double-click the .html file. It immediately launches in any browser (Chrome, Safari, Edge) 100% offline!'}
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
