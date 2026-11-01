import React, { useState, useMemo, useEffect } from 'react';
import { JobFieldId } from '../types/interview';
import { JOB_FIELDS } from '../data/mockData';
import { MascotCat } from './MascotCat';
import { exportScorecardToPNG, exportScorecardToJPG } from '../utils/canvasExport';
import { evaluateInterviewAnswers } from '../utils/evaluationEngine';
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Smartphone, 
  Sparkles, 
  ShieldCheck, 
  QrCode,
  Flame,
  PartyPopper,
  Zap,
  Smile,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ShareModal } from './Modals/ShareModal';

interface S06ScorecardProps {
  candidateName: string;
  selectedField: JobFieldId;
  onBackToReport: () => void;
  candidateAnswers?: Record<number, string>;
}

type VibeTemplate = 'neon' | 'midnight' | 'sunset';
type ActiveTab = 'stickers' | 'vibes' | 'export';

export interface GaulPersona {
  id: string;
  emoji: string;
  badge: string;
  title: string;
  quote: string;
  catComment: string;
  defaultSticker: string;
  tier: string;
  tierCategory: 'S+' | 'S' | 'A' | 'B';
  minScore: number;
}

export const GAUL_PERSONAS: GaulPersona[] = [
  // TIER S+ (Skor 90 - 100)
  {
    id: 'calon-direktur',
    emoji: '☕',
    badge: 'AURA CALON DIREKTUR',
    title: 'Aura Calon Direktur, Nada Bicara Siap RUPS',
    quote: 'Semua jawaban diselipin terminologi berbobot standar Fortune 500. Interviewer berasa lagi presentasi ke calon komisaris!',
    catComment: 'Gaya elit, tinggal tunggu offering 2 digit cair bos! 💼',
    defaultSticker: '💯 LOLOS TAHAP 1 AMIN',
    tier: 'TIER S+ (TOP 1% KANDIDAT)',
    tierCategory: 'S+',
    minScore: 95,
  },
  {
    id: 'ninja-satset',
    emoji: '🥷',
    badge: 'NINJA STAR SAT-SET',
    title: 'Ninja STAR: Sat-Set Gaspol No Basa-Basi',
    quote: 'Situasi jelas, aksi nyata, hasil konkret. Gak pake drama nangis-nangis, langsung to the point bikin HRD manggut-manggut.',
    catComment: 'Sat-set banget kayak orderan ojol instant! ⚡',
    defaultSticker: '🚀 AUTO OFFERING LETTER',
    tier: 'TIER S+ (GOKIL PARAH)',
    tierCategory: 'S+',
    minScore: 90,
  },

  // TIER S (Skor 80 - 89)
  {
    id: 'pede-dewa',
    emoji: '⚡',
    badge: 'PEDE TINGKAT DEWA',
    title: 'Pede Tingkat Dewa, Jawaban Mengalir',
    quote: 'HRD belum selesai nanya, jawaban udah 3 paragraf. Semoga gak ketahuan semalem baru kebut baca materi pas mau tidur.',
    catComment: 'Kharisma 99%, Hoki 100%! Gaspol terus bro! 🚀',
    defaultSticker: '✨ EMANG BOLEH SE-STAR INI?',
    tier: 'TIER S (KOMPETEN & SOLID)',
    tierCategory: 'S',
    minScore: 85,
  },
  {
    id: 'ngeles-master',
    emoji: '👑',
    badge: 'SI MASTER NGELES BERKELAS',
    title: 'Si Master Ngeles Berkelas Tapi Lolos',
    quote: 'Interview kayak nongkrong santai di Senopati, luwes banget! Ditanya apapun ngalir lancar bak curug tanpa jeda.',
    catComment: 'HRD auto bengong liat kelihaian lu! Meow 🐾',
    defaultSticker: '🔥 MENYALA ABANGKUH 🔥',
    tier: 'TIER S (PEDE GASPOL)',
    tierCategory: 'S',
    minScore: 80,
  },

  // TIER A (Skor 70 - 79)
  {
    id: 'kucing-oren',
    emoji: '🐱',
    badge: 'KUCING OREN CERTIFIED',
    title: 'Kucing Oren Vibes: Modal Senyum, Lolos Top 20%',
    quote: 'Muka tenang, dada dug-dug ser-seran. Untung AI Jessica gak liat tangan gemeteran di bawah meja sambil nahan grogi.',
    catComment: 'Emang boleh se-hoki dan se-kece ini? 😻',
    defaultSticker: '🐱 MEOW APPROVED 100%',
    tier: 'TIER A (HOKI TINGKAT TINGGI)',
    tierCategory: 'A',
    minScore: 75,
  },
  {
    id: 'storyteller-santai',
    emoji: '🎭',
    badge: 'STORYTELLER SANTAI',
    title: 'Si Penutur Santai Tapi Kurang STAR',
    quote: 'Gaya bicaramu super tenang dan meyakinkan, tapi sering lupa sebut angka terukur di bagian Result! Poles dikit lagi langsung gas lolos.',
    catComment: 'Dikit lagi tembus! Poles angka Result dikit lagi! 🎯',
    defaultSticker: '💼 VIBES SENOPATI 100%',
    tier: 'TIER A (CUKUP SIAP KERJA)',
    tierCategory: 'A',
    minScore: 70,
  },

  // TIER B (Skor < 70)
  {
    id: 'ninja-terselubung',
    emoji: '🕶️',
    badge: 'HEMAT BICARA PENUH MISTERI',
    title: 'Ninja Terselubung: Hemat Kata Tapi Ngena',
    quote: 'Jawaban to the point banget sampai interviewer nungguin kelanjutannya. Tambahin detail langkah STAR biar makin nendang!',
    catComment: 'Karakter misterius tapi berpotensi! Meow 🥷',
    defaultSticker: '⚡ SAT-SET NO DRAMA',
    tier: 'TIER B (POTENSI TERSEMBUNYI)',
    tierCategory: 'B',
    minScore: 60,
  },
  {
    id: 'pejuang-star',
    emoji: '🥊',
    badge: 'PEJUANG STAR PEMULA',
    title: 'Pejuang STAR: Masih Pemanasan Tapi Mental Baja',
    quote: 'Masih rada grogi dan jawab singkat-singkat, tapi mental berani uji coba simulasi udah dapet nilai 100 dari netizen!',
    catComment: 'Santai bro, jam terbang bikin jago! Latihan lagi yuk 🐾',
    defaultSticker: '☕ NGOPI DULU GAIS',
    tier: 'TIER B (PERLU LATIHAN)',
    tierCategory: 'B',
    minScore: 0,
  },
];

