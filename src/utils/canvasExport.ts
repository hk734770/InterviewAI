/**
 * Generates and downloads high-resolution 1080x1920 9:16 image for Instagram Story / WhatsApp Status
 * Mendukung ekspor format PNG & format JPG (JPEG) berkualitas tinggi
 */

export interface ScorecardData {
  candidateName: string;
  jobTrack: string;
  score: number;
  personaTitle: string;
  personaQuote: string;
  catComment?: string;
  sticker?: string;
  tier?: string;
  situation: number;
  task: number;
  action: number;
  result: number;
  vibeTemplate: 'neon' | 'midnight' | 'sunset';
  showSafeZones?: boolean;
}

export function renderScorecardToCanvas(data: ScorecardData): HTMLCanvasElement {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background gradient depending on Vibe Template
  let bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (data.vibeTemplate === 'neon') {
    // Senoparty Neon
    bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.35, '#0a1a2e');
    bgGrad.addColorStop(0.7, '#071524');
    bgGrad.addColorStop(1, '#050a12');
  } else if (data.vibeTemplate === 'midnight') {
    // Drip Boba Pastel / Violet
    bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#100b1a');
    bgGrad.addColorStop(0.35, '#1e1133');
    bgGrad.addColorStop(0.7, '#130924');
    bgGrad.addColorStop(1, '#090512');
  } else {
    // Menyala Abangkuh (Fire Sunset)
    bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#1a090a');
    bgGrad.addColorStop(0.35, '#2e1215');
    bgGrad.addColorStop(0.7, '#240d12');
    bgGrad.addColorStop(1, '#0e0406');
  }

  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Vibrant Ambient Neon Blobs in background
  const blob1 = ctx.createRadialGradient(540, 500, 80, 540, 500, 650);
  if (data.vibeTemplate === 'neon') {
    blob1.addColorStop(0, 'rgba(6, 182, 212, 0.35)');
    blob1.addColorStop(0.5, 'rgba(16, 185, 129, 0.15)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else if (data.vibeTemplate === 'midnight') {
    blob1.addColorStop(0, 'rgba(168, 85, 247, 0.35)');
    blob1.addColorStop(0.5, 'rgba(236, 72, 153, 0.15)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    blob1.addColorStop(0, 'rgba(249, 115, 22, 0.4)');
    blob1.addColorStop(0.5, 'rgba(239, 68, 68, 0.18)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  }
  ctx.fillStyle = blob1;
  ctx.fillRect(0, 0, width, height);

  // Decorative Playful Sparkles and Dot Patterns
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  for (let x = 60; x < width; x += 60) {
    for (let y = 80; y < height; y += 60) {
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Header Zone: App Tag & Verified Simulation
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('INTERVIEWAI', 120, 210);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('• GEN-Z STAR SCORECARD', 380, 210);

  // Batch / Year Badge (Lucu & Gaul)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
  ctx.beginPath();
  ctx.roundRect(width - 340, 175, 220, 50, 25);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ LOLOS VERIFIKASI', width - 315, 207);

  // Candidate Name & Track
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 64px "Plus Jakarta Sans", sans-serif';
  const nameText = data.candidateName || 'Johan Pratama';
  ctx.fillText(nameText.length > 18 ? nameText.slice(0, 18) + '...' : nameText, 120, 325);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 26px "JetBrains Mono", monospace';
  ctx.fillText(`ROLE: ${(data.jobTrack || 'ACCOUNTING').toUpperCase()} • READY TO HIRE`, 120, 375);

  // Top Percentile & Tier Pill
  const tierText = data.tier || 'TIER S+ (GOKIL PARAH)';
  ctx.fillStyle = 'rgba(234, 179, 8, 0.2)';
  ctx.beginPath();
  ctx.roundRect(width - 370, 325, 250, 55, 14);
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`👑 ${tierText}`, width - 355, 360);

  // MAIN CARD AREA (GAYA CARD MODERN BERSUDUT BESAR)
  const cardY = 430;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  ctx.beginPath();
  ctx.roundRect(90, cardY, width - 180, 890, 40);
  ctx.fill();
  ctx.strokeStyle = data.vibeTemplate === 'sunset' ? 'rgba(249, 115, 22, 0.5)' : data.vibeTemplate === 'midnight' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // STICKER GAUL (Rotated Badge di atas Card)
  const stickerText = data.sticker || '🔥 MENYALA ABANGKUH 🔥';
  ctx.save();
  ctx.translate(220, cardY - 5);
  ctx.rotate(-0.08); // Rotate -4.5 deg
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.roundRect(-10, -28, 380, 56, 16);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(stickerText, 15, 8);
  ctx.restore();

  // Big Score 84 / 100
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 165px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${data.score}`, 160, cardY + 200);

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 55px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('/100', 385, cardY + 200);

  // Subtitle Badge di bawah skor
  ctx.fillStyle = '#34d399';
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('✦ Certified STAR Prodigy • Siap Di-Hire ✦', 160, cardY + 260);

  // MASCOT CAT CIRCLE & CUTE SPEECH BUBBLE
  const catX = width - 250;
  const catY = cardY + 160;

  // Cat Circle background
  ctx.save();
  ctx.beginPath();
  ctx.arc(catX, catY, 95, 0, Math.PI * 2);
  ctx.fillStyle = '#1e293b';
  ctx.fill();
  ctx.strokeStyle = data.vibeTemplate === 'sunset' ? '#f97316' : '#38bdf8';
  ctx.lineWidth = 5;
  ctx.stroke();
  // Cat emoji representation
  ctx.fillStyle = '#fbbf24';
  ctx.font = '76px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🐱⭐', catX, catY);
  ctx.restore();

  // Speech bubble from cat
  const bubbleText = data.catComment || 'HRD auto naksir CV lu! Meow 🐾';
  ctx.save();
  ctx.translate(catX - 110, catY - 110);
  ctx.rotate(-0.05);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(0, 0, 270, 56, 18);
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(bubbleText.length > 25 ? bubbleText.slice(0, 23) + '..' : bubbleText, 15, 34);
  ctx.restore();

  // PERSONA BADGE BOX (LUCU & GAUL)
  const personaY = cardY + 315;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.beginPath();
  ctx.roundRect(130, personaY, width - 260, 190, 24);
  ctx.fill();
  ctx.strokeStyle = 'rgba(251, 191, 36, 0.5)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Persona Header
  ctx.fillStyle = '#fbbf24';
  ctx.font = '900 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`👑 ${data.personaTitle}`, 160, personaY + 52);

  // Funny Persona Quote (Wrap text)
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'italic 24px "Plus Jakarta Sans", sans-serif';
  const quote = `"${data.personaQuote}"`;
  if (quote.length > 58) {
    const half = quote.lastIndexOf(' ', 56);
    ctx.fillText(quote.slice(0, half > 0 ? half : 55), 160, personaY + 105);
    ctx.fillText(quote.slice(half > 0 ? half + 1 : 55), 160, personaY + 145);
  } else {
    ctx.fillText(quote, 160, personaY + 115);
  }

  // 4 STAR PILLARS METRICS GRID DENGAN NAMA GAUL
  const starY = cardY + 540;
  const pillars = [
    { label: 'SITUATION', desc: 'Gercep Parah', val: data.situation, color: '#34d399' },
    { label: 'TASK', desc: 'No Drama', val: data.task, color: '#60a5fa' },
    { label: 'ACTION', desc: 'Sat-Set Gaspol', val: data.action, color: '#2dd4bf' },
    { label: 'RESULT', desc: 'Penting Cuan', val: data.result, color: '#c084fc' },
  ];

  pillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const px = 130 + col * 420;
    const py = starY + row * 140;

    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.beginPath();
    ctx.roundRect(px, py, 390, 115, 18);
    ctx.fill();

    // Pillar title & gaul sublabel
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(p.label, px + 22, py + 38);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`• ${p.desc}`, px + 22, py + 65);

    // Percentage
    ctx.fillStyle = p.color;
    ctx.font = '900 40px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${p.val}%`, px + 265, py + 52);

    // Progress Bar Track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(px + 22, py + 84, 345, 10);
    ctx.fillStyle = p.color;
    ctx.fillRect(px + 22, py + 84, (345 * p.val) / 100, 10);
  });

  // FOOTER / QR CODE BOX (VIRAL CTA - EYE CATCHING NEON)
  const footerY = 1380;
  const footerGrad = ctx.createLinearGradient(90, footerY, width - 90, footerY + 240);
  footerGrad.addColorStop(0, 'rgba(6, 24, 38, 0.96)');
  footerGrad.addColorStop(0.5, 'rgba(10, 32, 54, 0.96)');
  footerGrad.addColorStop(1, 'rgba(15, 23, 42, 0.96)');
  ctx.fillStyle = footerGrad;
  ctx.beginPath();
  ctx.roundRect(90, footerY, width - 180, 240, 28);
  ctx.fill();

  const borderGrad = ctx.createLinearGradient(90, footerY, width - 90, footerY);
  borderGrad.addColorStop(0, '#34d399');
  borderGrad.addColorStop(0.5, '#22d3ee');
  borderGrad.addColorStop(1, '#3b82f6');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Header Badge Pill inside Footer
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.beginPath();
  ctx.roundRect(130, footerY + 26, 560, 46, 23);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.6)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = '900 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🔥 COBA SIMULASI INTERVIEW AI GRATIS', 152, footerY + 57);

  // Highlighted URL Pill Box
  ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
  ctx.beginPath();
  ctx.roundRect(130, footerY + 86, 645, 58, 16);
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 22px "JetBrains Mono", monospace';
  ctx.fillText('🌐 https://interview-ai-wheat-one.vercel.app', 148, footerY + 123);

  ctx.fillStyle = '#bae6fd';
  ctx.font = '700 21px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ Scan QR atau klik link buat tes mental interview bareng!', 135, footerY + 188);

  // Stylized QR Code
  const qrX = width - 275;
  const qrY = footerY + 45;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, 150, 150, 14);
  ctx.fill();

  // Crisp QR pattern modules
  ctx.fillStyle = '#000000';
  ctx.fillRect(qrX + 15, qrY + 15, 35, 35);
  ctx.clearRect(qrX + 22, qrY + 22, 21, 21);
  ctx.fillRect(qrX + 27, qrY + 27, 11, 11);

  ctx.fillRect(qrX + 100, qrY + 15, 35, 35);
  ctx.clearRect(qrX + 107, qrY + 22, 21, 21);
  ctx.fillRect(qrX + 112, qrY + 27, 11, 11);

  ctx.fillRect(qrX + 15, qrY + 100, 35, 35);
  ctx.clearRect(qrX + 22, qrY + 107, 21, 21);
  ctx.fillRect(qrX + 27, qrY + 112, 11, 11);

  ctx.fillRect(qrX + 65, qrY + 25, 20, 20);
  ctx.fillRect(qrX + 60, qrY + 65, 30, 30);
  ctx.fillRect(qrX + 105, qrY + 75, 25, 20);
  ctx.fillRect(qrX + 65, qrY + 115, 25, 20);

  // Bottom Watermark
  ctx.fillStyle = '#64748b';
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Terenkripsi & Terverifikasi STAR Matrix v4.2 • AI Interview Simulation System', 170, height - 120);

  // Optional Safe Zone Guides (if toggled)
  if (data.showSafeZones) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.setLineDash([12, 12]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(width, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, height - 320);
    ctx.lineTo(width, height - 320);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  return canvas;
}

