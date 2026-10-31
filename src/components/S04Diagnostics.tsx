import React, { useState, useEffect, useMemo } from 'react';
import { 
  JobFieldId 
} from '../types/interview';
import { JOB_FIELDS } from '../data/mockData';
import { 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  Lightbulb, 
  ShieldCheck, 
  ArrowRight,
  Cpu,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  TrendingUp,
  Check
} from 'lucide-react';
import { playSuccessDing } from '../utils/soundEffects';
import { evaluateInterviewAnswers } from '../utils/evaluationEngine';

interface S04DiagnosticsProps {
  candidateName: string;
  selectedField: JobFieldId;
  onViewReport: () => void;
  onGoToScorecard?: () => void;
  candidateAnswers?: Record<number, string>;
}

export const S04Diagnostics: React.FC<S04DiagnosticsProps> = ({
  candidateName,
  selectedField,
  onViewReport,
  onGoToScorecard,
  candidateAnswers = {},
}) => {
  const fieldObj = JOB_FIELDS.find((f) => f.id === selectedField) || JOB_FIELDS[1];

  // Hitung evaluasi persentase riil berdasarkan jawaban yang di-interview
  const evalResult = useMemo(() => {
    return evaluateInterviewAnswers(candidateAnswers, selectedField, candidateName || 'Johan');
  }, [candidateAnswers, selectedField, candidateName]);

  const targetPercent = evalResult.overallScore;
  const startPercent = Math.max(10, targetPercent - 22);

  const [percent, setPercent] = useState(startPercent);
  const [phase3Status, setPhase3Status] = useState<'calculating' | 'done'>('calculating');
  const [phase4Status, setPhase4Status] = useState<'waiting' | 'done'>('waiting');
  const [showAnswerDetails, setShowAnswerDetails] = useState(false);

  useEffect(() => {
    // Animasi progress menuju nilai persentase evaluasi riil
    const step = targetPercent >= startPercent ? 1 : -1;
    const interval = setInterval(() => {
      setPercent((prev) => {
        if ((step > 0 && prev < targetPercent) || (step < 0 && prev > targetPercent)) {
          return prev + step;
        }
        clearInterval(interval);
        return targetPercent;
      });
    }, 60);

    const timer1 = setTimeout(() => {
      setPhase3Status('done');
      setPhase4Status('done');
      playSuccessDing();
    }, 1600);

    return () => {
      clearInterval(interval);
      clearTimeout(timer1);
    };
  }, [targetPercent, startPercent]);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Cpu className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white tracking-tight">
              INTERVIEW AI
            </h2>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold block">
              NEURAL DIAGNOSTIC CHAMBER
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {candidateName || 'Johan'} / {fieldObj.title} / {evalResult.isCustomAnswered ? `${evalResult.answeredCount} Soal Terjawab` : '10 Soal Lengkap'}
          </span>
        </div>
      </div>

      {/* Center Circular Progress Ring */}
      <div className="flex flex-col items-center justify-center py-2 space-y-4">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Neon Radial Aura */}
          <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

          {/* SVG Progress Circle */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            {/* Dashed outer technical ring */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
              strokeDasharray="4 6"
            />
            {/* Active Progress Ring */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#blueCyanGrad)"
              strokeWidth="10"
              strokeDasharray={2 * Math.PI * 80}
              strokeDashoffset={2 * Math.PI * 80 * (1 - percent / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
            <defs>
              <linearGradient id="blueCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Text inside Circle */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <div className="text-5xl sm:text-6xl font-black text-white tracking-tight font-sans">
              {percent}<span className="text-3xl text-cyan-400 font-bold">%</span>
            </div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-bold mt-1">
              {phase3Status === 'calculating' ? 'MENGANALISIS PERFORMA...' : 'SKOR HASIL INTERVIEW'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono mt-0.5">
              {evalResult.isCustomAnswered 
                ? `${evalResult.answeredCount} DARI ${evalResult.totalQuestions} JAWABAN TERANALISIS` 
                : 'STANDAR BENCHMARK TIER-1'}
            </span>
          </div>
        </div>

        {/* Live 4-Pilar STAR Score Quick Bar */}
        <div className="w-full max-w-xl grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Situation</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{evalResult.situationScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${evalResult.situationScore}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Task</span>
            <span className="text-lg font-black text-blue-400 font-mono">{evalResult.taskScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-blue-400 h-full rounded-full" style={{ width: `${evalResult.taskScore}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Action</span>
            <span className="text-lg font-black text-purple-400 font-mono">{evalResult.actionScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-purple-400 h-full rounded-full" style={{ width: `${evalResult.actionScore}%` }} />
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">Result</span>
            <span className="text-lg font-black text-amber-400 font-mono">{evalResult.resultScore}%</span>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-amber-400 h-full rounded-full" style={{ width: `${evalResult.resultScore}%` }} />
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs">
          <Award className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-white font-bold">{evalResult.verdict}</span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-mono font-semibold">{evalResult.tier}</span>
        </div>
      </div>

      {/* Status STAR Rubric Engine Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <h3 className="text-sm font-bold text-white">Status STAR Rubric Engine</h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {evalResult.isCustomAnswered ? 'Evaluasi Transkrip Nyata' : 'Phase 4 of 4'}
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Step 1 */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">
                  {evalResult.isCustomAnswered 
                    ? `Transkrip ${evalResult.answeredCount} Pertanyaan Terverifikasi`
                    : 'Transkrip 10 Pertanyaan berhasil diarsip'}
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {evalResult.isCustomAnswered
                    ? `${evalResult.answeredCount} rekaman suara/teks jawaban Anda dipadankan ke rubrik STAR`
                    : '10/10 rekaman audio terkonversi presisi'}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">DONE</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">
                  Analisis 4 Pilar STAR & Gaya Komunikasi
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {evalResult.keyStrength}
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400">DONE</span>
          </div>

          {/* Step 3 */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-start gap-2.5">
              {phase3Status === 'calculating' ? (
                <RefreshCw className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className={`font-semibold ${phase3Status === 'calculating' ? 'text-amber-300' : 'text-slate-200'}`}>
                  Skor Akurasi STAR: {evalResult.overallScore}% ({evalResult.tier})
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Tingkat kesesuaian posisi {fieldObj.title}: <strong className="text-emerald-400">{evalResult.verdict}</strong>
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold ${phase3Status === 'calculating' ? 'text-amber-400' : 'text-emerald-400'}`}>
              {phase3Status === 'calculating' ? 'CALCULATING' : 'DONE'}
            </span>
          </div>

          {/* Step 4 */}
          <div className="flex items-start justify-between gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-start gap-2.5">
              {phase4Status === 'waiting' ? (
                <Clock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className={`font-semibold ${phase4Status === 'waiting' ? 'text-slate-400' : 'text-slate-200'}`}>
                  Julukan Dominan: "{evalResult.dominantPersonaTitle}"
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Scorecard viral & Star Report siap diekspor ke WhatsApp / IG Story
                </p>
              </div>
            </div>
            <span className={`text-xs font-mono font-bold ${phase4Status === 'waiting' ? 'text-slate-500' : 'text-emerald-400'}`}>
              {phase4Status === 'waiting' ? 'WAITING' : 'DONE'}
            </span>
          </div>
        </div>

        {/* Accordion Rincian Jawaban jika ada jawaban riil */}
        {evalResult.evaluations.length > 0 && (
          <div className="pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setShowAnswerDetails(!showAnswerDetails)}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold transition-colors"
            >
              <span className="flex items-center gap-2 text-cyan-300">
                <FileText className="w-3.5 h-3.5" />
                <span>Lihat Evaluasi per Soal yang Anda Jawab ({evalResult.evaluations.length} Soal)</span>
              </span>
              {showAnswerDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAnswerDetails && (
              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {evalResult.evaluations.map((item) => (
                  <div key={item.questionNumber} className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Soal #{item.questionNumber}</span>
                      <span className="font-mono font-bold text-cyan-400">{item.overallScore}%</span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      Q: "{item.questionText}"
                    </p>
                    <div className="p-2 rounded bg-slate-900 text-slate-200 text-[11px]">
                      <span className="text-[10px] text-emerald-400 font-mono block mb-0.5">Jawaban Anda ({item.wordCount} kata):</span>
                      <p className="line-clamp-2">{item.candidateAnswer}</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span>S: {item.situationScore}% | T: {item.taskScore}% | A: {item.actionScore}% | R: {item.resultScore}%</span>
                      <span className="text-cyan-400">{item.feedback}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* STAR Insight & Tips Card */}
      <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/30 flex items-start gap-3 text-xs text-slate-300">
        <div className="p-2 rounded-lg bg-blue-500/20 text-cyan-400 shrink-0">
          <Lightbulb className="w-4 h-4" />
        </div>
        <div>
          <span className="font-bold text-cyan-300 block mb-0.5">
            STAR RECOMENDATION & FEEDBACK
          </span>
          <p className="text-slate-300 leading-relaxed">
            {evalResult.keyImprovement}
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>Enkripsi 256-bit • STAR Neural Evaluator</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {onGoToScorecard && (
            <button
              onClick={onGoToScorecard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-pink-400 animate-spin" />
              <span>Langsung Scorecard Gaul 9:16</span>
            </button>
          )}

          <button
            onClick={onViewReport}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Lihat Laporan Evaluasi Lengkap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

