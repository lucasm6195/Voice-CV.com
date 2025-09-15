import fs from "fs";
import path from "path";

const STORE_FILE = path.join("/tmp", "payments.json");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { uid } = req.body || {};

    if (!uid) {
      res.status(400).json({ error: "uid requerido" });
      return;
    }

    let store = {};
    try {
      store = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    } catch {}

    const prev = store[uid] || { paid: false, used: false, canRecord: false };
    store[uid] = { ...prev, used: true, canRecord: false };

    fs.writeFileSync(STORE_FILE, JSON.stringify(store), "utf8");

    res.json({ ok: true });
  } catch (e) {
    console.error("mark-used error:", e);
    res.status(500).json({ error: "No se pudo marcar como usado" });
  }
}
