import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
import satori from 'satori';
import { initWasm, Resvg } from '@resvg/resvg-wasm';

const require = createRequire(import.meta.url);

let wasmInitPromise = null;
let cachedFontBuffer = null;

function getFontBuffer() {
  if (cachedFontBuffer) return cachedFontBuffer;
  const candidates = [
    new URL('./Geist-Regular.ttf', import.meta.url),
    path.join(process.cwd(), 'api', 'Geist-Regular.ttf'),
  ];
  for (const p of candidates) {
    try {
      cachedFontBuffer = fs.readFileSync(p);
      return cachedFontBuffer;
    } catch (_) {}
  }
  throw new Error('Font Geist-Regular.ttf not found');
}

async function ensureWasmInitialized() {
  if (!wasmInitPromise) {
    wasmInitPromise = (async () => {
      const candidates = [];
      try {
        candidates.push(require.resolve('@resvg/resvg-wasm/index_bg.wasm'));
      } catch (_) {}
      candidates.push(path.join(process.cwd(), 'node_modules', '@resvg', 'resvg-wasm', 'index_bg.wasm'));
      candidates.push(new URL('../node_modules/@resvg/resvg-wasm/index_bg.wasm', import.meta.url));

      let wasmBuf = null;
      for (const p of candidates) {
        try {
          wasmBuf = fs.readFileSync(p);
          break;
        } catch (_) {}
      }
      if (!wasmBuf) {
        throw new Error('resvg index_bg.wasm not found');
      }
      await initWasm(wasmBuf);
    })();
  }
  return wasmInitPromise;
}

