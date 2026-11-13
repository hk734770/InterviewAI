import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Flame } from 'lucide-react';
import { playSuccessDing } from '../../utils/soundEffects';

interface QRISModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export const QRISModal: React.FC<QRISModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      playSuccessDing();
      onPaymentSuccess();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-black text-xs tracking-wider border border-rose-500/20">
              QRIS
            </span>
            <span className="text-xs text-slate-400 font-medium">Pembayaran Instan Nasional</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex flex-col items-center mt-4 mb-4">
          <div className="text-center mb-3">
            <p className="text-xs text-slate-400">Total Tagihan</p>
            <div className="flex items-baseline justify-center gap-2.5 mt-1">
              <span className="text-base font-bold text-slate-400 line-through decoration-rose-500/90 decoration-2 font-mono">
                Rp25.000
              </span>
              <span className="text-3xl font-black text-emerald-400 font-mono tracking-tight drop-shadow-[0_0_12px_rgba(52,211,153,0.45)]">
                Rp9.000
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 font-black text-xs shadow-md">
              <Flame className="w-3.5 h-3.5 text-amber-950 fill-amber-300" />
              <span>Hemat Rp16.000</span>
            </div>

            <p className="text-[11px] text-slate-300 mt-2 font-medium">
              Jumlah yang Anda bayarkan di e-wallet/bank:{' '}
              <span className="text-emerald-400 font-bold font-mono">Rp. 9.000</span>
            </p>
            <p className="text-[11px] text-cyan-400 mt-0.5">Merchant: INTERVIEWAI SIMULATION PRO</p>
          </div>

          {/* White Card with QR Code */}
          <div className="p-4 bg-white rounded-xl shadow-lg border-2 border-slate-200 flex flex-col items-center">
            {/* QRIS Top Badge */}
            <div className="w-full flex items-center justify-between mb-2 px-1">
              <span className="text-[10px] font-extrabold text-red-600 tracking-wider">QRIS</span>
              <span className="text-[9px] font-bold text-slate-600">GPN • BI</span>
            </div>

            {/* Crisp QR Code Graphic */}
            <svg viewBox="0 0 160 160" width="160" height="160" className="shape-rendering-crispEdges">
              {/* Corner position markers */}
              {/* Top-Left */}
              <rect x="10" y="10" width="40" height="40" fill="#000000" />
              <rect x="16" y="16" width="28" height="28" fill="#ffffff" />
              <rect x="22" y="22" width="16" height="16" fill="#000000" />
              {/* Top-Right */}
              <rect x="110" y="10" width="40" height="40" fill="#000000" />
              <rect x="116" y="16" width="28" height="28" fill="#ffffff" />
              <rect x="122" y="22" width="16" height="16" fill="#000000" />
              {/* Bottom-Left */}
              <rect x="10" y="110" width="40" height="40" fill="#000000" />
              <rect x="16" y="116" width="28" height="28" fill="#ffffff" />
              <rect x="22" y="122" width="16" height="16" fill="#000000" />

              {/* Data modules */}
              <rect x="58" y="15" width="8" height="8" fill="#000000" />
              <rect x="74" y="15" width="8" height="8" fill="#000000" />
              <rect x="90" y="20" width="8" height="8" fill="#000000" />

              <rect x="15" y="58" width="8" height="8" fill="#000000" />
              <rect x="30" y="65" width="8" height="8" fill="#000000" />
              <rect x="45" y="58" width="8" height="8" fill="#000000" />

              {/* Middle grid */}
              <rect x="60" y="60" width="12" height="12" fill="#000000" />
              <rect x="80" y="60" width="12" height="12" fill="#000000" />
              <rect x="70" y="80" width="16" height="16" fill="#000000" />
              <rect x="100" y="70" width="10" height="10" fill="#000000" />
              <rect x="120" y="60" width="10" height="10" fill="#000000" />

              <rect x="60" y="115" width="8" height="8" fill="#000000" />
              <rect x="75" y="125" width="12" height="12" fill="#000000" />
              <rect x="100" y="115" width="8" height="8" fill="#000000" />
              <rect x="120" y="110" width="14" height="14" fill="#000000" />
              <rect x="135" y="130" width="10" height="10" fill="#000000" />
            </svg>

            <div className="w-full text-center mt-2 pt-1 border-t border-slate-200">
              <span className="text-[10px] text-slate-500 font-mono tracking-wider">NMID: ID1020084920199</span>
              <div className="text-[10px] font-bold text-slate-700">Nominal: Rp. 9.000</div>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 text-xs text-amber-400 mt-4 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>Berlaku hingga: {timeFormatted}</span>
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-400 text-center mb-4 leading-relaxed">
          Buka aplikasi GoPay, OVO, Dana, BCA Mobile, atau Livin Mandiri, lalu scan kode QR di atas untuk membayar <span className="text-emerald-400 font-bold">Rp. 9.000</span>.
        </p>

        {/* Demo Fast Trigger Button */}
        <button
          onClick={handleSimulatePayment}
          disabled={isProcessing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-600/30 active:scale-[0.98] cursor-pointer"
        >
          {isProcessing ? (
            <span className="animate-spin">⏳</span>
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{isProcessing ? 'Memverifikasi Pembayaran...' : 'Simulasi Bayar Berhasil: Rp. 9.000'}</span>
        </button>

        <div className="mt-3 text-center">
          <span className="text-[11px] text-slate-500">NMID resmi terdaftar di Bank Indonesia ASPI</span>
        </div>
      </div>
    </div>
  );
};
