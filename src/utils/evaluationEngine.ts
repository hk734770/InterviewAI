import { JobFieldId, InterviewQuestion } from '../types/interview';
import { getQuestionsForField } from '../data/mockData';

export interface QuestionEvaluation {
  questionIndex: number;
  questionNumber: number;
  questionText: string;
  candidateAnswer: string;
  wordCount: number;
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  overallScore: number;
  hasSituation: boolean;
  hasTask: boolean;
  hasAction: boolean;
  hasResult: boolean;
  hasMetrics: boolean;
  feedback: string;
}

export interface EvaluationResult {
  overallScore: number; // 0 - 100
  situationScore: number;
  taskScore: number;
  actionScore: number;
  resultScore: number;
  answeredCount: number;
  totalQuestions: number;
  isCustomAnswered: boolean;
  tier: string;
  verdict: string;
  dominantPersonaTitle: string;
  dominantPersonaQuote: string;
  dominantPersonaComment: string;
  keyStrength: string;
  keyImprovement: string;
  evaluations: QuestionEvaluation[];
}

// Keywords untuk deteksi 4 Pilar STAR dalam Bahasa Indonesia & Inggris (Lengkap & Adaptif)
const SITUATION_KEYWORDS = [
  'ketika', 'saat', 'waktu', 'perusahaan', 'proyek', 'masalah', 'kendala', 
  'situasi', 'tantangan', 'kondisi', 'latar belakang', 'departemen', 'divisi', 
  'klien', 'sebelumnya', 'pengalaman', 'tahun lalu', 'kasus', 'menghadapi',
  'dulu', 'sewaktu', 'posisi', 'kantor', 'organisasi', 'tim', 'peran saya',
  'saat bekerja', 'pernah', 'terjadi', 'menemui', 'kondisinya', 'kejadian',
  'saat saya menjabat', 'lingkungan kerja', 'waktu itu',
  'when', 'during', 'company', 'project', 'challenge', 'situation', 'background'
];

const TASK_KEYWORDS = [
  'tugas', 'tanggung jawab', 'peran', 'target', 'objektif', 'tujuan', 
  'diminta', 'diberikan', 'kewajiban', 'jobdesk', 'deadline', 'tenggat', 
  'harus', 'prioritas', 'wewenang', 'fokus', 'goal', 'responsibility', 'assigned',
  'tupoksi', 'arahan', 'atasan', 'diminta manager', 'sop', 'ekspektasi', 'kuota',
  'mandat', 'kewajiban saya', 'diminta pimpinan', 'ditargetkan', 'instruksi'
];

const ACTION_KEYWORDS = [
  'saya', 'melakukan', 'langkah', 'strategi', 'menganalisis', 'membuat', 
  'menerapkan', 'menggunakan', 'berkoordinasi', 'berdiskusi', 'memeriksa', 
  'mengecek', 'inisiatif', 'solusi', 'mengembangkan', 'memperbaiki', 
  'menangani', 'excel', 'software', 'sistem', 'sop', 'metode', 'proses', 
  'pendekatan', 'menyusun', 'menginput', 'memproses', 'menjalankan', 'mengatasi', 
  'membantu', 'mengoptimalkan', 'mempersiapkan', 'menghubungi', 'mendesain',
  'i did', 'implemented', 'coordinated', 'analyzed', 'developed', 'action'
];

const RESULT_KEYWORDS = [
  'hasilnya', 'berhasil', 'mencapai', 'meningkat', 'menurun', 'efisiensi', 
  'persen', '%', 'angka', 'waktu', 'selesai', 'sukses', 'apresiasi', 
  'profit', 'omzet', 'dampak', 'penghematan', 'rekomendasi', 'tepat waktu', 
  'zero error', 'target tercapai', 'puas', 'penghargaan', 'berkurang', 'hemat', 
  'lancar', 'tercapai', 'pertumbuhan', 'untung', 'apresiasi pimpinan',
  'result', 'achieved', 'increased', 'saved', 'outcome'
];

