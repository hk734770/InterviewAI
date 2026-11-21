export default function handler(req, res) {
  const ua = String(req.headers['user-agent'] || '');
  const isCrawler = /whatsapp\/|facebookexternalhit|facebot|meta-externalagent|twitterbot|telegrambot|linkedinbot|slackbot|discordbot/i.test(
    ua
  );

  // Untuk crawler pratinjau tautan (WhatsApp / Instagram / Meta / dll.), kembalikan 204 No Content
  // agar kotak link preview tidak muncul di atas pesan chat
  if (isCrawler) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(204).end();
    return;
  }

  // Untuk pengguna manusia yang mengakses /s secara langsung, arahkan ke aplikasi utama
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'interview-ai-wheat-one.vercel.app';
  res.writeHead(302, { Location: `${proto}://${host}/` });
  res.end();
}
