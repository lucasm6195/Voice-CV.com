export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { uid } = req.query || {};

  res.status(200).json({
    ok: true,
    uid: uid || null,
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Voice-CV API"
  });
}
