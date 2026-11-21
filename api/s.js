export const config = {
  runtime: 'edge',
};

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getTierForScore(score) {
  if (score >= 95) return 'TIER S+ (TOP 1% KANDIDAT)';
  if (score >= 90) return 'TIER S+ (GOKIL PARAH)';
  if (score >= 85) return 'TIER S (KOMPETEN & SOLID)';
  if (score >= 80) return 'TIER S (PEDE GASPOL)';
  if (score >= 75) return 'TIER A (HOKI TINGKAT TINGGI)';
  if (score >= 70) return 'TIER A (CUKUP SIAP KERJA)';
  if (score >= 60) return 'TIER B (POTENSI TERSEMBUNYI)';
  return 'TIER B (PERLU LATIHAN)';
}

function clampScore(val, fallback) {
  const num = Number.parseInt(val || '', 10);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(100, num));
}

export default async function handler(request) {
  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  // Deteksi crawler/bot preview tautan (WhatsApp, Instagram, Facebook, Telegram, Twitter, LinkedIn, dll.)
  const isPreviewBot =
    /whatsapp|facebookexternalhit|facebot|instagram|twitterbot|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|crawler|spider|preview|meta-externalagent|embedly/i.test(
      ua
    );

  // Jika yang membuka adalah pengguna manusia (klik link di WA / IG), langsung arahkan ke aplikasi utama
  if (!isPreviewBot) {
    return Response.redirect(`${origin}/`, 302);
  }

  const sp = url.searchParams;
  const candidateName = (sp.get('n') || 'Johan').slice(0, 32);
  const jobTrack = (sp.get('f') || 'Logistik & Gudang').slice(0, 40);
  const score = clampScore(sp.get('sc'), 78);
  const situation = clampScore(sp.get('s'), score);
  const task = clampScore(sp.get('t'), score);
  const action = clampScore(sp.get('a'), score);
  const result = clampScore(sp.get('r'), score);
  const vibe = sp.get('v') || 'neon';
  const sticker = sp.get('st') || '';
  const tier = getTierForScore(score);

  const ogParams = new URLSearchParams({
    n: candidateName,
    f: jobTrack,
    sc: String(score),
    s: String(situation),
    t: String(task),
    a: String(action),
    r: String(result),
    v: vibe,
  });
  if (sticker) ogParams.set('st', sticker);

  const ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;
  const pageTitle = `Scorecard STAR ${candidateName}: ${score}/100 (${tier})`;
  const pageDesc = `Situation ${situation}% • Task ${task}% • Action ${action}% • Result ${result}% (${jobTrack}). Coba simulasi interview kerja AI gratis di InterviewAI!`;

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="InterviewAI - Simulasi Interview Kerja Realistis" />
  <meta property="og:url" content="${escapeHtml(url.toString())}" />
  <meta property="og:title" content="${escapeHtml(pageTitle)}" />
  <meta property="og:description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:image" content="${escapeHtml(ogImageUrl)}" />
  <meta property="og:image:secure_url" content="${escapeHtml(ogImageUrl)}" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="860" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(pageTitle)}" />
  <meta name="twitter:description" content="${escapeHtml(pageDesc)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImageUrl)}" />
  <meta http-equiv="refresh" content="0;url=${escapeHtml(origin)}/" />
</head>
<body style="background:#080c14;color:#e2e8f0;font-family:sans-serif;padding:24px;">
  <p>Membuka InterviewAI Simulation Core...</p>
  <script>window.location.replace(${JSON.stringify(`${origin}/`)});</script>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
}