// Kata kunci spesifik bidang pekerjaan (Job Track)
const FIELD_KEYWORDS: Record<JobFieldId, string[]> = {
  accounting: [
    'jurnal', 'debet', 'kredit', 'neraca', 'laba rugi', 'psak', 'pajak', 
    'faktur', 'rekonsiliasi', 'audit', 'closing', 'ppn', 'pph', 'ledger', 
    'buku besar', 'efaktur', 'accrual', 'cash basis', 'depresiasi', 'akuntansi', 'laporan'
  ],
  finance: [
    'cash flow', 'arus kas', 'anggaran', 'budget', 'investasi', 'roi', 
    'ebitda', 'analisis rasio', 'likuiditas', 'profitabilitas', 'forecasting', 
    'peramalan', 'working capital', 'treasury', 'valuasi', 'finansial', 'modal'
  ],
  admin: [
    'arsip', 'korespondensi', 'agenda', 'notulen', 'surat', 'filing', 
    'database', 'rekap', 'reimbursement', 'atk', 'ekspedisi', 'rapi', 
    'prioritas', 'jadwal', 'dokumen', 'administrasi', 'operasional'
  ],
  sales: [
    'omzet', 'leads', 'prospek', 'closing', 'pipeline', 'negosiasi', 
    'funnel', 'klien', 'kuota', 'pitching', 'follow up', 'presentasi', 
    'customer', 'retensi', 'target', 'penjualan', 'market'
  ],
  ga: [
    'fasilitas', 'maintenance', 'perawatan', 'vendor', 'pengadaan', 
    'kebersihan', 'keamanan', 'operasional', 'kantor', 'gedung', 
    'utilitas', 'inventaris', 'perbaikan', 'logistik gedung'
  ],
  logistics: [
    'gudang', 'stok', 'inventory', 'pengiriman', 'distribusi', 'fifo', 
    'lifo', 'lead time', 'supplier', 'stock opname', 'packing', 
    'armada', 'surat jalan', 'barang masuk', 'barang keluar'
  ]
};

/**
 * Menganalisis 1 jawaban spesifik menggunakan rubrik STAR
 */
