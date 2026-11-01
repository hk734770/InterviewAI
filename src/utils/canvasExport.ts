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
  personaEmoji?: string;
  verdict?: string;
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

/**
 * Menggambar maskot kucing biru berdasi merah & berkacamata yang memegang clipboard STAR
 * persis seperti komponen MascotCat pada tampilan S06Scorecard
 */
function drawMascotCatOnCanvas(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, scale = 1.15) {
  ctx.save();
  ctx.translate(centerX - 100 * scale, centerY - 100 * scale);
  ctx.scale(scale, scale);

  // Outer Aura
  const aura = ctx.createRadialGradient(100, 100, 10, 100, 100, 95);
  aura.addColorStop(0, 'rgba(59, 130, 246, 0.38)');
  aura.addColorStop(0.6, 'rgba(139, 92, 246, 0.18)');
  aura.addColorStop(1, 'rgba(30, 27, 75, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(100, 100, 95, 0, Math.PI * 2);
  ctx.fill();

  // Confetti Particles
  const confettiItems = [
    { x: 25, y: 45, w: 6, h: 4, rot: 0.43, color: '#f43f5e' },
    { x: 165, y: 35, w: 5, h: 7, rot: -0.26, color: '#fbbf24' },
    { x: 180, y: 85, w: 4, h: 6, rot: 0.7, color: '#38bdf8' },
    { x: 20, y: 125, w: 7, h: 4, rot: -0.52, color: '#a855f7' },
    { x: 40, y: 20, w: 5, h: 5, rot: 0.21, color: '#10b981' },
  ];
  confettiItems.forEach((c) => {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rot);
    ctx.fillStyle = c.color;
    ctx.fillRect(0, 0, c.w, c.h);
    ctx.restore();
  });

  const furGrad = ctx.createLinearGradient(40, 40, 160, 180);
  furGrad.addColorStop(0, '#93c5fd');
  furGrad.addColorStop(0.5, '#60a5fa');
  furGrad.addColorStop(1, '#3b82f6');

  // Left Ear
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.moveTo(50, 45);
  ctx.lineTo(78, 82);
  ctx.lineTo(42, 78);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
  ctx.beginPath();
  ctx.moveTo(52, 50);
  ctx.lineTo(72, 78);
  ctx.lineTo(46, 75);
  ctx.closePath();
  ctx.fill();

  // Right Ear
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.moveTo(150, 45);
  ctx.lineTo(158, 78);
  ctx.lineTo(122, 82);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = 'rgba(244, 114, 182, 0.85)';
  ctx.beginPath();
  ctx.moveTo(148, 50);
  ctx.lineTo(154, 75);
  ctx.lineTo(128, 78);
  ctx.closePath();
  ctx.fill();

  // Tail
  ctx.strokeStyle = '#60a5fa';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(140, 150);
  ctx.quadraticCurveTo(182, 145, 172, 120);
  ctx.stroke();

  // Body
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.ellipse(100, 140, 46, 42, 0, 0, Math.PI * 2);
  ctx.fill();

  // Belly
  const bellyGrad = ctx.createLinearGradient(100, 114, 100, 170);
  bellyGrad.addColorStop(0, '#f1f5f9');
  bellyGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bellyGrad;
  ctx.beginPath();
  ctx.ellipse(100, 142, 30, 28, 0, 0, Math.PI * 2);
  ctx.fill();

  // Feet
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.ellipse(80, 176, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(120, 176, 14, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cat Head
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.arc(100, 95, 48, 0, Math.PI * 2);
  ctx.fill();

  // Soft Cheeks Blush
  ctx.fillStyle = 'rgba(251, 113, 133, 0.55)';
  ctx.beginPath();
  ctx.arc(68, 105, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(132, 105, 9, 0, Math.PI * 2);
  ctx.fill();

  // Big Expressive Eyes
  ctx.fillStyle = '#312e81';
  ctx.beginPath();
  ctx.ellipse(78, 94, 10, 13, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(122, 94, 10, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eye Highlights
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(75, 89, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(81, 98, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(119, 89, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(125, 98, 2, 0, Math.PI * 2);
  ctx.fill();

  // Glasses Wireframe (Golden)
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(78, 94, 19, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(122, 94, 19, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(97, 92);
  ctx.quadraticCurveTo(100, 89, 103, 92);
  ctx.stroke();

  // Cute Pink Nose & Smile
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath();
  ctx.moveTo(97, 103);
  ctx.lineTo(103, 103);
  ctx.lineTo(100, 107);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  ctx.arc(100, 109, 4.5, 0, Math.PI);
  ctx.fill();

  // Collar & Red Striped Tie
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.moveTo(88, 126);
  ctx.lineTo(97, 133);
  ctx.lineTo(100, 128);
  ctx.lineTo(103, 133);
  ctx.lineTo(112, 126);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(96, 128);
  ctx.lineTo(104, 128);
  ctx.lineTo(108, 162);
  ctx.lineTo(100, 170);
  ctx.lineTo(92, 162);
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.moveTo(95, 136);
  ctx.lineTo(105, 142);
  ctx.moveTo(94, 147);
  ctx.lineTo(106, 153);
  ctx.stroke();

  // Waving Left Paw
  ctx.save();
  ctx.translate(44, 115);
  ctx.rotate(-0.43);
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 14, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.ellipse(0, -1, 7, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Right Paw Holding Glowing Clipboard
  ctx.save();
  ctx.translate(115, 110);
  ctx.rotate(-0.17);
  ctx.fillStyle = '#0284c7';
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(0, 0, 34, 46, 4);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.roundRect(3, 6, 28, 36, 2);
  ctx.fill();

  // Gold Star on Clipboard
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(17, 3, 5, 0, Math.PI * 2);
  ctx.fill();

  // Checklist lines
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(6, 14);
  ctx.lineTo(9, 17);
  ctx.lineTo(14, 11);
  ctx.moveTo(6, 23);
  ctx.lineTo(9, 26);
  ctx.lineTo(14, 20);
  ctx.stroke();

  ctx.strokeStyle = '#94a3b8';
  ctx.beginPath();
  ctx.moveTo(17, 14);
  ctx.lineTo(27, 14);
  ctx.moveTo(17, 23);
  ctx.lineTo(27, 23);
  ctx.moveTo(17, 31);
  ctx.lineTo(26, 31);
  ctx.stroke();
  ctx.restore();

  // Paw holding clipboard
  ctx.fillStyle = furGrad;
  ctx.beginPath();
  ctx.arc(132, 144, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function renderScorecardToCanvas(data: ScorecardData): HTMLCanvasElement {
  const width = 1080;
  const height = 1920;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Outer Phone Frame Background (#020617)
  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, width, height);

  // Outer Phone Frame Border
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.roundRect(14, 14, width - 28, height - 28, 86);
  ctx.stroke();

  // Inner Story Screen Container
  const screenX = 36;
  const screenY = 36;
  const screenW = width - 72;
  const screenH = height - 72;

  let bgGrad = ctx.createLinearGradient(0, screenY, 0, screenY + screenH);
  if (data.vibeTemplate === 'neon') {
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#0d1e33');
    bgGrad.addColorStop(1, '#07111e');
  } else if (data.vibeTemplate === 'midnight') {
    bgGrad.addColorStop(0, '#100a1c');
    bgGrad.addColorStop(0.5, '#1a0f30');
    bgGrad.addColorStop(1, '#0a0614');
  } else {
    bgGrad.addColorStop(0, '#18090a');
    bgGrad.addColorStop(0.5, '#2a1014');
    bgGrad.addColorStop(1, '#0d0507');
  }

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenW, screenH, 68);
  ctx.clip();

  ctx.fillStyle = bgGrad;
  ctx.fillRect(screenX, screenY, screenW, screenH);

  // Vibrant Ambient Glow Blob
  const blob1 = ctx.createRadialGradient(540, 560, 60, 540, 560, 560);
  if (data.vibeTemplate === 'neon') {
    blob1.addColorStop(0, 'rgba(6, 182, 212, 0.28)');
    blob1.addColorStop(0.5, 'rgba(16, 185, 129, 0.14)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else if (data.vibeTemplate === 'midnight') {
    blob1.addColorStop(0, 'rgba(168, 85, 247, 0.3)');
    blob1.addColorStop(0.5, 'rgba(236, 72, 153, 0.14)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    blob1.addColorStop(0, 'rgba(249, 115, 22, 0.32)');
    blob1.addColorStop(0.5, 'rgba(239, 68, 68, 0.16)');
    blob1.addColorStop(1, 'rgba(0, 0, 0, 0)');
  }
  ctx.fillStyle = blob1;
  ctx.fillRect(screenX, screenY, screenW, screenH);
  ctx.restore();

  // Inner Screen Border
  ctx.strokeStyle = data.vibeTemplate === 'sunset' ? 'rgba(245, 158, 11, 0.5)' : data.vibeTemplate === 'midnight' ? 'rgba(168, 85, 247, 0.5)' : 'rgba(6, 182, 212, 0.5)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenW, screenH, 68);
  ctx.stroke();

  // Phone Speaker Notch at Top Center
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(width / 2 - 140, 42, 280, 38, 19);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 50, 56, 100, 10, 5);
  ctx.fill();

  // Header Row 1: INTERVIEWAI • GEN-Z EDITION & LOLOS VERIFIKASI
  ctx.fillStyle = '#22d3ee';
  ctx.font = '900 26px "JetBrains Mono", monospace';
  ctx.fillText('INTERVIEWAI', 84, 152);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 24px "JetBrains Mono", monospace';
  ctx.fillText('• GEN-Z EDITION', 280, 152);

  // Green Badge: ● LOLOS VERIFIKASI ⚡
  ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
  ctx.beginPath();
  ctx.roundRect(width - 395, 116, 315, 52, 26);
  ctx.fill();
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#34d399';
  ctx.beginPath();
  ctx.arc(width - 365, 142, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = '800 22px "JetBrains Mono", monospace';
  ctx.fillText('LOLOS VERIFIKASI ⚡', width - 344, 150);

  // Header Row 2: Blue Circle Avatar + Candidate Name + ROLE + Tier Badge
  const avatarX = 122;
  const avatarY = 236;
  const avatarGrad = ctx.createLinearGradient(avatarX - 38, avatarY - 38, avatarX + 38, avatarY + 38);
  avatarGrad.addColorStop(0, '#2563eb');
  avatarGrad.addColorStop(1, '#06b6d4');
  ctx.fillStyle = avatarGrad;
  ctx.beginPath();
  ctx.arc(avatarX, avatarY, 38, 0, Math.PI * 2);
  ctx.fill();

  const nameText = data.candidateName || 'Johan';
  const initialChar = nameText.charAt(0).toUpperCase();
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 34px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initialChar, avatarX, avatarY + 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(nameText.length > 18 ? nameText.slice(0, 18) + '...' : nameText, 180, 228);

  ctx.fillStyle = '#67e8f9';
  ctx.font = 'bold 22px "JetBrains Mono", monospace';
  ctx.fillText(`ROLE: ${(data.jobTrack || 'ACCOUNTING').toUpperCase()} • READY TO HIRE`, 180, 262);

  // Tier Pill on Right
  const tierText = data.tier || 'TIER B (PERLU LATIHAN)';
  const tierLabel = `👑 ${tierText}`;
  ctx.font = '900 21px "JetBrains Mono", monospace';
  const measuredTierW = Math.max(290, Math.min(400, ctx.measureText(tierLabel).width + 44));
  const tierX = width - 80 - measuredTierW;

  ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
  ctx.beginPath();
  ctx.roundRect(tierX, 198, measuredTierW, 56, 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fcd34d';
  ctx.fillText(tierLabel, tierX + 20, 234);

  // MAIN CARD AREA
  const cardY = 470;
  const cardH = 770;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
  ctx.beginPath();
  ctx.roundRect(76, cardY, width - 152, cardH, 42);
  ctx.fill();
  ctx.strokeStyle = 'rgba(51, 65, 85, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Floating Sticker Pill Centered Above Card (Rotated -3 deg)
  const stickerText = data.sticker || '☕ NGOPI DULU GAIS';
  ctx.save();
  ctx.translate(width / 2, cardY - 12);
  ctx.rotate(-0.055);
  const stkGrad = ctx.createLinearGradient(-190, 0, 190, 0);
  stkGrad.addColorStop(0, '#f43f5e');
  stkGrad.addColorStop(0.5, '#ec4899');
  stkGrad.addColorStop(1, '#f59e0b');
  ctx.fillStyle = stkGrad;
  ctx.beginPath();
  ctx.roundRect(-195, -42, 390, 84, 42);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 25px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(stickerText, 0, -4);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('tap ganti ↻', 0, 24);
  ctx.restore();
  ctx.textAlign = 'left';

  // Big Score (e.g. 34 /100)
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 138px "Plus Jakarta Sans", sans-serif';
  const scoreStr = `${data.score}`;
  ctx.fillText(scoreStr, 118, cardY + 168);
  const scoreW = ctx.measureText(scoreStr).width;

  ctx.fillStyle = '#64748b';
  ctx.font = 'bold 46px "JetBrains Mono", monospace';
  ctx.fillText('/100', 118 + scoreW + 8, cardY + 168);

  // Verdict Subtitle Below Score
  const verdictStr = data.verdict || (data.score >= 80 ? 'Sangat Siap Kerja' : data.score >= 70 ? 'Cukup Siap Kerja' : 'Perlu Pendalaman STAR');
  ctx.fillStyle = '#34d399';
  ctx.font = '800 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`✦ ${verdictStr} - ${tierText} ✦`, 118, cardY + 220);

  // Cute Blue Mascot Cat on Right Side of Card + Tilted White Speech Bubble
  const catCenterX = width - 235;
  const catCenterY = cardY + 150;
  drawMascotCatOnCanvas(ctx, catCenterX, catCenterY, 1.15);

  const bubbleText = data.catComment || 'Santai bro, jam terbang bikin jago! Latihan lagi yuk 🐾';
  ctx.save();
  ctx.translate(catCenterX - 210, catCenterY - 125);
  ctx.rotate(-0.08);
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(0, 0, 395, 50, 25);
  ctx.fill();
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#0f172a';
  ctx.font = '800 17px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(bubbleText.length > 44 ? bubbleText.slice(0, 42) + '...' : bubbleText, 16, 31);
  ctx.restore();

  // PERSONA BOX (With Emoji + Title + "Otomatis XX%" Badge + Quote)
  const personaY = cardY + 265;
  ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
  ctx.beginPath();
  ctx.roundRect(112, personaY, width - 224, 185, 28);
  ctx.fill();
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // "Otomatis XX%" Badge on Right of Persona Box
  const autoBadgeText = `Otomatis ${data.score}%`;
  ctx.font = 'bold 20px "JetBrains Mono", monospace';
  const autoBadgeW = ctx.measureText(autoBadgeText).width + 32;
  const autoBadgeX = width - 112 - autoBadgeW - 24;
  ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.beginPath();
  ctx.roundRect(autoBadgeX, personaY + 22, autoBadgeW, 38, 10);
  ctx.fill();
  ctx.fillStyle = '#fcd34d';
  ctx.fillText(autoBadgeText, autoBadgeX + 16, personaY + 48);

  // Persona Header Title (Truncated cleanly before badge)
  const personaEmoji = data.personaEmoji || (data.score < 70 ? '🥊' : '👑');
  const rawTitle = `${personaEmoji} ${data.personaTitle}`;
  ctx.fillStyle = '#fcd34d';
  ctx.font = '800 22px "Plus Jakarta Sans", sans-serif';
  const maxTitleWidth = autoBadgeX - 150;
  let fittedTitle = rawTitle;
  while (ctx.measureText(fittedTitle).width > maxTitleWidth && fittedTitle.length > 10) {
    fittedTitle = fittedTitle.slice(0, -4) + '...';
  }
  ctx.fillText(fittedTitle, 140, personaY + 50);

  // Persona Quote
  ctx.fillStyle = '#cbd5e1';
  ctx.font = 'italic 23px "Plus Jakarta Sans", sans-serif';
  const quote = `"${data.personaQuote}"`;
  if (quote.length > 58) {
    const half = quote.lastIndexOf(' ', 56);
    ctx.fillText(quote.slice(0, half > 0 ? half : 55), 140, personaY + 104);
    ctx.fillText(quote.slice(half > 0 ? half + 1 : 55), 140, personaY + 142);
  } else {
    ctx.fillText(quote, 140, personaY + 112);
  }

  // 4 STAR PILLARS COMPACT GRID (Matching Screenshot 1)
  const starY = cardY + 480;
  const pillars = [
    { label: 'SITUATION', desc: '⚡ Gercep Parah', val: data.situation, color: '#34d399' },
    { label: 'TASK', desc: '🎯 No Drama', val: data.task, color: '#60a5fa' },
    { label: 'ACTION', desc: '🛠️ Sat-Set Gaspol', val: data.action, color: '#2dd4bf' },
    { label: 'RESULT', desc: '📈 Penting Cuan', val: data.result, color: '#c084fc' },
  ];

  pillars.forEach((p, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const px = 112 + col * 438;
    const py = starY + row * 126;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.beginPath();
    ctx.roundRect(px, py, 418, 108, 22);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px "JetBrains Mono", monospace';
    ctx.fillText(p.label, px + 24, py + 42);

    ctx.fillStyle = p.color;
    ctx.font = 'bold 24px "JetBrains Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(`${p.val}%`, px + 394, py + 42);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 21px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(p.desc, px + 24, py + 82);
  });

  // FOOTER / QR CODE BOX (VIRAL CTA - EYE CATCHING NEON)
  const footerY = 1360;
  const footerGrad = ctx.createLinearGradient(76, footerY, width - 76, footerY + 240);
  footerGrad.addColorStop(0, '#020617');
  footerGrad.addColorStop(0.5, '#071a26');
  footerGrad.addColorStop(1, '#0b1528');
  ctx.fillStyle = footerGrad;
  ctx.beginPath();
  ctx.roundRect(76, footerY, width - 152, 235, 34);
  ctx.fill();

  const borderGrad = ctx.createLinearGradient(76, footerY, width - 76, footerY);
  borderGrad.addColorStop(0, '#34d399');
  borderGrad.addColorStop(0.5, '#22d3ee');
  borderGrad.addColorStop(1, '#3b82f6');
  ctx.strokeStyle = borderGrad;
  ctx.lineWidth = 4;
  ctx.stroke();

  // Header Badge Pill inside Footer
  ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
  ctx.beginPath();
  ctx.roundRect(112, footerY + 26, 555, 46, 23);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.55)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = '900 23px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('🔥 COBA SIMULASI INTERVIEW AI GRATIS', 136, footerY + 57);

  // Highlighted URL Pill Box
  ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
  ctx.beginPath();
  ctx.roundRect(112, footerY + 86, 655, 58, 18);
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#67e8f9';
  ctx.font = '900 22px "JetBrains Mono", monospace';
  ctx.fillText('🌐 https://interview-ai-wheat-one.vercel.app', 132, footerY + 122);
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(172, footerY + 129);
  ctx.lineTo(742, footerY + 129);
  ctx.stroke();

  ctx.fillStyle = '#bae6fd';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('⚡ Scan QR atau klik link buat tes mental interview bareng!', 116, footerY + 188);

  // Crisp QR Code Box with "SCAN GRATIS"
  const qrX = width - 256;
  const qrY = footerY + 34;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(qrX, qrY, 148, 168, 24);
  ctx.fill();
  ctx.strokeStyle = '#67e8f9';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.fillStyle = '#020617';
  ctx.fillRect(qrX + 24, qrY + 20, 36, 36);
  ctx.clearRect(qrX + 31, qrY + 27, 22, 22);
  ctx.fillRect(qrX + 36, qrY + 32, 12, 12);

  ctx.fillRect(qrX + 88, qrY + 20, 36, 36);
  ctx.clearRect(qrX + 95, qrY + 27, 22, 22);
  ctx.fillRect(qrX + 100, qrY + 32, 12, 12);

  ctx.fillRect(qrX + 24, qrY + 80, 36, 36);
  ctx.clearRect(qrX + 31, qrY + 87, 22, 22);
  ctx.fillRect(qrX + 36, qrY + 92, 12, 12);

  ctx.fillRect(qrX + 68, qrY + 28, 12, 24);
  ctx.fillRect(qrX + 66, qrY + 64, 24, 24);
  ctx.fillRect(qrX + 98, qrY + 72, 22, 16);
  ctx.fillRect(qrX + 70, qrY + 96, 22, 18);
  ctx.fillRect(qrX + 102, qrY + 98, 18, 18);

  ctx.fillStyle = '#0f172a';
  ctx.font = '900 16px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SCAN GRATIS', qrX + 74, qrY + 148);
  ctx.textAlign = 'left';

  // Bottom Green Link Bar (Inside Phone Frame)
  const pointerY = 1622;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
  ctx.beginPath();
  ctx.roundRect(76, pointerY, width - 152, 76, 24);
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.fillStyle = '#6ee7b7';
  ctx.font = '800 21px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('👇 KLIK LINK BIRU https://interview-ai-wheat-one.vercel.app DI BAWAH INI 👇', width / 2, pointerY + 46);
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(135, pointerY + 53);
  ctx.lineTo(width - 135, pointerY + 53);
  ctx.stroke();
  ctx.textAlign = 'left';

  // Bottom Watermark
  ctx.fillStyle = '#64748b';
  ctx.font = '500 19px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Terenkripsi & Terverifikasi STAR Matrix v4.2 • AI Interview Simulation System', width / 2, height - 115);
  ctx.textAlign = 'left';

  // Optional Safe Zone Guides (if toggled)
  if (data.showSafeZones) {
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.setLineDash([12, 12]);
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(screenX, 250);
    ctx.lineTo(screenX + screenW, 250);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(screenX, height - 320);
    ctx.lineTo(screenX + screenW, height - 320);
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
  ctx.font = 'bold 23px "Plus Jakarta Sans", sans-serif';
  const titleLine = `👑 Judul: ${data.personaTitle}`;
  ctx.fillText(titleLine.length > 68 ? titleLine.slice(0, 66) + '...' : titleLine, textX, boxY + 166);

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
  ctx.fillText('👉 Cobain Simulasi Gratis di sini (Klik Link Aktif di Caption):', textX, boxY + 580);

  // Pill Link URL
  ctx.fillStyle = 'rgba(6, 182, 212, 0.22)';
  ctx.beginPath();
  ctx.roundRect(textX, boxY + 598, 690, 56, 16);
  ctx.fill();
  ctx.strokeStyle = '#22d3ee';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#38bdf8';
  ctx.font = '900 24px "JetBrains Mono", monospace';
  ctx.fillText('🌐 https://interview-ai-wheat-one.vercel.app', textX + 20, boxY + 634);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(textX + 62, boxY + 641);
  ctx.lineTo(textX + 660, boxY + 641);
  ctx.stroke();

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
 * Ekspor Scorecard ke format PNG (Default: menyertakan Teks Evaluasi STAR + Scorecard)
 */
export function exportScorecardToPNG(data: ScorecardData, includeTextHeader = true): void {
  const canvas = includeTextHeader ? renderWhatsAppCompositeToCanvas(data) : renderScorecardToCanvas(data);
  const imageURL = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}.png`;
  link.href = imageURL;
  link.click();
}

/**
 * Ekspor & unduh Scorecard dalam format JPG (JPEG)
 * Default: menyertakan Teks Evaluasi STAR + Scorecard dalam satu gambar utuh
 */
export function exportScorecardToJPG(data: ScorecardData, includeTextHeader = true): string {
  const canvas = includeTextHeader ? renderWhatsAppCompositeToCanvas(data) : renderScorecardToCanvas(data);
  const jpgURL = canvas.toDataURL('image/jpeg', 0.95);
  const link = document.createElement('a');
  link.download = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}.jpg`;
  link.href = jpgURL;
  link.click();
  return jpgURL;
}

/**
 * Menghasilkan DataURL, Blob Scorecard JPG, File Gabungan (Teks Evaluasi STAR + Scorecard), dan Blob PNG untuk clipboard
 */
export async function getScorecardJPGData(data: ScorecardData): Promise<{ 
  dataUrl: string; 
  blob: Blob | null; 
  pngBlob: Blob | null;
  waCompositeFile: File;
}> {
  const canvas = renderWhatsAppCompositeToCanvas(data);
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  const fileName = `Scorecard_STAR_${(data.candidateName || 'Johan').replace(/\s+/g, '_')}_${data.score || 84}_1080x1920.jpg`;
  const waCompositeFile = dataUrlToFileSync(dataUrl, fileName, 'image/jpeg');
  
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
