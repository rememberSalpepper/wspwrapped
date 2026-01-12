import { NextResponse } from "next/server";
import { upsertSubscriptionStatus } from "@/lib/subscriptions";
import { createHmac } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MERCADOPAGO_WEBHOOK_SECRET = process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || "";

// Map MercadoPago status to our subscription status
function mapPaymentStatus(status?: string): "active" | "canceled" | "pending" {
  if (!status) return "pending";
  const normalized = status.toLowerCase();

  if (normalized === "approved" || normalized === "authorized") {
    return "active";
  }
  if (normalized === "cancelled" || normalized === "refunded" || normalized === "rejected") {
    return "canceled";
  }
  return "pending";
}

// Verify webhook signature (optional but recommended for production)
function verifySignature(payload: string, signature: string | null): boolean {
  if (!MERCADOPAGO_WEBHOOK_SECRET || !signature) {
    // Skip verification if no secret configured
    return true;
  }

  try {
    const [ts, v1] = signature.split(",").map(part => part.split("=")[1]);
    const signedPayload = `${ts}.${payload}`;
    const expectedSignature = createHmac("sha256", MERCADOPAGO_WEBHOOK_SECRET)
      .update(signedPayload)
      .digest("hex");
    return v1 === expectedSignature;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  // Verify signature in production
  if (process.env.NODE_ENV === "production" && MERCADOPAGO_WEBHOOK_SECRET) {
    if (!verifySignature(rawBody, signature)) {
      console.error("Invalid webhook signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { type, action, data } = payload;

  // Handle different notification types
  if (type === "payment") {
    // Fetch payment details from MercadoPago API
    try {
      const paymentId = data?.id;
      if (!paymentId) {
        return NextResponse.json({ received: true });
      }

      const paymentRes = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          },
        }
      );

      if (!paymentRes.ok) {
        console.error("Failed to fetch payment:", await paymentRes.text());
        return NextResponse.json({ received: true });
      }

      const payment = await paymentRes.json();

      // Extract user ID from external_reference or metadata
      const userId = payment.external_reference || payment.metadata?.user_id;
      const status = payment.status;
      const plan = payment.metadata?.plan || "pro-month";

      if (userId) {
        await upsertSubscriptionStatus({
          userId,
          provider: "mercadopago",
          status: mapPaymentStatus(status),
          plan,
        });

        console.log(`Updated subscription for user ${userId}: ${status}`);
      }
    } catch (err) {
      console.error("Error processing payment webhook:", err);
    }
  } else if (type === "subscription_preapproval") {
    // Handle subscription status changes (e.g. authorized, paused, cancelled)
    try {
      const preapprovalId = data?.id;
      if (!preapprovalId) return NextResponse.json({ received: true });

      const preapprovalRes = await fetch(
        `https://api.mercadopago.com/preapproval/${preapprovalId}`,
        {
          headers: { Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}` }
        }
      );

      if (preapprovalRes.ok) {
        const preapproval = await preapprovalRes.json();
        const userId = preapproval.external_reference;
        const status = preapproval.status; // authorized, paused, cancelled

        if (userId) {
          // Map preapproval status to our internal status
          let internalStatus: "active" | "canceled" | "pending" = "pending";
          if (status === "authorized") internalStatus = "active";
          if (status === "cancelled") internalStatus = "canceled";

          await upsertSubscriptionStatus({
            userId,
            provider: "mercadopago",
            status: internalStatus,
            plan: "pro-month"
          });
        }
      }
    } catch (err) {
      console.error("Error processing subscription webhook:", err);
    }
  }

  return NextResponse.json({ received: true });
}
