# 🎙️ InterviewAI — Simulasi Interview Kerja Realistis

Aplikasi simulasi wawancara kerja interaktif berbasis AI yang dirancang untuk melatih kesiapan kandidat melalui pertanyaan situasional terstruktur (STAR Matrix), transkripsi suara real-time, evaluasi desibel & pacing bicara (WPM), klip video interaktif, serta scorecard kelulusan.

---

## 🚀 Cara Menjalankan Proyek (Run Locally)

### Prasyarat
- **Node.js** (v18 atau lebih baru)
- **NPM** (disertakan bersama Node.js)

### Langkah Menjalankan:

1. **Buka terminal PowerShell / Command Prompt** pada folder proyek.
2. **Install Dependensi**:
   ```bash
   npm install
   ```
   > 💡 *Catatan Windows PowerShell*: Jika muncul pesan error `PSSecurityException / running scripts is disabled`, jalankan perintah berikut sekali untuk mengizinkan eksekusi script:
   > ```powershell
   > Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned -Force
   > ```

3. **Konfigurasi API Key**:
   - Salin file `.env.example` menjadi `.env.local` (sudah disediakan).
   - Masukkan API Key Gemini Anda di [.env.local](.env.local):
     ```env
     GEMINI_API_KEY="AIzaSy..."
     ```

4. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
5. Buka browser di `http://localhost:3000`.

---

## 🛠️ Perintah Lainnya

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev` | Menjalankan local development server Vite |
| `npm run build` | Melakukan build aplikasi untuk produksi |
| `npm run preview`| Menjalankan preview dari hasil build produksi |
| `npm run lint` | Melakukan pemeriksaan type safety TypeScript |

---

## 📋 Manajemen & Progres Fitur

Progres pengembangan dan Kanban Board proyek ini dapat dipantau langsung di:
- **Notion Kanban Board**: [PM - App Interviewer (Notion)](https://app.notion.com/p/Kanban-Board-Feature-Progress-40abb3196e6181209550c8a9099fae77)