/**
 * Merender gabungan Teks Scorecard Evaluasi Interview STAR (di bagian atas)
 * dan Kartu Visual Scorecard 1080x1920 (tepat di bawahnya) dalam satu gambar utuh.
 * Memastikan saat dikirim ke WhatsApp di Hand Phone (Android/iOS), baik Teks Evaluasi STAR
 * maupun gambar Scorecard selalu terkirim bersama-sama.
 */
export function renderWhatsAppCompositeToCanvas(data: ScorecardData): HTMLCanvasElement {
  const scorecardCanvas = renderScorecardToCanvas(data);
  const width = 1080;
  const headerHeight = 760;
  const totalHeight = headerHeight + scorecardCanvas.height;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = totalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return scorecardCanvas;

  // Latar belakang area pesan teks di atas Scorecard
  const topBg = ctx.createLinearGradient(0, 0, width, headerHeight);
  topBg.addColorStop(0, '#050b14');
  topBg.addColorStop(0.5, '#071521');
  topBg.addColorStop(1, '#090d16');
  ctx.fillStyle = topBg;
  ctx.fillRect(0, 0, width, headerHeight);

  // Kotak Bubble Pesan Teks Evaluasi STAR bergaya WhatsApp Modern
  const boxX = 60;
  const boxY = 35;
  const boxW = width - 120;
  const boxH = headerHeight - 65;

  const cardGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY + boxH);
  cardGrad.addColorStop(0, 'rgba(7, 29, 36, 0.98)');
  cardGrad.addColorStop(0.6, 'rgba(11, 25, 42, 0.98)');
  cardGrad.addColorStop(1, 'rgba(15, 23, 42, 0.98)');
  ctx.fillStyle = cardGrad;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 32);
  ctx.fill();

  const borderGrad = ctx.createLinearGradient(boxX, boxY, boxX + boxW, boxY);
  borderGrad.addColorStop(0, '#10b981');
  borderGrad.addColorStop(0.5, '#22d3ee');
  borderGrad.addColorStop(1, '#3b82f6');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  const candidate = data.candidateName || 'Johan Pratama';
  const tierText = data.tier || 'TIER S+ (GOKIL PARAH)';
  const stickerText = data.sticker || '🔥 MENYALA ABANGKUH 🔥';
  const textX = boxX + 45;

  // Judul Utama Teks Evaluasi
  ctx.fillStyle = '#34d399';
  ctx.font = '900 31px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`🔥 SCORECARD EVALUASI INTERVIEW STAR (${candidate})`, textX, boxY + 65);

  // Ringkasan Skor, Judul & Stiker
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`⭐ Skor STAR: ${data.score}/100 (${tierText})`, textX, boxY + 122);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 25px "Plus Jakarta Sans", sans-serif';
  const titleLine = `👑 Judul: ${data.personaTitle}`;
  ctx.fillText(titleLine.length > 52 ? titleLine.slice(0, 50) + '...' : titleLine, textX, boxY + 166);

  ctx.fillStyle = '#fb7185';
  ctx.font = 'bold 25px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`🏷️ Stiker: ${stickerText}`, textX, boxY + 210);

  // Garis pemisah tipis
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(textX, boxY + 235);
  ctx.lineTo(boxX + boxW - 45, boxY + 235);
  ctx.stroke();

  // Rincian Nilai STAR
  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📊 Rincian Nilai STAR:', textX, boxY + 276);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '700 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`• Situation: ${data.situation}% (Gercep Parah)`, textX + 10, boxY + 318);
  ctx.fillText(`• Task: ${data.task}% (No Drama)`, textX + 10, boxY + 356);
  ctx.fillText(`• Action: ${data.action}% (Sat-Set Gaspol)`, textX + 10, boxY + 394);
  ctx.fillText(`• Result: ${data.result}% (Penting Cuan)`, textX + 10, boxY + 432);

  // Garis pemisah kedua
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
  ctx.beginPath();
  ctx.moveTo(textX, boxY + 458);
  ctx.lineTo(boxX + boxW - 45, boxY + 458);
  ctx.stroke();

  // Info Lampiran & Link Promo
  ctx.fillStyle = '#6ee7b7';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📸 [KARTU SCORECARD STAR (JPG HD) TERLAMPIR DI BAWAH]', textX, boxY + 498);

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🎁 Mau coba uji mental interview lawan AI & dapet Scorecard kayak gini?', textX, boxY + 542);

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('👉 Cobain Simulasi Gratis di sini:', textX, boxY + 580);

  // Pill Link URL
  ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
  ctx.beginPath();
  ctx.roundRect(textX, boxY + 598, 690, 56, 16);
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.fillText('🌐 https://interview-ai-wheat-one.vercel.app', textX + 20, boxY + 634);

  // Tempelkan Kartu Visual Scorecard 1080x1920 tepat di bawah Teks Evaluasi STAR
  ctx.drawImage(scorecardCanvas, 0, headerHeight);

  return canvas;
}

