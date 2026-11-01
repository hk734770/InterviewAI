import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  Send, 
  Check, 
  Copy, 
  Instagram, 
  MessageCircle, 
  Smartphone, 
  AtSign, 
  Image as ImageIcon, 
  Download,
  Zap,
  Sparkles,
  Paperclip,
  CheckCircle2,
  Laptop,
  ExternalLink,
  Flame,
  MousePointer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  ScorecardData, 
  exportScorecardToJPG, 
  getScorecardJPGData,
  createScorecardJPGFileSync
} from '../../utils/canvasExport';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName: string;
  selectedField: string;
  captionText: string;
  scorecardData?: ScorecardData;
  initialTarget?: 'select' | 'instagram' | 'whatsapp';
}

type ShareTarget = 'select' | 'instagram' | 'whatsapp';

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  candidateName,
  selectedField,
  captionText,
  scorecardData,
  initialTarget = 'select',
}) => {
  const [target, setTarget] = useState<ShareTarget>(initialTarget);
  const [igUsername, setIgUsername] = useState('');
  const [waPhone, setWaPhone] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isCopiedImage, setIsCopiedImage] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [jpgPreviewUrl, setJpgPreviewUrl] = useState<string | null>(null);
  const [isGeneratingJpg, setIsGeneratingJpg] = useState(false);
  const [cachedJpgFile, setCachedJpgFile] = useState<File | null>(null);
  const [cachedJpgBlob, setCachedJpgBlob] = useState<Blob | null>(null);
  const [cachedPngBlob, setCachedPngBlob] = useState<Blob | null>(null);
  const [isDesktopGuideActive, setIsDesktopGuideActive] = useState(false);

  // Deteksi apakah perangkat yang digunakan adalah laptop/komputer desktop
  const isDesktop = typeof window !== 'undefined' && 
    !(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

  // Sync initialTarget when opening
  useEffect(() => {
    if (isOpen) {
      setTarget(initialTarget || 'select');
      setIsDesktopGuideActive(false);
    }
  }, [isOpen, initialTarget]);

  // Buat default scorecardData jika tidak dipass
  const activeScorecardData: ScorecardData = scorecardData || {
    candidateName: candidateName || 'Johan Pratama',
    jobTrack: selectedField || 'Accounting',
    score: 84,
    personaTitle: 'Si Master Ngeles Berkelas Tapi Lolos',
    personaQuote: 'Interview kayak nongkrong santai di Senopati, luwes banget!',
    catComment: 'HRD auto bengong liat kelihaian lu! Meow 🐾',
    sticker: '🔥 MENYALA ABANGKUH 🔥',
    tier: 'TIER S+ (GOKIL PARAH)',
    situation: 88,
    task: 82,
    action: 86,
    result: 78,
    vibeTemplate: 'neon',
  };

  // Generate thumbnail JPG preview 1080x1920 & siapkan file cache (gabungan Teks Evaluasi STAR + Scorecard) agar siap dilampirkan langsung ke WhatsApp
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsGeneratingJpg(true);
    getScorecardJPGData(activeScorecardData)
      .then((res) => {
        if (isMounted) {
          setJpgPreviewUrl(res.dataUrl);
          if (res.waCompositeFile) {
            setCachedJpgFile(res.waCompositeFile);
          } else if (res.blob) {
            const fileName = `Scorecard_STAR_${(activeScorecardData.candidateName || 'Johan').replace(/\s+/g, '_')}_${activeScorecardData.score || 84}_1080x1920.jpg`;
            const file = new File([res.blob], fileName, { type: 'image/jpeg' });
            setCachedJpgFile(file);
          }
          if (res.blob) {
            setCachedJpgBlob(res.blob);
          }
          if (res.pngBlob) {
            setCachedPngBlob(res.pngBlob);
          }
          setIsGeneratingJpg(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsGeneratingJpg(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, target, activeScorecardData.vibeTemplate, activeScorecardData.sticker, activeScorecardData.personaTitle]);

  if (!isOpen) return null;

  const handleClose = () => {
    setTarget('select');
    setIgUsername('');
    setWaPhone('');
    setFeedbackMsg(null);
    setIsCopiedImage(false);
    setIsDesktopGuideActive(false);
    onClose();
  };

  const handleBackToSelect = () => {
    setTarget('select');
    setFeedbackMsg(null);
    setIsCopiedImage(false);
    setIsDesktopGuideActive(false);
  };

  // Helper untuk membersihkan username Instagram
  const getCleanIgUsername = () => {
    return igUsername.trim().replace(/^@+/, '');
  };

  // Helper untuk membersihkan & memformat nomor WhatsApp Indonesia
  const getCleanWaPhone = () => {
    let clean = waPhone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '62' + clean;
    }
    return clean;
  };

  // Helper link promosi Cobain Simulasi Gratis
  const getPromoLink = () => {
    return 'https://interview-ai-wheat-one.vercel.app';
  };

  // Pesan WhatsApp dengan link https://interview-ai-wheat-one.vercel.app aktif (bisa diklik) tepat di baris pertama (di bawah kartu Scorecard) & di bagian akhir
  const getFormattedWhatsAppMessage = () => {
    const promoLink = getPromoLink();
    const candidate = activeScorecardData.candidateName || 'Johan';

    return `🌐 ${promoLink}\n` +
      `👆 *KLIK LINK DI ATAS UNTUK MEMBUKA APLIKASI INTERVIEW AI*\n\n` +
      `*🔥 SCORECARD EVALUASI INTERVIEW STAR (${candidate})*\n\n` +
      `⭐ Skor STAR: *${activeScorecardData.score}/100* (${activeScorecardData.tier || 'TIER S+'})\n` +
      `👑 Judul: *${activeScorecardData.personaTitle}*\n` +
      `🏷️ Stiker: *${activeScorecardData.sticker || '🔥 MENYALA ABANGKUH 🔥'}*\n\n` +
      `📊 *Rincian Nilai STAR:*\n` +
      `• Situation: ${activeScorecardData.situation}% (Gercep Parah)\n` +
      `• Task: ${activeScorecardData.task}% (No Drama)\n` +
      `• Action: ${activeScorecardData.action}% (Sat-Set Gaspol)\n` +
      `• Result: ${activeScorecardData.result}% (Penting Cuan)\n\n` +
      `📸 *[FILE GAMBAR SCORECARD STAR (JPG 1080x1920) DILAMPIRKAN]*\n` +
      `File kartu Scorecard STAR format JPG resolusi tinggi (1080x1920) dilampirkan langsung di pesan ini.\n\n` +
      `🎁 *Mau coba uji mental interview lawan AI & dapet Scorecard kayak gini?*\n` +
      `👉 *Cobain Simulasi Gratis di sini (Klik Link):*\n` +
      `${promoLink}`;
  };

  // Pesan Instagram dengan link https://interview-ai-wheat-one.vercel.app aktif di baris pertama & bawah
  const getFormattedInstagramMessage = () => {
    const promoLink = getPromoLink();
    if (captionText && captionText.includes(promoLink)) {
      return captionText.startsWith('🌐')
        ? captionText
        : `🌐 ${promoLink}\n👆 KLIK LINK DI ATAS UNTUK BUKA APLIKASI INTERVIEW AI 🔥\n\n${captionText}`;
    }
    return `🌐 ${promoLink}\n👆 KLIK LINK DI ATAS UNTUK BUKA APLIKASI INTERVIEW AI 🔥\n\n${captionText || getFormattedWhatsAppMessage()}\n\n${promoLink}`;
  };

  // Manual download JPG 1080x1920 (Gabungan Teks Evaluasi STAR + Scorecard)
  const handleDownloadJPG = () => {
    exportScorecardToJPG(activeScorecardData, true);
    setFeedbackMsg('✅ File gambar Scorecard Evaluasi STAR + Kartu Scorecard format JPG HD berhasil diunduh!');
    try {
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  // Salin gambar Scorecard ke Clipboard (Mendukung paste gambar langsung di WhatsApp Web / Instagram / Mobile)
  const handleCopyImageToClipboard = async () => {
    if (cachedPngBlob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': cachedPngBlob })
        ]);
        setIsCopiedImage(true);
        setFeedbackMsg('📋 Foto Scorecard Evaluasi STAR + Kartu Scorecard berhasil disiapkan! Foto siap tertempel bersama teks pesan.');
        try {
          confetti({ particleCount: 35, spread: 45, origin: { y: 0.6 } });
        } catch {}
        setTimeout(() => setIsCopiedImage(false), 4000);
        return true;
      } catch (err) {
        console.warn('Clipboard write error:', err);
      }
    }
    // Fallback: unduh file
    exportScorecardToJPG(activeScorecardData, true);
    setFeedbackMsg('Gambar Scorecard berhasil diunduh ke perangkat Anda.');
    return false;
  };

  // Action: Kirim ke Instagram (Mengirimkan Scorecard Gabungan + Tautan Aktif https://interview-ai-wheat-one.vercel.app)
  const handleSendInstagram = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanIg = getCleanIgUsername();
    const igMessage = getFormattedInstagramMessage();

    // 1. Siapkan file gambar JPG gabungan (Teks Evaluasi STAR + Scorecard) secara sinkron
    let fileToShare = cachedJpgFile;
    if (!fileToShare) {
      try {
        fileToShare = createScorecardJPGFileSync(activeScorecardData, true);
        setCachedJpgFile(fileToShare);
      } catch (err) {
        console.warn('Error generating synchronous IG file to share:', err);
      }
    }

    // 2. Jika di Hand Phone, gunakan native share sheet dengan { files, text } (tanpa properti url agar file gambar tidak dibuang oleh sistem)
    if (!isDesktop && fileToShare && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        const sharePayload = {
          files: [fileToShare],
          text: igMessage,
        };
        const canShareFiles = typeof navigator.canShare === 'function' ? navigator.canShare({ files: [fileToShare] }) : true;
        if (canShareFiles) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(igMessage).catch(() => {});
          }
          await navigator.share(sharePayload);
          setFeedbackMsg('✅ Berhasil! Kartu Scorecard Evaluasi STAR & tautan aktif https://interview-ai-wheat-one.vercel.app berhasil dikirimkan ke Instagram.');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {}
          return;
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.warn('Instagram share fallback:', err);
      }
    }

    // 3. Fallback (atau pada Laptop/Desktop): Unduh file JPG gabungan & salin gambar ke clipboard
    exportScorecardToJPG(activeScorecardData, true);

    if (cachedPngBlob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': cachedPngBlob })
        ]);
        setIsCopiedImage(true);
      } catch {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(igMessage).catch(() => {});
        }
      }
    } else if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(igMessage).catch(() => {});
    }

    const targetAccount = cleanIg ? `@${cleanIg}` : 'Instagram';
    setFeedbackMsg(`✅ Kartu Scorecard Evaluasi STAR & tautan aktif https://interview-ai-wheat-one.vercel.app telah disiapkan! Membuka ${targetAccount}...`);

    setTimeout(() => {
      if (cleanIg) {
        const igUrl = `https://ig.me/m/${cleanIg}`;
        window.open(igUrl, '_blank') || window.open(`https://instagram.com/${cleanIg}`, '_blank');
      } else {
        window.open('https://www.instagram.com/', '_blank');
      }
    }, 350);
  };

  // URL WhatsApp untuk Laptop vs Mobile
  const getWhatsAppTargetUrl = (cleanPhone: string, waMessage: string) => {
    if (isDesktop) {
      // Pada Laptop / Desktop: langsung buka WhatsApp Web tanpa halaman perantara wa.me
      return cleanPhone 
        ? `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMessage)}`
        : `https://web.whatsapp.com/send?text=${encodeURIComponent(waMessage)}`;
    }
    // Pada Smartphone: langsung gunakan skema wa.me atau app
    return cleanPhone 
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`
      : `https://wa.me/?text=${encodeURIComponent(waMessage)}`;
  };

  // EKSEKUSI UTAMA: Melampirkan Teks Scorecard Evaluasi Interview STAR dan Kartu Scorecard langsung ke pesan WhatsApp
  // dengan tautan aktif https://interview-ai-wheat-one.vercel.app yang langsung bisa diklik untuk membuka aplikasi
  const handleSendWhatsApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPhone = getCleanWaPhone();
    const waMessage = getFormattedWhatsAppMessage();

    // 1. Siapkan file gambar JPG resolusi tinggi secara SINKRON (tanpa await)
    // File ini berisi gabungan Teks Scorecard Evaluasi Interview STAR (di atas) + Kartu Visual Scorecard (di bawah)
    // sehingga user gesture activation di Hand Phone (Android/iOS) tidak pernah hilang.
    let fileToShare = cachedJpgFile;
    if (!fileToShare) {
      try {
        fileToShare = createScorecardJPGFileSync(activeScorecardData, true);
        setCachedJpgFile(fileToShare);
      } catch (err) {
        console.warn('Error generating synchronous file to share:', err);
      }
    }

    // 2. Jika dibuka di Hand Phone:
    // Langsung kirim Kartu Gabungan (Teks Scorecard Evaluasi Interview STAR + Scorecard) beserta caption link aktif!
    // Catatan penting: Jangan menyertakan properti `url` atau `title` bersamaan dengan `files` agar Android/iOS
    // tidak membuang file gambar atau teks caption saat dikirim ke WhatsApp.
    if (!isDesktop && fileToShare && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        const canShareFiles = typeof navigator.canShare === 'function' ? navigator.canShare({ files: [fileToShare] }) : true;

        if (canShareFiles) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(waMessage).catch(() => {});
          }
          await navigator.share({
            files: [fileToShare],
            text: waMessage,
          });
          setFeedbackMsg('✅ Berhasil! Teks Scorecard Evaluasi Interview STAR, Kartu Scorecard, dan link aktif https://interview-ai-wheat-one.vercel.app berhasil dikirim ke WhatsApp.');
          try {
            confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
          } catch {}
          return;
        }
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
        console.warn('Navigator share error, continuing with direct WhatsApp URL:', err);
      }
    }

    // 3. Fallback (atau pada Laptop/Desktop): Otomatis unduh file JPG gabungan (Teks Evaluasi STAR + Scorecard) ke perangkat
    exportScorecardToJPG(activeScorecardData, true);

    // 4. Salin gambar gabungan (Teks Evaluasi STAR + Scorecard) ke clipboard agar langsung siap ditempel di WhatsApp Web
    if (cachedPngBlob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': cachedPngBlob })
        ]);
        setIsCopiedImage(true);
      } catch (err) {
        console.warn('Background clipboard write error:', err);
      }
    }

    // 5. Buka WhatsApp dengan teks pesan lengkap & link aktif https://interview-ai-wheat-one.vercel.app
    const waUrl = getWhatsAppTargetUrl(cleanPhone, waMessage);
    
    setIsDesktopGuideActive(true);
    setFeedbackMsg('🚀 WhatsApp terbuka! Teks Scorecard Evaluasi Interview STAR, Kartu Scorecard, dan link aktif https://interview-ai-wheat-one.vercel.app telah disiapkan.');

    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsGeneratingJpg(false);
    }, 250);
  };

  const handleCopyTextOnly = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(captionText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-slate-900 border-2 border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Glow Effects */}
        <div className="absolute -top-24 -right-24 w-52 h-52 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            {target !== 'select' && (
              <button
                onClick={handleBackToSelect}
                className="p-1.5 -ml-1 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                title="Kembali ke pilihan"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                {target === 'select' && 'Pilih Media Bagikan Scorecard'}
                {target === 'instagram' && 'Bagikan ke Instagram'}
                {target === 'whatsapp' && (
                  <span className="flex items-center gap-1.5">
                    <span>Lampirkan Scorecard ke WhatsApp</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                      JPG 1080x1920 HD
                    </span>
                  </span>
                )}
              </h3>
              {target === 'whatsapp' && (
                <p className="text-[11px] text-slate-400">
                  {isDesktop ? '💻 Terdeteksi: Mode Laptop / WhatsApp Web' : '📱 Terdeteksi: Mode Smartphone / WhatsApp App'}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TAHAP 1: PILIHAN UTAMA INSTAGRAM ATAU WHATSAPP */}
        {target === 'select' && (
          <div className="mt-5 space-y-3.5">
            <p className="text-xs text-slate-300 leading-relaxed">
              Pilih tujuan untuk membagikan kartu hasil evaluasi wawancara milik <strong className="text-white">{candidateName}</strong>:
            </p>

            {/* Pilihan 1: WhatsApp (Dengan Lampiran File Scorecard JPG Resolusi Tinggi 1080x1920) */}
            <button
              onClick={() => {
                setTarget('whatsapp');
                setFeedbackMsg(null);
                setIsDesktopGuideActive(false);
              }}
              className="w-full flex items-center justify-between p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-teal-950/50 to-slate-900 border-2 border-emerald-500/60 hover:border-emerald-400 transition-all group hover:scale-[1.01] active:scale-[0.99] text-left shadow-xl shadow-emerald-950/50 cursor-pointer ring-2 ring-emerald-500/20"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0 group-hover:scale-105 group-hover:rotate-6 transition-transform">
                  <MessageCircle className="w-8 h-8 text-slate-950 font-black" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-black text-white group-hover:text-emerald-300 transition-colors flex flex-wrap items-center gap-2">
                    <span>Bagikan ke WhatsApp</span>
                    <span className="text-[10px] bg-emerald-400 text-slate-950 px-2.5 py-0.5 rounded-full font-mono font-black shadow animate-pulse">
                      OTOMATIS LAMPIRKAN GAMBAR 📸
                    </span>
                  </div>
                  <div className="text-xs text-emerald-200/90 mt-1 font-medium">
                    File JPG resolusi tinggi (1080x1920) otomatis dilampirkan di chat WhatsApp / WhatsApp Web
                  </div>
                </div>
              </div>
              <span className="text-xs font-black text-slate-950 bg-emerald-400 px-3.5 py-2 rounded-xl shrink-0 shadow-md flex items-center gap-1 group-hover:bg-emerald-300">
                PILIH ➔
              </span>
            </button>

            {/* Pilihan 2: Instagram */}
            <button
              onClick={() => {
                setTarget('instagram');
                setFeedbackMsg(null);
                setIsDesktopGuideActive(false);
              }}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-950/40 via-purple-950/30 to-slate-900/60 border border-pink-500/30 hover:border-pink-500/60 transition-all group hover:scale-[1.01] active:scale-[0.99] text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-pink-500/20 shrink-0 group-hover:scale-105 transition-transform">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">
                    Bagikan ke Instagram Story / DM
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Kirim ke akun Instagram teman atau HRD dengan format Story 9:16
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-pink-400 bg-pink-500/10 px-2.5 py-1 rounded-lg border border-pink-500/20 shrink-0">
                Pilih
              </span>
            </button>

            {/* Tombol Cadangan Salin Teks */}
            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80">
              <span>Hanya ingin salin teks caption?</span>
              <button
                onClick={handleCopyTextOnly}
                className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAHAP 2A: FORM INSTAGRAM DENGAN LAMPIRAN SCORECARD GABUNGAN & LINK AKTIF */}
        {target === 'instagram' && (
          <form onSubmit={handleSendInstagram} className="mt-4 space-y-4">
            {/* Kartu Gambar Scorecard Gabungan (Teks Evaluasi STAR + Scorecard) untuk Instagram */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-pink-500/40 flex items-center gap-3.5 shadow-lg relative overflow-hidden">
              <div 
                className="w-20 h-44 rounded-xl overflow-hidden bg-slate-800 border-2 border-pink-500/50 shrink-0 relative flex items-center justify-center shadow-md group"
                title="Klik tulisan https://interview-ai-wheat-one.vercel.app pada Scorecard untuk langsung membuka aplikasi"
              >
                {jpgPreviewUrl ? (
                  <>
                    <img 
                      src={jpgPreviewUrl} 
                      alt="Scorecard Preview" 
                      className="w-full h-full object-contain bg-slate-950" 
                    />
                    {/* Area Klik Aktif pada tulisan https://interview-ai-wheat-one.vercel.app di bagian atas Scorecard */}
                    <a
                      href="https://interview-ai-wheat-one.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-[6%] top-[21%] w-[88%] h-[6%] z-20 cursor-pointer hover:bg-cyan-400/20 rounded transition-colors"
                      title="Klik https://interview-ai-wheat-one.vercel.app untuk langsung membuka aplikasi"
                    />
                    {/* Area Klik Aktif pada tulisan https://interview-ai-wheat-one.vercel.app di bagian bawah Scorecard */}
                    <a
                      href="https://interview-ai-wheat-one.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-[6%] top-[79%] w-[88%] h-[15%] z-20 cursor-pointer hover:bg-cyan-400/20 rounded transition-colors"
                      title="Klik https://interview-ai-wheat-one.vercel.app untuk langsung membuka aplikasi"
                    />
                  </>
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white">Scorecard Evaluasi STAR + Kartu</span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-mono font-bold border border-pink-500/40">
                    SIAP KIRIM IG 📸
                  </span>
                </div>
                <div className="text-[11.5px] text-pink-300 mt-1 flex items-center gap-1.5 font-bold">
                  <Paperclip className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                  <span>Teks Evaluasi STAR + Scorecard + Link Aktif:</span>
                </div>
                <div className="mt-1.5">
                  <a
                    href="https://interview-ai-wheat-one.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-[11px] font-mono font-black text-cyan-300 hover:text-white underline transition-colors shadow-sm"
                  >
                    <span>🌐 https://interview-ai-wheat-one.vercel.app</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCopyImageToClipboard}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isCopiedImage ? 'Scorecard Tersalin! ✨' : 'Salin Gambar Scorecard 📸'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadJPG}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-pink-400" />
                    <span>Unduh JPG</span>
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                <span>Nama Akun Instagram Tujuan:</span>
                <span className="text-[10px] text-pink-400 font-medium">Bisa dikosongkan di Hand Phone</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <AtSign className="w-4 h-4 text-pink-400" />
                </div>
                <input
                  type="text"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  placeholder="contoh: johan_pratama atau kosongkan untuk pilih di IG"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Scorecard di atas beserta tautan aktif{' '}
                <a
                  href="https://interview-ai-wheat-one.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 font-mono font-bold underline"
                >
                  https://interview-ai-wheat-one.vercel.app
                </a>{' '}
                otomatis dikirimkan ke Instagram.
              </p>
            </div>

            {feedbackMsg && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{feedbackMsg}</span>
              </div>
            )}

            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:opacity-95 text-white font-black text-sm shadow-lg shadow-pink-600/25 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Scorecard ke Instagram {getCleanIgUsername() ? `@${getCleanIgUsername()}` : '(Foto + Link Aktif)'}</span>
              </button>
              <button
                type="button"
                onClick={handleBackToSelect}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              >
                Ganti Pilihan
              </button>
            </div>
          </form>
        )}

        {/* TAHAP 2B: FORM WHATSAPP DENGAN LAMPIRAN SCORECARD GABUNGAN & LINK AKTIF */}
        {target === 'whatsapp' && (
          <div className="mt-4 space-y-4">
            {/* Kartu Gambar Scorecard Gabungan (Teks Evaluasi STAR + Scorecard) */}
            <div className="p-4 rounded-2xl bg-slate-950 border-2 border-emerald-500/40 flex items-center gap-3.5 shadow-lg relative overflow-hidden">
              <div 
                className="w-20 h-44 rounded-xl overflow-hidden bg-slate-800 border-2 border-emerald-500/50 shrink-0 relative flex items-center justify-center shadow-md cursor-grab active:cursor-grabbing group"
                title="Klik tulisan https://interview-ai-wheat-one.vercel.app pada Scorecard untuk langsung membuka aplikasi"
                draggable
                onDragStart={(e) => {
                  if (jpgPreviewUrl) {
                    e.dataTransfer.setData('text/uri-list', jpgPreviewUrl);
                  }
                }}
              >
                {jpgPreviewUrl ? (
                  <>
                    <img 
                      src={jpgPreviewUrl} 
                      alt="Scorecard Preview" 
                      className="w-full h-full object-contain bg-slate-950" 
                    />
                    {/* Area Klik Aktif pada tulisan https://interview-ai-wheat-one.vercel.app di bagian atas Scorecard */}
                    <a
                      href="https://interview-ai-wheat-one.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-[6%] top-[21%] w-[88%] h-[6%] z-20 cursor-pointer hover:bg-cyan-400/20 rounded transition-colors"
                      title="Klik https://interview-ai-wheat-one.vercel.app untuk langsung membuka aplikasi"
                    />
                    {/* Area Klik Aktif pada tulisan https://interview-ai-wheat-one.vercel.app di bagian bawah Scorecard */}
                    <a
                      href="https://interview-ai-wheat-one.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute left-[6%] top-[79%] w-[88%] h-[15%] z-20 cursor-pointer hover:bg-cyan-400/20 rounded transition-colors"
                      title="Klik https://interview-ai-wheat-one.vercel.app untuk langsung membuka aplikasi"
                    />
                  </>
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-500" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-black text-white">Scorecard Evaluasi STAR + Kartu</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                    JPG HD (SIAP KIRIM)
                  </span>
                </div>
                <div className="text-[11.5px] text-emerald-300 mt-1 flex items-center gap-1.5 font-bold">
                  <Paperclip className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Otomatis Dilampirkan + Link Aktif Bisa Diklik:</span>
                </div>
                <div className="mt-1.5">
                  <a
                    href="https://interview-ai-wheat-one.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/60 text-[11px] font-mono font-black text-cyan-300 hover:text-white underline transition-colors shadow-sm"
                  >
                    <span>🌐 https://interview-ai-wheat-one.vercel.app</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleCopyImageToClipboard}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-300 hover:text-white bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 px-3 py-1.5 rounded-xl cursor-pointer transition-colors shadow-sm"
                    title="Foto kartu Scorecard otomatis tertempel di bawah teks pesan"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isCopiedImage ? 'Foto Otomatis Siap Terlampir! ✨' : 'Foto Siap Tertempel di Bawah Teks 📸'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadJPG}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Unduh File JPG</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PANDUAN OTOMATISASI: FOTO TERTEMPEL DI BAWAH TEKS TANPA MENEKAN CTRL+V */}
            {isDesktop ? (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border-2 border-cyan-500/40 text-xs text-slate-200 space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-cyan-300 text-xs sm:text-sm">
                    <Laptop className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Otomatisasi di WhatsApp (Laptop / Desktop):</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    Tanpa Tekan Ctrl+V ⚡
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block font-mono">1. KLIK KIRIM</span>
                    <p className="text-slate-300">File foto Scorecard JPG HD (1080x1920) langsung disiapkan secara otomatis.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-cyan-400 block font-mono">2. TERTEMPEL OTOMATIS</span>
                    <p className="text-slate-300">Foto kartu langsung tertempel di bawah teks evaluasi STAR tanpa perlu menekan Ctrl+V.</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 block font-mono">3. SIAP MELUNCUR</span>
                    <p className="text-slate-300">WhatsApp terbuka dengan foto kartu STAR resolusi tinggi dan teks lengkap siap kirim!</p>
                  </div>
                </div>
              </div>
            ) : (
              /* PANDUAN SMARTPHONE */
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-2 font-bold text-emerald-300">
                  <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Mode Smartphone:</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Tombol di bawah otomatis melampirkan file kartu Scorecard format JPG 1080x1920 di bawah teks evaluasi ke chat WhatsApp Anda tanpa perlu menekan tombol apapun.
                </p>
              </div>
            )}

            {/* OVERLAY NOTIFIKASI APABILA WHATSAPP TELAH DIBUKA */}
            {isDesktopGuideActive && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border-2 border-emerald-400 shadow-2xl space-y-2.5 animate-fadeIn">
                <div className="flex items-center gap-2 text-emerald-300 font-black text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                  <span>WhatsApp Terbuka! Foto Scorecard Otomatis Tertempel di Bawah Teks</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Foto kartu Scorecard STAR (1080x1920) <strong>otomatis terpasang dan tertempel bersama teks evaluasi</strong> tanpa perlu menekan tombol Ctrl+V. File JPG juga tersimpan rapi di folder Unduhan laptop Anda.
                </p>
                <div className="p-2.5 rounded-xl bg-slate-950/90 border border-emerald-500/40 flex items-center justify-between gap-2">
                  <div className="text-xs text-emerald-300 font-bold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span>Foto kartu dan teks evaluasi STAR telah otomatis siap dikirim!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadJPG}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shrink-0 cursor-pointer"
                  >
                    Unduh Lagi
                  </button>
                </div>
              </div>
            )}

            {/* Form Input Nomor HP WhatsApp & Tombol Eksekusi */}
            <form onSubmit={handleSendWhatsApp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Nomor HP WhatsApp Tujuan:</span>
                  <span className="text-[10px] text-cyan-400 font-medium">Bisa dikosongkan (pilih kontak di WA)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                  </div>
                  <input
                    type="tel"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="contoh: 08123456789 atau kosongkan untuk pilih kontak langsung"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              {feedbackMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2 shadow-inner">
                  <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="leading-snug">{feedbackMsg}</span>
                </div>
              )}

              {/* Tombol Eksekusi Kirim WhatsApp: Super Besar, Menarik & Jelas */}
              <div className="pt-1 space-y-2.5">
                <button
                  type="submit"
                  className="w-full group relative flex items-center justify-center gap-3 py-4 sm:py-4.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:from-emerald-300 hover:via-teal-300 hover:to-cyan-300 text-slate-950 font-black text-sm sm:text-base shadow-2xl shadow-emerald-500/40 border-2 border-white/90 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ring-4 ring-emerald-400/25"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-950/15 flex items-center justify-center text-xl shrink-0 group-hover:rotate-12 transition-transform">
                    <Paperclip className="w-5 h-5 text-slate-950" />
                  </div>
                  <div className="text-left leading-tight">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
                        Kirim ke WhatsApp (Foto Otomatis Tertempel)
                      </span>
                      <span className="text-xs">🚀</span>
                    </div>
                    <span className="text-[11px] text-slate-900 font-bold block mt-0.5">
                      Foto format JPG HD (1080x1920) otomatis tertempel di bawah teks pesan (Tanpa menekan Ctrl+V)
                    </span>
                  </div>
                </button>

                {isDesktop && (
                  <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-slate-400">
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>WhatsApp Web akan terbuka langsung di tab baru dengan teks pesan & foto siap tempel.</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={handleBackToSelect}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    ← Kembali ke Pilihan Media
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