export function evaluateSingleAnswer(
  answer: string,
  field: JobFieldId,
  question: InterviewQuestion
): QuestionEvaluation {
  const text = (answer || '').trim();
  const words = text ? text.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;
  const lowerText = text.toLowerCase();

  // 1. Deteksi Kehadiran Indikator STAR
  const hasSituation = SITUATION_KEYWORDS.some((kw) => lowerText.includes(kw));
  const hasTask = TASK_KEYWORDS.some((kw) => lowerText.includes(kw));
  const hasAction = ACTION_KEYWORDS.some((kw) => lowerText.includes(kw));
  const hasResult = RESULT_KEYWORDS.some((kw) => lowerText.includes(kw));
  const hasMetrics = /\d+[\s%]|(\d+)|persen|jam|hari|juta|ribu/i.test(lowerText);

  // 2. Deteksi Kata Kunci Bidang Pekerjaan
  const fieldKeywords = FIELD_KEYWORDS[field] || [];
  const fieldMatches = fieldKeywords.filter((kw) => lowerText.includes(kw)).length;
  const fieldBonus = Math.min(12, fieldMatches * 3);

  // Jika tidak ada jawaban atau sangat pendek (< 3 kata)
  if (wordCount < 3) {
    return {
      questionIndex: question.questionNumber - 1,
      questionNumber: question.questionNumber,
      questionText: question.questionText,
      candidateAnswer: text || '(Tidak ada jawaban terekam)',
      wordCount,
      situationScore: 35,
      taskScore: 35,
      actionScore: 35,
      resultScore: 30,
      overallScore: 34,
      hasSituation: false,
      hasTask: false,
      hasAction: false,
      hasResult: false,
      hasMetrics: false,
      feedback: 'Jawaban terlalu singkat atau belum dijawab. Cobalah uraikan situasi nyata dan tindakan konkrit Anda.'
    };
  }

  // 3. Perhitungan Skor Tiap Pilar STAR
  // Base score berdasarkan panjang & kelengkapan deskripsi
  let lengthBase = 45;
  if (wordCount >= 70) lengthBase = 72;
  else if (wordCount >= 40) lengthBase = 65;
  else if (wordCount >= 20) lengthBase = 58;
  else if (wordCount >= 10) lengthBase = 50;

  // Situation: Latar belakang & konteks masalah
  let sScore = lengthBase + (hasSituation ? 18 : 0) + (wordCount >= 30 ? 6 : 0) + fieldBonus;
  // Task: Peran & tanggung jawab
  let tScore = lengthBase + (hasTask ? 18 : 0) + (wordCount >= 30 ? 6 : 0) + fieldBonus;
  // Action: Langkah konkrit & inisiatif diri
  let aScore = lengthBase + (hasAction ? 18 : 0) + (wordCount >= 35 ? 8 : 0) + fieldBonus;
  // Result: Dampak bisnis & angka terukur
  let rScore = (lengthBase - 5) + (hasResult ? 18 : 0) + (hasMetrics ? 14 : 0) + (wordCount >= 40 ? 5 : 0);

  // Batasi dalam rentang 35 - 98
  sScore = Math.max(35, Math.min(98, Math.round(sScore)));
  tScore = Math.max(35, Math.min(98, Math.round(tScore)));
  aScore = Math.max(35, Math.min(98, Math.round(aScore)));
  rScore = Math.max(30, Math.min(98, Math.round(rScore)));

  const overall = Math.round((sScore * 0.25) + (tScore * 0.25) + (aScore * 0.30) + (rScore * 0.20));

  let feedback = 'Jawaban solid dan terstruktur.';
  if (!hasResult && !hasMetrics) {
    feedback = 'Penyampaian aksi sudah bagus, namun tambahkan hasil akhir terukur (angka/metrik).';
  } else if (!hasSituation) {
    feedback = 'Awali dengan latar belakang konteks situasi yang lebih spesifik.';
  } else if (overall >= 88) {
    feedback = 'Luar biasa! Struktur STAR lengkap dan mencerminkan kompetensi profesional.';
  }

  return {
    questionIndex: question.questionNumber - 1,
    questionNumber: question.questionNumber,
    questionText: question.questionText,
    candidateAnswer: text,
    wordCount,
    situationScore: sScore,
    taskScore: tScore,
    actionScore: aScore,
    resultScore: rScore,
    overallScore: overall,
    hasSituation,
    hasTask,
    hasAction,
    hasResult,
    hasMetrics,
    feedback
  };
}

/**
 * Menghitung skor keseluruhan diagnostik berdasarkan seluruh jawaban yang di-interview
 */