/**
 * Konversi DataURL ke objek File secara 100% sinkron (tanpa async/await)
 * agar tidak menghilangkan user gesture activation saat memanggil navigator.share di Hand Phone.
 */
export function dataUrlToFileSync(dataUrl: string, fileName: string, mimeType = 'image/jpeg'): File {
  const parts = dataUrl.split(',');
  const byteString = atob(parts[1] || '');
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new File([ab], fileName, { type: mimeType });
}

/**
 * Membuat objek File JPG secara sinkron untuk langsung dikirim ke WhatsApp
 * @param includeTextHeader Jika true, menggabungkan Teks Evaluasi STAR + Scorecard
 */
export function createScorecardJPGFileSync(data: ScorecardData, includeTextHeader = true): File {
  const canvas = includeTextHeader ? renderWhatsAppCompositeToCanvas(data) : renderScorecardToCanvas(data);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const fileName = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}_1080x1920.jpg`;
  return dataUrlToFileSync(dataUrl, fileName, 'image/jpeg');
}

/**
 * Ekspor Scorecard ke format PNG
 */
export function exportScorecardToPNG(data: ScorecardData): void {
  const canvas = renderScorecardToCanvas(data);
  const imageURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}.png`;
  link.href = imageURL;
  link.click();
}

/**
 * Ekspor & unduh Scorecard dalam format JPG (JPEG)
 * Mengembalikan string DataURL format JPG
 */
