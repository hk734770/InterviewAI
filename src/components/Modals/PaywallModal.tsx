import React from 'react';
import { X, Sparkles, Check, QrCode, ShieldCheck, Zap, RefreshCw } from 'lucide-react';
import { useLiveExchangeRate, BASE_USD_PRICE } from '../../utils/currency';

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
  const {
    formattedRate,
    formattedIdr,
    formattedUsd,
    isLive,
    lastUpdated,
    isLoading,
    refreshRate,
  } = useLiveExchangeRate(BASE_USD_PRICE);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
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

        <h3 className="text-xl font-bold text-white mb-2">
          Hebat, {candidateName || 'Kandidat'}! Lanjut ke Pertanyaan 4–10?
        </h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
          Buka akses penuh ke 10 pertanyaan standar HRD multinational, evaluasi komprehensif 4 pilar STAR, feedback intonasi suara, dan sertifikat resmi.
        </p>

        {/* Pricing Plan Card */}
        <div className="p-4 rounded-xl bg-gradient-to-b from-blue-950/40 to-slate-800/40 border border-blue-500/30 mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs uppercase tracking-wider text-cyan-400 font-semibold">Paket Sesi Instan PRO</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black text-white font-mono tracking-tight">{formattedUsd}</span>
                <span className="text-xs text-slate-400 font-normal">USD / 1 Sesi Penuh</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Konversi: {formattedIdr}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>(Kurs: $1 USD = {formattedRate})</span>
                  <button
                    onClick={() => refreshRate()}
                    title="Perbarui kurs secara manual"
                    className="p-0.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {isLive ? `Kurs realtime saat aplikasi dibuka (${lastUpdated})` : 'Kurs pasar realtime terkini'} • Pengguna membayar dalam Rupiah ({formattedIdr}) via QRIS
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Hemat 60%
            </span>
          </div>

          <ul className="space-y-2 mt-4 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Akses 10 Pertanyaan Lengkap (Studi Kasus & Behavioral)</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Laporan Diagnostik STAR Akurat & Rekomendasi Jawaban Emas</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Ekspor Viral Scorecard 9:16 Resolusi Tinggi (IG / LinkedIn)</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onProceedToQRIS}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98]"
          >
            <QrCode className="w-4 h-4" />
            <span>Bayar Instan dengan QRIS ({formattedIdr} / {formattedUsd})</span>
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm transition-colors text-center"
          >
            Nanti Saja
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Aman dengan Standar Bank Indonesia QRIS & Verifikasi Instan</span>
        </div>
      </div>
    </div>
  );
};