export const AVAILABLE_STICKERS = [
  '🔥 MENYALA ABANGKUH 🔥',
  '🚀 AUTO OFFERING LETTER',
  '✨ EMANG BOLEH SE-STAR INI?',
  '💯 LOLOS TAHAP 1 AMIN',
  '🐱 MEOW APPROVED 100%',
  '💼 VIBES SENOPATI 100%',
  '☕ NGOPI DULU GAIS',
  '⚡ SAT-SET NO DRAMA',
  '🏆 CALON KARYAWAN TELADAN',
  '😂 UNTUNG HRD GAK TAU',
  '💸 GAJI 2 DIGIT AMIN',
  '🎯 SPEK BINTANG LIMA',
  '🥑 SIAP GASPOL SENIN-JUMAT',
  '👑 CALON MANAJER MASA DEPAN',
];

/**
 * Judul Gaul & Kocak langsung terbentuk otomatis sesuai nilai persentase yang didapatkan
 */
export function getDefaultPersonaForScore(score: number): GaulPersona {
  if (score >= 95) {
    return GAUL_PERSONAS.find((p) => p.id === 'calon-direktur') || GAUL_PERSONAS[0];
  } else if (score >= 90) {
    return GAUL_PERSONAS.find((p) => p.id === 'ninja-satset') || GAUL_PERSONAS[1];
  } else if (score >= 85) {
    return GAUL_PERSONAS.find((p) => p.id === 'pede-dewa') || GAUL_PERSONAS[2];
  } else if (score >= 80) {
    return GAUL_PERSONAS.find((p) => p.id === 'ngeles-master') || GAUL_PERSONAS[3];
  } else if (score >= 75) {
    return GAUL_PERSONAS.find((p) => p.id === 'kucing-oren') || GAUL_PERSONAS[4];
  } else if (score >= 70) {
    return GAUL_PERSONAS.find((p) => p.id === 'storyteller-santai') || GAUL_PERSONAS[5];
  } else if (score >= 60) {
    return GAUL_PERSONAS.find((p) => p.id === 'ninja-terselubung') || GAUL_PERSONAS[6];
  } else {
    return GAUL_PERSONAS.find((p) => p.id === 'pejuang-star') || GAUL_PERSONAS[7];
  }
}

export function getDefaultStickerForScore(score: number): string {
  if (score >= 90) return '🚀 AUTO OFFERING LETTER';
  if (score >= 80) return '🔥 MENYALA ABANGKUH 🔥';
  if (score >= 70) return '✨ EMANG BOLEH SE-STAR INI?';
  return '☕ NGOPI DULU GAIS';
}

