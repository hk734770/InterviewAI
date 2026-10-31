# 🗄️ Database Documentation — InterviewAI

File skema SQL telah disediakan untuk mendukung pengembangan backend dan integrasi database aplikasi **InterviewAI** (Simulasi Interview Kerja Realistis).

---

## 📁 Berkas Database yang Tersedia
1. **[interviewai_schema.sql](../interviewai_schema.sql)** (Root directory) & **[database/schema.sql](./schema.sql)**:
   - DDL skema tabel lengkap beserta *foreign keys*, *indexes*, dan tipe data.
   - Initial Seed Data untuk **6 Bidang Pekerjaan (Job Tracks)**.
   - Initial Seed Data untuk **60 Soal Simulasi Matriks STAR** (lengkap dengan teks pertanyaan, jawaban kandidat, tip AI coach, dan video URL).
   - Seed data contoh pengguna (`users`) dan sesi simulasi (`interview_sessions`).
2. **[database/generate_sql.cjs](./generate_sql.cjs)**:
   - Generator script Node.js jika di masa depan Anda ingin memperbarui soal dari [mockData.ts](../src/data/mockData.ts).

---

## 📊 Struktur Relasi Tabel (Entity Relationship)

```mermaid
erDiagram
    users ||--o{ interview_sessions : "has many"
    users ||--o{ payment_transactions : "makes"
    job_fields ||--o{ interview_questions : "contains"
    job_fields ||--o{ interview_sessions : "selected in"
    interview_sessions ||--o{ interview_answers : "records"
    interview_sessions ||--o{ transcript_histories : "logs"
    interview_sessions ||--o{ payment_transactions : "generates"
    interview_questions ||--o{ interview_answers : "evaluated in"

    users {
        varchar id PK
        varchar name
        varchar email UK
        varchar password_hash
        boolean is_pro
        timestamp pro_expires_at
    }

    job_fields {
        varchar id PK
        varchar title
        varchar subtitle
        varchar icon_name
        int display_order
    }

    interview_questions {
        int id PK
        varchar job_field_id FK
        int question_number
        varchar category
        text question_text
        text sample_candidate_answer
        text ai_coach_tip
        int default_score
        int default_pacing_wpm
        varchar video_url
    }

    interview_sessions {
        varchar id PK
        varchar user_id FK
        varchar candidate_name
        varchar job_field_id FK
        varchar status
        varchar current_step
        decimal overall_score
        decimal situation_score
        decimal task_score
        decimal action_score
        decimal result_score
        varchar tier
        varchar verdict
    }

    interview_answers {
        varchar id PK
        varchar session_id FK
        int question_id FK
        text candidate_answer
        int situation_score
        int task_score
        int action_score
        int result_score
        int overall_score
        text ai_feedback
    }

    transcript_histories {
        varchar id PK
        varchar session_id FK
        varchar sender
        text message_text
        varchar timestamp_label
    }

    payment_transactions {
        varchar id PK
        varchar user_id FK
        varchar session_id FK
        varchar invoice_number UK
        varchar payment_method
        decimal amount_idr
        varchar status
    }
```

---

## 🚀 Cara Import ke Database

### 1. PostgreSQL (Supabase / Neon / Local Postgres)
```bash
psql -h localhost -U postgres -d interviewai_db -f interviewai_schema.sql
```
*Atau buka file `interviewai_schema.sql` lalu copy-paste ke SQL Editor di Supabase / pgAdmin / DBeaver.*

### 2. MySQL / MariaDB
File SQL menggunakan standar ANSI. Untuk MySQL:
- `ON CONFLICT (id) DO NOTHING` dapat diganti menjadi `ON DUPLICATE KEY UPDATE` atau jalankan bagian `CREATE TABLE` terlebih dahulu.
```bash
mysql -u root -p interviewai_db < interviewai_schema.sql
```

