import React from 'react';
import { X, Sparkles, CheckCircle2, QrCode, ShieldCheck, Zap, Flame, Award, Share2 } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToQRIS: () => void;
  candidateName: string;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  onProceedToQRIS,
  candidateName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Batas Sesi Gratis (3 Pertanyaan)
          </span>
          <span className="text-xs text-slate-400 font-mono">DEMO OVERLAY 01</span>
        </div>

        <h3 className="text-xl font-extrabold text-white mb-2">
          Hebat, {candidateName || 'Kandidat'}! Lanjut ke Pertanyaan 4–10?
        </h3>
        <p className="text-sm text-slate-300 mb-5 leading-relaxed">
          Buka akses penuh ke 10 pertanyaan standar HRD multinational, evaluasi komprehensif 4 pilar STAR, feedback intonasi suara, dan sertifikat resmi.
        </p>

        {/* Pricing Plan Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/95 via-blue-950/50 to-slate-900/95 border-2 border-cyan-500/40 shadow-xl shadow-cyan-950/30 mb-6 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/90">
            <div>
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold block mb-1.5">
                PAKET SESI INSTAN PRO
              </span>
              <div className="flex items-baseline gap-3">
                <span className="text-lg sm:text-xl font-bold text-slate-400 line-through decoration-rose-500/90 decoration-2 font-mono">
                  Rp25.000
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_14px_rgba(52,211,153,0.45)]">
                  Rp9.000
                </span>
              </div>
            </div>

            {/* Eye-Catching Hemat Rp16.000 Box */}
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 rounded-xl blur opacity-50 group-hover:opacity-80 transition duration-300" />
              <div className="relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-lg border border-white/40">
                <Flame className="w-4 h-4 text-amber-950 fill-amber-300 animate-bounce shrink-0" />
                <span>Hemat Rp16.000</span>
              </div>
            </div>
          </div>

          {/* Eye-Catching Feature List */}
          <ul className="space-y-2.5 mt-4">
            <li className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/75 border border-emerald-500/30 hover:border-emerald-400/60 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Akses <span className="text-emerald-300 font-extrabold">10 Pertanyaan Lengkap</span> (Studi Kasus &amp; Behavioral)
              </span>
            </li>

            <li className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/75 border border-cyan-500/30 hover:border-cyan-400/60 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <Award className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Laporan <span className="text-cyan-300 font-extrabold">Diagnostic STAR Akurat</span> &amp; Rekomendasi Jawaban Emas
              </span>
            </li>

            <li className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/75 border border-amber-500/30 hover:border-amber-400/60 transition-all shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-inner">
                <Share2 className="w-4 h-4 text-amber-400" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white leading-snug">
                Ekspor <span className="text-amber-300 font-extrabold">Viral Scorecard 9:16</span> Resolusi Tinggi (WA/IG)
              </span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onProceedToQRIS}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 hover:from-blue-500 hover:via-cyan-400 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-[0.98] cursor-pointer"
          >
            <QrCode className="w-4 h-4 shrink-0" />
            <span>Bayar Instan dengan QRIS Rp. 9.000</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-colors text-center shrink-0 cursor-pointer"
          >
            Nanti Saja
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aman dengan Standar Bank Indonesia QRIS &amp; Verifikasi Instan</span>
        </div>
      </div>
    </div>
  );
};