export function exportScorecardToJPG(data: ScorecardData, includeTextHeader = false): string {
  const canvas = includeTextHeader ? renderWhatsAppCompositeToCanvas(data) : renderScorecardToCanvas(data);
  const jpgURL = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.download = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}.jpg`;
  link.href = jpgURL;
  link.click();
  return jpgURL;
}

/**
 * Menghasilkan DataURL, Blob Scorecard JPG, File Gabungan WhatsApp (Teks + Scorecard), dan Blob PNG untuk clipboard
 */
export async function getScorecardJPGData(data: ScorecardData): Promise<{ 
  dataUrl: string; 
  blob: Blob | null; 
  pngBlob: Blob | null;
  waCompositeFile: File;
}> {
  const canvas = renderScorecardToCanvas(data);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const waCompositeFile = createScorecardJPGFileSync(data, true);
  
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.95);
  });

  const pngBlob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/png');
  });

  return { dataUrl, blob, pngBlob, waCompositeFile };
}

/**
 * Membagikan file gambar Scorecard (.JPG 1080x1920) secara langsung ke WhatsApp melalui Web Share API
 * Foto otomatis tertempel tepat di bawah teks evaluasi tanpa perlu menekan Ctrl+V
 */
export async function shareScorecardJPGDirectly(
  data: ScorecardData,
  caption: string
): Promise<{ success: boolean; method: 'web-share' | 'clipboard' | 'download' }> {
  const file = createScorecardJPGFileSync(data, true);

  // 1. Coba Web Share API dengan File Attachment secara langsung (tanpa await sebelumnya agar user gesture tetap aktif di Hand Phone)
  if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        text: caption,
        files: [file],
      });
      return { success: true, method: 'web-share' };
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        return { success: false, method: 'web-share' };
      }
    }
  }

  const { pngBlob } = await getScorecardJPGData(data);

  // 2. Salin gambar ke clipboard dalam format image/png di latar belakang & unduh file JPG
  if (pngBlob && typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob })
      ]);
      exportScorecardToJPG(data, true);
      return { success: true, method: 'clipboard' };
    } catch (_) {}
  }

  // 3. Fallback: Unduh file JPG
  exportScorecardToJPG(data, true);
  return { success: true, method: 'download' };
}
