import React, { useState, useMemo } from 'react';
import { JobFieldId } from '../types/interview';
import { STAR_REPORT_METRICS, getQuestionsForField, JOB_FIELDS } from '../data/mockData';
import { evaluateInterviewAnswers, evaluateSingleAnswer } from '../utils/evaluationEngine';
import { 
  Download, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Clock,
  Eye,
  Activity,
  Check,
  Copy
} from 'lucide-react';

interface S05STARReportProps {
  candidateName: string;
  selectedField: JobFieldId;
  onRetakeInterview: () => void;
  onGoToScorecard: () => void;
  candidateAnswers?: Record<number, string>;
}

export const S05STARReport: React.FC<S05STARReportProps> = ({
  candidateName,
  selectedField,
  onRetakeInterview,
  onGoToScorecard,
  candidateAnswers = {},
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(3);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  const fieldObj = JOB_FIELDS.find((f) => f.id === selectedField) || JOB_FIELDS[1];
  const fieldQuestions = getQuestionsForField(selectedField);

  // Evaluasi skor riil berdasarkan jawaban interview
  const evalResult = useMemo(() => {
    return evaluateInterviewAnswers(candidateAnswers, selectedField, candidateName || 'Johan');
  }, [candidateAnswers, selectedField, candidateName]);

  const handleShareLink = () => {
    const isGoogleRunApp = typeof window !== 'undefined' && window.location.origin && (
      window.location.origin.includes('run.app') ||
      window.location.origin.includes('google') ||
      window.location.origin.includes('ais-') ||
      window.location.origin.includes('localhost')
    );
    const shareUrl = isGoogleRunApp ? 'https://interview-ai.app' : window.location.href;
    navigator.clipboard?.writeText(shareUrl);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const handleDownloadPDF = () => {
    const vp = document.getElementById('viewport-meta');
    const prevContent = vp ? vp.getAttribute('content') : null;
    if (vp) {
      vp.setAttribute('content', 'width=device-width, initial-scale=1.0');
    }
    setTimeout(() => {
      window.print();
      if (vp && prevContent) {
        vp.setAttribute('content', prevContent);
      }
    }, 50);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn print:max-w-full print:px-2 print:py-3 print:space-y-5 overflow-hidden">
      {/* Subheader Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:flex-wrap print:gap-3 print:pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              SESI SELESAI
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: #IVW-9821 • 14 Okt 2024</span>
          </div>
          <h1 className="text-2xl sm:text-3xl print:text-xl font-black text-white tracking-tight break-words">
            Hasil Wawancara Kerja: <span className="text-cyan-400">{candidateName || 'Budi Pratama'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
            <span>💼 Target Posisi:</span>
            <span className="text-slate-200 font-bold">{fieldObj.title} ({fieldObj.subtitle})</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onGoToScorecard}
            className="flex items-center gap-1.5 px-4 py-2.5 print:px-3 print:py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-pink-600/25 hover:scale-105 active:scale-95"
            title="Lihat Scorecard Gaul 9:16 untuk Instagram / WhatsApp"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>Scorecard Gaul 9:16</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-1.5 px-3.5 py-2.5 print:px-3 print:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>PDF</span>
          </button>
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3.5 py-2.5 print:px-3 print:py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-colors"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{isCopiedLink ? 'Tersalin!' : 'Bagikan Link'}</span>
          </button>
        </div>
      </div>

      {/* Two Key Metric Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:gap-3 print:break-inside-avoid">
        {/* Left: STAR Audit Index Circular Gauge */}
        <div className="lg:col-span-4 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 print:p-4 flex flex-col justify-between shadow-xl relative overflow-hidden min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              STAR AUDIT INDEX
            </span>
            <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Evaluasi Valid
            </span>
          </div>

          {/* Big Circular Gauge */}
          <div className="my-6 print:my-3 flex flex-col items-center justify-center">
            <div className="relative w-44 h-44 print:w-32 print:h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="10"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="64"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 64}
                  strokeDashoffset={2 * Math.PI * 64 * (1 - evalResult.overallScore / 100)}
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_12px_rgba(52,211,153,0.4)]"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div className="text-4xl print:text-3xl font-black text-white font-sans">
                  {evalResult.overallScore}
                </div>
                <div className="text-xs font-mono text-slate-400 font-bold">
                  / 100
                </div>
              </div>
            </div>

            <div className="mt-3 px-4 py-1.5 print:px-2.5 print:py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-extrabold text-sm print:text-xs tracking-wide text-center">
              {evalResult.verdict}
            </div>
            <div className="text-[11px] print:text-[10px] font-mono text-slate-400 uppercase tracking-wider mt-2 text-center">
              TINGKAT KELULUSAN: <span className="text-slate-200 font-bold">{evalResult.overallScore}% REKOMENDASI ({evalResult.tier})</span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] print:text-[10px] text-slate-400 text-center font-mono">
            {evalResult.isCustomAnswered ? `Evaluasi ${evalResult.answeredCount} Soal Riil Interview` : 'Benchmark Standar Nasional S-Tier'}
          </div>
        </div>

        {/* Right: Diagnostik Persona AI Card */}
        <div className="lg:col-span-8 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 print:p-4 flex flex-col justify-between shadow-xl space-y-4 print:space-y-3 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
              DIAGNOSTIK PERSONA AI
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {evalResult.isCustomAnswered ? `Analisis Jawaban ${candidateName || 'Kandidat'}` : 'Simulasi AI Batch #4'}
            </span>
          </div>

          {/* Dominant Persona Badge & Quote */}
          <div className="p-4 print:p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                GAYA RESPON DOMINAN
              </span>
            </div>
            <h3 className="text-base sm:text-lg print:text-sm font-black text-white break-words">
              "{evalResult.dominantPersonaTitle}"
            </h3>
            <p className="text-xs sm:text-sm print:text-xs text-slate-300 leading-relaxed italic break-words">
              "{evalResult.dominantPersonaQuote}"
            </p>
          </div>

          {/* Executive Impression Summary */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              EXECUTIVE IMPRESSION SUMMARY
            </span>
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              Kandidat memperlihatkan kematangan teknis akuntansi yang solid dan penguasaan terminologi keuangan standar PSAK secara fasih. Struktur jawaban berorientasi solusi dengan runutan kronologis yang mudah dipahami oleh interviewer HR maupun User Finance. Untuk menjamin penawaran gaji optimal, perkuat hasil kerja akhir dengan angka dampak bisnis konkret seperti persentase efisiensi waktu closing buku bulanan.
            </p>
          </div>

          {/* 3 Telemetry Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 print:gap-2 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2 text-xs print:text-[11px] font-medium text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pacing Bicara: <strong className="text-white">138 WPM</strong> (Ideal)</span>
            </div>
            <div className="flex items-center gap-2 text-xs print:text-[11px] font-medium text-slate-300">
              <Eye className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Eye Contact Focus: <strong className="text-white">89%</strong></span>
            </div>
            <div className="flex items-center gap-2 text-xs print:text-[11px] font-medium text-slate-300">
              <Clock className="w-4 h-4 text-purple-400 shrink-0" />
              <span>Total Waktu: <strong className="text-white">24m 12s</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Metrik: Evaluasi 4 Pilar STAR */}
      <div className="space-y-4 print:space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              DETAIL METRIK
            </span>
            <h2 className="text-lg font-bold text-white">Evaluasi 4 Pilar STAR</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Formula Standar Recruiter Global</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 print:grid-cols-2 gap-4 print:gap-3">
          {/* Situation */}
          <div className="p-5 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg min-w-0 print:break-inside-avoid">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">PILAR 01</span>
              <span className="text-sm font-black text-emerald-400 font-mono">{evalResult.situationScore}<span className="text-xs text-slate-500">/100</span></span>
            </div>
            <div className="text-base font-bold text-white">Situation</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${evalResult.situationScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              {evalResult.situationScore >= 85
                ? 'Sangat jelas dan sistematis dalam menguraikan konteks latar belakang permasalahan bisnis, divisi, dan tantangan awal.'
                : 'Uraikan latar belakang konteks bisnis dan masalah awal lebih spesifik agar pewawancara memahami urgensinya.'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>{evalResult.situationScore >= 85 ? 'Sangat Unggul' : evalResult.situationScore >= 70 ? 'Cukup Baik' : 'Perlu Detail'}</span>
            </div>
          </div>

          {/* Task */}
          <div className="p-5 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg min-w-0 print:break-inside-avoid">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">PILAR 02</span>
              <span className="text-sm font-black text-blue-400 font-mono">{evalResult.taskScore}<span className="text-xs text-slate-500">/100</span></span>
            </div>
            <div className="text-base font-bold text-white">Task</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${evalResult.taskScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              {evalResult.taskScore >= 80
                ? 'Tanggung jawab individu dipaparkan lugas. Rekruiter memahami persis batas peranmu vs rekan satu departemen.'
                : 'Tegaskan batas tanggung jawab pribadi vs peran tim agar kontribusi nyata Anda terlihat jelas.'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-400">
              <Check className="w-3.5 h-3.5" />
              <span>{evalResult.taskScore >= 80 ? 'Siap Pakai' : 'Perjelas Peran'}</span>
            </div>
          </div>

          {/* Action */}
          <div className="p-5 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg min-w-0 print:break-inside-avoid">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">PILAR 03</span>
              <span className="text-sm font-black text-teal-400 font-mono">{evalResult.actionScore}<span className="text-xs text-slate-500">/100</span></span>
            </div>
            <div className="text-base font-bold text-white">Action</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-400 h-full rounded-full" style={{ width: `${evalResult.actionScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              {evalResult.actionScore >= 80
                ? 'Langkah konkrit, tahapan inisiatif, dan penerapan tools/software terurai dengan rincian operasional yang rapi.'
                : 'Sebutkan software/tools spesifik dan metodologi langkah kerja yang Anda gunakan untuk menyelesaikan tugas.'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-teal-400">
              <Check className="w-3.5 h-3.5" />
              <span>{evalResult.actionScore >= 80 ? 'Proaktif & Solutif' : 'Tingkatkan Langkah'}</span>
            </div>
          </div>

          {/* Result */}
          <div className="p-5 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-lg min-w-0 print:break-inside-avoid">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">PILAR 04</span>
              <span className="text-sm font-black text-purple-400 font-mono">{evalResult.resultScore}<span className="text-xs text-slate-500">/100</span></span>
            </div>
            <div className="text-base font-bold text-white">Result</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${evalResult.resultScore}%` }} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed break-words">
              {evalResult.resultScore >= 85
                ? 'Hasil terukur sangat baik, mencakup angka persentase dampak bisnis yang meyakinkan hiring manager.'
                : 'Perlu diperkuat metrik kuantitatif. Hasil masih cenderung deskriptif dibanding angka konkret (% saving / waktu selesai).'}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-purple-400">
              <Check className="w-3.5 h-3.5" />
              <span>{evalResult.resultScore >= 85 ? 'Kuantitatif Kuat' : 'Poles Angka & Metrik'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Poin Kekuatan & Area Perbaikan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-3 print:break-inside-avoid">
        {/* Poin Kekuatan Utama */}
        <div className="p-6 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold block">
                KELEBIHAN MENONJOL
              </span>
              <h3 className="text-base font-bold text-white">Poin Kekuatan Utama</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Artikulasi Percaya Diri & Terkontrol</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Vokal stabil, intonasi tenang saat dihadapkan pada pertanyaan jebakan terkait salah hitung neraca.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Ketepatan Terminologi Akuntansi</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Menggunakan istilah teknis secara tepat (seperti "Amortisasi", "Rekonsiliasi Bank 3-Way Match", "Audit Trail").
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Problem Solving Sistematis</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Bisa memecah insiden audit rumit menjadi urutan verifikasi dokumen yang masuk akal dan mudah diimplementasikan tim.
              </p>
            </div>
          </div>
        </div>

        {/* Area Perbaikan Kritis */}
        <div className="p-6 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl min-w-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold block">
                POTENSI PERTUMBUHAN
              </span>
              <h3 className="text-base font-bold text-white">Area Perbaikan Kritis</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Tambahkan Metrik % Efisiensi Kuantitatif</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Ganti kalimat "proses jadi lebih cepat" dengan format terukur: "mempercepat periode closing bulanan dari 5 hari kerja menjadi 2 hari (hemat 60%)".
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Kurangi Filler Words ('Eh', 'Hmm')</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Terdeteksi 18 kali jeda filler pada babak transisi Q3 dan Q7. Ambil jeda diam 1 detik daripada menggumam untuk kesan lebih berwibawa.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
              <h4 className="font-bold text-slate-200">Perjelas Batas "Saya" vs "Tim Kami"</h4>
              <p className="text-slate-400 leading-relaxed break-words">
                Gunakan kata ganti "Saya" saat menceritakan keputusan krusial penulisan jurnal penyesuaian agar kontribusi individual tidak kabur.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Studi Kasus Pembelajaran: Rekomendasi Jawaban Emas STAR */}
      <div className="p-6 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl min-w-0 print:break-inside-avoid">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold block">
              STUDI KASUS PEMBELAJARAN
            </span>
            <h3 className="text-lg font-bold text-white">
              Rekomendasi Jawaban Emas STAR
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Analisis Khusus Pertanyaan #3</span>
        </div>

        {/* Question Prompt */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
          <div className="p-1.5 rounded-md bg-blue-600/20 text-blue-400 shrink-0">
            <span className="text-xs font-mono font-bold">?</span>
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              PERTANYAAN PEWAWANCARA (USER MANAGER)
            </span>
            <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-0.5 break-words">
              "Ceritakan pengalaman ketika Anda menemukan selisih saldo signifikan saat proses rekonsiliasi akhir bulan dan bagaimana Anda mengatasinya?"
            </p>
          </div>
        </div>

        {/* Comparison: Transkrip Aslimu vs Jawaban Versi Pro */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 print:gap-3">
          {/* Asli */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4 min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Transkrip Aslimu</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                  Skor: 75/100
                </span>
              </div>
              <p className="text-xs text-slate-400 italic leading-relaxed break-words">
                "Waktu itu di kantor lama, ada selisih sekitar belasan juta waktu closing bulanan. Saya cek lagi nota-nota dan bukti transfer di ordner kas kecil. Setelah seharian diteliti bersama tim admin, ternyata ada invoice vendor logistik yang ke-dobel input karena beda admin. Lalu kami buat jurnal koreksi pembalik dan closing bisa kelar."
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Kelemahan: Kurang spesifik angka nominal, peran inisiatif pasif, tidak ada langkah preventif lanjutan.</span>
            </div>
          </div>

          {/* Versi Pro */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/40 flex flex-col justify-between space-y-4 min-w-0">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Jawaban Versi Pro (AI Enhanced Script)
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                  Skor: 98/100
                </span>
              </div>

              <div className="space-y-2 text-xs leading-relaxed break-words">
                <div>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono mr-1.5 border border-emerald-500/30">
                    [SITUATION]
                  </span>
                  <span className="text-slate-200">
                    "Pada closing buku kuartal 3, saya mendapati selisih rekonsiliasi bank sebesar <strong>Rp 18.500.000</strong> antara general ledger dan rekening koran H-1 sebelum deadline audit holding."
                  </span>
                </div>

                <div>
                  <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-bold font-mono mr-1.5 border border-blue-500/30">
                    [TASK]
                  </span>
                  <span className="text-slate-200">
                    "Tanggung jawab saya sebagai staf akun adalah melacak akar perbedaan saldo tanpa menunda rilis laporan laba rugi bulanan."
                  </span>
                </div>

                <div>
                  <span className="px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-400 text-[10px] font-bold font-mono mr-1.5 border border-teal-500/30">
                    [ACTION]
                  </span>
                  <span className="text-slate-200">
                    "Saya menjalankan formula <em>VLOOKUP & Fuzzy Matching</em> di Excel untuk membandingkan 600 baris transaksi secara otomatis, dan menemukan duplikasi tagging PO pada vendor kargo yang sama."
                  </span>
                </div>

                <div>
                  <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 text-[10px] font-bold font-mono mr-1.5 border border-purple-500/30">
                    [RESULT]
                  </span>
                  <span className="text-slate-200">
                    "Saya memposting jurnal penyesuaian dalam waktu 3 jam, sehingga closing tuntas tepat waktu 100% tanpa denda penalti, sekaligus merancang checklist approval ganda yang mencegah insiden berulang hingga 0% kasus."
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Kelebihan: Memuat nominal persis, metode otomatisasi, dan dampak sistemik jangka panjang.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluasi Per Pertanyaan (Q1 – Q10) Accordion */}
      <div className="p-6 print:p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
              TRANSKRIP & CATATAN GILIRAN
            </span>
            <h3 className="text-lg font-bold text-white">Evaluasi Per Pertanyaan (Q1 – Q10)</h3>
          </div>
          <span className="text-xs font-mono text-cyan-400 cursor-pointer hover:underline">
            Buka Semua Catatan
          </span>
        </div>

        <div className="space-y-2.5">
          {fieldQuestions.map((rawQ, qIdx) => {
            const hasCustomAns = !!(candidateAnswers[qIdx] && candidateAnswers[qIdx].trim());
            const candidateAnswerText = hasCustomAns ? candidateAnswers[qIdx] : rawQ.sampleCandidateAnswer;
            const singleEval = hasCustomAns 
              ? evaluateSingleAnswer(candidateAnswerText, selectedField, rawQ)
              : null;
            const displayScore = singleEval ? singleEval.overallScore : rawQ.score;

            const q = {
              ...rawQ,
              questionText: rawQ.questionText
                .replace(/{name}/g, candidateName?.trim() || 'Johan')
                .replace(/Halo Budi,/g, `Halo ${candidateName?.trim() || 'Johan'},`),
            };
            const isExpanded = expandedQuestion === q.id;
            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden transition-colors print:break-inside-avoid"
              >
                <div
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3 overflow-hidden min-w-0">
                    <span className={`px-2 py-0.5 rounded font-bold font-mono text-xs border shrink-0 ${
                      displayScore >= 80 
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' 
                        : displayScore >= 65
                        ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                        : 'bg-amber-500/15 text-amber-400 border-amber-500/20'
                    }`}>
                      {displayScore}/100
                    </span>
                    <div className="truncate print:whitespace-normal print:overflow-visible min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                          PERTANYAAN {q.questionNumber < 10 ? `0${q.questionNumber}` : q.questionNumber}
                        </span>
                        {hasCustomAns && (
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-mono font-semibold">
                            ✓ Transkrip Riil
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-200 truncate print:whitespace-normal print:overflow-visible">
                        "{q.questionText}"
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
                      {q.category}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950 space-y-3 text-xs">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">
                          {hasCustomAns ? 'Jawaban Anda (Transkrip Riil):' : 'Jawaban Contoh Benchmark:'}
                        </span>
                        {singleEval && (
                          <span className="text-[10px] font-mono text-cyan-400">
                            S: {singleEval.situationScore}% | T: {singleEval.taskScore}% | A: {singleEval.actionScore}% | R: {singleEval.resultScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-slate-300 mt-1 italic leading-relaxed">
                        "{candidateAnswerText}"
                      </p>
                    </div>
                    {singleEval && (
                      <div className="p-2 rounded bg-slate-900/90 text-cyan-300 text-[11px]">
                        <span className="font-bold">Analisis Jawaban Anda: </span>
                        {singleEval.feedback}
                      </div>
                    )}
                    <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-500/20 text-slate-300">
                      <span className="font-bold text-cyan-400">Rekomendasi AI Coach: </span>
                      {q.aiCoachTip}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Showcase Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-950 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Hasil STAR Anda Siap Dipamerkan</h4>
            <p className="text-xs text-slate-400">
              Konversi otomatis ke format kartu Instagram Story 9:16 resolusi tinggi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={onRetakeInterview}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Latihan Lagi</span>
          </button>

          <button
            onClick={onGoToScorecard}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-extrabold shadow-lg shadow-blue-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <span>Buat Viral Scorecard 9:16 (IG Story)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