function getPersonaForScore(score) {
  if (score >= 95) {
    return {
      title: 'Aura Calon Direktur, Nada Bicara Siap RUPS',
      quote: 'Semua jawaban diselipin terminologi berbobot standar Fortune 500. Interviewer berasa lagi presentasi ke calon komisaris!',
      tier: 'TIER S+ (TOP 1% KANDIDAT)',
      verdict: 'Sangat Layak Direkrut',
      sticker: 'LOLOS TAHAP 1 AMIN',
    };
  }
  if (score >= 90) {
    return {
      title: 'Ninja STAR: Sat-Set Gaspol No Basa-Basi',
      quote: 'Situasi jelas, aksi nyata, hasil konkret. Langsung to the point bikin HRD manggut-manggut.',
      tier: 'TIER S+ (GOKIL PARAH)',
      verdict: 'Sangat Layak Direkrut',
      sticker: 'AUTO OFFERING LETTER',
    };
  }
  if (score >= 85) {
    return {
      title: 'Pede Tingkat Dewa, Jawaban Mengalir',
      quote: 'HRD belum selesai nanya, jawaban udah 3 paragraf. Kharisma 99%, siap gaspol!',
      tier: 'TIER S (KOMPETEN & SOLID)',
      verdict: 'Siap Kerja & Kompeten',
      sticker: 'EMANG BOLEH SE-STAR INI?',
    };
  }
  if (score >= 80) {
    return {
      title: 'Si Master Ngeles Berkelas Tapi Lolos',
      quote: 'Interview kayak nongkrong santai di Senopati, luwes banget! Ditanya apapun ngalir lancar.',
      tier: 'TIER S (PEDE GASPOL)',
      verdict: 'Siap Kerja & Kompeten',
      sticker: 'MENYALA ABANGKUH',
    };
  }
  if (score >= 75) {
    return {
      title: 'Kucing Oren Vibes: Modal Senyum, Lolos Top 20%',
      quote: 'Muka tenang, dada dug-dug ser-seran. Untung AI Jessica gak liat tangan gemeteran di bawah meja.',
      tier: 'TIER A (HOKI TINGKAT TINGGI)',
      verdict: 'Cukup Siap Kerja',
      sticker: 'MEOW APPROVED 100%',
    };
  }
  if (score >= 70) {
    return {
      title: 'Si Penutur Santai Tapi Kurang STAR',
      quote: 'Gaya bicaramu super tenang dan meyakinkan, tinggal poles angka terukur di bagian Result!',
      tier: 'TIER A (CUKUP SIAP KERJA)',
      verdict: 'Cukup Siap Kerja',
      sticker: 'VIBES SENOPATI 100%',
    };
  }
  if (score >= 60) {
    return {
      title: 'Ninja Terselubung: Hemat Kata Tapi Ngena',
      quote: 'Jawaban to the point banget sampai interviewer nungguin kelanjutannya. Tambahin detail STAR biar makin nendang!',
      tier: 'TIER B (POTENSI TERSEMBUNYI)',
      verdict: 'Perlu Pendalaman STAR',
      sticker: 'SAT-SET NO DRAMA',
    };
  }
  return {
    title: 'Pejuang STAR: Masih Pemanasan Tapi Mental Baja',
    quote: 'Masih rada grogi dan jawab singkat-singkat, tapi mental berani uji coba simulasi udah dapet nilai 100!',
    tier: 'TIER B (PERLU LATIHAN)',
    verdict: 'Perlu Pendalaman STAR',
    sticker: 'NGOPI DULU GAIS',
  };
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

function el(type, props, ...children) {
  const flat = children.flat().filter((c) => c !== null && c !== undefined && c !== false);
  return {
    type,
    props: {
      ...(props || {}),
      children: flat.length === 1 ? flat[0] : flat.length > 1 ? flat : undefined,
    },
  };
}

export default async function handler(req, res) {
  try {
    const mode = getParam(req, 'mode', '');
    if (mode === 'brand') {
      const brandTree = el(
        'div',
        {
          style: {
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'linear-gradient(180deg, #07111e 0%, #0d1e33 50%, #090d16 100%)',
            padding: '48px 56px',
            color: '#ffffff',
            fontFamily: 'Geist',
            border: '6px solid #22d3ee',
          },
        },
        el(
          'div',
          { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
          el('span', { style: { fontSize: '28px', fontWeight: 900, color: '#22d3ee', letterSpacing: '0.08em' } }, 'INTERVIEWAI • SIMULATION CORE'),
          el(
            'div',
            {
              style: {
                display: 'flex',
                backgroundColor: 'rgba(16, 185, 129, 0.16)',
                border: '2px solid rgba(52, 211, 153, 0.45)',
                borderRadius: '999px',
                padding: '10px 24px',
                color: '#34d399',
                fontSize: '20px',
                fontWeight: 800,
              },
            },
            'GRATIS 3 PERTANYAAN PERTAMA'
          )
        ),
        el(
          'div',
          { style: { display: 'flex', flexDirection: 'column', gap: '20px' } },
          el('span', { style: { fontSize: '64px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 } }, 'Latihan Interview Kerja Tanpa Gugup & Auto Lolos HRD'),
          el(
            'span',
            { style: { fontSize: '26px', color: '#cbd5e1', lineHeight: 1.4 } },
            'Simulasi video call Zoom realistis bersama AI HRD, transkrip suara real-time, evaluasi 4 pilar metode STAR, dan Viral Scorecard 9:16.'
          )
        ),
        el(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '18px 28px',
              borderRadius: '18px',
              backgroundColor: 'rgba(6, 182, 212, 0.16)',
              border: '2px solid rgba(34, 211, 238, 0.5)',
            },
          },
          el('span', { style: { fontSize: '22px', fontWeight: 900, color: '#6ee7b7' } }, 'COBA SIMULASI INTERVIEW AI GRATIS'),
          el('span', { style: { fontSize: '24px', fontWeight: 900, color: '#67e8f9' } }, 'https://interview-ai-wheat-one.vercel.app')
        )
      );

      const fontData = getFontBuffer();
      const svg = await satori(brandTree, {
        width: 1200,
        height: 860,
        fonts: [
          { name: 'Geist', data: fontData, weight: 400, style: 'normal' },
          { name: 'Geist', data: fontData, weight: 700, style: 'normal' },
          { name: 'Geist', data: fontData, weight: 800, style: 'normal' },
          { name: 'Geist', data: fontData, weight: 900, style: 'normal' },
        ],
      });
      await ensureWasmInitialized();
      const pngBuffer = Buffer.from(new Resvg(svg).render().asPng());
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable');
      res.status(200).send(pngBuffer);
      return;
    }

    const candidateName = (getParam(req, 'n', 'Johan') || 'Johan').slice(0, 32);
    const jobTrack = (getParam(req, 'f', 'Logistik & Gudang') || 'Logistik & Gudang').slice(0, 40);
    const score = clampScore(getParam(req, 'sc', '78'), 78);
    const situation = clampScore(getParam(req, 's', String(score)), score);
    const task = clampScore(getParam(req, 't', String(score)), score);
    const action = clampScore(getParam(req, 'a', String(score)), score);
    const result = clampScore(getParam(req, 'r', String(score)), score);
    const vibe = getParam(req, 'v', 'neon') || 'neon';

    const persona = getPersonaForScore(score);
    const rawSticker = getParam(req, 'st', persona.sticker) || persona.sticker;
    const cleanSticker = rawSticker.replace(/[^\x20-\x7E]/g, '').trim() || persona.sticker;
    const initial = (candidateName.trim().charAt(0) || 'J').toUpperCase();

    const themes = {
      neon: {
        bg: 'linear-gradient(180deg, #07111e 0%, #0d1e33 50%, #090d16 100%)',
        border: '#22d3ee',
        accent: '#22d3ee',
      },
      midnight: {
        bg: 'linear-gradient(180deg, #100a1c 0%, #1a0f30 50%, #0a0614 100%)',
        border: '#a855f7',
        accent: '#c084fc',
      },
      sunset: {
        bg: 'linear-gradient(180deg, #18090a 0%, #2a1014 50%, #0d0507 100%)',
        border: '#f59e0b',
        accent: '#fbbf24',
      },
    };
    const theme = themes[vibe] || themes.neon;

    const pillarCard = (label, value, subtitle, valueColor) =>
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#050a14',
            border: '2px solid #1e293b',
            borderRadius: '18px',
            padding: '16px 22px',
          },
        },
        el(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            },
          },
          el(
            'span',
            {
              style: {
                fontSize: '20px',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.06em',
              },
            },
            label
          ),
          el(
            'span',
            {
              style: {
                fontSize: '30px',
                fontWeight: 900,
                color: valueColor,
              },
            },
            `${value}%`
          )
        ),
        el(
          'span',
          {
            style: {
              fontSize: '18px',
              color: '#cbd5e1',
              marginTop: '6px',
              fontWeight: 600,
            },
          },
          subtitle
        )
      );

    const tree = el(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: theme.bg,
          padding: '28px 36px',
          color: '#ffffff',
          fontFamily: 'Geist',
          border: `6px solid ${theme.border}`,
        },
      },
      // Top Brand Header
      el(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          },
        },
        el(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '12px' } },
          el(
            'span',
            { style: { fontSize: '24px', fontWeight: 900, color: theme.accent, letterSpacing: '0.08em' } },
            'INTERVIEWAI'
          ),
          el(
            'span',
            { style: { fontSize: '20px', fontWeight: 700, color: '#94a3b8' } },
            '• GEN-Z EDITION'
          )
        ),
        el(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(16, 185, 129, 0.16)',
              border: '2px solid rgba(52, 211, 153, 0.45)',
              borderRadius: '999px',
              padding: '8px 20px',
              color: '#34d399',
              fontSize: '18px',
              fontWeight: 800,
            },
          },
          '• LOLOS VERIFIKASI'
        )
      ),

      // Candidate Identity + Tier Row
      el(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginTop: '14px',
          },
        },
        el(
          'div',
          { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
          el(
            'div',
            {
              style: {
                width: '62px',
                height: '62px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #2563eb, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '30px',
                fontWeight: 900,
                color: '#ffffff',
              },
            },
            initial
          ),
          el(
            'div',
            { style: { display: 'flex', flexDirection: 'column' } },
            el(
              'span',
              { style: { fontSize: '32px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1 } },
              candidateName
            ),
            el(
              'span',
              { style: { fontSize: '18px', fontWeight: 700, color: '#67e8f9', marginTop: '4px' } },
              `ROLE: ${jobTrack.toUpperCase()} • READY TO HIRE`
            )
          )
        ),
        el(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(245, 158, 11, 0.18)',
              border: '2px solid rgba(251, 191, 36, 0.5)',
              borderRadius: '14px',
              padding: '10px 20px',
              color: '#fcd34d',
              fontSize: '19px',
              fontWeight: 900,
            },
          },
          persona.tier
        )
      ),

      // Main Scorecard Box
      el(
        'div',
        {
          style: {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(15, 23, 42, 0.92)',
            border: '2px solid #334155',
            borderRadius: '28px',
            padding: '26px 30px',
            marginTop: '16px',
            flex: 1,
            justifyContent: 'space-between',
          },
        },
        // Score + Sticker Row
        el(
          'div',
          {
            style: {
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            },
          },
          el(
            'div',
            { style: { display: 'flex', flexDirection: 'column' } },
            el(
              'div',
              { style: { display: 'flex', alignItems: 'baseline', gap: '10px' } },
              el(
                'span',
                { style: { fontSize: '104px', fontWeight: 900, color: '#ffffff', lineHeight: 0.95 } },
                String(score)
              ),
              el(
                'span',
                { style: { fontSize: '42px', fontWeight: 800, color: '#64748b' } },
                '/ 100'
              )
            ),
            el(
              'span',
              { style: { fontSize: '21px', fontWeight: 800, color: '#34d399', marginTop: '8px' } },
              `• ${persona.verdict} • ${persona.tier} •`
            )
          ),
          el(
            'div',
            {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '12px',
              },
            },
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  background: 'linear-gradient(90deg, #f43f5e, #ec4899, #f59e0b)',
                  color: '#ffffff',
                  fontSize: '22px',
                  fontWeight: 900,
                  padding: '12px 26px',
                  borderRadius: '999px',
                  border: '2px solid rgba(255,255,255,0.6)',
                },
              },
              cleanSticker
            ),
            el(
              'div',
              {
                style: {
                  display: 'flex',
                  backgroundColor: 'rgba(6, 182, 212, 0.16)',
                  border: '2px solid rgba(34, 211, 238, 0.45)',
                  color: '#67e8f9',
                  fontSize: '18px',
                  fontWeight: 800,
                  padding: '8px 18px',
                  borderRadius: '12px',
                },
              },
              `Skor STAR Aktual: ${score}%`
            )
          )
        ),

        // Persona Box
        el(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#050a14',
              border: '2px solid rgba(245, 158, 11, 0.45)',
              borderRadius: '18px',
              padding: '16px 22px',
              marginTop: '14px',
            },
          },
          el(
            'div',
            { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
            el(
              'span',
              { style: { fontSize: '23px', fontWeight: 900, color: '#fcd34d' } },
              persona.title
            ),
            el(
              'span',
              {
                style: {
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#fde68a',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  padding: '4px 12px',
                  borderRadius: '8px',
                },
              },
              `Otomatis ${score}%`
            )
          ),
          el(
            'span',
            { style: { fontSize: '18px', color: '#cbd5e1', marginTop: '6px', lineHeight: 1.35 } },
            `"${persona.quote}"`
          )
        ),

        // 4 STAR Pillars (Explicit 2 rows x 2 columns)
        el(
          'div',
          {
            style: {
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              marginTop: '14px',
              width: '100%',
            },
          },
          el(
            'div',
            { style: { display: 'flex', flexDirection: 'row', gap: '16px', width: '100%' } },
            pillarCard('SITUATION', situation, 'Gercep Parah', '#34d399'),
            pillarCard('TASK', task, 'No Drama', '#60a5fa')
          ),
          el(
            'div',
            { style: { display: 'flex', flexDirection: 'row', gap: '16px', width: '100%' } },
            pillarCard('ACTION', action, 'Sat-Set Gaspol', '#2dd4bf'),
            pillarCard('RESULT', result, 'Penting Cuan', '#c084fc')
          )
        )
      ),

      // Footer Link Bar
      el(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '14px',
            padding: '12px 22px',
            borderRadius: '16px',
            backgroundColor: 'rgba(6, 182, 212, 0.14)',
            border: '2px solid rgba(34, 211, 238, 0.5)',
          },
        },
        el(
          'span',
          { style: { fontSize: '19px', fontWeight: 900, color: '#6ee7b7' } },
          'COBA SIMULASI INTERVIEW AI GRATIS'
        ),
        el(
          'span',
          { style: { fontSize: '20px', fontWeight: 900, color: '#67e8f9' } },
          'https://interview-ai-wheat-one.vercel.app'
        )
      )
    );

    const fontData = getFontBuffer();
    const svg = await satori(tree, {
      width: 1200,
      height: 860,
      fonts: [
        { name: 'Geist', data: fontData, weight: 400, style: 'normal' },
        { name: 'Geist', data: fontData, weight: 600, style: 'normal' },
        { name: 'Geist', data: fontData, weight: 700, style: 'normal' },
        { name: 'Geist', data: fontData, weight: 800, style: 'normal' },
        { name: 'Geist', data: fontData, weight: 900, style: 'normal' },
      ],
    });

    await ensureWasmInitialized();
    const pngBuffer = Buffer.from(new Resvg(svg).render().asPng());

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, s-maxage=31536000, max-age=31536000, immutable');
    res.status(200).send(pngBuffer);
  } catch (err) {
    console.error('OG generation error:', err);
    res.status(500).send('Failed to generate scorecard image');
  }
}
