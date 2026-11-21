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
  const num = Number.parseInt(Array.isArray(val) ? val[0] : (val || ''), 10);
  if (Number.isNaN(num)) return fallback;
  return Math.max(0, Math.min(100, num));
}

function getParam(req, key, fallback = '') {
  if (req.query && req.query[key] !== undefined) {
    const v = req.query[key];
    return String(Array.isArray(v) ? v[0] : v);
  }
  try {
    const u = new URL(req.url || '/', 'https://interview-ai-wheat-one.vercel.app');
    return u.searchParams.get(key) || fallback;
  } catch {
    return fallback;
  }
}

export default function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'interview-ai-wheat-one.vercel.app';
  const origin = `${proto}://${host}`;

  const candidateName = (getParam(req, 'n', 'Johan') || 'Johan').slice(0, 32);
  const jobTrack = (getParam(req, 'f', 'Logistik & Gudang') || 'Logistik & Gudang').slice(0, 40);
  const score = clampScore(getParam(req, 'sc', '78'), 78);
  const situation = clampScore(getParam(req, 's', String(score)), score);
  const task = clampScore(getParam(req, 't', String(score)), score);
  const action = clampScore(getParam(req, 'a', String(score)), score);
  const result = clampScore(getParam(req, 'r', String(score)), score);
  const vibe = getParam(req, 'v', 'neon') || 'neon';
  const sticker = getParam(req, 'st', '') || '';
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

  const pageUrl = `${origin}/s?${ogParams.toString()}`;
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
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
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
</head>
<body style="background:#080c14;color:#e2e8f0;font-family:sans-serif;padding:24px;text-align:center;">
  <p>Membuka InterviewAI Simulation Core...</p>
  <p><a href="${escapeHtml(origin)}/" style="color:#38bdf8;">Klik di sini jika tidak otomatis terbuka</a></p>
  <script>window.location.replace(${JSON.stringify(`${origin}/`)});</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.status(200).send(html);
}