export const S06Scorecard: React.FC<S06ScorecardProps> = ({
  candidateName,
  selectedField,
  onBackToReport,
  candidateAnswers = {},
}) => {
  const [vibeTemplate, setVibeTemplate] = useState<VibeTemplate>('neon');
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [isCopiedCaption, setIsCopiedCaption] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('stickers');

  // Evaluasi skor riil berdasarkan jawaban interview
  const evalResult = useMemo(() => {
    return evaluateInterviewAnswers(candidateAnswers, selectedField, candidateName || 'Johan');
  }, [candidateAnswers, selectedField, candidateName]);

  // Judul Gaul & Kocak LANGSUNG TERBENTUK OTOMATIS sesuai nilai persentase yang didapatkan (tanpa pilihan manual)
  const selectedPersona = useMemo(() => {
    return getDefaultPersonaForScore(evalResult.overallScore);
  }, [evalResult.overallScore]);

  // Stiker default otomatis sesuai skor, pengguna bebas memilih stiker lain
  const autoSticker = useMemo(() => {
    return getDefaultStickerForScore(evalResult.overallScore);
  }, [evalResult.overallScore]);

  const [activeSticker, setActiveSticker] = useState<string>(autoSticker);

  useEffect(() => {
    setActiveSticker(autoSticker);
  }, [autoSticker]);

  const fieldObj = JOB_FIELDS.find((f) => f.id === selectedField) || JOB_FIELDS[1];
  const promoUrl = 'https://interview-ai-wheat-one.vercel.app';
  
  // Caption bergaya gaul anak muda dengan link aktif https://interview-ai-wheat-one.vercel.app di baris pertama & bawah agar langsung bisa diklik di WhatsApp & Instagram
  const captionText = `🌐 ${promoUrl}\n👆 KLIK LINK DI ATAS UNTUK MEMBUKA APLIKASI INTERVIEW AI 🔥\n\nGila bener skor interview AI gue tembus ${evalResult.overallScore}/100 nih 🔥! Judulnya otomatis dapet "${selectedPersona.title}" 😭😂.\n\nSticker: ${activeSticker}\n\n📸 *[FILE GAMBAR SCORECARD STAR (JPG 1080x1920) DILAMPIRKAN]*\nFile kartu Scorecard STAR format JPG resolusi tinggi (1080x1920) dilampirkan langsung di pesan ini.\n\n🎁 Mau coba uji mental interview lawan AI & dapet Scorecard kayak gini?\n👉 Cobain Simulasi Gratis di sini (Klik Link):\n${promoUrl}\n\n#MenyalaAbangku #InterviewAI #STARMethod #GenZCareer`;

  const handleCopyCaption = () => {
    navigator.clipboard?.writeText(captionText);
    setIsCopiedCaption(true);
    setTimeout(() => setIsCopiedCaption(false), 2000);
  };

  const handleCycleSticker = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.5 },
      });
    } catch {}
    const currentIndex = AVAILABLE_STICKERS.indexOf(activeSticker);
    const nextIndex = (currentIndex + 1) % AVAILABLE_STICKERS.length;
    setActiveSticker(AVAILABLE_STICKERS[nextIndex]);
  };

  const handleDownloadPNG = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}

    exportScorecardToPNG({
      candidateName: candidateName || 'Johan Pratama',
      jobTrack: fieldObj.title,
      score: evalResult.overallScore,
      personaTitle: selectedPersona.title,
      personaQuote: selectedPersona.quote,
      personaEmoji: selectedPersona.emoji,
      verdict: evalResult.verdict,
      catComment: selectedPersona.catComment,
      sticker: activeSticker,
      tier: selectedPersona.tier,
      situation: evalResult.situationScore,
      task: evalResult.taskScore,
      action: evalResult.actionScore,
      result: evalResult.resultScore,
      vibeTemplate,
      showSafeZones,
    });
  };

  const handleDownloadJPG = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}

    exportScorecardToJPG({
      candidateName: candidateName || 'Johan Pratama',
      jobTrack: fieldObj.title,
      score: evalResult.overallScore,
      personaTitle: selectedPersona.title,
      personaQuote: selectedPersona.quote,
      personaEmoji: selectedPersona.emoji,
      verdict: evalResult.verdict,
      catComment: selectedPersona.catComment,
      sticker: activeSticker,
      tier: selectedPersona.tier,
      situation: evalResult.situationScore,
      task: evalResult.taskScore,
      action: evalResult.actionScore,
      result: evalResult.resultScore,
      vibeTemplate,
      showSafeZones,
    });
  };

  const [shareInitialTarget, setShareInitialTarget] = useState<'select' | 'instagram' | 'whatsapp'>('select');

  const handleShare = () => {
    setShareInitialTarget('select');
    try {
      confetti({
        particleCount: 65,
        spread: 75,
        origin: { y: 0.6 },
      });
    } catch {}
    setIsShareModalOpen(true);
  };

  // Determine styling based on selected vibe
  const getVibeStyles = () => {
    switch (vibeTemplate) {
      case 'neon':
        return {
          bg: 'bg-gradient-to-b from-[#090d16] via-[#0d1e33] to-[#07111e]',
          border: 'border-cyan-500/50',
          accent: 'text-cyan-400',
          cardBg: 'bg-slate-900/85',
          glow: 'from-cyan-500/25 via-emerald-500/20 to-transparent',
          tag: 'Senoparty Neon',
        };
      case 'midnight':
        return {
          bg: 'bg-gradient-to-b from-[#100a1c] via-[#1a0f30] to-[#0a0614]',
          border: 'border-purple-500/50',
          accent: 'text-purple-400',
          cardBg: 'bg-slate-900/85',
          glow: 'from-purple-500/30 via-pink-500/20 to-transparent',
          tag: 'Drip Boba Pastel',
        };
      case 'sunset':
        return {
          bg: 'bg-gradient-to-b from-[#18090a] via-[#2a1014] to-[#0d0507]',
          border: 'border-amber-500/50',
          accent: 'text-amber-400',
          cardBg: 'bg-slate-900/85',
          glow: 'from-amber-500/30 via-rose-500/20 to-transparent',
          tag: 'Menyala Abangkuh 🔥',
        };
    }
  };

  const currentStyles = getVibeStyles();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6 animate-fadeIn">
      {/* Top Header / Back Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToReport}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors self-start cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Laporan Evaluasi STAR</span>
          <span className="text-slate-600 font-mono">/ GEN-Z EDITION</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-pink-500/30 text-xs font-bold text-pink-400 self-start sm:self-auto shadow-sm">
          <PartyPopper className="w-3.5 h-3.5 text-pink-400 animate-bounce" />
          <span>SCORECARD GAUL & VIRAL READY (9:16)</span>
        </div>
      </div>

      {/* BANNER UTAMA: JUDUL GAUL & KOCAK LANGSUNG TERBENTUK SESUAI NILAI PERSENTASE */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950/90 via-purple-950/70 to-slate-900 border border-blue-500/40 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 shrink-0">
              <Zap className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black font-mono text-[10.5px] border border-emerald-500/40 flex items-center gap-1.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                  JUDUL GAUL OTOMATIS TERBENTUK SESUAI SKOR
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 font-mono text-[10.5px] font-bold border border-blue-500/30">
                  Nilai: {evalResult.overallScore}% • {evalResult.verdict}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10.5px] font-bold border border-amber-500/30">
                  {selectedPersona.tier}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight flex items-center gap-2">
                <span>{selectedPersona.emoji}</span>
                <span>{selectedPersona.title}</span>
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Judul kartu langsung terbentuk dari persentase interview Anda (<strong className="text-cyan-300">{evalResult.overallScore}%</strong>) • Komentar Kucing AI: <span className="text-amber-300 italic">"{selectedPersona.catComment}"</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            <button
              onClick={handleShare}
              className="group relative w-full md:w-auto flex items-center justify-center gap-3 px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-300 hover:via-rose-400 hover:to-pink-400 text-white font-black shadow-xl shadow-rose-500/35 hover:shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer border-2 border-white/80 ring-4 ring-pink-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-transform">
                🚀
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-black tracking-tight uppercase text-white drop-shadow-sm">
                    Bagikan Scorecard 🔥
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-rose-600 font-mono font-black shadow-sm animate-bounce">
                    VIRAL! ⚡
                  </span>
                </div>
                <span className="text-[11px] font-bold text-amber-100 block mt-0.5 drop-shadow-sm">
                  Pamerin ke WhatsApp & IG Story (Format JPG HD) 😻
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* 4 PILAR STAR KELULUSAN SINGKAT DARI JAWABAN INTERVIEW */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-slate-400">⚡ Situation:</span>
            <span className="text-emerald-400 font-bold">{evalResult.situationScore}%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-slate-400">🎯 Task:</span>
            <span className="text-blue-400 font-bold">{evalResult.taskScore}%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-slate-400">🛠️ Action:</span>
            <span className="text-teal-400 font-bold">{evalResult.actionScore}%</span>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 font-mono">
            <span className="text-slate-400">📈 Result:</span>
            <span className="text-purple-400 font-bold">{evalResult.resultScore}%</span>
          </div>
        </div>
      </div>

      {/* TABS KONTROL KARTU (STIKER, TEMA WARNA, BAGIKAN & UNDUH) */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg overflow-x-auto scrollbar-thin">
        <button
          onClick={() => setActiveTab('stickers')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'stickers'
              ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md font-black scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>🔥 Stiker Gaul di Kartu ({AVAILABLE_STICKERS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vibes')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'vibes'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md font-black scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>🎨 Tema Warna / Vibe</span>
        </button>

        <button
          onClick={() => setActiveTab('export')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
            activeTab === 'export'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-black scale-[1.02]'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>📲 Bagikan & Unduh (JPG/PNG)</span>
        </button>
      </div>

      {/* Main Grid: Left Phone Canvas Mockup & Right Interactive Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Vertical Phone Canvas with Quick Interactive Controls */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Quick Interactive Sticker Bar directly on top of the phone card */}
          <div className="w-full max-w-[420px] p-2.5 rounded-2xl bg-slate-900/95 border border-slate-800 mb-2.5 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5 text-rose-400">
                <Flame className="w-3.5 h-3.5" />
                <span>Pilih Stiker Cepat di Kartu:</span>
              </span>
              <button 
                onClick={() => setActiveTab('stickers')}
                className="text-[10px] text-cyan-400 hover:underline font-mono font-medium cursor-pointer"
              >
                Lihat Semua ({AVAILABLE_STICKERS.length}) →
              </button>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
              {AVAILABLE_STICKERS.map((stk) => {
                const isSel = activeSticker === stk;
                return (
                  <button
                    key={stk}
                    onClick={() => {
                      setActiveSticker(stk);
                      try { confetti({ particleCount: 25, spread: 45, origin: { y: 0.5 } }); } catch {}
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-black whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                      isSel
                        ? 'bg-rose-500 text-white shadow-md shadow-rose-500/40 ring-2 ring-white scale-105'
                        : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {stk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full max-w-[420px] flex items-center justify-between text-xs font-mono text-slate-400 mb-2 px-2">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400">
              <Smartphone className="w-3.5 h-3.5" />
              Format Story IG / WA (9:16 HD)
            </span>
            <span className="text-emerald-400 font-semibold">1080 x 1920 Proportional</span>
          </div>

          {/* Kotak Teks Scorecard Evaluasi Interview STAR (Terintegrasi di Atas Kartu Visual seperti Hasil Ekspor WhatsApp & Instagram) */}
          <div className="w-full max-w-[420px] mb-2.5 rounded-3xl p-[2px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_12px_35px_rgba(6,182,212,0.25)]">
            <div className="p-3.5 sm:p-4 rounded-[22px] bg-gradient-to-br from-[#071d24] via-[#0b192a] to-[#0f172a] text-slate-100 space-y-2">
              <div className="text-xs sm:text-sm font-black text-emerald-400 leading-tight">
                🔥 SCORECARD EVALUASI INTERVIEW STAR ({candidateName || 'Johan'})
              </div>
              <div className="space-y-0.5 text-[11px] font-bold">
                <div className="text-white">
                  ⭐ Skor STAR: {evalResult.overallScore}/100 ({selectedPersona.tier})
                </div>
                <div className="text-yellow-300 truncate">
                  👑 Judul: {selectedPersona.title}
                </div>
                <div className="text-rose-400">
                  🏷️ Stiker: {activeSticker}
                </div>
              </div>

              <div className="border-t border-slate-700/60 pt-1.5 space-y-0.5 text-[10.5px]">
                <div className="font-black text-sky-400">📊 Rincian Nilai STAR:</div>
                <div className="text-slate-200 font-semibold pl-1 space-y-0.5">
                  <div>• Situation: {evalResult.situationScore}% (Gercep Parah)</div>
                  <div>• Task: {evalResult.taskScore}% (No Drama)</div>
                  <div>• Action: {evalResult.actionScore}% (Sat-Set Gaspol)</div>
                  <div>• Result: {evalResult.resultScore}% (Penting Cuan)</div>
                </div>
              </div>

              <div className="border-t border-slate-700/60 pt-1.5 space-y-1 text-[10px]">
                <div className="font-extrabold text-emerald-300">
                  📸 [KARTU SCORECARD STAR (JPG HD) TERLAMPIR DI BAWAH]
                </div>
                <div className="font-bold text-slate-100">
                  🎁 Mau coba uji mental interview lawan AI &amp; dapet Scorecard kayak gini?
                </div>
                <div className="font-bold text-sky-200">
                  👉 Cobain Simulasi Gratis di sini (Klik Link Aktif):
                </div>
                <a
                  href="https://interview-ai-wheat-one.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/25 border border-cyan-400 text-[11px] font-mono font-black text-sky-300 hover:text-white hover:bg-cyan-500/35 underline decoration-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                  title="Klik untuk langsung membuka aplikasi https://interview-ai-wheat-one.vercel.app"
                >
                  <span>🌐 https://interview-ai-wheat-one.vercel.app</span>
                </a>
              </div>
            </div>
          </div>

          {/* Phone Frame Mockup Container */}
          <div className="relative w-full max-w-[420px] aspect-[9/16] rounded-[38px] p-3 bg-slate-950 border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
            {/* Phone Speaker Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-slate-900 z-40 border border-slate-800 flex items-center justify-center">
              <div className="w-10 h-1 rounded-full bg-slate-800" />
            </div>

            {/* Inner Story Canvas Container */}
            <div className={`relative w-full h-full rounded-[28px] p-4 flex flex-col justify-between overflow-hidden text-slate-100 ${currentStyles.bg} border ${currentStyles.border}`}>
              {/* Background ambient glow */}
              <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-gradient-to-tr ${currentStyles.glow} blur-3xl pointer-events-none`} />

              {/* Instagram Story Safe Zones Overlay */}
              {showSafeZones && (
                <div className="absolute inset-0 z-30 pointer-events-none">
                  {/* Top IG Header zone */}
                  <div className="h-16 border-b-2 border-dashed border-rose-500/70 bg-rose-500/15 flex items-end justify-center pb-1">
                    <span className="text-[9px] font-mono font-bold text-rose-300">AREA TERTUTUP PROFILE IG</span>
                  </div>
                  {/* Bottom IG Reply bar zone */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 border-t-2 border-dashed border-rose-500/70 bg-rose-500/15 flex items-start justify-center pt-1">
                    <span className="text-[9px] font-mono font-bold text-rose-300">AREA TERTUTUP REPLY BAR IG</span>
                  </div>
                </div>
              )}

              {/* Story Header */}
              <div className="relative z-10 pt-3.5 space-y-1">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black tracking-wider text-cyan-400">INTERVIEWAI</span>
                    <span className="text-slate-400">• GEN-Z EDITION</span>
                  </div>
                  <span className="text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LOLOS VERIFIKASI ⚡
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-xs font-black text-white shadow-md">
                      {candidateName ? candidateName.charAt(0).toUpperCase() : 'J'}
                    </div>
                    <div>
                      <span className="text-xs font-black text-white block leading-tight">
                        {candidateName || 'Johan Pratama'}
                      </span>
                      <span className="text-[9px] font-mono text-cyan-300 font-bold block leading-none">
                        ROLE: {(fieldObj.title || 'Accounting').toUpperCase()} • READY TO HIRE
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/30 text-[9px] font-black font-mono text-amber-300">
                    👑 {selectedPersona.tier}
                  </span>
                </div>
              </div>

              {/* Hero Score & Mascot Cat Area */}
              <div className="relative z-10 my-auto py-1.5">
                {/* Floating Stiker Lucu Gaul di atas Card (Bisa Diganti 1-Klik) */}
                <div className="flex justify-center -mb-2 relative z-20">
                  <button
                    type="button"
                    onClick={handleCycleSticker}
                    className="px-3.5 py-1 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-[10px] font-black shadow-lg shadow-pink-500/30 border border-white/40 rotate-[-3deg] hover:scale-110 active:scale-95 transition-transform cursor-pointer group"
                    title="Klik langsung untuk mengganti stiker gaul!"
                  >
                    <span className="group-hover:underline">{activeSticker}</span>
                    <span className="text-[8px] opacity-80 block font-normal leading-none mt-0.5">tap ganti ↻</span>
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900/85 border border-slate-700/80 shadow-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    {/* Score */}
                    <div>
                      <div className="flex items-baseline">
                        <span className="text-5xl font-black text-white tracking-tight leading-none">
                          {evalResult.overallScore}
                        </span>
                        <span className="text-lg font-bold text-slate-500 font-mono">
                          /100
                        </span>
                      </div>
                      <div className="text-[9.5px] font-bold text-emerald-400 mt-1 flex items-center gap-1">
                        <span>✦ {evalResult.verdict} • {evalResult.tier} ✦</span>
                      </div>
                    </div>

                    {/* Mascot Cat Graphic with Speech Bubble */}
                    <div className="shrink-0 -mr-1 relative">
                      {/* Speech Bubble */}
                      <div className="absolute -top-3.5 -left-10 bg-white text-slate-900 text-[8.5px] font-black px-2 py-0.5 rounded-full shadow-md border border-slate-200 rotate-[-5deg] whitespace-nowrap z-20">
                        {selectedPersona.catComment}
                      </div>
                      <MascotCat size={95} />
                    </div>
                  </div>

                  {/* Persona Judul Gaul & Kocak: Otomatis Terbentuk Sesuai Skor */}
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-950/90 border border-amber-500/40 shadow-inner space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-extrabold text-amber-300">
                      <div className="flex items-center gap-1.5 truncate">
                        <span>{selectedPersona.emoji}</span>
                        <span className="truncate">{selectedPersona.title}</span>
                      </div>
                      <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono shrink-0">
                        Otomatis {evalResult.overallScore}%
                      </span>
                    </div>
                    <p className="text-[9.5px] text-slate-300 italic leading-snug">
                      "{selectedPersona.quote}"
                    </p>
                  </div>

                  {/* 4 Pillars Compact Grid dengan Bahasa Gaul */}
                  <div className="grid grid-cols-2 gap-1.5 mt-2.5">
                    <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[8.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono font-bold">SITUATION</span>
                        <span className="text-emerald-400 font-bold font-mono">{evalResult.situationScore}%</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5 font-medium">⚡ Gercep Parah</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[8.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono font-bold">TASK</span>
                        <span className="text-blue-400 font-bold font-mono">{evalResult.taskScore}%</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5 font-medium">🎯 No Drama</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[8.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono font-bold">ACTION</span>
                        <span className="text-teal-400 font-bold font-mono">{evalResult.actionScore}%</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5 font-medium">🛠️ Sat-Set Gaspol</span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-950/90 border border-slate-800 text-[8.5px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono font-bold">RESULT</span>
                        <span className="text-purple-400 font-bold font-mono">{evalResult.resultScore}%</span>
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5 font-medium">📈 Penting Cuan</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Footer & QR Box - Eye Catching Neon CTA (Seluruh area & URL bisa diklik langsung membuka aplikasi) */}
              <a
                href="https://interview-ai-wheat-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 block rounded-2xl p-[1.5px] bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:scale-[1.01] active:scale-[0.99] transition-transform cursor-pointer group"
                title="Klik untuk langsung membuka aplikasi https://interview-ai-wheat-one.vercel.app"
              >
                <div className="p-2.5 rounded-[14px] bg-gradient-to-br from-slate-950 via-[#071a26] to-[#0b1528] flex items-center justify-between gap-2.5 relative overflow-hidden">
                  {/* Subtle ambient light sweep */}
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-500/15 blur-xl pointer-events-none" />

                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Eye-Catching Header Badge */}
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-500/25 to-teal-500/20 border border-emerald-400/50 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-[8.5px] font-black bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent uppercase tracking-wider leading-none">
                        🔥 COBA SIMULASI INTERVIEW AI GRATIS
                      </span>
                    </div>

                    {/* Highlighted URL Pill */}
                    <div className="block px-2 py-1 rounded-lg bg-gradient-to-r from-cyan-500/25 via-blue-600/25 to-indigo-500/25 border border-cyan-400/60 shadow-[0_0_12px_rgba(34,211,238,0.25)] group-hover:border-cyan-300 transition-all">
                      <span className="text-[9.5px] font-mono font-black text-cyan-300 group-hover:text-white underline decoration-cyan-400 drop-shadow-[0_1px_4px_rgba(34,211,238,0.6)] tracking-tight whitespace-nowrap block">
                        🌐 https://interview-ai-wheat-one.vercel.app
                      </span>
                    </div>

                    <span className="text-[8px] text-cyan-200/80 font-medium block leading-none pl-0.5">
                      ⚡ Scan QR atau klik link buat tes mental interview bareng!
                    </span>
                  </div>

                  {/* Mini Crisp QR Code with Neon Frame */}
                  <div className="flex flex-col items-center shrink-0 bg-gradient-to-b from-white to-cyan-50 p-1.5 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.25)] border-2 border-cyan-300">
                    <QrCode className="w-8 h-8 text-slate-950" />
                    <span className="text-[6.5px] font-black font-mono text-slate-900 tracking-tighter uppercase mt-0.5 leading-none">
                      SCAN GRATIS
                    </span>
                  </div>
                </div>
              </a>

              {/* Bar Klik Link Biru di Bawah Footer (Sesuai Scorecard Gabungan) */}
              <a
                href="https://interview-ai-wheat-one.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 mt-1.5 block px-2.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500 hover:bg-emerald-500/30 transition-colors text-center cursor-pointer"
                title="Klik untuk langsung membuka aplikasi https://interview-ai-wheat-one.vercel.app"
              >
                <span className="text-[8.5px] font-extrabold text-emerald-300 underline decoration-emerald-400">
                  👇 KLIK LINK BIRU https://interview-ai-wheat-one.vercel.app DI BAWAH INI 👇
                </span>
              </a>
            </div>
          </div>

          {/* Big Playful Share Button right below Phone Mockup */}
          <button
            onClick={handleShare}
            className="w-full max-w-[420px] mt-3.5 group relative flex items-center justify-between gap-3 py-4 px-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-300 hover:via-rose-400 hover:to-pink-400 text-white font-black shadow-2xl shadow-rose-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-2 border-white/90 ring-4 ring-pink-500/25"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl group-hover:rotate-12 group-hover:scale-125 transition-transform animate-bounce">🚀</span>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-black block tracking-tight uppercase text-white drop-shadow">
                    Bagikan Scorecard Gaul
                  </span>
                  <span className="text-xs">🔥</span>
                </div>
                <span className="text-[11px] text-amber-100 font-bold block mt-0.5 drop-shadow-sm">
                  Pamerin ke WhatsApp & IG Story (JPG 1080x1920) 😻
                </span>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1.5 rounded-xl bg-white text-rose-600 font-mono font-black shadow-md shrink-0 uppercase tracking-tight">
              GASPOL ⚡
            </span>
          </button>

          {/* Quick Dual Download Buttons below phone mockup */}
          <div className="w-full max-w-[360px] grid grid-cols-2 gap-2 mt-2">
            <button
              onClick={handleDownloadJPG}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors shadow cursor-pointer"
              title="Unduh Scorecard dalam format JPG resolusi tinggi"
            >
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Unduh JPG</span>
            </button>
            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors shadow cursor-pointer"
              title="Unduh Scorecard dalam format PNG"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Unduh PNG</span>
            </button>
          </div>
        </div>

        {/* Right Column: Active Tab Content (Stiker, Vibe, Export) */}
        <div className="lg:col-span-7 space-y-4">
          {/* TAB 1: PILIH STIKER GAUL DI KARTU */}
          {activeTab === 'stickers' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <Flame className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Pilih Stiker Gaul di Kartu
                    </h3>
                    <p className="text-xs text-slate-400">
                      Judul kartu sudah terkunci otomatis sesuai skor (<strong className="text-cyan-300">{evalResult.overallScore}%</strong>). Pilih stiker favorit untuk ditempel:
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-400 font-bold shrink-0">
                  {AVAILABLE_STICKERS.length} Stiker
                </span>
              </div>

              {/* Grid Stiker Gaul */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-thin">
                {AVAILABLE_STICKERS.map((stk) => {
                  const isSelected = activeSticker === stk;
                  const isAutoSticker = stk === autoSticker;
                  return (
                    <button
                      key={stk}
                      onClick={() => {
                        setActiveSticker(stk);
                        try {
                          confetti({
                            particleCount: 35,
                            spread: 50,
                            origin: { y: 0.6 },
                          });
                        } catch {}
                      }}
                      className={`p-3.5 rounded-xl text-xs font-black transition-all flex items-center justify-between gap-2 border cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-600/30 scale-[1.02] ring-2 ring-white/60 border-rose-400'
                          : 'bg-slate-950 text-slate-200 hover:text-white border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="truncate">{stk}</span>
                        {isAutoSticker && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono font-normal">
                            Rekomendasi Skor
                          </span>
                        )}
                      </div>
                      {isSelected ? (
                        <span className="w-5 h-5 rounded-full bg-white text-rose-600 flex items-center justify-center text-xs shrink-0 font-black shadow">✓</span>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">Pilih</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEMA WARNA / VIBE */}
          {activeTab === 'vibes' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Palette className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Pilih Tema Warna / Vibe Scorecard
                    </h3>
                    <p className="text-xs text-slate-400">
                      Ubah nuansa gradien dan pencahayaan kartu Story
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-bold">{currentStyles.tag}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Senoparty Neon */}
                <button
                  onClick={() => setVibeTemplate('neon')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    vibeTemplate === 'neon'
                      ? 'border-cyan-500 bg-cyan-950/30 ring-2 ring-cyan-500/20'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-10 rounded-lg bg-gradient-to-r from-cyan-400 to-emerald-400 mb-2 shadow" />
                  <div className="text-xs font-bold text-white truncate">Senoparty Neon</div>
                  <div className="text-[10px] text-slate-400">Cyber Cyan & Mint</div>
                </button>

                {/* Drip Boba Pastel */}
                <button
                  onClick={() => setVibeTemplate('midnight')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    vibeTemplate === 'midnight'
                      ? 'border-purple-500 bg-purple-950/30 ring-2 ring-purple-500/20'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-10 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 mb-2 shadow" />
                  <div className="text-xs font-bold text-white truncate">Boba Drip Pastel</div>
                  <div className="text-[10px] text-slate-400">Purple Velvet & Candy</div>
                </button>

                {/* Menyala Abangkuh */}
                <button
                  onClick={() => setVibeTemplate('sunset')}
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    vibeTemplate === 'sunset'
                      ? 'border-amber-500 bg-amber-950/30 ring-2 ring-amber-500/20'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <div className="w-full h-10 rounded-lg bg-gradient-to-r from-amber-400 to-rose-500 mb-2 shadow" />
                  <div className="text-xs font-bold text-white truncate">Menyala Abangkuh 🔥</div>
                  <div className="text-[10px] text-slate-400">Sunset Flare & Fire</div>
                </button>
              </div>

              {/* Garis Panduan Aman IG Story */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-slate-800 text-slate-300">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Garis Panduan Aman IG Story</div>
                    <div className="text-[10px] text-slate-400">Tampilkan area batas header profil dan reply bar Instagram</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowSafeZones(!showSafeZones)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                    showSafeZones ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BAGIKAN & UNDUH (JPG/PNG) */}
          {activeTab === 'export' && (
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <Share2 className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Bagikan & Unduh Scorecard
                    </h3>
                    <p className="text-xs text-slate-400">
                      Kirim langsung ke WhatsApp atau posting di Instagram Story
                    </p>
                  </div>
                </div>
              </div>

              {/* Caption Gaul Siap Posting */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Smile className="w-3.5 h-3.5 text-cyan-400" />
                    Teks Caption Gaul Siap Posting
                  </span>
                  <button
                    onClick={handleCopyCaption}
                    className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {isCopiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{isCopiedCaption ? 'Tersalin!' : 'Salin Caption'}</span>
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {captionText.split(/(https:\/\/interview-ai-wheat-one\.vercel\.app)/g).map((part, idx) =>
                    part === 'https://interview-ai-wheat-one.vercel.app' ? (
                      <a
                        key={idx}
                        href="https://interview-ai-wheat-one.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono font-bold underline"
                      >
                        {part}
                      </a>
                    ) : (
                      <React.Fragment key={idx}>{part}</React.Fragment>
                    )
                  )}
                </div>
              </div>

              {/* Tombol Ekspor Utama */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleShare}
                  className="w-full group flex items-center justify-center gap-3.5 py-4 sm:py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-pink-500 hover:from-amber-300 hover:via-rose-400 hover:to-pink-400 text-white font-black text-sm sm:text-base shadow-2xl shadow-rose-500/35 border-2 border-white/80 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer ring-4 ring-pink-500/20"
                >
                  <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl shadow-inner group-hover:rotate-12 group-hover:scale-110 transition-transform shrink-0">
                    🚀
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-white uppercase tracking-tight text-sm sm:text-base drop-shadow-sm">
                        Bagikan Scorecard ke WhatsApp / Instagram 🔥
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-white text-rose-600 text-[10px] font-mono font-black shadow-sm animate-pulse">
                        JPG HD 📸
                      </span>
                    </div>
                    <span className="text-xs text-amber-100 font-bold block mt-1 drop-shadow-sm">
                      Biar HRD & temen se-circle tau gaya interview STAR lu yang menyala abangkuh! 😻✨
                    </span>
                  </div>
                </button>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={handleDownloadJPG}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-4 h-4 text-emerald-400" />
                    <span>Unduh Format JPG</span>
                  </button>

                  <button
                    onClick={handleDownloadPNG}
                    className="flex items-center justify-center gap-2 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-cyan-400" />
                    <span>Unduh Format PNG</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Summary Cards (Always Visible below active tab) */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                CHANCE OFFERING LETTER
              </span>
              <div className="text-xl font-black text-white mt-0.5">4.8x Lipat</div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Peluang dipanggil HR bila dishare ke LinkedIn / Story
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-left">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                BENCHMARK GEN-Z
              </span>
              <div className="text-xl font-black text-cyan-400 mt-0.5">{selectedPersona.tier}</div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Top Kwartil {fieldObj.title} 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pilihan Bagikan ke Instagram / WhatsApp */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        candidateName={candidateName || 'Johan'}
        selectedField={fieldObj.title}
        captionText={captionText}
        initialTarget={shareInitialTarget}
        scorecardData={{
          candidateName: candidateName || 'Johan Pratama',
          jobTrack: fieldObj.title,
          score: evalResult.overallScore,
          personaTitle: selectedPersona.title,
          personaQuote: selectedPersona.quote,
          personaEmoji: selectedPersona.emoji,
          verdict: evalResult.verdict,
          catComment: selectedPersona.catComment,
          sticker: activeSticker,
          tier: selectedPersona.tier,
          situation: evalResult.situationScore,
          task: evalResult.taskScore,
          action: evalResult.actionScore,
          result: evalResult.resultScore,
          vibeTemplate,
          showSafeZones,
        }}
      />
    </div>
  );
};
