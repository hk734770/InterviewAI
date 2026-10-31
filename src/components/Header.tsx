import React, { useState } from 'react';
import { StepId } from '../types/interview';
import { Bot, Radio, Share2, Check, ExternalLink, Database, Download } from 'lucide-react';

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

export const Header: React.FC<HeaderProps> = ({ currentStep, onSelectStep }) => {
  const [isCopied, setIsCopied] = useState(false);

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
    <header className="sticky top-0 z-40 w-full bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
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
        <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner overflow-x-auto max-w-2xl">
          {STEPS.map((step) => {
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
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
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Tombol Download File .SQL */}
          <a
            href="/interviewai_schema.sql"
            download="interviewai_schema.sql"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 active:scale-95"
            title="Download file database .sql (PostgreSQL / MySQL Schema)"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Download .SQL</span>
            <span className="sm:hidden">.SQL</span>
          </a>

          {/* Tombol Bagikan Link Publik */}
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${
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
            <div className="relative">
              <div className="w-8 h-8 rounded-full ring-2 ring-blue-500/30 overflow-hidden bg-slate-800 flex items-center justify-center">
                <span className="text-xs font-bold text-cyan-300">RS</span>
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-tight">HR Partner AI</div>
              <div className="text-[10px] text-slate-400 leading-tight">Level 3 Interviewer</div>
            </div>
          </div>
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
  );
};
