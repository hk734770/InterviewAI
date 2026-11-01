import React, { useState, useEffect, useRef } from 'react';
import { 
  InterviewQuestion, 
  JobFieldId 
} from '../types/interview';
import { getQuestionsForField, JOB_FIELDS } from '../data/mockData';
import { PhotorealisticFemaleAvatar } from './PhotorealisticFemaleAvatar';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Smile, 
  FileText, 
  Send,
  Zap,
  HelpCircle,
  AlertCircle,
  Shield,
  Users,
  Share2,
  Disc,
  LayoutGrid,
  Maximize2,
  ChevronUp,
  MessageSquare,
  Pin,
  MoreHorizontal,
  Camera,
  Radio,
  Timer
} from 'lucide-react';
import { playSuccessDing, playTestChime, playWarningTone } from '../utils/soundEffects';

interface S03SimulationProps {
  candidateName: string;
  selectedField: JobFieldId;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  isProUser: boolean;
  onOpenDemoOverlay: (overlay: 'paywall' | 'qris' | 'paid' | 'micAlert' | 'exit') => void;
  onFinishSimulation: (answers?: Record<number, string>) => void;
  candidateAnswers?: Record<number, string>;
  onSaveAnswer?: (questionIndex: number, text: string) => void;
}

export const S03Simulation: React.FC<S03SimulationProps> = ({
  candidateName,
  selectedField,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  isProUser,
  onOpenDemoOverlay,
  onFinishSimulation,
  candidateAnswers = {},
  onSaveAnswer,
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(
    currentQuestionIndex === 0 ? 15 : 1149
  );
  // Microphone & Camera state
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoStopped, setIsVideoStopped] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [micAudioLevel, setMicAudioLevel] = useState(50);
  const [decibelLevel, setDecibelLevel] = useState(48);

  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(true);
  const [isCandidateSpeaking, setIsCandidateSpeaking] = useState(false);
  const [candidateSpeechText, setCandidateSpeechText] = useState('');
  const [silenceCountdown, setSilenceCountdown] = useState<number | null>(null);
  const [candidateAnswersHistory, setCandidateAnswersHistory] = useState<{ [index: number]: string }>({});
  const [videoReplayTrigger, setVideoReplayTrigger] = useState(0);

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [floatingReaction, setFloatingReaction] = useState(null as string | null);
  const [viewMode, setViewMode] = useState<'speaker' | 'gallery'>('speaker');
  const [isChatOpen, setIsChatOpen] = useState(true);

  const pipVideoRef = useRef<HTMLVideoElement>(null);
  const galleryVideoRef = useRef<HTMLVideoElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const isMicActiveRef = useRef<boolean>(true);
  const isMutedRef = useRef<boolean>(false);

  useEffect(() => {
    isMicActiveRef.current = isMicActive;
  }, [isMicActive]);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const silenceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const hasCandidateAnsweredRef = useRef<boolean>(false);
  const candidateSpeechTextRef = useRef<string>('');
  const voiceFramesRef = useRef<number>(0);
  const isRecognitionRunningRef = useRef<boolean>(false);
  const isRecognitionStartingRef = useRef<boolean>(false);
  const isInterviewerSpeakingRef = useRef<boolean>(true);
  const accumulatedFinalTextRef = useRef<string>('');

  const fieldQuestions = getQuestionsForField(selectedField);
  const rawQuestion: InterviewQuestion = fieldQuestions[currentQuestionIndex] || fieldQuestions[0];
  const activeCandidateName = candidateName?.trim() || 'Johan';
  const currentQuestion: InterviewQuestion = {
    ...rawQuestion,
    questionText: rawQuestion.questionText
      .replace(/{name}/g, activeCandidateName)
      .replace(/Halo Budi,/g, `Halo ${activeCandidateName},`),
  };
  const currentQuestionRef = useRef<InterviewQuestion>(currentQuestion);
  useEffect(() => {
    currentQuestionRef.current = currentQuestion;
  }, [currentQuestion]);
  const fieldObj = JOB_FIELDS.find((f) => f.id === selectedField) || JOB_FIELDS[0];

  // Fungsi tandai kandidat sudah menjawab (membatalkan timer agar Jessica tidak mengulang)
  const markCandidateAnswered = () => {
    hasCandidateAnsweredRef.current = true;
    setSilenceCountdown(null);
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (silenceIntervalRef.current) {
      clearInterval(silenceIntervalRef.current);
      silenceIntervalRef.current = null;
    }
  };

  // Fungsi hitung mundur jika kandidat belum berbicara (diberi waktu 8 detik agar kandidat santai mulai menjawab)
  const startSilenceCountdown = () => {
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);

    if (hasCandidateAnsweredRef.current || candidateSpeechTextRef.current.trim()) return;

    let secondsLeft = 8;
    setSilenceCountdown(8);

    silenceIntervalRef.current = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft > 0 && !hasCandidateAnsweredRef.current && !candidateSpeechTextRef.current.trim()) {
        setSilenceCountdown(secondsLeft);
      } else {
        if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
      }
    }, 1000);

    // Jika kandidat belum menjawab sama sekali, Jessica mengulang pertanyaan secara santun
    silenceTimeoutRef.current = setTimeout(() => {
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
      setSilenceCountdown(null);

      if (!hasCandidateAnsweredRef.current && !candidateSpeechTextRef.current.trim()) {
        speakQuestion(true);
      }
    }, 8000);
  };

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

  // FUNGSI INTI: INISIALISASI SPEECH RECOGNITION FRESH SETIAP SAAT (Berfungsi sama di HandPhone & Notebook)
  const startFreshRecognition = () => {
    try {
      if (typeof window === 'undefined') return;

      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      if (isMutedRef.current || isInterviewerSpeakingRef.current) return;
      if (isRecognitionRunningRef.current || isRecognitionStartingRef.current) return;

      isRecognitionStartingRef.current = true;

      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }

      const onHandPhone = isHandPhoneDevice();

      // Pada HandPhone, lepaskan stream getUserMedia audio mentah saat SpeechRecognition berjalan
      // agar mikrofon tidak terkunci (exclusive hardware mic lock) dan speaker tetap mode Loudspeaker
      if (onHandPhone && audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((t) => t.stop());
        audioStreamRef.current = null;
      }

      const recognition = new SpeechRecognitionClass();
      recognitionRef.current = recognition;
      recognition.continuous = !onHandPhone;
      recognition.interimResults = true;
      recognition.lang = 'id-ID';

      const startTimeout = setTimeout(() => {
        isRecognitionStartingRef.current = false;
      }, 1500);

      recognition.onstart = () => {
        clearTimeout(startTimeout);
        isRecognitionRunningRef.current = true;
        isRecognitionStartingRef.current = false;
      };

      recognition.onsoundstart = () => {
        setIsCandidateSpeaking(true);
        setMicAudioLevel(68 + Math.floor(Math.random() * 22));
        setDecibelLevel(64 + Math.floor(Math.random() * 14));
      };

      recognition.onspeechstart = () => {
        markCandidateAnswered();
        setIsCandidateSpeaking(true);
        setMicAudioLevel(75 + Math.floor(Math.random() * 20));
        setDecibelLevel(68 + Math.floor(Math.random() * 15));
      };

      recognition.onspeechend = () => {
        setIsCandidateSpeaking(false);
        setMicAudioLevel(22);
        setDecibelLevel(38);
      };

      recognition.onresult = (event: any) => {
        let currentSessionFinal = '';
        let interim = '';
        for (let i = 0; i < event.results.length; ++i) {
          const piece = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            currentSessionFinal += (currentSessionFinal ? ' ' : '') + piece.trim();
          } else {
            interim += (interim ? ' ' : '') + piece.trim();
          }
        }
        const sessionPieces = onHandPhone
          ? (currentSessionFinal || interim).trim()
          : [currentSessionFinal, interim].filter(Boolean).join(' ').trim();
        const base = accumulatedFinalTextRef.current.trim();
        let fullText = '';
        if (base && sessionPieces) {
          fullText = `${base} ${sessionPieces}`;
        } else {
          fullText = base || sessionPieces;
        }
        fullText = fullText.replace(/\s+/g, ' ').trim();

        if (fullText) {
          markCandidateAnswered();
          candidateSpeechTextRef.current = fullText;
          setCandidateSpeechText(fullText);
          setIsCandidateSpeaking(true);
          setMicAudioLevel(72 + Math.floor(Math.random() * 24));
          setDecibelLevel(66 + Math.floor(Math.random() * 16));
          onSaveAnswer?.(currentQuestionIndex, fullText);
        }
      };

      recognition.onend = () => {
        clearTimeout(startTimeout);
        isRecognitionRunningRef.current = false;
        isRecognitionStartingRef.current = false;
        if (candidateSpeechTextRef.current.trim()) {
          accumulatedFinalTextRef.current = candidateSpeechTextRef.current.trim();
        }
        // Pada Notebook otomatis sambung terus; pada HandPhone tidak melakukan loop timer kosong
        // agar tidak memicu bunyi "beep / ding" berulang saat kandidat sedang diam
        if (!onHandPhone && isMicActiveRef.current && !isMutedRef.current && !isInterviewerSpeakingRef.current) {
          setTimeout(() => {
            startFreshRecognition();
          }, 150);
        }
      };

      recognition.onerror = (err: any) => {
        clearTimeout(startTimeout);
        isRecognitionRunningRef.current = false;
        isRecognitionStartingRef.current = false;
        if (err?.error === 'audio-capture' && audioStreamRef.current) {
          audioStreamRef.current.getAudioTracks().forEach((t) => t.stop());
          audioStreamRef.current = null;
        }
        if (!onHandPhone && err?.error !== 'aborted' && err?.error !== 'not-allowed' && isMicActiveRef.current && !isMutedRef.current && !isInterviewerSpeakingRef.current) {
          setTimeout(() => {
            startFreshRecognition();
          }, 350);
        }
      };

      try {
        recognition.start();
      } catch (err) {
        isRecognitionRunningRef.current = false;
        isRecognitionStartingRef.current = false;
        console.warn('Recognition start notice:', err);
      }
    } catch (e) {
      isRecognitionRunningRef.current = false;
      isRecognitionStartingRef.current = false;
      console.warn('SpeechRecognition setup notice:', e);
    }
  };

  // INTERVIEWER VIDEO EVENT HANDLERS
  const handleInterviewerVideoEnd = () => {
    setIsInterviewerSpeaking(false);
    isInterviewerSpeakingRef.current = false;
    setIsCandidateSpeaking(false);
    setTimeout(() => {
      startFreshRecognition();
    }, 120);
    startSilenceCountdown();
  };

  const handleInterviewerVideoPlay = () => {
    setIsInterviewerSpeaking(true);
    isInterviewerSpeakingRef.current = true;
    // Pada HandPhone, lepaskan stream audio mic saat video interviewer berputar agar suara video keluar penuh di Loudspeaker
    if (isHandPhoneDevice() && audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((t) => t.stop());
      audioStreamRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch (_) {}
      isRecognitionRunningRef.current = false;
    }
  };

  // FUNGSI INTI: INTERVIEWER LANGSUNG BERBICARA (MENGGUNAKAN VIDEO ADMIN1 ATAU TTS SEBAGAI CADANGAN)
  const speakQuestion = (isRepeating = false) => {
    if (typeof window === 'undefined') return;

    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
    setSilenceCountdown(null);

    // Prioritaskan video rekaman pewawancara (Admin, Accounting, Finance, Sales, GA, Logistik dst)
    const effectiveVideo = currentQuestion.videoUrl || 
      (selectedField === 'admin' ? `/Admin${currentQuestionIndex + 1}.mp4` : 
       selectedField === 'accounting' ? `/Accounting${currentQuestionIndex + 1}.mp4` : 
       selectedField === 'finance' ? `/Finance${currentQuestionIndex + 1}.mp4` :
       selectedField === 'sales' ? `/Sales${currentQuestionIndex + 1}.mp4` :
       selectedField === 'ga' ? `/General${currentQuestionIndex + 1}.mp4` :
       selectedField === 'logistics' ? `/Logistik${currentQuestionIndex + 1}.mp4` :
       '/Logistik1.mp4');

    if (effectiveVideo) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsInterviewerSpeaking(true);
      isInterviewerSpeakingRef.current = true;
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (_) {}
        isRecognitionRunningRef.current = false;
      }
      // Memicu video untuk memutar ulang dari awal dengan suara
      setVideoReplayTrigger((prev) => prev + 1);
      return;
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const text = isRepeating 
        ? `Maaf, saya belum mendengar suara jawaban Anda. ${currentQuestion.questionText}`
        : currentQuestion.questionText;

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsInterviewerSpeaking(true);
        isInterviewerSpeakingRef.current = true;
        if (recognitionRef.current) {
          try {
            recognitionRef.current.onend = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.abort();
          } catch (_) {}
          isRecognitionRunningRef.current = false;
        }
      };

      let hasFinished = false;
      const onFinishedInterviewerSpeaking = () => {
        if (hasFinished) return;
        hasFinished = true;
        setIsInterviewerSpeaking(false);
        isInterviewerSpeakingRef.current = false;
        setIsCandidateSpeaking(false);
        // Otomatis aktifkan recognition fresh untuk mendengarkan suara kandidat
        setTimeout(() => {
          startFreshRecognition();
        }, 120);
        // Mulai hitung mundur jika kandidat belum mulai menjawab
        startSilenceCountdown();
      };

      utterance.onend = onFinishedInterviewerSpeaking;
      utterance.onerror = onFinishedInterviewerSpeaking;

      // Jaminan keselamatan jika browser membatasi atau gagal menembakkan onend
      const estDurationMs = Math.min(10000, Math.max(3000, text.length * 80));
      setTimeout(() => {
        onFinishedInterviewerSpeaking();
      }, estDurationMs);

      window.speechSynthesis.speak(utterance);
    } else {
      setIsInterviewerSpeaking(true);
      isInterviewerSpeakingRef.current = true;
      setTimeout(() => {
        setIsInterviewerSpeaking(false);
        isInterviewerSpeakingRef.current = false;
        setIsCandidateSpeaking(false);
        startFreshRecognition();
        startSilenceCountdown();
      }, 3000);
    }
  };

  // OTOMATIS: Begitu S03 Simulation dibuka atau soal berganti, interviewer langsung berbicara & mic siap mendengarkan setelahnya
  useEffect(() => {
    const existing = candidateAnswers?.[currentQuestionIndex] || candidateAnswersHistory[currentQuestionIndex] || '';
    hasCandidateAnsweredRef.current = !!existing.trim();
    candidateSpeechTextRef.current = existing;
    accumulatedFinalTextRef.current = existing;
    voiceFramesRef.current = 0;
    setCandidateSpeechText(existing);

    // Tandai interviewer sedang berbicara sejak awal soal agar SpeechRecognition tidak menyala sebelum video selesai
    setIsInterviewerSpeaking(true);
    isInterviewerSpeakingRef.current = true;
    if (recognitionRef.current) {
      try {
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.abort();
      } catch (_) {}
      isRecognitionRunningRef.current = false;
    }

    if (!audioStreamRef.current) {
      activateMicrophone();
    }

    return () => {
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      const cur = candidateSpeechTextRef.current.trim();
      if (cur && onSaveAnswer) {
        onSaveAnswer(currentQuestionIndex, cur);
      }
    };
  }, [currentQuestionIndex]);

  // FUNGSI INTI: AKTIFKAN MIKROFON & AUDIO DENGAN PENANGANAN LENGKAP (Sama untuk HandPhone & Notebook)
  const activateMicrophone = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setIsMicActive(true);
        return;
      }

      const onHandPhone = isHandPhoneDevice();
      if (onHandPhone) {
        // Pada HandPhone, jangan tahan stream getUserMedia audio mentah terus-menerus agar
        // SpeechRecognition dapat memakai mikrofon penuh dan speaker video tetap di mode Loudspeaker
        setIsMicActive(true);
        isMicActiveRef.current = true;
        setIsMuted(false);
        isMutedRef.current = false;
        if (!isInterviewerSpeakingRef.current) {
          startFreshRecognition();
        }
        return;
      }

      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }

      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      audioStreamRef.current = audioStream;
      setIsMicActive(true);
      isMicActiveRef.current = true;
      setIsMuted(false);
      isMutedRef.current = false;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close().catch(() => {});
        }
        const audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
        audioCtxRef.current = audioCtx;
        const source = audioCtx.createMediaStreamSource(audioStream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 128;
        analyser.smoothingTimeConstant = 0.3;
        source.connect(analyser);
        analyserRef.current = analyser;

        const pcmData = new Uint8Array(analyser.frequencyBinCount);
        const updateAudio = () => {
          if (analyserRef.current) {
            analyserRef.current.getByteFrequencyData(pcmData);
            let sum = 0;
            for (let i = 0; i < pcmData.length; i++) {
              sum += pcmData[i];
            }
            const avg = sum / pcmData.length;

            // Jika interviewer masih berbicara, abaikan mic agar tidak feedback suara interviewer
            if (isInterviewerSpeakingRef.current) {
              setMicAudioLevel(18 + Math.floor(Math.random() * 4));
              setDecibelLevel(34);
              setIsCandidateSpeaking(false);
              animFrameRef.current = requestAnimationFrame(updateAudio);
              return;
            }

            if (avg > 5) {
              // Suara kandidat terdeteksi masuk ke mic! Update visualisasi audio
              const mapped = Math.min(100, Math.max(35, Math.round(35 + (avg / 120) * 65)));
              setMicAudioLevel(mapped);
              const dB = Math.min(88, Math.max(38, Math.round(38 + (avg / 120) * 48)));
              setDecibelLevel(dB);
              setIsCandidateSpeaking(true);

              // Jika kandidat berbicara ke mic
              if (avg > 6) {
                voiceFramesRef.current += 1;
                markCandidateAnswered();

                // Pastikan recognition sedang aktif mendengarkan suara kandidat
                if (!isRecognitionRunningRef.current && !isInterviewerSpeakingRef.current && !isMutedRef.current) {
                  startFreshRecognition();
                }
              }
            } else {
              setMicAudioLevel(18 + Math.floor(Math.random() * 5));
              setDecibelLevel(36);
              setIsCandidateSpeaking(false);
            }
          }
          animFrameRef.current = requestAnimationFrame(updateAudio);
        };
        animFrameRef.current = requestAnimationFrame(updateAudio);
      }

      if (!isInterviewerSpeakingRef.current) {
        startFreshRecognition();
      }

      if (videoStreamRef.current) {
        const combined = new MediaStream([
          ...audioStream.getAudioTracks(),
          ...videoStreamRef.current.getVideoTracks(),
        ]);
        setMediaStream(combined);
      } else {
        setMediaStream(audioStream);
      }

    } catch (err) {
      console.warn('Microphone activation note:', err);
      setIsMicActive(true);
      setIsMuted(false);
    }
  };

  // FUNGSI INTI: AKTIFKAN KAMERA (WEBCAM)
  const activateCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;

      const videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      videoStreamRef.current = videoStream;
      setIsCameraActive(true);
      setIsVideoStopped(false);

      if (audioStreamRef.current) {
        const combined = new MediaStream([
          ...audioStreamRef.current.getAudioTracks(),
          ...videoStream.getVideoTracks(),
        ]);
        setMediaStream(combined);
      } else {
        setMediaStream(videoStream);
      }

      if (pipVideoRef.current) {
        pipVideoRef.current.srcObject = videoStream;
        pipVideoRef.current.play().catch(() => {});
      }
      if (galleryVideoRef.current) {
        galleryVideoRef.current.srcObject = videoStream;
        galleryVideoRef.current.play().catch(() => {});
      }
    } catch (err) {
      console.warn('Camera activation note:', err);
    }
  };

  // Otomatis aktifkan mikrofon dan kamera saat masuk ke S03, serta pasang pendengar auto-refresh
  useEffect(() => {
    activateMicrophone();
    activateCamera();

    const handleFocusOrVisible = () => {
      if (document.visibilityState === 'visible') {
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume().catch(() => {});
        }
        if (!isHandPhoneDevice() && !isMutedRef.current && isMicActiveRef.current && !isInterviewerSpeakingRef.current) {
          startFreshRecognition();
        }
      }
    };

    const handleGlobalClickToResume = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      if (!isMutedRef.current && isMicActiveRef.current && !isRecognitionRunningRef.current && !isInterviewerSpeakingRef.current) {
        startFreshRecognition();
      }
    };

    window.addEventListener('visibilitychange', handleFocusOrVisible);
    window.addEventListener('focus', handleFocusOrVisible);
    window.addEventListener('click', handleGlobalClickToResume, { passive: true });
    window.addEventListener('touchstart', handleGlobalClickToResume, { passive: true });

    return () => {
      isMicActiveRef.current = false;
      window.removeEventListener('visibilitychange', handleFocusOrVisible);
      window.removeEventListener('focus', handleFocusOrVisible);
      window.removeEventListener('click', handleGlobalClickToResume);
      window.removeEventListener('touchstart', handleGlobalClickToResume);

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (audioStreamRef.current) audioStreamRef.current.getTracks().forEach((t) => t.stop());
      if (videoStreamRef.current) videoStreamRef.current.getTracks().forEach((t) => t.stop());
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') audioCtxRef.current.close().catch(() => {});
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onstart = null;
          recognitionRef.current.onresult = null;
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (_) {}
        recognitionRef.current = null;
      }
    };
  }, []);

  // Hubungkan ulang stream video saat viewMode beralih
  useEffect(() => {
    if (mediaStream && !isVideoStopped) {
      if (pipVideoRef.current && pipVideoRef.current.srcObject !== mediaStream) {
        pipVideoRef.current.srcObject = mediaStream;
        pipVideoRef.current.play().catch(() => {});
      }
      if (galleryVideoRef.current && galleryVideoRef.current.srcObject !== mediaStream) {
        galleryVideoRef.current.srcObject = mediaStream;
        galleryVideoRef.current.play().catch(() => {});
      }
    }
  }, [viewMode, mediaStream, isVideoStopped]);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format timer
  const minutes = Math.floor(secondsElapsed / 60);
  const seconds = secondsElapsed % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // FUNGSI INTI: AKTIFKAN MICROPHONE & RUBAH SUARA MENJADI TEKS DARI KOLOM INTERVIEWEE
  const handleActivateMicAndSTT = async () => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsInterviewerSpeaking(false);
      isInterviewerSpeakingRef.current = false;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      if (silenceIntervalRef.current) {
        clearInterval(silenceIntervalRef.current);
        silenceIntervalRef.current = null;
      }
      setSilenceCountdown(null);

      setIsMuted(false);
      isMutedRef.current = false;
      setIsMicActive(true);
      isMicActiveRef.current = true;

      if (!audioStreamRef.current) {
        await activateMicrophone();
      }

      if (audioStreamRef.current) {
        audioStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = true;
        });
      }

      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }

      isRecognitionRunningRef.current = false;
      isRecognitionStartingRef.current = false;
      startFreshRecognition();
    } catch (err) {
      console.warn('Aktifkan mic error:', err);
    }
  };

  const handleToggleMute = () => {
    if (!isMicActive) {
      activateMicrophone();
      return;
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    isMutedRef.current = nextMuted;
    if (audioStreamRef.current) {
      audioStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
    if (nextMuted) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.onend = null;
          recognitionRef.current.onerror = null;
          recognitionRef.current.abort();
        } catch (_) {}
      }
      isRecognitionRunningRef.current = false;
      isRecognitionStartingRef.current = false;
    } else {
      startFreshRecognition();
    }
  };

  const handleToggleVideo = () => {
    if (!isCameraActive) {
      activateCamera();
      return;
    }
    const nextStopped = !isVideoStopped;
    setIsVideoStopped(nextStopped);
    if (videoStreamRef.current) {
      videoStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !nextStopped;
      });
    }
  };

  const handleNextQuestionOrFinish = () => {
    playSuccessDing();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (silenceIntervalRef.current) clearInterval(silenceIntervalRef.current);

    if (!isProUser && currentQuestionIndex >= 2) {
      onOpenDemoOverlay('paywall');
      return;
    }

    // Rekam jawaban riil interviewee untuk pertanyaan saat ini jika ada
    const currentAnswer = candidateSpeechTextRef.current.trim();
    const updatedAnswers = {
      ...candidateAnswersHistory,
      ...(candidateAnswers || {}),
      ...(currentAnswer ? { [currentQuestionIndex]: currentAnswer } : {})
    };
    setCandidateAnswersHistory(updatedAnswers);
    if (onSaveAnswer && currentAnswer) {
      onSaveAnswer(currentQuestionIndex, currentAnswer);
    }

    if (currentQuestionIndex < fieldQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onFinishSimulation(updatedAnswers);
    }
  };

  const handleTriggerReaction = (emoji: string) => {
    setFloatingReaction(emoji);
    setShowEmojiPicker(false);
    setTimeout(() => setFloatingReaction(null), 2200);
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto px-2 sm:px-4 py-2 space-y-2 animate-fadeIn flex flex-col h-[calc(min(100vh,860px)-75px)] min-h-[720px]">
      {/* Zoom Meeting Top Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-lg">
        {/* Left: Recording & Zoom Meeting ID */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            <span>RECORDING</span>
          </div>

          <div className="text-slate-200 font-semibold hidden sm:flex items-center gap-1.5">
            <span className="text-white font-bold">Zoom Meeting:</span>
            <span>Wawancara {fieldObj.title}</span>
          </div>

          <div className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30 font-mono text-[11px] hidden md:inline-block">
            SOAL {currentQuestionIndex + 1}/10 • {isProUser ? 'PRO' : 'GRATIS'}
          </div>
        </div>

        {/* Center: Meeting Clock & View Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 font-mono text-slate-300 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold">{timeFormatted}</span>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'gallery' : 'speaker')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors ${
              viewMode === 'gallery'
                ? 'bg-blue-600/20 border-blue-500/50 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Ubah Tampilan Zoom (Speaker / Gallery Grid)"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-cyan-400" />
            <span>{viewMode === 'speaker' ? 'Speaker View' : 'Gallery View (2 Grid)'}</span>
          </button>
        </div>

        {/* Right: Demo Overlays Quick Bar */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold hidden md:inline">
            DEMO OVERLAYS:
          </span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-[11px]">
            <button
              onClick={() => onOpenDemoOverlay('paywall')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              01 Paywall
            </button>
            <button
              onClick={() => onOpenDemoOverlay('qris')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              02 QRIS
            </button>
            <button
              onClick={() => onOpenDemoOverlay('paid')}
              className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold border border-emerald-500/30 transition-colors"
            >
              03 Paid
            </button>
            <button
              onClick={() => onOpenDemoOverlay('micAlert')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors"
            >
              04 Mic Alert
            </button>
            <button
              onClick={() => onOpenDemoOverlay('exit')}
              className="px-2 py-0.5 rounded hover:bg-slate-800 text-rose-400 hover:text-rose-300 transition-colors"
            >
              05 Exit
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Left Zoom Meeting Window & Right Real-Time Transcript / AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Zoom Video Call Chamber */}
        <div className={`${isChatOpen ? 'lg:col-span-8' : 'lg:col-span-12'} rounded-2xl bg-slate-950 border border-slate-800 flex flex-col overflow-hidden relative shadow-2xl transition-all duration-300`}>
          {/* Zoom In-Call Header Bar */}
          <div className="px-4 py-2 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-xs z-30">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="font-mono text-slate-300 font-semibold">
                Zoom Meeting #894-320-1129 • Jessica Pratama (Host)
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <Shield className="w-3 h-3" /> End-to-End Encrypted
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isInterviewerSpeaking ? (
                <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Jessica Pratama Sedang Bertanya Langsung
                </span>
              ) : silenceCountdown !== null ? (
                <span className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold animate-pulse">
                  <Timer className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>Menunggu Jawaban Anda ({silenceCountdown}d)...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Jessica Mendengarkan Jawabanmu
                </span>
              )}
            </div>
          </div>

          {/* Video Container (Speaker View vs Gallery View) */}
          <div className="relative flex-1 w-full h-full min-h-[380px] bg-slate-950 overflow-hidden">
            {viewMode === 'speaker' ? (
              /* SPEAKER VIEW: Jessica Pratama as Main Tile + Candidate Live Video PIP */
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Active Speaker Border around Jessica when speaking */}
                <div className={`relative w-full h-full flex items-center justify-center transition-all ${
                  isInterviewerSpeaking ? 'ring-2 ring-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.25)]' : ''
                }`}>
                  <PhotorealisticFemaleAvatar
                    isSpeaking={isInterviewerSpeaking}
                    videoUrl={
                      currentQuestion.videoUrl || 
                      (selectedField === 'admin' ? `/Admin${currentQuestionIndex + 1}.mp4` : 
                       selectedField === 'accounting' ? `/Accounting${currentQuestionIndex + 1}.mp4` : 
                       selectedField === 'finance' ? `/Finance${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'sales' ? `/Sales${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'ga' ? `/General${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'logistics' ? `/Logistik${currentQuestionIndex + 1}.mp4` :
                       '/Logistik1.mp4')
                    }
                    questionNumber={currentQuestionIndex + 1}
                    onVideoEnd={handleInterviewerVideoEnd}
                    onVideoPlay={handleInterviewerVideoPlay}
                    replayTrigger={videoReplayTrigger}
                  />
                </div>

                {/* Jessica Pratama Zoom Name Badge */}
                <div className="absolute bottom-4 left-4 z-30 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800 text-xs text-white font-medium shadow-xl">
                  <div className="flex items-center gap-1">
                    <Mic className={`w-3.5 h-3.5 ${isInterviewerSpeaking ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {isInterviewerSpeaking && (
                      <div className="flex items-center gap-0.5">
                        <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-4 bg-emerald-400 rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-pulse delay-150" />
                      </div>
                    )}
                  </div>
                  <span className="font-bold">Jessica Pratama</span>
                  <span className="text-[10px] text-slate-400 font-mono">(Interviewer)</span>
                  <Pin className="w-3 h-3 text-slate-400 ml-1" />
                </div>

                {/* Candidate Zoom Picture-in-Picture (PIP) Window with LIVE CAMERA & MIC FEED */}
                <div className="absolute bottom-4 right-4 z-30 w-44 sm:w-60 aspect-[4/3] rounded-xl bg-slate-900/95 border-2 border-emerald-500/60 shadow-2xl overflow-hidden backdrop-blur-md flex flex-col justify-between p-2 group ring-2 ring-emerald-500/20">
                  {/* Candidate Header in PIP */}
                  <div className="flex items-center justify-between text-[11px] z-20 bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    <span className="font-bold text-white font-mono uppercase tracking-wide truncate pr-1 flex items-center gap-1">
                      <span className={`w-2 h-2 rounded-full ${!isMuted ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'}`} />
                      {candidateName || 'JOHAN'} (YOU)
                    </span>
                    <button 
                      onClick={handleToggleMute}
                      title="Klik untuk Mute/Unmute Mikrofon"
                      className="p-1 hover:bg-slate-800 rounded transition-colors"
                    >
                      {isMuted ? (
                        <MicOff className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      ) : (
                        <Mic className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </button>
                  </div>

                  {/* Candidate Real Webcam Live Video Element */}
                  <div className="relative flex-1 w-full h-full my-1 rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center">
                    {!isVideoStopped && mediaStream ? (
                      <video
                        ref={pipVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover transform -scale-x-100"
                      />
                    ) : isVideoStopped ? (
                      <div className="flex flex-col items-center justify-center p-2 text-slate-400">
                        <VideoOff className="w-6 h-6 text-rose-400 mb-1" />
                        <span className="text-[10px] font-mono text-slate-400">Kamera Dimatikan</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-blue-400/40 flex items-center justify-center text-lg font-bold text-white shadow-md">
                          {candidateName ? candidateName.charAt(0).toUpperCase() : 'J'}
                        </div>
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">● Mic Aktif (Live)</span>
                      </div>
                    )}

                    {/* Live Audio Visualizer Overlay on Video */}
                    {!isMuted && (
                      <div className="absolute bottom-1.5 left-2 flex items-center gap-1 z-20 bg-slate-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {[0.4, 0.9, 0.6, 1.0, 0.7].map((barHeight, idx) => (
                          <span
                            key={idx}
                            className="w-1 bg-emerald-400 rounded-full animate-pulse"
                            style={{ height: `${barHeight * 12}px` }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Candidate Status & Decibel in PIP */}
                  <div className="flex items-center justify-between text-[10px] text-slate-300 font-mono bg-slate-950/80 px-2 py-0.5 rounded-md backdrop-blur-sm z-20">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{isMuted ? 'Muted' : `${decibelLevel} dB`}</span>
                    </span>
                    <span
                      className={isMuted ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold flex items-center gap-1'}
                    >
                      {!isMuted && <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />}
                      {isMuted ? 'MUTED' : 'MIC LIVE'}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* GALLERY VIEW: Side-by-Side Dual Tiles (Jessica Pratama & Candidate Live Camera) */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2 w-full h-full">
                {/* Tile 1: Jessica Pratama */}
                <div className={`relative w-full h-full rounded-xl bg-slate-900 overflow-hidden border ${
                  isInterviewerSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg' : 'border-slate-800'
                }`}>
                  <PhotorealisticFemaleAvatar
                    isSpeaking={isInterviewerSpeaking}
                    videoUrl={
                      currentQuestion.videoUrl || 
                      (selectedField === 'admin' ? `/Admin${currentQuestionIndex + 1}.mp4` : 
                       selectedField === 'accounting' ? `/Accounting${currentQuestionIndex + 1}.mp4` : 
                       selectedField === 'finance' ? `/Finance${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'sales' ? `/Sales${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'ga' ? `/General${currentQuestionIndex + 1}.mp4` :
                       selectedField === 'logistics' ? `/Logistik${currentQuestionIndex + 1}.mp4` :
                       '/Logistik1.mp4')
                    }
                    questionNumber={currentQuestionIndex + 1}
                    onVideoEnd={handleInterviewerVideoEnd}
                    onVideoPlay={handleInterviewerVideoPlay}
                    replayTrigger={videoReplayTrigger}
                  />
                  <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-xs text-white font-medium border border-slate-800">
                    <Mic className={`w-3 h-3 ${isInterviewerSpeaking ? 'text-emerald-400' : 'text-slate-400'}`} />
                    <span className="font-bold">Jessica Pratama</span>
                  </div>
                </div>

                {/* Tile 2: Candidate Live Camera Tile */}
                <div className={`relative w-full h-full rounded-xl bg-slate-900 overflow-hidden border flex flex-col items-center justify-center ${
                  !isMuted && !isInterviewerSpeaking ? 'border-emerald-500 ring-2 ring-emerald-500/40' : 'border-slate-800'
                }`}>
                  {!isVideoStopped && mediaStream ? (
                    <video
                      ref={galleryVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : isVideoStopped ? (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="w-20 h-20 rounded-full mx-auto bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 mb-2">
                        <VideoOff className="w-8 h-8" />
                      </div>
                      <h4 className="text-sm font-bold text-white">{candidateName || 'Budi'} (You)</h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">Kamera Dimatikan</p>
                    </div>
                  ) : (
                    <div className="text-center space-y-3">
                      <div className="w-20 h-20 rounded-full mx-auto bg-gradient-to-tr from-blue-700 to-indigo-800 border-2 border-blue-400/50 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {candidateName ? candidateName.charAt(0).toUpperCase() : 'J'}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{candidateName || 'Johan'} (You)</h4>
                        <p className="text-xs text-emerald-400 font-mono mt-0.5">● Terhubung</p>
                      </div>
                      {/* Live Waveform */}
                      <div className="flex items-center justify-center gap-1.5 pt-2">
                        {[0.3, 0.7, 1.0, 0.5, 0.8, 0.4].map((h, i) => (
                          <span
                            key={i}
                            className={`w-1 rounded-full ${isMuted ? 'bg-slate-700 h-1' : 'bg-emerald-400 animate-pulse'}`}
                            style={{ height: isMuted ? '4px' : `${h * 20}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Name badge in Gallery View */}
                  <div className="absolute bottom-3 left-3 z-30 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-xs text-white font-medium border border-slate-800">
                    <button onClick={handleToggleMute} className="flex items-center gap-1">
                      {isMuted ? <MicOff className="w-3 h-3 text-rose-400" /> : <Mic className="w-3 h-3 text-emerald-400" />}
                      <span>{candidateName || 'Budi'} (You)</span>
                    </button>
                    <span className="text-[10px] text-emerald-400 font-mono ml-1">● Live Mic</span>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Zoom Reaction Emoji Overlay */}
            {floatingReaction && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-7xl animate-bounce drop-shadow-2xl">
                {floatingReaction}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: In-Meeting Chat & Real-Time Transcript & AI Coach Guidance */}
        {isChatOpen && (
          <div className="lg:col-span-4 rounded-2xl bg-slate-900/95 border border-slate-800 flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Transkrip & Chat Rapat
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono border border-emerald-500/30">
                MIC REAL-TIME SYNC
              </span>
            </div>

            {/* Transcript Messages Area */}
            <div className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
              {/* Previous Chat exchanges (hanya muncul jika sudah ada soal sebelumnya dan hanya menampilkan jawaban riil interviewee) */}
              {Array.from({ length: currentQuestionIndex }).map((_, prevIdx) => {
                const prevQ = fieldQuestions[prevIdx];
                const prevText = prevQ?.questionText
                  .replace(/{name}/g, activeCandidateName)
                  .replace(/Halo Budi,/g, `Halo ${activeCandidateName},`);
                const prevAnswer = candidateAnswersHistory[prevIdx];

                return (
                  <div key={prevIdx} className="space-y-2 border-b border-slate-800/60 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <span className="font-semibold text-slate-300">● Jessica Pratama (HR) • Soal {prevIdx + 1}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
                        "{prevText}"
                      </div>
                    </div>

                    {prevAnswer && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono">
                          <span className="font-semibold">● {candidateName || 'Kamu'} (Interviewee)</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-blue-950/30 border border-emerald-500/30 text-slate-200 leading-relaxed">
                          "{prevAnswer}"
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Currently Active Question from Jessica */}
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400">
                  <span className="font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    ● Jessica Pratama (HR) • Soal {currentQuestionIndex + 1}/10 Aktif
                  </span>
                  <span>{currentQuestionIndex === 0 ? '00:15' : '08:10'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border-2 border-cyan-500/40 text-white font-medium leading-relaxed shadow-lg shadow-cyan-950/20">
                  "{currentQuestion.questionText}"
                </div>
              </div>

              {/* Candidate live answering input box */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                  <span className="font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Bicaralah langsung ke mikrofon (jawaban otomatis tertranskrip):
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[10px] font-bold">LIVE STT</span>
                    {!isMuted && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {decibelLevel} dB
                      </span>
                    )}
                  </div>
                </div>

                {/* KOTAK JAWABAN YANG DIJAWAB OLEH YANG DI-INTERVIEW */}
                <div className="p-3.5 rounded-xl bg-slate-950 border-2 border-emerald-500/60 shadow-lg shadow-emerald-950/40 space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                        {candidateName ? candidateName.charAt(0).toUpperCase() : 'J'}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block leading-none">
                          {candidateName || 'Johan'} (Interviewee)
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Rubah Suara Menjadi Teks
                        </span>
                      </div>
                    </div>

                    {/* Tombol Aktifkan Microphone & Rubah Suara Menjadi Teks */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleActivateMicAndSTT}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${
                          !isMuted && isMicActive
                            ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50 animate-pulse'
                        }`}
                        title="Klik untuk mengaktifkan mikrofon dan merubah suara Anda menjadi teks"
                      >
                        <Mic className={`w-3.5 h-3.5 ${!isMuted && isMicActive ? 'text-emerald-400' : 'text-white'}`} />
                        <span>
                          {!isMuted && isMicActive
                            ? (isCandidateSpeaking ? '● Suara Sedang Dirubah ke Teks' : 'Microphone Aktif')
                            : 'Aktifkan Microphone'}
                        </span>
                      </button>

                      <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live STT</span>
                      </div>
                    </div>
                  </div>

                  {/* Teks Nyata yang Dijawab oleh Yang Di-interview */}
                  <div className="p-3 rounded-lg bg-slate-900/95 border border-slate-800 text-slate-100 text-xs sm:text-sm font-medium leading-relaxed font-sans shadow-inner min-h-[95px] flex flex-col justify-center">
                    <textarea
                      value={candidateSpeechText}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCandidateSpeechText(val);
                        candidateSpeechTextRef.current = val;
                        accumulatedFinalTextRef.current = val;
                        onSaveAnswer?.(currentQuestionIndex, val);
                        if (val.trim()) {
                          markCandidateAnswered();
                        }
                      }}
                      placeholder="Microphone aktif! Bicaralah sekarang ke mikrofon, suara Anda akan langsung otomatis dirubah menjadi teks di kolom ini..."
                      rows={3}
                      className="w-full bg-transparent border-0 outline-none text-emerald-200 placeholder:text-slate-500 font-medium resize-none text-xs sm:text-sm leading-relaxed"
                    />
                    {candidateSpeechText.trim() ? (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-emerald-400 font-mono mt-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Suara berhasil dirubah menjadi teks ({candidateSpeechText.trim().split(/\s+/).length} kata)</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const sampleAns = currentQuestion.sampleCandidateAnswer;
                              setCandidateSpeechText(sampleAns);
                              candidateSpeechTextRef.current = sampleAns;
                              accumulatedFinalTextRef.current = sampleAns;
                              markCandidateAnswered();
                              onSaveAnswer?.(currentQuestionIndex, sampleAns);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-dotted flex items-center gap-1"
                            title="Ganti dengan contoh jawaban STAR ideal"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Contoh STAR</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setCandidateSpeechText('');
                              candidateSpeechTextRef.current = '';
                              accumulatedFinalTextRef.current = '';
                              voiceFramesRef.current = 0;
                              onSaveAnswer?.(currentQuestionIndex, '');
                              startFreshRecognition();
                            }}
                            className="text-slate-400 hover:text-rose-400 transition-colors underline decoration-dotted"
                            title="Kosongkan kolom dan rekam ulang dari suara"
                          >
                            Kosongkan
                          </button>
                          <span className="text-slate-400">Tersimpan otomatis</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-500 font-mono mt-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-slate-300 font-sans">
                            {isCandidateSpeaking
                              ? '● Suara terdeteksi... sedang otomatis dirubah menjadi teks'
                              : 'Bicaralah ke mic atau ketik jawaban Anda'}
                          </span>
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const sampleAns = currentQuestion.sampleCandidateAnswer;
                              setCandidateSpeechText(sampleAns);
                              candidateSpeechTextRef.current = sampleAns;
                              accumulatedFinalTextRef.current = sampleAns;
                              markCandidateAnswered();
                              onSaveAnswer?.(currentQuestionIndex, sampleAns);
                            }}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors underline decoration-dotted flex items-center gap-1"
                            title="Klik untuk mengisi contoh jawaban STAR ideal"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Gunakan Contoh STAR</span>
                          </button>
                          <span className="text-emerald-400/90 font-medium">● Real-time STT</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div ref={transcriptEndRef} />
            </div>
          </div>
        )}
      </div>

      {/* Authentic Zoom Control Bottom Footer Bar */}
      <div className="px-3 sm:px-5 py-2 rounded-2xl bg-[#090d16] border border-slate-800 flex items-center justify-between shadow-2xl">
        {/* Left Zoom Controls: Audio / Video / Security / Members */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mute Button with Caret */}
          <div className="relative flex items-center">
            <button
              onClick={handleToggleMute}
              className={`flex flex-col items-center justify-center w-14 sm:w-16 h-12 rounded-xl text-xs font-semibold transition-all relative ${
                isMuted
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
              }`}
              title={isMuted ? 'Nyalakan Mikrofon (Unmute)' : 'Mute Mikrofon'}
            >
              {isMuted ? <MicOff className="w-4 h-4 mb-0.5 text-rose-400" /> : <Mic className="w-4 h-4 mb-0.5 text-emerald-400" />}
              <span className="text-[9px] uppercase font-mono font-bold">{isMuted ? 'UNMUTE' : 'MUTE'}</span>
              {!isMuted && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* Video Toggle Button with Caret */}
          <button
            onClick={handleToggleVideo}
            className={`flex flex-col items-center justify-center w-14 sm:w-16 h-12 rounded-xl text-xs font-semibold transition-all ${
              isVideoStopped
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
            }`}
            title={isVideoStopped ? 'Nyalakan Kamera Video' : 'Kamera Aktif (Klik untuk Stop Video)'}
          >
            {isVideoStopped ? <VideoOff className="w-4 h-4 mb-0.5 text-rose-400" /> : <Video className="w-4 h-4 mb-0.5 text-emerald-400" />}
            <span className="text-[9px] uppercase font-mono font-bold">{isVideoStopped ? 'START' : 'STOP VIDEO'}</span>
            {!isVideoStopped && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>

          {/* Security Shield */}
          <button
            onClick={() => onOpenDemoOverlay('micAlert')}
            className="hidden md:flex flex-col items-center justify-center w-14 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors"
            title="Pengaturan Keamanan Audio & Enkripsi"
          >
            <Shield className="w-4 h-4 mb-0.5 text-emerald-400" />
            <span className="text-[9px] uppercase font-mono">SECURITY</span>
          </button>

          {/* Participants */}
          <button
            onClick={() => setViewMode(viewMode === 'speaker' ? 'gallery' : 'speaker')}
            className="hidden md:flex flex-col items-center justify-center w-16 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold transition-colors relative"
            title="Daftar Peserta Rapat (2 Orang)"
          >
            <Users className="w-4 h-4 mb-0.5 text-cyan-400" />
            <span className="text-[9px] uppercase font-mono">MEMBERS</span>
            <span className="absolute top-1.5 right-2 text-[9px] font-bold text-white bg-blue-600 rounded-full px-1">2</span>
          </button>

          {/* Chat Toggle */}
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`hidden sm:flex flex-col items-center justify-center w-14 h-12 rounded-xl border text-xs font-semibold transition-colors ${
              isChatOpen
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
            }`}
            title="Buka/Tutup Panel Transkrip & Chat"
          >
            <MessageSquare className="w-4 h-4 mb-0.5 text-blue-400" />
            <span className="text-[9px] uppercase font-mono">CHAT</span>
          </button>
        </div>

        {/* Center Primary Action: Selesai Menjawab Saja (Tanpa tombol Dengarkan Jessica) */}
        {/* Center Primary Action: Selesai Menjawab / Lanjut & Langsung Diagnostik */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNextQuestionOrFinish}
            className="flex items-center gap-2 px-5 sm:px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {currentQuestionIndex < fieldQuestions.length - 1 ? 'Selesai Menjawab (Lanjut)' : 'Selesai & Diagnostik'}
            </span>
          </button>

          {/* Tombol Langsung Diagnostik Kapan Saja */}
          <button
            onClick={() => {
              const currentAnswer = candidateSpeechTextRef.current.trim();
              const updatedAnswers = {
                ...candidateAnswersHistory,
                ...(candidateAnswers || {}),
                ...(currentAnswer ? { [currentQuestionIndex]: currentAnswer } : {})
              };
              setCandidateAnswersHistory(updatedAnswers);
              if (onSaveAnswer && currentAnswer) {
                onSaveAnswer(currentQuestionIndex, currentAnswer);
              }
              onFinishSimulation(updatedAnswers);
            }}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 hover:border-cyan-500/60 text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer"
            title="Selesaikan wawancara sekarang dan langsung hitung persentase diagnostik nyata"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Selesai &</span>
            <span>Lihat Diagnostik</span>
          </button>
        </div>

        {/* Right Zoom Controls: Reactions & End Call */}
        <div className="flex items-center gap-1.5 sm:gap-2 relative">
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex flex-col items-center justify-center w-12 sm:w-14 h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-semibold transition-colors"
              title="Kirim Reaksi Emosi Zoom"
            >
              <Smile className="w-4 h-4 mb-0.5 text-amber-400" />
              <span className="text-[9px] uppercase font-mono">REACTION</span>
            </button>

            {/* Reaction popup (Zoom authentic icons) */}
            {showEmojiPicker && (
              <div className="absolute bottom-14 right-0 p-2 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl flex items-center gap-2 z-50 animate-fadeIn">
                {[
                  { emoji: '👏', label: 'Tepuk Tangan' },
                  { emoji: '👍', label: 'Jempol' },
                  { emoji: '❤️', label: 'Suka' },
                  { emoji: '😂', label: 'Tertawa' },
                  { emoji: '😮', label: 'Takjub' },
                  { emoji: '🎉', label: 'Selamat' },
                ].map((item) => (
                  <button
                    key={item.emoji}
                    onClick={() => handleTriggerReaction(item.emoji)}
                    title={item.label}
                    className="p-1.5 hover:bg-slate-800 rounded-xl text-xl transition-transform hover:scale-125"
                  >
                    {item.emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => onOpenDemoOverlay('exit')}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 h-12 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-xs transition-colors shadow-lg shadow-rose-600/25"
            title="Keluar / Akhiri Rapat Zoom"
          >
            <PhoneOff className="w-4 h-4" />
            <span className="hidden sm:inline">End Meeting</span>
          </button>
        </div>
      </div>
    </div>
  );
};
