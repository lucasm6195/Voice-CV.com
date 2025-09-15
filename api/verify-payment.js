import Stripe from "stripe";
import fs from "fs";
import path from "path";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});

const STORE_FILE = path.join("/tmp", "payments.json");

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { session_id, uid } = req.query || {};

  if (!session_id || !uid) {
    res.status(400).json({ error: "session_id y uid requeridos" });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paid = session && (session.payment_status === "paid" || session.status === "complete");

    if (!paid) {
      res.json({ paid: false });
      return;
    }

    let store = {};
    try {
      store = JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
    } catch {}

    store[uid] = { ...(store[uid] || {}), paid: true, used: store[uid]?.used || false, canRecord: true };
    fs.writeFileSync(STORE_FILE, JSON.stringify(store), "utf8");

    res.json({ paid: true });
  } catch (e) {
    console.error("verify-payment error:", e);
    res.status(500).json({ error: "No se pudo verificar el pago" });
  }
}
