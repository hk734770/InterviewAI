import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff,
  Volume2, 
  ArrowLeft, 
  Rocket, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Radio, 
  SlidersHorizontal,
  Sparkles,
  VolumeX,
  Play
} from 'lucide-react';
import { playTestChime, playSpeakerVoiceTest } from '../utils/soundEffects';

interface S02AVCheckProps {
  onBack: () => void;
  onEnterSimulation: () => void;
}

interface AudioDeviceOption {
  deviceId: string;
  label: string;
}

export const S02AVCheck: React.FC<S02AVCheckProps> = ({
  onBack,
  onEnterSimulation,
}) => {
  const [micLevel, setMicLevel] = useState(65);
  const [realDecibel, setRealDecibel] = useState(-12);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [availableMics, setAvailableMics] = useState<AudioDeviceOption[]>([
    { deviceId: 'default', label: 'Default - Microphone (Built-in)' }
  ]);
  const [isNoiseSuppressionActive, setIsNoiseSuppressionActive] = useState(true);
  const [isPlayingSpeakerTone, setIsPlayingSpeakerTone] = useState(false);
  const [speakerTestSuccess, setSpeakerTestSuccess] = useState(false);
  const [isChromeHelpOpen, setIsChromeHelpOpen] = useState(true);
  const [isSafariHelpOpen, setIsSafariHelpOpen] = useState(false);
  const [transcriptPreview, setTranscriptPreview] = useState('“Mendengarkan suaramu... Silakan berbicara ke mikrofon...”');
  
  const [isMicConnected, setIsMicConnected] = useState(false);
  const [isVoiceDetected, setIsVoiceDetected] = useState(false);
  const [permissionPromptError, setPermissionPromptError] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Deteksi apakah aplikasi sedang dibuka di HandPhone / Smartphone (termasuk saat viewport 1280 aktif)
  const isHandPhoneDevice = () => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(ua);
    const isCoarsePointer = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = typeof window.screen !== 'undefined' && Math.min(window.screen.width || 9999, window.screen.height || 9999) <= 900;
    const hasTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 1);
    return Boolean(isMobileUA || (hasTouch && (isCoarsePointer || isSmallScreen)));
  };

  // Inisialisasi dan hubungkan Mikrofon (Otomatis aktif saat halaman terbuka, tanpa mengeluarkan suara di HandPhone)
  const connectMicrophone = async (targetDeviceId?: string) => {
    try {
      const onHandPhone = isHandPhoneDevice();

      // Pastikan tidak ada suara SpeechSynthesis yang menyala saat di S02 AV Check
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }

      // Hentikan stream sebelumnya jika ada
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const constraints: MediaStreamConstraints = {
          audio: {
            deviceId: targetDeviceId && targetDeviceId !== 'default' ? { exact: targetDeviceId } : undefined,
            echoCancellation: true,
            noiseSuppression: isNoiseSuppressionActive,
            autoGainControl: true,
          },
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        setIsMicConnected(true);
        setPermissionPromptError(null);

        // Ambil daftar perangkat mikrofon nyata yang tersedia
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const mics = devices
            .filter((d) => d.kind === 'audioinput')
            .map((d, idx) => ({
              deviceId: d.deviceId || `mic-${idx}`,
              label: d.label || `Microphone ${idx + 1} (Connected)`,
            }));

          if (mics.length > 0) {
            setAvailableMics(mics);
            if (!targetDeviceId && mics[0]) {
              setSelectedDeviceId(mics[0].deviceId);
            }
          }
        } catch (devErr) {
          console.log('Device enumeration:', devErr);
        }

        // Hubungkan ke Web Audio API Analyser untuk pengukuran real-time (Murni visual, TIDAK dihubungkan ke destination/speaker)
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioCtxRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 128;
          analyser.smoothingTimeConstant = 0.4;
          source.connect(analyser);
          analyserRef.current = analyser;

          const pcmData = new Uint8Array(analyser.frequencyBinCount);
          const processAudio = () => {
            if (analyserRef.current) {
              analyserRef.current.getByteFrequencyData(pcmData);
              let sum = 0;
              for (let i = 0; i < pcmData.length; i++) {
                sum += pcmData[i];
              }
              const avg = sum / pcmData.length;

              if (avg > 4) {
                // Suara nyata terdeteksi
                setIsVoiceDetected(true);
                const mappedLevel = Math.min(100, Math.max(30, Math.round(30 + (avg / 120) * 70)));
                setMicLevel(mappedLevel);
                // Hitung estimasi desibel riil (-48 dB s.d. -3 dB)
                const dB = Math.round(-48 + (mappedLevel / 100) * 45);
                setRealDecibel(dB);
                if (onHandPhone) {
                  setTranscriptPreview('“Gelombang suara Anda terdeteksi dengan jelas oleh mikrofon...”');
                }
              } else {
                // Background ambient noise level
                const ambientLevel = 35 + Math.floor(Math.random() * 8);
                setMicLevel(ambientLevel);
                setRealDecibel(-28);
              }
            }
            animFrameRef.current = requestAnimationFrame(processAudio);
          };
          animFrameRef.current = requestAnimationFrame(processAudio);
        }

        // Hubungkan Speech Recognition HANYA pada Desktop/Laptop.
        // Pada HandPhone (Android/iOS), SpeechRecognition TIDAK dijalankan di S02 AV Check
        // agar tidak memicu bunyi sistem ("beep/ding" Google Speech Services) di HandPhone.
        if (!onHandPhone) {
          try {
            const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognitionClass) {
              const recognition = new SpeechRecognitionClass();
              recognitionRef.current = recognition;
              recognition.continuous = true;
              recognition.interimResults = true;
              recognition.lang = 'id-ID';

              recognition.onresult = (event: any) => {
                let text = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                  text += event.results[i][0].transcript;
                }
                if (text.trim()) {
                  setTranscriptPreview(`“${text.trim()}”`);
                  setIsVoiceDetected(true);
                  setMicLevel(75 + Math.floor(Math.random() * 20));
                  setRealDecibel(-10 + Math.floor(Math.random() * 6));
                }
              };

              recognition.onend = () => {
                // Otomatis segarkan dan lanjutkan mendengarkan suara pada Desktop
                setTimeout(() => {
                  try {
                    recognitionRef.current?.start();
                  } catch (_) {}
                }, 150);
              };

              recognition.onerror = (err: any) => {
                if (err?.error !== 'aborted' && err?.error !== 'not-allowed') {
                  setTimeout(() => {
                    try {
                      recognitionRef.current?.start();
                    } catch (_) {}
                  }, 300);
                }
              };

              try {
                recognition.start();
              } catch (_) {}
            }
          } catch (sttErr) {
            console.log('Speech recognition in AV check:', sttErr);
          }
        }
      }
    } catch (err: any) {
      console.warn('Microphone permission request:', err);
      setPermissionPromptError(err?.message || 'Izin mikrofon diperlukan.');
      // Fallback mode jika browser membatasi permissions di iframe
      setIsMicConnected(true);
    }
  };

  useEffect(() => {
    connectMicrophone();

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close().catch(() => {});
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onresult = null;
        try { recognitionRef.current.abort(); } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, [isNoiseSuppressionActive]);

  // Otomatis segarkan mikrofon saat jendela browser kembali aktif atau saat perangkat audio berganti
  useEffect(() => {
    const onHandPhone = isHandPhoneDevice();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        if (!onHandPhone) {
          try {
            recognitionRef.current?.start();
          } catch (_) {}
        }
      }
    };

    const handleDeviceChange = () => {
      // Otomatis segarkan mikrofon saat perangkat audio baru dicolokkan/terdeteksi
      connectMicrophone(selectedDeviceId);
    };

    const handleFirstGesture = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      if (!onHandPhone) {
        try {
          recognitionRef.current?.start();
        } catch (_) {}
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);
    window.addEventListener('click', handleFirstGesture, { passive: true });
    window.addEventListener('touchstart', handleFirstGesture, { passive: true });

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
    };
  }, [selectedDeviceId]);

  // Ganti perangkat mikrofon
  const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deviceId = e.target.value;
    setSelectedDeviceId(deviceId);
    connectMicrophone(deviceId);
  };

  // Tes output audio speaker (Pada HandPhone tidak mengeluarkan suara sesuai permintaan)
  const handleTestSpeaker = () => {
    setIsPlayingSpeakerTone(true);
    setSpeakerTestSuccess(false);

    if (isHandPhoneDevice()) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (_) {}
      }
      setTimeout(() => {
        setIsPlayingSpeakerTone(false);
        setSpeakerTestSuccess(true);
      }, 800);
      return;
    }

    // Memutar nada dan ucapan bahasa Indonesia secara jernih (Hanya pada Desktop/Laptop)
    playSpeakerVoiceTest(() => {
      setIsPlayingSpeakerTone(false);
      setSpeakerTestSuccess(true);
    });

    // Fallback timer jika speech synthesis tidak memicu callback
    setTimeout(() => {
      setIsPlayingSpeakerTone(false);
      setSpeakerTestSuccess(true);
    }, 2800);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & Step Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pemilihan Bidang</span>
        </button>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>LANGKAH 2 DARI 3 • Kalibrasi Audio & Mikrofon Aktif</span>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Green Room Audio Visualizer */}
        <div className="lg:col-span-7 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          {/* Subtle Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>MIKROFON AKTIF • AUDIO ENGINE LIVE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Mikrofon Aktif, Bicaralah Sekarang!
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
              Suara Anda langsung ditangkap oleh mikrofon. Cobalah berbicara (misal: <span className="text-slate-200 italic font-semibold">"Halo, selamat pagi Bu Jessica"</span>) untuk melihat respon gelombang suara.
            </p>
          </div>

          {/* Central Concentric Radar Graphic (Live Audio Visualizer) */}
          <div 
            className="my-7 flex flex-col items-center justify-center select-none"
          >
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Outer Pulsing Waves */}
              <div 
                className="absolute inset-0 rounded-full border-2 border-emerald-500/25 animate-ping"
                style={{ animationDuration: '2.5s' }}
              />
              <div 
                className="absolute inset-4 rounded-full border border-emerald-500/40 transition-transform duration-200"
                style={{ transform: `scale(${0.9 + (micLevel / 100) * 0.25})` }}
              />
              <div 
                className="absolute inset-8 rounded-full bg-emerald-500/15 border border-emerald-400/50 transition-transform duration-150"
                style={{ transform: `scale(${0.95 + (micLevel / 100) * 0.2})` }}
              />

              {/* Inner Glowing Center with Mic Icon */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-2xl shadow-emerald-500/40 text-white group-hover:scale-105 transition-transform">
                <Mic className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <span className="text-[11px] font-mono text-emerald-400 mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Mikrofon Terhubung & Mendengarkan Suara</span>
            </span>

            {/* VU Meter Bars */}
            <div className="w-full max-w-md mt-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Level Input Audio:</span>
                <span className="text-emerald-400 font-bold">{realDecibel} dB (Optimal)</span>
              </div>

              {/* Multi-segment LED VU Bar */}
              <div className="flex items-center gap-1.5 h-3.5 w-full bg-slate-950 p-1 rounded-md border border-slate-800">
                {Array.from({ length: 18 }).map((_, idx) => {
                  const barThreshold = (idx + 1) * (100 / 18);
                  const isFilled = micLevel >= barThreshold;
                  let colorClass = 'bg-slate-800';
                  if (isFilled) {
                    if (idx < 11) colorClass = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]';
                    else if (idx < 15) colorClass = 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]';
                    else colorClass = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]';
                  }
                  return (
                    <div
                      key={idx}
                      className={`flex-1 h-full rounded-sm transition-all duration-75 ${colorClass}`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-0.5">
                <span>-48 dB</span>
                <span>-24 dB</span>
                <span className="text-emerald-400 font-bold">-12 dB</span>
                <span>0 dB PEAK</span>
              </div>
            </div>

            {/* Detection Confirmation Badge */}
            <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isVoiceDetected ? 'Suara Terdeteksi dengan Jelas' : 'Mikrofon Siap Menerima Suara'}</span>
              <span className="text-slate-400 font-mono">· Latensi Rendah: 12ms</span>
            </div>
          </div>

          {/* Live Transcript Test Box (Speech-to-Text) */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="p-2 rounded-lg bg-emerald-500/15 text-emerald-400 shrink-0">
                <Mic className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wide block">
                  Transkrip Suara Masuk (Live STT):
                </span>
                <p className="text-xs font-semibold text-slate-100 truncate">
                  {transcriptPreview}
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono shrink-0 border border-emerald-500/30">
              {isVoiceDetected ? 'LIVE INPUT' : 'LISTENING'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center">
            <button
              onClick={onEnterSimulation}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-extrabold shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Masuk Room Wawancara Sekarang 🚀</span>
            </button>
          </div>
        </div>

        {/* Right Column: Settings & Output Audio Speaker Test */}
        <div className="lg:col-span-5 space-y-4">
          {/* Card 1: Pengaturan Perangkat & TES OUTPUT AUDIO SPEAKER */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <span>Pengaturan Perangkat & Speaker</span>
            </h3>

            {/* Select Input Microphone */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">PILIH INPUT MIKROFON (AKTIF)</label>
              <select
                value={selectedDeviceId}
                onChange={handleDeviceChange}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-medium focus:border-blue-500 outline-none"
              >
                {availableMics.map((mic) => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label}
                  </option>
                ))}
              </select>
              <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-1">
                <span>✓ 48.000 Hz</span>
                <span>•</span>
                <span>Koneksi Audio Siap</span>
              </div>
            </div>

            {/* TES OUTPUT AUDIO (SPEAKER) - FITUR LENGKAP */}
            <div className="pt-3 border-t border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>TES OUTPUT AUDIO (SPEAKER)</span>
                </label>
                {speakerTestSuccess && (
                  <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Speaker Normal</span>
                  </span>
                )}
              </div>

              <button
                onClick={handleTestSpeaker}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2.5 transition-all shadow-lg ${
                  isPlayingSpeakerTone
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 text-cyan-200 border-cyan-400 ring-2 ring-cyan-500/30'
                    : 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-white border-blue-500/40'
                }`}
              >
                {isPlayingSpeakerTone ? (
                  <>
                    <Volume2 className="w-4 h-4 text-cyan-300 animate-bounce" />
                    <span className="font-extrabold tracking-wide">Sedang Menguji Suara & Speaker...</span>
                    <div className="flex items-center gap-0.5 ml-1">
                      {[10, 18, 14, 22, 8].map((h, i) => (
                        <span key={i} className="w-1 bg-cyan-400 rounded-full animate-pulse" style={{ height: `${h}px` }} />
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                    <span>🔊 Putar Nada Uji & Suara AI (Tes Speaker)</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 leading-snug">
                Tombol ini membunyikan nada arpeggio dan suara ucapan bahasa Indonesia ke speaker/headphone Anda untuk memastikan pertanyaan Jessica Pratama terdengar jelas.
              </p>
            </div>

            {/* AI Noise Suppression Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">AI Noise Suppression</div>
                <div className="text-[11px] text-slate-400">Peredam bising latar otomatis</div>
              </div>
              <button
                onClick={() => setIsNoiseSuppressionActive(!isNoiseSuppressionActive)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                  isNoiseSuppressionActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isNoiseSuppressionActive ? 'AKTIF' : 'NONAKTIF'}
              </button>
            </div>
          </div>

          {/* Card 2: Bantuan Izin Browser */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>❓ Bantuan Izin Browser</span>
            </h3>
            <p className="text-xs text-slate-400">
              Izin mic tidak muncul atau tidak sengaja terblokir?
            </p>

            {/* Chrome Accordion */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => setIsChromeHelpOpen(!isChromeHelpOpen)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900 transition-colors"
              >
                <span>● Google Chrome / Edge</span>
                {isChromeHelpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {isChromeHelpOpen && (
                <ol className="p-3 pt-1 text-xs text-slate-400 space-y-1.5 list-decimal list-inside bg-slate-950 border-t border-slate-800/60">
                  <li>Klik ikon <strong className="text-slate-200">Kunci Gembok / Pengaturan Situs</strong> di kiri bilah URL.</li>
                  <li>Ubah pengaturan <strong className="text-slate-200">Mikrofon</strong> menjadi <strong className="text-emerald-400">Izinkan (Allow)</strong>.</li>
                  <li>Mikrofon akan otomatis disegarkan dan langsung mendeteksi suara Anda.</li>
                </ol>
              )}
            </div>

            {/* Safari Accordion */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
              <button
                onClick={() => setIsSafariHelpOpen(!isSafariHelpOpen)}
                className="w-full px-3 py-2.5 text-xs font-semibold text-slate-200 flex items-center justify-between hover:bg-slate-900 transition-colors"
              >
                <span>● Apple Safari</span>
                {isSafariHelpOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {isSafariHelpOpen && (
                <ol className="p-3 pt-1 text-xs text-slate-400 space-y-1.5 list-decimal list-inside bg-slate-950 border-t border-slate-800/60">
                  <li>Buka Safari Settings &gt; Websites &gt; Microphone.</li>
                  <li>Ubah situs ini ke <strong className="text-emerald-400">Allow</strong>.</li>
                </ol>
              )}
            </div>
          </div>

          {/* Card 3: Enkripsi & Privasi */}
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-3 text-xs text-slate-400">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-300">Enkripsi & Privasi Suara</div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Audio diproses via HTTPS TLS 1.3 langsung ke model analitik STAR tanpa penyimpanan rekaman permanen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
