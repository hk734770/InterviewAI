import React, { useEffect, useState } from 'react';
import { JobFieldId } from '../types/interview';
import { JOB_FIELDS } from '../data/mockData';
import { 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RotateCcw, 
  User, 
  ShieldCheck, 
  Mic, 
  Video, 
  VideoOff, 
  MicOff, 
  MessageSquare, 
  PhoneOff,
  Calculator,
  ClipboardList,
  TrendingUp,
  Megaphone,
  Building2,
  Package,
  Layers,
  Award,
  Zap,
  Share2
} from 'lucide-react';

interface S01SetupProps {
  candidateName: string;
  setCandidateName: (name: string) => void;
  selectedField: JobFieldId;
  setSelectedField: (field: JobFieldId) => void;
  hasResumeDraft: boolean;
  onResumeSession: () => void;
  onResetSession: () => void;
  onStartInterview: () => void;
}

export const S01Setup: React.FC<S01SetupProps> = ({
  candidateName,
  setCandidateName,
  selectedField,
  setSelectedField,
  hasResumeDraft,
  onResumeSession,
  onResetSession,
  onStartInterview,
}) => {
  const [isReloading, setIsReloading] = useState(false);

  // OTOMATIS: Pada saat S01 Setup dibuka, otomatis lakukan Reload the app (dengan proteksi sessionStorage agar tidak infinite loop)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const hasReloaded = sessionStorage.getItem('s01_setup_auto_reloaded');
      if (!hasReloaded) {
        sessionStorage.setItem('s01_setup_auto_reloaded', 'true');
        setIsReloading(true);
        setTimeout(() => {
          window.location.reload();
        }, 80);
      }
    } catch (e) {
      console.warn('Auto reload storage access error:', e);
    }
  }, []);

  const getFieldIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator': return <Calculator className="w-5 h-5 text-emerald-400" />;
      case 'ClipboardList': return <ClipboardList className="w-5 h-5 text-blue-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-purple-400" />;
      case 'Megaphone': return <Megaphone className="w-5 h-5 text-amber-400" />;
      case 'Building2': return <Building2 className="w-5 h-5 text-cyan-400" />;
      case 'Package': return <Package className="w-5 h-5 text-indigo-400" />;
      default: return <Calculator className="w-5 h-5 text-blue-400" />;
    }
  };

  const selectedFieldObj = JOB_FIELDS.find((f) => f.id === selectedField) || JOB_FIELDS[0];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-10 animate-fadeIn">
      {/* Reloading Overlay if auto reload is executing */}
      {isReloading && (
        <div className="fixed inset-0 z-50 bg-[#080c14]/90 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
          <p className="text-sm font-semibold text-cyan-300 font-mono tracking-wide">
            Memuat ulang aplikasi (Reload the app)...
          </p>
        </div>
      )}

      {/* Draft Resume Alert */}
      {hasResumeDraft && (
        <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg shadow-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wide">
                ● Sesi Sebelumnya Terdeteksi
              </span>
              <p className="text-sm font-medium text-slate-200">
                Draft tersimpan: <span className="font-bold text-white">{candidateName || 'Budi Santoso'}</span> • Bidang {selectedFieldObj.title} (Q2 dari 3)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onResumeSession}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Lanjutkan Sesi</span>
            </button>
            <button
              onClick={onResetSession}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Mulai Baru
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>SIMULASI INTERVIEW AI ZOOM #1 DI INDONESIA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Latihan Interview Kerja Tanpa Gugup &{' '}
          <span className="relative inline-block text-cyan-400">
            Auto Lolos
            <span className="absolute left-0 bottom-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" />
          </span>{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]">
            HRD
          </span>
        </h1>

        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Hadapi simulasi video call Zoom dengan AI HRD realistis, dapatkan transkrip interaktif real-time, dan evaluasi metode STAR berstandar industri multinational.{' '}
          <span className="text-emerald-400 font-semibold">Gratis 3 pertanyaan pertama!</span>
        </p>

        {/* 3 Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tanpa Login Akun</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Feedback Audio & Teks Real-Time</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Sertifikat & Viral Scorecard 9:16</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-8">
        {/* Step 1: Name Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Siapa Nama ?</span>
            </label>
            <span className="text-xs font-mono text-slate-400">Wajib diisi</span>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Contoh: Johan"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-sm font-semibold placeholder:text-slate-600 outline-none transition-all"
            />
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="text-blue-400">ℹ</span>
            <span>Digunakan AI Interviewer untuk menyapamu secara personal di dalam video call Zoom.</span>
          </p>
        </div>

        {/* Step 2: Job Field Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Pilih Bidang Pekerjaan yang Dituju</span>
            </label>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              Terpilih: {selectedFieldObj.title}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {JOB_FIELDS.map((field) => {
              const isSelected = selectedField === field.id;
              return (
                <div
                  key={field.id}
                  onClick={() => setSelectedField(field.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden ${
                    isSelected
                      ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 ${isSelected ? 'bg-blue-600/20' : 'bg-slate-900'}`}>
                    {getFieldIcon(field.iconName)}
                  </div>
                  <div className="flex-1 pr-6">
                    <h3 className={`text-sm font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {field.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-snug">
                      {field.subtitle}
                    </p>
                  </div>
                  {/* Radio Indicator */}
                  <div className="absolute top-4 right-4">
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-blue-500 bg-blue-500' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Button - Super Eye Catching & Prominent */}
        <div className="pt-4 relative group">
          {/* Ambient Multi-Color Animated Pulsing Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse pointer-events-none" />

          <button
            onClick={onStartInterview}
            className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 p-[2px] shadow-[0_0_40px_rgba(37,99,235,0.45)] hover:shadow-[0_0_55px_rgba(6,182,212,0.65)] transition-all duration-300 hover:scale-[1.015] active:scale-[0.99] cursor-pointer"
          >
            {/* Shimmer light reflection sweep */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

            {/* Inner Content */}
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-[#0d172e]/95 via-[#0a1936]/95 to-[#0c243b]/95 backdrop-blur-xl border border-white/20">
              {/* Left Side: Icon & Title */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/35 shrink-0 group-hover:rotate-6 transition-transform">
                  <Play className="w-5 h-5 fill-current ml-0.5 text-white" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900" />
                  </span>
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="text-lg sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                      Mulai Interview Sekarang
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md shadow-emerald-500/25 animate-bounce">
                      <Sparkles className="w-3.5 h-3.5 fill-current text-slate-950" />
                      Gratis 3 Soal
                    </span>
                  </div>
                  <p className="text-xs text-cyan-200/80 font-medium hidden sm:block mt-1">
                    Langsung interaksi dengan video pewawancara real-time • Tanpa login akun
                  </p>
                </div>
              </div>

              {/* Right Side: Action Badge */}
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 group-hover:from-cyan-400 group-hover:to-blue-500 text-white font-extrabold text-sm border border-cyan-300/40 shadow-lg shadow-cyan-500/30 transition-all duration-300 shrink-0">
                <span>Masuk Ruang Zoom</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </div>
          </button>

          {/* Under CTA Trust Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              100% Privat & Tanpa Login
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-current shrink-0" />
              Langsung Mulai (0 Detik Tunggu)
            </span>
            <span className="hidden sm:inline text-slate-700">•</span>
            <span className="flex items-center gap-1.5 text-slate-300 font-medium">
              <Mic className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              Transkrip Audio Real-Time
            </span>
          </div>
        </div>
      </div>

      {/* Preview Interface Showcase Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">
              PREVIEW INTERFACE
            </span>
            <h3 className="text-lg font-bold text-white">
              Ruang Zoom Autentik dengan AI Recruiter
            </h3>
          </div>
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            LIVE AUDIO-REC ENGINE
          </span>
        </div>

        {/* Zoom Window Mockup */}
        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          {/* Zoom Window Header Bar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <span className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-slate-400 font-mono ml-2">
                Zoom Room #894-320-1129 • AI Evaluation Sandbox
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-rose-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                REC 00:03:42
              </span>
            </div>
          </div>

          {/* Split Video Call Mockup */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 bg-slate-950">
            {/* Left Feed: Interviewer Video Admin1 (Muted) */}
            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-slate-800/80 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none" />
              
              {/* Interviewer badge */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-xs font-medium text-slate-200 border border-slate-700/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Interviewer: Jessica Pratama</span>
              </div>

              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Speaking</span>
              </div>

              {/* Real Video Preview (Tanpa Suara / Muted) */}
              <div className="absolute inset-0 flex items-center justify-center">
                <video
                  key={selectedField}
                  src={
                    selectedField === 'logistics' ? '/Logistik1.mp4' :
                    selectedField === 'ga' ? '/General1.mp4' :
                    selectedField === 'sales' ? '/Sales1.mp4' :
                    selectedField === 'finance' ? '/Finance1.mp4' :
                    selectedField === 'accounting' ? '/Accounting1.mp4' :
                    '/Admin1.mp4'
                  }
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Subtitle bar */}
              <div className="absolute bottom-3 left-3 right-3 z-20 p-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-200 italic shadow-lg">
                {selectedField === 'logistics'
                  ? '"Halo! Ceritakan sedikit tentang latar belakang pengalaman dan ketertarikanmu pada posisi Logistik & Gudang ini."'
                  : selectedField === 'ga'
                  ? '"Halo! Ceritakan sedikit tentang latar belakang pendidikan dan ketertarikanmu pada posisi General Affair (GA) ini."'
                  : selectedField === 'sales'
                  ? '"Halo! Ceritakan sedikit tentang latar belakang pengalaman dan ketertarikanmu pada posisi Sales & Marketing ini."'
                  : selectedField === 'finance'
                  ? '"Halo! Ceritakan sedikit tentang latar belakang pendidikan dan ketertarikanmu pada posisi Finance Analyst & Treasury ini."'
                  : '"Halo! Ceritakan sedikit tentang latar belakang pendidikan dan ketertarikanmu pada posisi ini."'}
              </div>
            </div>

            {/* Right Feed: Candidate */}
            <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden border border-slate-800/80 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10" />

              <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md text-xs font-medium text-slate-200 border border-slate-700/50">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>{candidateName || 'Budi'} (Kandidat)</span>
              </div>

              <div className="absolute top-3 right-3 z-20 flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Audio Active</span>
              </div>

              <div className="text-center space-y-2">
                <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-blue-700 to-indigo-800 border-2 border-blue-400/40 flex items-center justify-center text-2xl font-bold text-white shadow-xl">
                  {candidateName ? candidateName.charAt(0).toUpperCase() : 'B'}
                </div>
                <div className="flex items-center justify-center gap-1">
                  {[0.3, 0.7, 1.0, 0.5, 0.8, 0.4].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-emerald-400 rounded-full animate-pulse"
                      style={{ height: `${h * 16}px` }}
                    />
                  ))}
                </div>
              </div>

              <div className="absolute bottom-3 left-3 right-3 z-20 p-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs text-slate-300">
                <span className="text-emerald-400 font-semibold mr-1.5">● Real-Time Transcription:</span>
                "Waktu itu di pekerjaan terakhir saya..." <span className="text-slate-400 italic">[AI menganalisis komponen STAR...]</span>
              </div>
            </div>
          </div>

          {/* Zoom Footer Bar */}
          <div className="px-4 py-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5">
                <Mic className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mute</span>
              </button>
              <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-blue-400" />
                <span>Video</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold">
                STAR Live Feedback
              </span>
            </div>

            <button className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold">
              End Call
            </button>
          </div>
        </div>
      </div>

      {/* 3 Bottom Value Prop Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
          <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Video Call AI Interaktif</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Wawancara tatap muka langsung via audio-visual dengan gestur dan intonasi HRD natural layaknya ruang meeting Zoom sungguhan.
          </p>
          <div className="pt-2 text-xs font-mono text-cyan-400 font-semibold">
            Latency &lt; 400ms Real-Time ⚡
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
          <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Analisis Metode STAR</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Setiap jawaban dievaluasi instan berdasarkan Situation, Task, Action, dan Result dengan saran perbaikan kalimat konkret.
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-400 font-semibold">
            Standar Penilaian Top Tier HR ⇋
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors space-y-2">
          <div className="w-10 h-10 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">Gen-Z Viral Scorecard</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dapatkan kartu skor visual format rasio 9:16 yang estetik, siap kamu bagikan ke Instagram Story, X (Twitter), dan feed LinkedIn.
          </p>
          <div className="pt-2 text-xs font-mono text-purple-400 font-semibold">
            Download PNG Instan 📥
          </div>
        </div>
      </div>
    </div>
  );
};
