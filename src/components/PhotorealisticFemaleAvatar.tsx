import React, { useState, useEffect, useRef } from 'react';
import { 
  Pin, 
  MoreHorizontal, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Play, 
  Video as VideoIcon,
  Headphones,
  Sparkles
} from 'lucide-react';

export interface PhotorealisticFemaleAvatarProps {
  isSpeaking: boolean;
  className?: string;
  videoUrl?: string;
  questionNumber?: number;
  onVideoEnd?: () => void;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  replayTrigger?: number;
  interviewerName?: string;
}

export const PhotorealisticFemaleAvatar: React.FC<PhotorealisticFemaleAvatarProps> = ({
  isSpeaking,
  className = '',
  videoUrl = '/Logistik1.mp4',
  questionNumber = 1,
  onVideoEnd,
  onVideoPlay,
  onVideoPause,
  replayTrigger = 0,
  interviewerName = 'Jessica Pratama',
}) => {
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback high-def photo in case video cannot be loaded
  const fallbackPhoto = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80';

  // Effective video source
  const effectiveSrc = videoUrl || '/Logistik1.mp4';

  // Attempt video playback whenever source or replayTrigger changes
  useEffect(() => {
    setVideoError(false);
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = isMuted;

    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsAutoplayBlocked(false);
          setIsVideoPlaying(true);
          onVideoPlay?.();
        })
        .catch((err) => {
          console.warn('Autoplay with sound paused by browser:', err);
          setIsAutoplayBlocked(true);
          setIsVideoPlaying(false);
        });
    }
  }, [effectiveSrc, replayTrigger]);

  // Handle external isSpeaking trigger
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isSpeaking && video.paused) {
      video.muted = isMuted;
      video.play()
        .then(() => {
          setIsAutoplayBlocked(false);
          setIsVideoPlaying(true);
        })
        .catch((err) => {
          console.warn('Play triggered notice:', err);
        });
    }
  }, [isSpeaking, isMuted]);

  // Manual play/unblock click
  const handleUserStartPlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    video.currentTime = 0;
    video.play()
      .then(() => {
        setIsAutoplayBlocked(false);
        setIsVideoPlaying(true);
        onVideoPlay?.();
      })
      .catch((err) => {
        console.error('Manual play error:', err);
      });
  };

  // Replay question video
  const handleReplayVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.muted = isMuted;
    video.play()
      .then(() => {
        setIsAutoplayBlocked(false);
        setIsVideoPlaying(true);
        onVideoPlay?.();
      })
      .catch((err) => {
        console.error('Replay error:', err);
      });
  };

  // Toggle Mute
  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    video.muted = nextMuted;
  };

  const handleVideoEnded = () => {
    setIsVideoPlaying(false);
    onVideoEnd?.();
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    setIsAutoplayBlocked(false);
    onVideoPlay?.();
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
    onVideoPause?.();
  };

  // Extract video label for badge (e.g. Accounting1 / Admin1)
  const videoLabel = effectiveSrc.split('/').pop()?.replace('.mp4', '') || `Interviewer`;

  return (
    <div className={`relative w-full h-full bg-[#080d1a] overflow-hidden flex items-center justify-center select-none ${className}`}>
      {/* Zoom Video Container Frame */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <div 
          className={`relative w-full h-full aspect-[4/3] sm:aspect-video flex items-center justify-center overflow-hidden transition-all duration-300 ${
            isVideoPlaying || isSpeaking ? 'scale-[1.008]' : 'scale-100'
          }`}
        >
          {!videoError ? (
            /* REAL VIDEO INTERVIEWER: Accounting1.mp4 / Admin1.mp4 */
            <video
              ref={videoRef}
              key={effectiveSrc}
              src={effectiveSrc}
              playsInline
              preload="auto"
              muted={isMuted}
              onPlay={handleVideoPlay}
              onPause={handleVideoPause}
              onEnded={handleVideoEnded}
              onError={() => {
                console.warn('Video load fallback triggered for', effectiveSrc);
                setVideoError(true);
              }}
              className="w-full h-full object-cover object-center filter brightness-[1.02] contrast-[1.03]"
            />
          ) : (
            /* Fallback Photo if Video Not Found */
            <img
              src={fallbackPhoto}
              alt={`${interviewerName} - Head of Talent Acquisition`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03]"
            />
          )}

          {/* Video Call Lighting Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/20 pointer-events-none" />

          {/* Autoplay Blocked Overlay Prompt */}
          {isAutoplayBlocked && (
            <div className="absolute inset-0 z-40 bg-slate-950/75 backdrop-blur-sm flex flex-col items-center justify-center p-4 animate-fadeIn">
              <div className="max-w-md w-full bg-slate-900/90 border border-emerald-500/50 rounded-2xl p-5 shadow-2xl flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 animate-pulse">
                  <Play className="w-7 h-7 ml-1 fill-emerald-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Putar Video Wawancara
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Klik tombol di bawah agar suara & video {interviewerName} langsung berjalan aktif.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleUserStartPlay}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>Mulai Putar Video</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Right Floating Controls: Zoom Tile Pin, Volume, & Replay */}
      <div className="absolute top-3 right-3 z-30 flex items-center gap-1.5">
        {/* Replay Video Button */}
        <button
          type="button"
          onClick={handleReplayVideo}
          title="Ulangi Interview"
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 hover:bg-slate-850 backdrop-blur-md border border-slate-700/60 text-xs text-slate-200 hover:text-white shadow-md transition-all active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] hidden sm:inline">Ulangi Interview</span>
        </button>

        {/* Video Audio Mute/Unmute */}
        <button
          type="button"
          onClick={handleToggleMute}
          title={isMuted ? 'Nyalakan Suara Video' : 'Bisukan Suara Video'}
          className={`p-1.5 rounded-lg backdrop-blur-md border text-xs shadow-md transition-all ${
            isMuted 
              ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
              : 'bg-slate-900/85 hover:bg-slate-800 border-slate-700/60 text-slate-200'
          }`}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
        </button>

        {/* Zoom Tile Actions */}
        <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2 py-1.5 rounded-lg border border-slate-700/60 text-slate-400">
          <Pin className="w-3 h-3" />
          <MoreHorizontal className="w-3 h-3" />
        </div>
      </div>

      {/* Bottom Floating Equalizer: Active Speaking Wave vs Listening Status */}
      {isVideoPlaying || isSpeaking ? (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/90 border border-emerald-500/60 backdrop-blur-md shadow-2xl shadow-emerald-500/20 animate-fadeIn">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider uppercase">
            {interviewerName} Sedang Berbicara
          </span>
          <div className="flex items-center gap-1 ml-1">
            {[12, 22, 10, 26, 18, 14, 24, 16, 20, 8].map((barHeight, idx) => (
              <span
                key={idx}
                className="w-1 bg-gradient-to-t from-emerald-500 to-cyan-400 rounded-full animate-pulse"
                style={{
                  height: `${barHeight}px`,
                  animationDuration: '450ms',
                  animationDelay: `${idx * 70}ms`,
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-cyan-500/40 backdrop-blur-md shadow-lg text-[11px] font-medium text-cyan-300">
          <Headphones className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>{interviewerName} Mendengarkan Jawabanmu...</span>
        </div>
      )}
    </div>
  );
};
