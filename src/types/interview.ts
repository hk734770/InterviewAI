export type StepId = 'S01' | 'S02' | 'S03' | 'S04' | 'S05' | 'S06';

export type JobFieldId = 'admin' | 'accounting' | 'finance' | 'sales' | 'ga' | 'logistics';

export interface JobField {
  id: JobFieldId;
  title: string;
  subtitle: string;
  iconName: string;
}

export interface InterviewQuestion {
  id: number;
  questionNumber: number;
  category: string;
  questionText: string;
  sampleCandidateAnswer: string;
  aiCoachTip: string;
  score: number;
  pacingWpm: number;
  hesitationRate: string;
  videoUrl?: string;
}

export interface InterviewState {
  candidateName: string;
  selectedField: JobFieldId;
  currentStep: StepId;
  currentQuestionIndex: number;
  isRecording: boolean;
  isMuted: boolean;
  isVideoStopped: boolean;
  activeDemoOverlay: 'paywall' | 'qris' | 'paid' | 'micAlert' | 'exit' | null;
  isProUser: boolean;
  hasResumeDraft: boolean;
  vibeTemplate: 'neon' | 'midnight' | 'sunset';
  showSafeZones: boolean;
  micInputLevel: number; // 0 to 100
  isInterviewerSpeaking: boolean;
  transcriptHistory: Array<{
    sender: 'interviewer' | 'candidate';
    text: string;
    timestamp: string;
  }>;
}

export interface StarMetrics {
  situation: { score: number; status: string; comment: string };
  task: { score: number; status: string; comment: string };
  action: { score: number; status: string; comment: string };
  result: { score: number; status: string; comment: string };
}
