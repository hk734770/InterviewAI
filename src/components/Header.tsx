import React, { useState } from 'react';
import { StepId } from '../types/interview';
import { Radio, Share2, Check, FileText, Download, ExternalLink, X } from 'lucide-react';

interface HeaderProps {
  currentStep: StepId;
  onSelectStep: (step: StepId) => void;
  candidateName: string;
}

const STEPS: { id: StepId; label: string }[] = [
  { id: 'S01', label: 'S01 Setup' },
  { id: 'S02', label: 'S02 AV Check' },
  { id: 'S03', label: 'S03 Simulation' },
  { id: 'S04', label: 'S04 Diagnostics' },
  { id: 'S05', label: 'S05 STAR Report' },
  { id: 'S06', label: 'S06 Scorecard' },
];

const CATALOG_PDF_URL = '/Katalog-Produk-dan-Layanan-InterviewAI.pdf';

export const Header: React.FC<HeaderProps> = ({ currentStep, onSelectStep }) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const handleCopyLink = () => {
    const isGoogleRunApp = typeof window !== 'undefined' && window.location.origin && (
      window.location.origin.includes('run.app') ||
      window.location.origin.includes('google') ||
      window.location.origin.includes('ais-') ||
      window.location.origin.includes('localhost')
    );
    const publicUrl = isGoogleRunApp ? 'https://interview-ai.app' : (window.location.origin || 'https://interview-ai.app');
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(publicUrl).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }).catch(() => {
        window.prompt('Salin link publik berikut:', publicUrl);
      });
    } else {
      window.prompt('Salin link publik berikut:', publicUrl);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-3 lg:px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2.5">
          {/* Brand Zone */}
          <div 
            onClick={() => onSelectStep('S01')}
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-extrabold tracking-tight text-white font-sans">
                  InterviewAI
                </span>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold block mt-0.5">
                Simulation Core
              </span>
            </div>
          </div>

          {/* Center Navigation Steps Bar */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => onSelectStep(step.id)}
                  className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {step.label}
                </button>
              );
            })}
          </nav>

          {/* Right Status Zone */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Tombol Bagikan Link Publik */}
            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer ${
                isCopied
                  ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400/50'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/25 hover:shadow-lg'
              }`}
              title="Salin Link Publik untuk Dibagikan ke Orang Lain"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Bagikan Link</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SIM ACTIVE</span>
            </div>

            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="relative shrink-0">
                <div className="w-8 h-8 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-slate-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-cyan-300">RS</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight whitespace-nowrap">HR Partner AI</div>
                <div className="text-[10px] text-slate-400 leading-tight whitespace-nowrap">Level 3 Interviewer</div>
              </div>
            </div>

            {/* Tombol Katalog Produk dan Layanan (Di Sebelah Kanan HR Partner AI) */}
            <button
              onClick={() => setIsCatalogOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold border border-cyan-400/40 shadow-md shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Buka Dokumen Katalog Produk dan Layanan Resmi (PDF)"
            >
              <FileText className="w-3.5 h-3.5 text-cyan-100 shrink-0" />
              <span>Katalog Produk dan Layanan</span>
            </button>
          </div>
        </div>

        {/* Mobile Step Switcher Bar */}
        <div className="md:hidden flex items-center gap-1 mt-2.5 pt-2 border-t border-slate-800/60 overflow-x-auto pb-1 scrollbar-none">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Modal Dokumen PDF Katalog Produk dan Layanan */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {/* Modal Top Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Katalog Produk dan Layanan Resmi — InterviewAI Simulation Core
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Dokumen Katalog Produk &amp; Layanan Resmi (Merchant Onboarding) • 3 Halaman PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={CATALOG_PDF_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
                  title="Buka file PDF asli di tab baru"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Buka Tab PDF</span>
                </a>
                <a
                  href={CATALOG_PDF_URL}
                  download="Katalog-Produk-dan-Layanan-InterviewAI.pdf"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors shadow-sm"
                  title="Unduh file PDF Katalog Produk dan Layanan"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF</span>
                </a>
                <button
                  onClick={() => setIsCatalogOpen(false)}
                  className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer"
                  title="Tutup Katalog"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Isi Dokumen PDF 3 Halaman (Tampil Jelas di HandPhone & Notebook) */}
            <div className="flex-1 overflow-y-auto bg-slate-800/90 p-4 sm:p-8 space-y-6">
              {/* HALAMAN 1 DARI 3 */}
              <div className="bg-white text-slate-900 rounded-lg shadow-xl max-w-4xl mx-auto p-6 sm:p-10 flex flex-col justify-between min-h-[760px] border border-slate-300 font-sans">
                <div className="space-y-6">
                  {/* Header Dokumen */}
                  <div className="border-b-2 border-slate-900 pb-4">
                    <div className="text-xs font-bold tracking-wider uppercase text-blue-700">
                      DOKUMEN KATALOG PRODUK &amp; LAYANAN RESMI (MERCHANT ONBOARDING)
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight mt-1">
                      INTERVIEWAI — SIMULATION CORE
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5">
                      Platform Simulasi Wawancara Kerja Interaktif Berbasis AI &amp; Evaluasi Metode STAR | URL:{' '}
                      <a
                        href="https://interview-ai-wheat-one.vercel.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-slate-900 underline"
                      >
                        https://interview-ai-wheat-one.vercel.app
                      </a>
                    </p>
                  </div>

                  {/* Bagian 1 */}
                  <div className="space-y-2.5">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-950 border-b border-slate-200 pb-1.5">
                      1. Deskripsi Singkat Platform &amp; Layanan
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify">
                      <strong>InterviewAI Simulation Core</strong> adalah aplikasi web berbayar untuk latihan wawancara kerja (<em>job interview simulation</em>) interaktif secara <em>real-time</em>. Pelanggan berlatih menjawab pertanyaan wawancara layaknya di ruang pertemuan virtual bersama pewawancara AI HRD (Jessica Pratama) dengan fitur transkripsi suara langsung (<em>Live Speech-to-Text</em>), kemudian memperoleh hasil evaluasi diagnostik metode STAR (<em>Situation, Task, Action, Result</em>) berstandar industri multinasional beserta laporan digital yang dapat diunduh secara instan.
                    </p>
                  </div>

                  {/* Bagian 2 (Tabel Bagian 1: Sesi Trial Awal) */}
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-950 border-b border-slate-200 pb-1.5">
                      2. Katalog Paket Layanan &amp; Rincian Harga (IDR)
                    </h2>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#0f172a] text-white text-left">
                            <th className="border border-slate-300 p-3 font-bold w-[22%]">Nama Paket / Produk</th>
                            <th className="border border-slate-300 p-3 font-bold w-[16%]">Kategori</th>
                            <th className="border border-slate-300 p-3 font-bold w-[42%]">Rincian Fitur &amp; Produk Digital (Deliverables)</th>
                            <th className="border border-slate-300 p-3 font-bold w-[20%]">Harga Resmi (IDR)</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="align-top bg-white">
                            <td className="border border-slate-300 p-3 font-bold text-slate-900">
                              Sesi Trial Awal (Freemium)
                            </td>
                            <td className="border border-slate-300 p-3 text-slate-700">
                              Uji Coba Gratis
                            </td>
                            <td className="border border-slate-300 p-3 text-slate-700 space-y-1">
                              <div>• Kalibrasi perangkat mikrofon &amp; uji output audio speaker AI.</div>
                              <div>• Simulasi wawancara interaktif untuk <strong>3 pertanyaan pertama</strong>.</div>
                              <div>• Transkripsi jawaban suara ke teks secara <em>real-time</em> tanpa login akun.</div>
                            </td>
                            <td className="border border-slate-300 p-3 text-slate-900">
                              <div className="font-extrabold text-sm">Rp 0</div>
                              <div className="text-xs text-slate-600 mt-0.5">(Gratis 3 Soal Pertama)</div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer Halaman 1 */}
                <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Katalog Produk &amp; Layanan Resmi — InterviewAI Simulation Core (https://interview-ai-wheat-one.vercel.app)</span>
                  <span className="font-semibold">Page 1 of 3</span>
                </div>
              </div>

              {/* HALAMAN 2 DARI 3 */}
              <div className="bg-white text-slate-900 rounded-lg shadow-xl max-w-4xl mx-auto p-6 sm:p-10 flex flex-col justify-between min-h-[760px] border border-slate-300 font-sans">
                <div className="space-y-6">
                  {/* Tabel Lanjutan: Paket Sesi Instan Pro */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#0f172a] text-white text-left">
                          <th className="border border-slate-300 p-3 font-bold w-[22%]">Nama Paket / Produk</th>
                          <th className="border border-slate-300 p-3 font-bold w-[16%]">Kategori</th>
                          <th className="border border-slate-300 p-3 font-bold w-[42%]">Rincian Fitur &amp; Produk Digital (Deliverables)</th>
                          <th className="border border-slate-300 p-3 font-bold w-[20%]">Harga Resmi (IDR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="align-top bg-slate-50/60">
                          <td className="border border-slate-300 p-3 text-slate-900">
                            <div className="font-bold">Paket Sesi Instan Pro</div>
                            <div className="text-xs text-slate-700 mt-0.5">(Sesi Interview PRO 10 Soal)</div>
                          </td>
                          <td className="border border-slate-300 p-3 text-slate-700">
                            Layanan Simulasi &amp; Laporan Evaluasi Digital
                          </td>
                          <td className="border border-slate-300 p-3 text-slate-700 space-y-2 leading-relaxed">
                            <div>
                              <strong>1. Akses Penuh 10 Pertanyaan Lengkap:</strong> Melanjutkan simulasi wawancara interaktif (pertanyaan ke-4 s.d. ke-10) untuk 1 sesi penuh pada bidang pekerjaan yang dipilih.
                            </div>
                            <div>
                              <strong>2. Hasil Diagnostic Interaktif:</strong> Skor hasil interview keseluruhan, rincian persentase 4 pilar STAR (<em>Situation, Task, Action, Result</em>), status Tier kesiapan kerja, pacing bicara (WPM), dan <em>eye contact focus</em>.
                            </div>
                            <div>
                              <strong>3. STAR Report Lengkap (File PDF):</strong> Laporan evaluasi komprehensif berisi <em>Executive Impression Summary</em>, Poin Kekuatan Utama, Area Perbaikan Kritis, serta Rekomendasi Jawaban Emas STAR (perbandingan transkrip asli vs <em>AI Enhanced Script</em>) yang dapat diunduh dalam format <strong>PDF</strong>.
                            </div>
                            <div>
                              <strong>4. Gen-Z Viral Scorecard 9:16 (File JPG/PNG):</strong> Kartu skor evaluasi visual dalam bahasa gaul (resolusi tinggi 1080x1920) yang dapat dikustomisasi dengan stiker dan diunduh dalam bentuk file <strong>JPG / PNG</strong> untuk dibagikan ke WhatsApp atau Instagram Story
                            </div>
                          </td>
                          <td className="border border-slate-300 p-3 text-slate-900">
                            <div className="font-extrabold text-blue-700">Rp 9.051 <span className="font-normal text-slate-700">/ Sesi Penuh</span></div>
                            <div className="text-xs text-slate-600 mt-1.5 leading-snug">
                              (Konversi otomatis dari $0,5 USD dengan kurs <em>realtime</em> Rp 18.102; ditagihkan &amp; dibayar penuh dalam Rupiah via QRIS)
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Bagian 3: Pilihan Bidang Pekerjaan */}
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-950 border-b border-slate-200 pb-1.5">
                      3. Pilihan Bidang Pekerjaan Simulasi yang Tersedia
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-700">
                      Setiap pembelian <strong>Paket Sesi Instan Pro</strong> dapat digunakan pada salah satu dari 6 modul bidang pekerjaan spesifik berikut:
                    </p>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                        <thead>
                          <tr className="bg-[#0f172a] text-white text-left">
                            <th className="border border-slate-300 p-2.5 font-bold w-[8%]">No</th>
                            <th className="border border-slate-300 p-2.5 font-bold w-[28%]">Bidang Pekerjaan</th>
                            <th className="border border-slate-300 p-2.5 font-bold w-[64%]">Cakupan Peran &amp; Materi Pertanyaan Wawancara</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="border border-slate-300 p-2.5 text-slate-700">1</td>
                            <td className="border border-slate-300 p-2.5 font-bold text-slate-900">Administrasi</td>
                            <td className="border border-slate-300 p-2.5 text-slate-700">
                              Staff Admin &amp; Operasional (pengelolaan dokumen, tata kelola data, dan koordinasi administrasi).
                            </td>
                          </tr>
                          <tr className="bg-slate-50/60">
                            <td className="border border-slate-300 p-2.5 text-slate-700">2</td>
                            <td className="border border-slate-300 p-2.5 font-bold text-slate-900">Accounting</td>
                            <td className="border border-slate-300 p-2.5 text-slate-700">
                              Akuntan &amp; Pajak / Tax (siklus buku besar, jurnal penyesuaian, rekonsiliasi, dan kepatuhan PSAK/pajak).
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="border border-slate-300 p-2.5 text-slate-700">3</td>
                            <td className="border border-slate-300 p-2.5 font-bold text-slate-900">Finance</td>
                            <td className="border border-slate-300 p-2.5 text-slate-700">
                              Finance Analyst &amp; Treasury (manajemen arus kas, analisis keuangan, dan penganggaran perusahaan).
                            </td>
                          </tr>
                          <tr className="bg-slate-50/60">
                            <td className="border border-slate-300 p-2.5 text-slate-700">4</td>
                            <td className="border border-slate-300 p-2.5 font-bold text-slate-900">Sales &amp; Marketing</td>
                            <td className="border border-slate-300 p-2.5 text-slate-700">
                              Business Development &amp; Sales (strategi akuisisi pelanggan, negosiasi komersial, dan pencapaian target).
                            </td>
                          </tr>
                          <tr className="bg-white">
                            <td className="border border-slate-300 p-2.5 text-slate-700">5</td>
                            <td className="border border-slate-300 p-2.5 font-bold text-slate-900">General Affair (GA)</td>
                            <td className="border border-slate-300 p-2.5 text-slate-700">
                              Facility &amp; Office Operations (manajemen fasilitas gedung, aset kantor, dan pengadaan vendor).
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer Halaman 2 */}
                <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Katalog Produk &amp; Layanan Resmi — InterviewAI Simulation Core (https://interview-ai-wheat-one.vercel.app)</span>
                  <span className="font-semibold">Page 2 of 3</span>
                </div>
              </div>

              {/* HALAMAN 3 DARI 3 */}
              <div className="bg-white text-slate-900 rounded-lg shadow-xl max-w-4xl mx-auto p-6 sm:p-10 flex flex-col justify-between min-h-[760px] border border-slate-300 font-sans">
                <div className="space-y-6">
                  {/* Tabel Lanjutan No 6 */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-300 text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-[#0f172a] text-white text-left">
                          <th className="border border-slate-300 p-2.5 font-bold w-[8%]">No</th>
                          <th className="border border-slate-300 p-2.5 font-bold w-[28%]">Bidang Pekerjaan</th>
                          <th className="border border-slate-300 p-2.5 font-bold w-[64%]">Cakupan Peran &amp; Materi Pertanyaan Wawancara</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-slate-50/60">
                          <td className="border border-slate-300 p-2.5 text-slate-700">6</td>
                          <td className="border border-slate-300 p-2.5 font-bold text-slate-900">Logistik &amp; Gudang</td>
                          <td className="border border-slate-300 p-2.5 text-slate-700">
                            Warehouse &amp; Supply Chain (manajemen inventaris gudang, distribusi barang, dan rantai pasok).
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Bagian 4: Mekanisme Pemesanan, Pembayaran, & Pengiriman Layanan */}
                  <div className="space-y-3">
                    <h2 className="text-base sm:text-lg font-extrabold text-slate-950 border-b border-slate-200 pb-1.5">
                      4. Mekanisme Pemesanan, Pembayaran, &amp; Pengiriman Layanan (End-to-End)
                    </h2>
                    <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <li>
                        <strong>Pemilihan Layanan:</strong> Pelanggan mengakses{' '}
                        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-900 font-mono text-xs">
                          https://interview-ai-wheat-one.vercel.app
                        </code>
                        , mengisi nama, memilih bidang pekerjaan, melakukan uji mikrofon/speaker, dan menjawab 3 pertanyaan simulasi pertama secara gratis.
                      </li>
                      <li>
                        <strong>Penawaran &amp; Checkout:</strong> Setelah menyelesaikan 3 pertanyaan gratis, sistem menampilkan jendela konfirmasi <strong>Paket Sesi Instan Pro</strong> dengan rincian harga dalam mata uang Rupiah sebesar <strong>Rp 9.051</strong> (konversi dari $0,5 USD).
                      </li>
                      <li>
                        <strong>Pembayaran via QRIS:</strong> Pelanggan menekan tombol <em>&quot;Bayar Instan dengan QRIS (Rp 9.051 / $ 0,5)&quot;</em> dan memindai kode QRIS yang tampil di layar menggunakan aplikasi <em>e-wallet</em> atau <em>mobile banking</em> (GoPay, OVO, Dana, BCA Mobile, Livin&apos; Mandiri, dll.).
                      </li>
                      <li>
                        <strong>Aktivasi &amp; Pengiriman Produk Digital Instan:</strong> Begitu pembayaran berhasil diverifikasi secara otomatis, sesi pertanyaan ke-4 hingga ke-10 langsung terbuka. Setelah seluruh pertanyaan dijawab, pelanggan langsung menerima hasil <strong>Diagnostic</strong> serta dapat mengunduh <strong>STAR Report (PDF)</strong> dan <strong>Scorecard (JPG/PNG)</strong> secara langsung dari aplikasi.
                      </li>
                    </ol>
                  </div>

                  {/* Kotak Informasi Transaksi & Mata Uang */}
                  <div className="p-4 rounded-r-lg bg-sky-50 border-l-4 border-blue-600 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    <strong>Informasi Transaksi &amp; Mata Uang:</strong> Seluruh transaksi pada platform{' '}
                    <strong>INTERVIEWAI SIMULATION PRO</strong> diproses dan diselesaikan 100% dalam mata uang{' '}
                    <strong>Rupiah (IDR)</strong> sesuai ketentuan Bank Indonesia melalui metode pembayaran{' '}
                    <strong>QRIS</strong> dengan pengiriman produk digital secara instan (<em>real-time fulfillment</em>) di dalam web aplikasi.
                  </div>
                </div>

                {/* Footer Halaman 3 */}
                <div className="pt-6 mt-8 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Katalog Produk &amp; Layanan Resmi — InterviewAI Simulation Core (https://interview-ai-wheat-one.vercel.app)</span>
                  <span className="font-semibold">Page 3 of 3</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
