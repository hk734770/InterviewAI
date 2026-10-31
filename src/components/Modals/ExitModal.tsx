import { LogOut, Save, X, Sparkles } from 'lucide-react';

interface ExitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmExit: () => void;
  onSaveDraftAndExit: () => void;
  onGoToDiagnostics?: () => void;
}

export const ExitModal: React.FC<ExitModalProps> = ({
  isOpen,
  onClose,
  onConfirmExit,
  onSaveDraftAndExit,
  onGoToDiagnostics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-rose-400">
            <LogOut className="w-5 h-5" />
            <span className="font-bold text-sm tracking-wide">Keluar dari Sesi Simulasi?</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="mt-4 text-xs text-slate-300 leading-relaxed">
          Progres wawancara dan transkrip pertanyaan yang telah dijawab dapat langsung dievaluasi ke diagnostik STAR atau disimpan ke draft lokal.
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {onGoToDiagnostics && (
            <button
              onClick={onGoToDiagnostics}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs transition-colors shadow-lg shadow-cyan-600/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>Selesai & Lihat Hasil Diagnostik</span>
            </button>
          )}
          <button
            onClick={onSaveDraftAndExit}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors border border-slate-700"
          >
            <Save className="w-4 h-4 text-blue-400" />
            <span>Simpan Draft & Keluar ke Menu</span>
          </button>
          <button
            onClick={onConfirmExit}
            className="w-full px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 text-xs font-semibold transition-colors"
          >
            Keluar Tanpa Menyimpan
          </button>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 text-xs transition-colors"
          >
            Batalkan, Tetap di Ruang Simulasi
          </button>
        </div>
      </div>
    </div>
  );
};
