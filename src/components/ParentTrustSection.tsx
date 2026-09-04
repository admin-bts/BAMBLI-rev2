import { useState } from 'react';
import { ChevronDown, ShieldCheck, Clock, Brain, EyeOff, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { playPop } from '../utils/audio';

interface ParentTrustSectionProps {
  currentLang: Language;
}

export function ParentTrustSection({ currentLang }: ParentTrustSectionProps) {
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);
  const t = TRANSLATIONS[currentLang];

  const trustCards = [
    {
      icon: Clock,
      title: t.trust_card_1_title,
      desc: t.trust_card_1_desc,
      color: '#4ECDC4',
      badge: 'Time Balanced',
    },
    {
      icon: Brain,
      title: t.trust_card_2_title,
      desc: t.trust_card_2_desc,
      color: '#FFD93D',
      badge: 'Transparent Growth',
    },
    {
      icon: EyeOff,
      title: t.trust_card_3_title,
      desc: t.trust_card_3_desc,
      color: '#FF6B6B',
      badge: 'Zero Risk',
    },
    {
      icon: Sparkles,
      title: t.trust_card_4_title,
      desc: t.trust_card_4_desc,
      color: '#8054C2',
      badge: 'Local Context 🇲🇾',
    },
  ];

  const faqs = [
    {
      q: currentLang === 'ms' ? 'Berapa lama masa bermain yang disyorkan sehari?' : 'How long should my child play Bambli each day?',
      a: currentLang === 'ms'
        ? 'Kami mereka bentuk pengembaraan Bambli untuk diselesaikan dalam masa 10–15 minit. Ini memastikan anak-anak mendapat rangsangan kognitif optimum tanpa keletihan skrin yang melampau.'
        : 'We design Bambli adventures specifically in 10–15 minute sessions. This provides high-impact cognitive engagement without sensory overload or endless screen addiction.',
    },
    {
      q: currentLang === 'ms' ? 'Adakah Bambli selamat daripada iklan dan pembelian mengejut?' : 'Is Bambli completely ad-free and safe?',
      a: currentLang === 'ms'
        ? 'Ya, 100%! Tiada iklan pihak ketiga, tiada kotak misteri bayaran tersembunyi, dan tiada ciri sembang terbuka antara kanak-kanak. Keselamatan anak anda adalah keutamaan kami.'
        : 'Yes, 100%! Bambli has zero third-party ads, no manipulative loot boxes, and no open social chats between kids. Your child’s digital environment is strictly safe and walled.',
    },
    {
      q: currentLang === 'ms' ? 'Apakah perbezaan antara permainan percuma dan berbayar?' : 'What is the difference between free and paid games?',
      a: currentLang === 'ms'
        ? 'Pengembaraan pemula adalah 100% percuma untuk dimainkan pada bila-bila masa. Pek permainan penuh menawarkan 50+ cabaran bertingkat, lencana rahsia, dan sijil pengembara.'
        : 'Free Starter Adventures give you instant access to introductory challenges. Full adventure packs offer 50+ progressive multi-zone challenges, secret unlockables, and completion awards.',
    },
    {
      q: currentLang === 'ms' ? 'Bagaimanakah Bambli mengintegrasikan Bahasa Malaysia?' : 'How is Bahasa Malaysia integrated with English?',
      a: currentLang === 'ms'
        ? 'Dunia "Word Garden" dan aktiviti berpandu kami membawakan kosa kata dwibahasa harian supaya kanak-kanak membina keyakinan dalam kedua-dua bahasa secara semula jadi.'
        : 'Through our "Word Garden" world and bilingual vocabulary pairing, kids naturally connect Malaysian everyday words with English phrases in an intuitive, joyful context.',
    },
  ];

  const toggleFaq = (idx: number) => {
    playPop(400);
    setOpenFaqIdx(openFaqIdx === idx ? null : idx);
  };

  return (
    <section id="for-parents" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center gap-3 mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 bg-white border-[3.5px] border-black px-4 py-1.5 rounded-full rotate-1 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <ShieldCheck className="w-4 h-4 text-[#8AC926]" />
          <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-black">
            What Parents Can Expect
          </span>
        </div>

        <h2 className="font-black text-3xl sm:text-5xl lg:text-6xl text-black tracking-tight">
          {t.parent_trust_title}
        </h2>

        <p className="text-base sm:text-lg font-bold text-black/80 max-w-2xl">
          {t.parent_trust_subtitle}
        </p>
      </div>

      {/* 4 Trust Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
        {trustCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              className="bg-white border-[4px] border-black rounded-[32px] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase bg-[#FFFDF0] border-2 border-black px-2.5 py-0.5 rounded-full shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                    {c.badge}
                  </span>
                  <div
                    className="w-12 h-12 rounded-2xl border-[3px] border-black flex items-center justify-center text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: c.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="font-black text-xl text-black leading-tight mb-2">
                  {c.title}
                </h3>

                <p className="text-xs sm:text-sm font-bold text-black/80 leading-relaxed">
                  {c.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t-2 border-black/10 text-[11px] font-black text-black/60 flex items-center gap-1">
                <span>✓ Verified Parent-Friendly</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-3xl mx-auto bg-[#FFFDF0] border-[5px] border-black rounded-[36px] p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-2xl sm:text-3xl text-black mb-6 text-center">
          {currentLang === 'ms' ? 'Soalan Lazim Ibu Bapa' : 'Parent Frequently Asked Questions'}
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIdx === idx;

            return (
              <div
                key={idx}
                className="bg-white border-[3px] border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 text-left font-black text-sm sm:text-base text-black flex items-center justify-between gap-3 select-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs sm:text-sm font-bold text-black/85 leading-relaxed border-t-2 border-black/10">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
