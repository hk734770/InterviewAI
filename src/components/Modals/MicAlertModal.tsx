import React from 'react';
import { AlertTriangle, MicOff, RefreshCw, Volume2, X } from 'lucide-react';
import { playTestChime } from '../../utils/soundEffects';

interface MicAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRetestMic: () => void;
}

export const MicAlertModal: React.FC<MicAlertModalProps> = ({
  isOpen,
  onClose,
  onRetestMic,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">Peringatan Audio & Mikrofon</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
            <MicOff className="w-5 h-5 shrink-0 text-amber-400" />
            <span>Sinyal suara tidak terdeteksi selama lebih dari 8 detik atau volume terlalu kecil (&lt; -40 dB).</span>
          </div>

          <h4 className="text-sm font-semibold text-slate-200">Rekomendasi Pemecahan Masalah:</h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>Pastikan mikrofon tidak dalam posisi mute fisik / switch kabel.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>Dekatkan posisi mulut ke mic (jarak optimal 15–20 cm).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>Periksa izin akses mikrofon di bilah alamat browser (ikon gembok).</span>
            </li>
          </ul>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => {
              playTestChime();
              onRetestMic();
              onClose();
            }}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Kalibrasi Ulang Mic</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
          >
            Lanjutkan Saja
          </button>
        </div>
      </div>
    </div>
  );
};
