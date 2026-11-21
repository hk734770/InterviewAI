import fs from 'fs';

const TMP_FILE = '/tmp/interviewai_latest_scorecard.json';
let latestScorecardMemory = null;

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

function readLatestSaved() {
  if (latestScorecardMemory) return latestScorecardMemory;
  try {
    if (fs.existsSync(TMP_FILE)) {
      const raw = fs.readFileSync(TMP_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.sc === 'number') {
        latestScorecardMemory = parsed;
        return parsed;
      }
    }
  } catch (_) {}
  return null;
}

function saveLatest(payload) {
  latestScorecardMemory = payload;
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(payload), 'utf8');
  } catch (_) {}
}

export default async function handler(req, res) {
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'interview-ai-wheat-one.vercel.app';
  const origin = `${proto}://${host}`;

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        body = JSON.parse(body);
      } else if (!body) {
        const chunks = [];
        for await (const chunk of req) chunks.push(chunk);
        const raw = Buffer.concat(chunks).toString('utf8');
        body = raw ? JSON.parse(raw) : {};
      }

      const saved = {
        n: String(body.n || 'Johan').slice(0, 32),
        f: String(body.f || 'Logistik & Gudang').slice(0, 40),
        sc: clampScore(body.sc, 78),
        s: clampScore(body.s, clampScore(body.sc, 78)),
        t: clampScore(body.t, clampScore(body.sc, 78)),
        a: clampScore(body.a, clampScore(body.sc, 78)),
        r: clampScore(body.r, clampScore(body.sc, 78)),
        v: String(body.v || 'neon'),
        st: String(body.st || '').replace(/[^\x20-\x7E]/g, '').trim().slice(0, 40),
        ts: Date.now(),
      };
      saveLatest(saved);

      const ogParams = new URLSearchParams({
        n: saved.n,
        f: saved.f,
        sc: String(saved.sc),
        s: String(saved.s),
        t: String(saved.t),
        a: String(saved.a),
        r: String(saved.r),
        v: saved.v,
      });
      if (saved.st) ogParams.set('st', saved.st);

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.status(200).send(JSON.stringify({ ok: true, ogImageUrl: `${origin}/api/og?${ogParams.toString()}` }));
      return;
    } catch (err) {
      res.status(400).send(JSON.stringify({ ok: false }));
      return;
    }
  }

  const hasQueryScore = getParam(req, 'sc', '') !== '';
  const saved = !hasQueryScore ? readLatestSaved() : null;

  let ogImageUrl = `${origin}/api/og?mode=brand`;
  let pageTitle = 'InterviewAI - Simulasi Interview Kerja Realistis';
  let pageDesc =
    'Platform simulasi wawancara video call interaktif dengan AI Recruiter, diagnostik komprehensif 4 pilar STAR, dan viral scorecard 9:16 untuk media sosial.';

  if (hasQueryScore || saved) {
    const candidateName = hasQueryScore ? (getParam(req, 'n', 'Johan') || 'Johan').slice(0, 32) : saved.n;
    const jobTrack = hasQueryScore ? (getParam(req, 'f', 'Logistik & Gudang') || 'Logistik & Gudang').slice(0, 40) : saved.f;
    const score = hasQueryScore ? clampScore(getParam(req, 'sc', '78'), 78) : saved.sc;
    const situation = hasQueryScore ? clampScore(getParam(req, 's', String(score)), score) : saved.s;
    const task = hasQueryScore ? clampScore(getParam(req, 't', String(score)), score) : saved.t;
    const action = hasQueryScore ? clampScore(getParam(req, 'a', String(score)), score) : saved.a;
    const result = hasQueryScore ? clampScore(getParam(req, 'r', String(score)), score) : saved.r;
    const vibe = hasQueryScore ? getParam(req, 'v', 'neon') || 'neon' : saved.v;
    const sticker = hasQueryScore ? getParam(req, 'st', '') || '' : saved.st;
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

    ogImageUrl = `${origin}/api/og?${ogParams.toString()}`;
    pageTitle = `Scorecard STAR ${candidateName}: ${score}/100 (${tier})`;
    pageDesc = `Situation ${situation}% • Task ${task}% • Action ${action}% • Result ${result}% (${jobTrack}). Coba simulasi interview kerja AI gratis di InterviewAI!`;
  }

  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(pageDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="InterviewAI - Simulasi Interview Kerja Realistis" />
  <meta property="og:url" content="${escapeHtml(origin)}/" />
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
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.status(200).send(html);
}