export function evaluateInterviewAnswers(
  candidateAnswers: Record<number, string>,
  selectedField: JobFieldId,
  candidateName: string
): EvaluationResult {
  const fieldQuestions = getQuestionsForField(selectedField);
  const totalQuestions = fieldQuestions.length;

  const answeredIndices = Object.keys(candidateAnswers)
    .map(Number)
    .filter((idx) => (candidateAnswers[idx] || '').trim().length > 0);

  const isCustomAnswered = answeredIndices.length > 0;

  // Jika kandidat sudah menjawab secara riil minimal 1 soal
  if (isCustomAnswered) {
    const questionEvaluations: QuestionEvaluation[] = [];

    // Evaluasi setiap soal yang dijawab
    for (const idx of answeredIndices) {
      const q = fieldQuestions[idx] || fieldQuestions[0];
      const ans = candidateAnswers[idx] || '';
      questionEvaluations.push(evaluateSingleAnswer(ans, selectedField, q));
    }

    // Hitung rata-rata skor dari soal yang telah dijawab
    const avgOverall = Math.round(
      questionEvaluations.reduce((sum, item) => sum + item.overallScore, 0) / questionEvaluations.length
    );
    const avgSituation = Math.round(
      questionEvaluations.reduce((sum, item) => sum + item.situationScore, 0) / questionEvaluations.length
    );
    const avgTask = Math.round(
      questionEvaluations.reduce((sum, item) => sum + item.taskScore, 0) / questionEvaluations.length
    );
    const avgAction = Math.round(
      questionEvaluations.reduce((sum, item) => sum + item.actionScore, 0) / questionEvaluations.length
    );
    const avgResult = Math.round(
      questionEvaluations.reduce((sum, item) => sum + item.resultScore, 0) / questionEvaluations.length
    );

    let tier = 'TIER S (UNGGUL)';
    let verdict = 'Sangat Siap Kerja';
    let dominantTitle = 'Si Master Storyteller Berkelas';
    let dominantQuote = 'Gaya bicaramu tenang dan meyakinkan, struktur jawaban lugas dan profesional!';
    let dominantComment = 'HRD auto manggut-manggut menyimak jawabanmu!';

    if (avgOverall >= 90) {
      tier = 'TIER S+ (GOKIL PARAH)';
      verdict = 'Top 5% Kandidat Terbaik';
      dominantTitle = 'Ninja STAR: Sat-Set Gaspol No Basa-Basi';
      dominantQuote = 'Situasi jelas, aksi nyata, hasil terukur konkret! Jawaban sempurna standar Tier-1.';
      dominantComment = 'Jawaban kamu bikin user langsung pengen offering letter!';
    } else if (avgOverall >= 80) {
      tier = 'TIER S (KOMPETEN & SOLID)';
      verdict = 'Sangat Siap Kerja';
      dominantTitle = 'Pede Tingkat Dewa, Jawaban Mengalir';
      dominantQuote = 'Pemahaman teknis kuat, runutan aksi rapi. Siap bersaing di tahap user.';
      dominantComment = 'Tinggal poles sedikit metrik hasil akhir agar makin memukau!';
    } else if (avgOverall >= 68) {
      tier = 'TIER A (POTENSIAL)';
      verdict = 'Cukup Siap Kerja';
      dominantTitle = 'Si Penutur Santai Tapi Kurang STAR';
      dominantQuote = 'Komunikasi luwes, namun perlu pertegas pembagian peran Task dan dampak kuantitatif Result.';
      dominantComment = 'Perbanyak sebut angka konkret untuk meningkatkan daya tawar!';
    } else {
      tier = 'TIER B (PERLU LATIHAN)';
      verdict = 'Perlu Pendalaman STAR';
      dominantTitle = 'Kucing Oren Vibes: Masih Grogi';
      dominantQuote = 'Jawaban masih cenderung singkat atau normatif. Uraikan lebih detail pengalaman riilmu.';
      dominantComment = 'Gunakan formula STAR: Ceritakan Situasi, Tugas, Aksi Anda, dan Hasil akhirnya.';
    }

    // Identifikasi pilar terkuat & terlemah
    const pillars = [
      { name: 'Situation', score: avgSituation },
      { name: 'Task', score: avgTask },
      { name: 'Action', score: avgAction },
      { name: 'Result', score: avgResult },
    ];
    pillars.sort((a, b) => b.score - a.score);
    const strongest = pillars[0];
    const weakest = pillars[pillars.length - 1];

    return {
      overallScore: avgOverall,
      situationScore: avgSituation,
      taskScore: avgTask,
      actionScore: avgAction,
      resultScore: avgResult,
      answeredCount: answeredIndices.length,
      totalQuestions,
      isCustomAnswered: true,
      tier,
      verdict,
      dominantPersonaTitle: dominantTitle,
      dominantPersonaQuote: dominantQuote,
      dominantPersonaComment: dominantComment,
      keyStrength: `Pilar ${strongest.name} Anda sangat menonjol (${strongest.score}%) dengan artikulasi yang meyakinkan.`,
      keyImprovement: `Tingkatkan pilar ${weakest.name} (${weakest.score}%) dengan uraian yang lebih rinci dan terukur.`,
      evaluations: questionEvaluations
    };
  }

  // Baseline jika belum ada input riil (pengguna langsung ke S04 sebelum wawancara)
  return {
    overallScore: 78,
    situationScore: 82,
    taskScore: 76,
    actionScore: 80,
    resultScore: 72,
    answeredCount: 0,
    totalQuestions,
    isCustomAnswered: false,
    tier: 'TIER A (STANDAR SIMULASI)',
    verdict: 'Cukup Siap Kerja',
    dominantPersonaTitle: 'Si Penutur Potensial',
    dominantPersonaQuote: 'Jawaban memiliki fondasi baik, optimalkan metrik kuantitatif di bagian Result!',
    dominantPersonaComment: 'Silakan rekam jawaban Anda di S03 untuk evaluasi riil berakurasi tinggi!',
    keyStrength: 'Artikulasi terstruktur dengan alur yang mudah dipahami.',
    keyImprovement: 'Tingkatkan rincian angka terukur dan dampak bisnis nyata pada pilar Result.',
    evaluations: []
  };
}

