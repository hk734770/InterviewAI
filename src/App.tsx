import React, { useState } from 'react';
import { StepId, JobFieldId } from './types/interview';
import { Header } from './components/Header';
import { S01Setup } from './components/S01Setup';
import { S02AVCheck } from './components/S02AVCheck';
import { S03Simulation } from './components/S03Simulation';
import { S04Diagnostics } from './components/S04Diagnostics';
import { S05STARReport } from './components/S05STARReport';
import { S06Scorecard } from './components/S06Scorecard';
import { PaywallModal } from './components/Modals/PaywallModal';
import { QRISModal } from './components/Modals/QRISModal';
import { MicAlertModal } from './components/Modals/MicAlertModal';
import { ExitModal } from './components/Modals/ExitModal';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  const [currentStep, setCurrentStep] = useState<StepId>('S01');
  const [candidateName, setCandidateName] = useState('Johan');
  const [selectedField, setSelectedField] = useState<JobFieldId>('logistics');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Pertanyaan pertama (Question 1)
  const [isProUser, setIsProUser] = useState(false);
  const [hasResumeDraft, setHasResumeDraft] = useState(false);
  const [candidateAnswers, setCandidateAnswers] = useState<Record<number, string>>({});
  const [activeOverlay, setActiveOverlay] = useState<'paywall' | 'qris' | 'paid' | 'micAlert' | 'exit' | null>(null);
  const [toastNotification, setToastNotification] = useState<string | null>(null);

  // Reset flag auto reload ketika berpindah ke step selain S01 agar saat S01 dibuka kembali otomatis reload
  React.useEffect(() => {
    if (currentStep !== 'S01') {
      try {
        sessionStorage.removeItem('s01_setup_auto_reloaded');
      } catch (_) {}
    }
  }, [currentStep]);

  const showToast = (message: string) => {
    setToastNotification(message);
    setTimeout(() => setToastNotification(null), 3500);
  };

  const handleOpenDemoOverlay = (overlay: 'paywall' | 'qris' | 'paid' | 'micAlert' | 'exit') => {
    if (overlay === 'paid') {
      setIsProUser(true);
      showToast('Akses PRO Diaktifkan! Semua 10 pertanyaan terbuka bebas tanpa batas.');
    } else {
      setActiveOverlay(overlay);
    }
  };

  const handlePaymentSuccess = () => {
    setIsProUser(true);
    setActiveOverlay(null);
    showToast('Pembayaran QRIS Berhasil! Sesi Interview PRO 10 Soal Telah Aktif.');
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Global Top Bar */}
      <Header
        currentStep={currentStep}
        onSelectStep={setCurrentStep}
        candidateName={candidateName}
      />

      {/* Toast Notification Banner */}
      {toastNotification && (
        <div className="fixed top-16 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold text-xs shadow-2xl animate-bounce">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{toastNotification}</span>
          <button
            onClick={() => setToastNotification(null)}
            className="p-1 hover:bg-emerald-700 rounded ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Screen Views */}
      <main className="flex-1 w-full">
        {currentStep === 'S01' && (
          <S01Setup
            candidateName={candidateName}
            setCandidateName={setCandidateName}
            selectedField={selectedField}
            setSelectedField={setSelectedField}
            hasResumeDraft={hasResumeDraft}
            onResumeSession={() => {
              setCurrentStep('S03');
              showToast('Melanjutkan sesi tersimpan: Pertanyaan 3 dari 10');
            }}
            onResetSession={() => {
              try {
                sessionStorage.removeItem('s01_setup_auto_reloaded');
              } catch (_) {}
              setHasResumeDraft(false);
              setCandidateAnswers({});
              setCurrentQuestionIndex(0);
              window.location.reload();
            }}
            onStartInterview={() => {
              setCurrentQuestionIndex(0);
              setCurrentStep('S02');
            }}
          />
        )}

        {currentStep === 'S02' && (
          <S02AVCheck
            onBack={() => setCurrentStep('S01')}
            onEnterSimulation={() => {
              setCurrentQuestionIndex(0);
              setCurrentStep('S03');
            }}
          />
        )}

        {currentStep === 'S03' && (
          <S03Simulation
            candidateName={candidateName}
            selectedField={selectedField}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            isProUser={isProUser}
            onOpenDemoOverlay={handleOpenDemoOverlay}
            candidateAnswers={candidateAnswers}
            onSaveAnswer={(idx, text) => {
              setCandidateAnswers((prev) => ({ ...prev, [idx]: text }));
            }}
            onFinishSimulation={(finalAnswers) => {
              if (finalAnswers) {
                setCandidateAnswers(finalAnswers);
              }
              setCurrentStep('S04');
            }}
          />
        )}

        {currentStep === 'S04' && (
          <S04Diagnostics
            candidateName={candidateName}
            selectedField={selectedField}
            candidateAnswers={candidateAnswers}
            onViewReport={() => setCurrentStep('S05')}
            onGoToScorecard={() => setCurrentStep('S06')}
          />
        )}

        {currentStep === 'S05' && (
          <S05STARReport
            candidateName={candidateName}
            selectedField={selectedField}
            candidateAnswers={candidateAnswers}
            onRetakeInterview={() => {
              setCurrentQuestionIndex(0);
              setCurrentStep('S01');
            }}
            onGoToScorecard={() => setCurrentStep('S06')}
          />
        )}

        {currentStep === 'S06' && (
          <S06Scorecard
            candidateName={candidateName}
            selectedField={selectedField}
            candidateAnswers={candidateAnswers}
            onBackToReport={() => setCurrentStep('S05')}
          />
        )}
      </main>

      {/* Demo Overlays Modals */}
      <PaywallModal
        isOpen={activeOverlay === 'paywall'}
        onClose={() => setActiveOverlay(null)}
        onProceedToQRIS={() => setActiveOverlay('qris')}
        candidateName={candidateName}
      />

      <QRISModal
        isOpen={activeOverlay === 'qris'}
        onClose={() => setActiveOverlay(null)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <MicAlertModal
        isOpen={activeOverlay === 'micAlert'}
        onClose={() => setActiveOverlay(null)}
        onRetestMic={() => {
          setActiveOverlay(null);
          setCurrentStep('S02');
        }}
      />

      <ExitModal
        isOpen={activeOverlay === 'exit'}
        onClose={() => setActiveOverlay(null)}
        onConfirmExit={() => {
          setActiveOverlay(null);
          setCurrentStep('S01');
        }}
        onSaveDraftAndExit={() => {
          setHasResumeDraft(true);
          setActiveOverlay(null);
          setCurrentStep('S01');
          showToast('Draft wawancara berhasil disimpan secara lokal.');
        }}
      />

      {/* Global Footer (Visible on S01, S02, S04, S05, S06) */}
      {currentStep !== 'S03' && (
        <footer className="w-full border-t border-slate-900 bg-[#060a12] py-4 px-6 text-xs text-slate-500 font-mono mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <span>© 2025 AI Interview Simulation System • STAR Matrix v4.2</span>
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Voice Decibel Engine Connected</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
