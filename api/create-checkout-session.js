import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20"
});

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
    const { uid } = req.body;

    if (!uid) {
      res.status(400).json({ error: "uid requerido" });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Suscripción Voice-CV"
            },
            unit_amount: 1 // 1€
          },
          quantity: 1
        }
      ],
      success_url: `${process.env.CLIENT_URL}?success=true&session_id={CHECKOUT_SESSION_ID}&uid=${uid}`,
      cancel_url: `${process.env.CLIENT_URL}?canceled=true`
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Error al crear sesión de pago:", err);
    res.status(500).json({ error: "No se pudo crear la sesión de pago" });
  }
}