// Preset Jawaban untuk simulasi respons evaluasi dinamis
export const SAMPLE_EVALUATION_PRESETS: Record<string, { label: string; scoreLabel: string; answers: Record<number, string> }> = {
  short: {
    label: 'Jawaban Singkat (Tanpa STAR)',
    scoreLabel: '~42%',
    answers: {
      0: 'Saya pernah bekerja di kantor. Ya tugas saya ya mengerjakan yang disuruh atasan aja.',
      1: 'Menghadapi komplain ya saya minta maaf dan selesaikan sebisanya.'
    }
  },
  medium: {
    label: 'Jawaban Menengah (STAR Parsial)',
    scoreLabel: '~72%',
    answers: {
      0: 'Di posisi sebelumnya waktu ada kendala dokumen yang menumpuk, tanggung jawab saya merapikannya. Saya menyusun sistem pengarsipan baru dan memisahkan berkas prioritas sehingga tim kerja lebih cepat.',
      1: 'Saat menghadapi deadline ketat, peran saya berkoordinasi dengan rekan satu divisi untuk membagi tugas secara seimbang dan menyelesaikannya tepat waktu.'
    }
  },
  complete: {
    label: 'Jawaban STAR Lengkap & Metrik',
    scoreLabel: '~89%',
    answers: {
      0: 'Ketika bekerja di divisi operasional tahun lalu, perusahaan menghadapi kendala selisih pencatatan berkas fisik hingga 12%. Sebagai PIC administrasi, tugas saya menertibkan seluruh logbook dan meminimalisir deviasi. Saya membuat SOP digital menggunakan spreadsheet terintegrasi, mengadakan sosialisasi berkala, dan mengecek mutasi harian. Hasilnya, deviasi berkurang menjadi 0% dalam 2 bulan dan efisiensi waktu input meningkat 35%.',
      1: 'Saat menangani komplain klien prioritas terkait keterlambatan laporan, peran saya menjaga retensi klien dan menyelesaikan isu dalam 24 jam. Saya menganalisis akar masalah, berkoordinasi intensif dengan tim logistik, dan memberikan diskon kompensasi 10%. Hasilnya klien sangat puas dan memperpanjang kontrak tahunan senilai 150 juta rupiah.'
    }
  },
  expert: {
    label: 'Jawaban Expert Tier-1 (S+)',
    scoreLabel: '~96%',
    answers: {
      0: 'Ketika saya memimpin proyek optimalisasi sistem di kuartal 3 tahun lalu, perusahaan mengalami penurunan efisiensi proses sebesar 20%. Target saya merevisi workflow serta memangkas waktu proses hingga 30%. Saya memformulasikan strategi otomatisasi, memimpin standup harian tim, dan berkolaborasi erat dengan IT. Hasil akhirnya melampaui ekspektasi: waktu proses terpangkas 45%, penghematan biaya operasional mencapai 75 juta rupiah, dan tim kami meraih penghargaan Best Performance dari direksi.',
      1: 'Di situasi krisis saat sistem internal down pada hari gajian, tanggung jawab saya memastikan rekonsiliasi pembayaran 200 karyawan tetap sukses tepat waktu. Saya langsung mengaktifkan protokol kontinjensi manual, memvalidasi data debet-kredit bersama bank partner, dan mengamankan otorisasi darurat. Hasilnya seluruh transfer selesai 2 jam sebelum batas cut-off tanpa ada komplain maupun kerugian finansial.'
    }
  }
};
