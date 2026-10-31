const fs = require('fs');
const path = require('path');

// We can import or read the ts mockData
const mockDataContent = fs.readFileSync(path.join(__dirname, '../src/data/mockData.ts'), 'utf8');

// Function to parse questions using regex or eval safely
const jobFieldMap = [
  { varName: 'ADMIN_QUESTIONS', fieldId: 'admin' },
  { varName: 'ACCOUNTING_QUESTIONS', fieldId: 'accounting' },
  { varName: 'FINANCE_QUESTIONS', fieldId: 'finance' },
  { varName: 'SALES_QUESTIONS', fieldId: 'sales' },
  { varName: 'GA_QUESTIONS', fieldId: 'ga' },
  { varName: 'LOGISTICS_QUESTIONS', fieldId: 'logistics' },
];

function escapeSql(str) {
  if (!str) return 'NULL';
  return "'" + str.replace(/'/g, "''") + "'";
}

const allQuestions = [];

for (const { varName, fieldId } of jobFieldMap) {
  const marker = `export const ${varName}: InterviewQuestion[] = [`;
  const startIdx = mockDataContent.indexOf(marker);
  if (startIdx === -1) {
    console.error(`Marker not found for ${varName}`);
    continue;
  }
  const endIdx = mockDataContent.indexOf('\n];', startIdx);
  const block = mockDataContent.substring(startIdx + marker.length, endIdx);

  // Match each object { ... }
  const regex = /{\s*id:\s*(\d+),\s*questionNumber:\s*(\d+),\s*category:\s*'([^']*)',\s*questionText:\s*'([^']*)',\s*sampleCandidateAnswer:\s*'([^']*)',\s*aiCoachTip:\s*'([^']*)',\s*score:\s*(\d+),\s*pacingWpm:\s*(\d+),\s*hesitationRate:\s*'([^']*)',\s*videoUrl:\s*'([^']*)'/g;

  let match;
  let count = 0;
  while ((match = regex.exec(block)) !== null) {
    count++;
    allQuestions.push({
      id: parseInt(match[1]),
      jobFieldId: fieldId,
      questionNumber: parseInt(match[2]),
      category: match[3],
      questionText: match[4],
      sampleCandidateAnswer: match[5],
      aiCoachTip: match[6],
      score: parseInt(match[7]),
      pacingWpm: parseInt(match[8]),
      hesitationRate: match[9],
      videoUrl: match[10],
    });
  }
  console.log(`Parsed ${count} questions for ${fieldId}`);
}

console.log(`Total questions parsed: ${allQuestions.length}`);

// Generate SQL
const sqlStatements = [];

sqlStatements.push(`-- =============================================================================
-- InterviewAI Database Schema & Initial Seed Data
-- Database Engine: PostgreSQL / MySQL (ANSI SQL Compatible)
-- Aplikasi: InterviewAI — Simulasi Interview Kerja Realistis
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TABEL: users
-- Menyimpan informasi akun pengguna / kandidat pelamar
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NULL,
    phone_number VARCHAR(30) NULL,
    avatar_url VARCHAR(255) NULL,
    is_pro BOOLEAN DEFAULT FALSE,
    pro_expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 2. TABEL: job_fields
-- Kategori bidang pekerjaan (Job Tracks) untuk simulasi interview
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS job_fields (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    subtitle VARCHAR(200) NOT NULL,
    icon_name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------------------------------
-- 3. TABEL: interview_questions
-- Daftar bank soal terstruktur berdasarkan bidang pekerjaan & matriks STAR
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_questions (
    id INT PRIMARY KEY,
    job_field_id VARCHAR(50) NOT NULL,
    question_number INT NOT NULL,
    category VARCHAR(150) NOT NULL,
    question_text TEXT NOT NULL,
    sample_candidate_answer TEXT NOT NULL,
    ai_coach_tip TEXT NOT NULL,
    default_score INT DEFAULT 85,
    default_pacing_wpm INT DEFAULT 130,
    default_hesitation_rate VARCHAR(20) DEFAULT '2%',
    video_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_questions_job_field FOREIGN KEY (job_field_id) REFERENCES job_fields (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 4. TABEL: interview_sessions
-- Sesi pelaksanaan simulasi interview oleh kandidat
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_sessions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    candidate_name VARCHAR(150) NOT NULL,
    job_field_id VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'in_progress', -- in_progress, completed, abandoned
    current_step VARCHAR(10) DEFAULT 'S01',   -- S01 Setup, S02 AVCheck, S03 Simulation, S04 Diagnostics, S05 STARReport, S06 Scorecard
    current_question_index INT DEFAULT 0,
    vibe_template VARCHAR(30) DEFAULT 'neon',
    is_pro_session BOOLEAN DEFAULT FALSE,
    overall_score DECIMAL(5,2) NULL,
    situation_score DECIMAL(5,2) NULL,
    task_score DECIMAL(5,2) NULL,
    action_score DECIMAL(5,2) NULL,
    result_score DECIMAL(5,2) NULL,
    avg_pacing_wpm DECIMAL(5,2) NULL,
    tier VARCHAR(50) NULL,
    verdict VARCHAR(100) NULL,
    dominant_persona_title VARCHAR(150) NULL,
    dominant_persona_quote TEXT NULL,
    dominant_persona_comment TEXT NULL,
    key_strength TEXT NULL,
    key_improvement TEXT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_sessions_job_field FOREIGN KEY (job_field_id) REFERENCES job_fields (id) ON DELETE RESTRICT
);

-- -----------------------------------------------------------------------------
-- 5. TABEL: interview_answers
-- Jawaban suara/teks kandidat untuk setiap nomor pertanyaan dan evaluasi STAR
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS interview_answers (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    question_id INT NOT NULL,
    question_number INT NOT NULL,
    candidate_answer TEXT NULL,
    word_count INT DEFAULT 0,
    pacing_wpm INT DEFAULT 0,
    hesitation_rate VARCHAR(20) DEFAULT '0%',
    decibel_level DECIMAL(5,2) DEFAULT 0.00,
    situation_score INT DEFAULT 0,
    task_score INT DEFAULT 0,
    action_score INT DEFAULT 0,
    result_score INT DEFAULT 0,
    overall_score INT DEFAULT 0,
    has_situation BOOLEAN DEFAULT FALSE,
    has_task BOOLEAN DEFAULT FALSE,
    has_action BOOLEAN DEFAULT FALSE,
    has_result BOOLEAN DEFAULT FALSE,
    has_metrics BOOLEAN DEFAULT FALSE,
    ai_feedback TEXT NULL,
    audio_recording_url VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_answers_session FOREIGN KEY (session_id) REFERENCES interview_sessions (id) ON DELETE CASCADE,
    CONSTRAINT fk_answers_question FOREIGN KEY (question_id) REFERENCES interview_questions (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 6. TABEL: transcript_histories
-- Log percakapan transkrip langsung antara Pewawancara AI dan Kandidat
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transcript_histories (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    sender VARCHAR(30) NOT NULL, -- 'interviewer' | 'candidate'
    message_text TEXT NOT NULL,
    timestamp_label VARCHAR(30) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transcripts_session FOREIGN KEY (session_id) REFERENCES interview_sessions (id) ON DELETE CASCADE
);

-- -----------------------------------------------------------------------------
-- 7. TABEL: payment_transactions
-- Transaksi pembayaran paket PRO / QRIS simulasi interview
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payment_transactions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NULL,
    session_id VARCHAR(36) NULL,
    invoice_number VARCHAR(100) NOT NULL UNIQUE,
    payment_method VARCHAR(50) DEFAULT 'qris',
    amount_idr DECIMAL(12,2) NOT NULL,
    amount_usd DECIMAL(8,2) NOT NULL,
    exchange_rate DECIMAL(12,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'pending', -- pending, paid, expired, failed
    qris_reference VARCHAR(255) NULL,
    paid_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL,
    CONSTRAINT fk_payments_session FOREIGN KEY (session_id) REFERENCES interview_sessions (id) ON DELETE SET NULL
);

-- -----------------------------------------------------------------------------
-- 8. INDEXES UNTUK OPTIMASI PERFORMA QUERY
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_questions_field ON interview_questions (job_field_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON interview_sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON interview_sessions (status);
CREATE INDEX IF NOT EXISTS idx_answers_session ON interview_answers (session_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_session ON transcript_histories (session_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payment_transactions (invoice_number);

-- =============================================================================
-- SEED DATA: JOB FIELDS
-- =============================================================================
INSERT INTO job_fields (id, title, subtitle, icon_name, display_order) VALUES
('admin', 'Administrasi', 'Staff Admin & Operasional', 'ClipboardList', 1),
('accounting', 'Accounting', 'Akuntan & Pajak (Tax)', 'Calculator', 2),
('finance', 'Finance', 'Finance Analyst & Treasury', 'TrendingUp', 3),
('sales', 'Sales & Marketing', 'Business Development & Sales', 'Megaphone', 4),
('ga', 'General Affair (GA)', 'Facility & Office Operations', 'Building2', 5),
('logistics', 'Logistik & Gudang', 'Warehouse & Supply Chain', 'Package', 6)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title, subtitle = EXCLUDED.subtitle, icon_name = EXCLUDED.icon_name, display_order = EXCLUDED.display_order;

-- =============================================================================
-- SEED DATA: 60 INTERVIEW QUESTIONS (LENGKAP 6 BIDANG x 10 SOAL)
-- =============================================================================
`);

const questionInserts = allQuestions.map(q => {
  return `INSERT INTO interview_questions (id, job_field_id, question_number, category, question_text, sample_candidate_answer, ai_coach_tip, default_score, default_pacing_wpm, default_hesitation_rate, video_url) VALUES (${q.id}, ${escapeSql(q.jobFieldId)}, ${q.questionNumber}, ${escapeSql(q.category)}, ${escapeSql(q.questionText)}, ${escapeSql(q.sampleCandidateAnswer)}, ${escapeSql(q.aiCoachTip)}, ${q.score}, ${q.pacingWpm}, ${escapeSql(q.hesitationRate)}, ${escapeSql(q.videoUrl)}) ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, sample_candidate_answer = EXCLUDED.sample_candidate_answer, ai_coach_tip = EXCLUDED.ai_coach_tip;`;
});

sqlStatements.push(questionInserts.join('\n'));

sqlStatements.push(`

-- =============================================================================
-- SEED DATA: SAMPLE USER & DEMO SESSION
-- =============================================================================
INSERT INTO users (id, name, email, is_pro) VALUES
('usr-demo-001', 'Kandidat Demo', 'kandidat@example.com', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO interview_sessions (
    id, user_id, candidate_name, job_field_id, status, current_step, 
    current_question_index, vibe_template, is_pro_session,
    overall_score, situation_score, task_score, action_score, result_score,
    avg_pacing_wpm, tier, verdict, dominant_persona_title,
    dominant_persona_quote, dominant_persona_comment,
    key_strength, key_improvement
) VALUES (
    'sess-demo-001', 'usr-demo-001', 'Kandidat Demo', 'admin', 'completed', 'S06',
    10, 'neon', TRUE,
    88.50, 90.00, 85.00, 88.00, 91.00,
    134.00, 'Tier 1 - High Potential Candidate', 'SANGAT DIREKOMENDASIKAN (HIGHLY RECOMMENDED)',
    'The Operational Maestro',
    'Menghubungkan efisiensi sistemik dengan ketepatan eksekusi administrasi.',
    'Menunjukkan penguasaan alur kerja kantor dan manajemen dokumen yang terstruktur serta akurat.',
    'Penyusunan solusi teknis operasional dan artikulasi metode kerja sangat sistematis.',
    'Dapat menambahkan lebih banyak rincian kuantitatif rasio keberhasilan pada poin Result.'
)
ON CONFLICT (id) DO NOTHING;
`);

const finalSql = sqlStatements.join('\n');
fs.writeFileSync(path.join(__dirname, '../interviewai_schema.sql'), finalSql, 'utf8');
fs.writeFileSync(path.join(__dirname, 'schema.sql'), finalSql, 'utf8');
console.log('Successfully generated interviewai_schema.sql and database/schema.sql');
