import { useState } from 'react';
import { X, Printer, Download, Star, Check } from 'lucide-react';
import { Language } from '../types';
import { playPop } from '../utils/audio';

interface PrintablePuzzleModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export function PrintablePuzzleModal({
  isOpen,
  onClose,
  currentLang,
}: PrintablePuzzleModalProps) {
  const [activePuzzle, setActivePuzzle] = useState(0);

  if (!isOpen) return null;

  const puzzles = [
    {
      theme: 'Animals • Haiwan',
      title: 'Wonder Woods Jungle Maze',
      titleMs: 'Labirin Rimba Hutan Keajaiban',
      instruction: 'Help Bambli guide the baby koala through the bamboo forest to find mama koala!',
      instructionMs: 'Bantu Bambli memandu anak koala melalui hutan buluh untuk bertemu ibu koala!',
      emoji: '🐨',
      color: '#4ECDC4',
      type: 'Maze & Footprint Trail',
      grid: [
        ['🌲', '🐨', '🌿', '🪵', '🌲'],
        ['🌲', '▫️', '▫️', '▫️', '🌲'],
        ['🌲', '🪨', '🌲', '▫️', '🌲'],
        ['🌲', '▫️', '▫️', '▫️', '🌿'],
        ['🌲', '🌲', '🌲', '🐨 (Mama)', '🌲'],
      ],
    },
    {
      theme: 'Fruits • Buah-Buahan',
      title: 'Tropical Fruit Sudoku Mini',
      titleMs: 'Sudoku Mini Buah Tropika',
      instruction: 'Place 🍌 Banana, 🍍 Pineapple, 🍉 Watermelon, and 🥭 Mango so each row & column has 1 of each!',
      instructionMs: 'Letakkan 🍌 Pisang, 🍍 Nanas, 🍉 Tembikai, dan 🥭 Mangga tanpa ulangan dalam setiap baris & lajur!',
      emoji: '🍉',
      color: '#FFD93D',
      type: 'Logic Grid',
      grid: [
        ['🍌', '🍍', '🍉', '?'],
        ['🍉', '?', '🍌', '🍍'],
        ['?', '🍉', '🍍', '🍌'],
        ['🍍', '🍌', '?', '🍉'],
      ],
    },
    {
      theme: 'Words • Perkataan',
      title: 'Bilingual Word Garden Search',
      titleMs: 'Cari Kata Dwibahasa Taman Bunga',
      instruction: 'Find 5 words in English & Bahasa Malaysia: STAR (BINTANG), CAT (KUCING), MOON (BULAN)!',
      instructionMs: 'Cari 5 perkataan dalam Bahasa Inggeris & BM: BINTANG, KUCING, BULAN, POKOK, AIR!',
      emoji: '🌸',
      color: '#FF7096',
      type: 'Word Puzzle',
      grid: [
        ['B', 'I', 'N', 'T', 'A', 'N', 'G'],
        ['K', 'U', 'C', 'I', 'N', 'G', 'X'],
        ['S', 'T', 'A', 'R', 'O', 'K', 'O'],
        ['B', 'U', 'L', 'A', 'N', 'M', 'P'],
        ['C', 'A', 'T', 'W', 'A', 'T', 'E'],
      ],
    },
    {
      theme: 'Numbers & Logic • Nombor & Logik',
      title: 'Puzzle Play Secret Decoder',
      titleMs: 'Penyahkod Rahsia Puzzle Play',
      instruction: 'Solve the sums to decode the password: 4+4=[?], 10-3=[?], 6+2=[?]. Reveal the secret word!',
      instructionMs: 'Selesaikan tambah tolak untuk dapatkan kod rahsia perkataan!',
      emoji: '🧩',
      color: '#FF8E3C',
      type: 'Secret Math Decoder',
      grid: [
        ['8 = B', '7 = E', '9 = S', '5 = T'],
        ['Math Clue 1: 4 + 4 = 8 (Letter B)'],
        ['Math Clue 2: 12 - 5 = 7 (Letter E)'],
        ['Math Clue 3: 5 + 4 = 9 (Letter S)'],
        ['Math Clue 4: 10 - 5 = 5 (Letter T)'],
      ],
    },
    {
      theme: 'Logic • Logik',
      title: 'Sprout Pattern Detective',
      titleMs: 'Penyiasat Corak Si Tunas',
      instruction: 'Look at the shape sequence: Circle ➔ Triangle ➔ Square ➔ Circle ➔ Triangle ➔ [?]',
      instructionMs: 'Perhatikan corak jujukan bentuk dan lukis bentuk seterusnya!',
      emoji: '🧩',
      color: '#8054C2',
      type: 'Pattern Sequence',
      grid: [
        ['🔵', '🔺', '🟩', '🔵', '🔺', '❓'],
        ['⭐', '⭐', '🌙', '⭐', '⭐', '❓'],
        ['🐾', '🐾', '🌿', '🐾', '🐾', '❓'],
      ],
    },
  ];

  const currentP = puzzles[activePuzzle];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-[#FFFDF0] border-[6px] border-black rounded-[40px] p-5 sm:p-7 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-[3px] border-black pb-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🖨️</span>
            <div>
              <h3 className="font-black text-xl sm:text-2xl text-black">
                {currentLang === 'ms' ? 'Pratonton Lembaran Teka-Teki Percuma' : 'Free Printable Puzzle Pack Preview'}
              </h3>
              <p className="text-xs font-bold text-black/70">
                {currentLang === 'ms' ? '5 Aktiviti Berfaedah untuk Si Cilik' : '5 Brain-building worksheets for ages 4–9'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playPop(350);
              onClose();
            }}
            className="w-10 h-10 bg-white border-[3px] border-black rounded-full flex items-center justify-center hover:bg-[#FF6B6B] hover:text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all"
            aria-label="Close"
          >
            <X className="w-5 h-5 font-black" />
          </button>
        </div>

        {/* Puzzle Page Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {puzzles.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                playPop(420 + idx * 30);
                setActivePuzzle(idx);
              }}
              className={`shrink-0 border-[2.5px] border-black rounded-xl px-3 py-1 text-xs font-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all ${
                activePuzzle === idx
                  ? 'bg-[#FFD93D] -translate-y-0.5 ring-2 ring-black'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              <span>{p.emoji}</span>
              <span>Puzzle {idx + 1}</span>
            </button>
          ))}
        </div>

        {/* Printable Worksheet Frame (Storybook style) */}
        <div className="bg-white border-[4px] border-dashed border-black rounded-3xl p-6 shadow-inner flex flex-col gap-4">
          <div className="flex items-center justify-between border-b-2 border-black/20 pb-3">
            <div>
              <div className="text-[11px] font-black uppercase text-[#8054C2]">
                {currentP.theme} • {currentP.type}
              </div>
              <h4 className="font-black text-2xl text-black">
                {currentLang === 'ms' ? currentP.titleMs : currentP.title}
              </h4>
            </div>
            <div className="text-3xl">{currentP.emoji}</div>
          </div>

          <p className="text-xs sm:text-sm font-bold text-black/85 bg-[#FFFDF0] p-3 rounded-2xl border-2 border-black">
            ✏️ {currentLang === 'ms' ? currentP.instructionMs : currentP.instruction}
          </p>

          {/* Puzzle Visual Worksheet representation */}
          <div
            className="p-5 rounded-2xl border-[3px] border-black flex flex-col items-center justify-center gap-2 font-mono text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: currentP.color }}
          >
            {currentP.grid.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2 sm:gap-3">
                {row.map((cell, cIdx) => (
                  <span
                    key={cIdx}
                    className="w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] text-xs sm:text-sm"
                  >
                    {cell}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-bold text-black/60 pt-2 border-t border-black/10">
            <span>Name: ______________________</span>
            <span>Date: ________________</span>
            <span>Stars: ⭐⭐⭐</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t-2 border-black/20">
          <span className="text-xs font-black text-black/80 flex items-center gap-1">
            <Check className="w-4 h-4 text-[#8AC926]" />
            <span>High-resolution printable A4 ready</span>
          </span>

          <button
            onClick={() => {
              playPop(550);
              window.print();
            }}
            className="bg-[#4ECDC4] border-[3px] border-black px-5 py-2 rounded-2xl font-black text-xs sm:text-sm text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 flex items-center gap-1.5 hover:bg-[#3dbdb4]"
          >
            <Printer className="w-4 h-4" />
            <span>{currentLang === 'ms' ? 'Cetak Halaman Ini' : 'Print Worksheet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
