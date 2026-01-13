import { NextResponse } from "next/server";
import { upsertSubscriptionStatus } from "@/lib/subscriptions";
import { createHmac } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// Map PayPal subscription status to our internal status
function mapPayPalStatus(eventType: string): "active" | "canceled" | "past_due" | "pending" {
  const normalized = eventType.toUpperCase();

  if (normalized.includes("ACTIVATED") || normalized.includes("RENEWED") || normalized.includes("UPDATED")) {
    return "active";
  }
  if (normalized.includes("CANCELLED") || normalized.includes("EXPIRED")) {
    return "canceled";
  }
  if (normalized.includes("SUSPENDED")) {
    return "past_due";
  }
  return "pending";
}

// Verify PayPal webhook signature
async function verifyWebhookSignature(
  webhookId: string,
  headers: Headers,
  body: string
): Promise<boolean> {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      console.warn("PayPal credentials missing, skipping signature verification");
      return true; // Allow in development
    }

    // Get PayPal access token
    const authResponse = await fetch(
      `${getPayPalBaseUrl()}/v1/oauth2/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
        },
        body: "grant_type=client_credentials",
      }
    );

    if (!authResponse.ok) {
      console.error("Failed to get PayPal access token for verification");
      return false;
    }

    const { access_token } = await authResponse.json();

    // Verify webhook signature using PayPal API
    const verifyResponse = await fetch(
      `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          transmission_id: headers.get("paypal-transmission-id"),
          transmission_time: headers.get("paypal-transmission-time"),
          cert_url: headers.get("paypal-cert-url"),
          auth_algo: headers.get("paypal-auth-algo"),
          transmission_sig: headers.get("paypal-transmission-sig"),
          webhook_id: webhookId,
          webhook_event: JSON.parse(body),
        }),
      }
    );

    if (!verifyResponse.ok) {
      console.error("Webhook signature verification failed");
      return false;
    }

    const result = await verifyResponse.json();
    return result.verification_status === "SUCCESS";
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

function getPayPalBaseUrl(): string {
  return process.env.NODE_ENV === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const headers = request.headers;

  // Verify webhook signature in production
  if (process.env.NODE_ENV === "production" && PAYPAL_WEBHOOK_ID) {
    const isValid = await verifyWebhookSignature(PAYPAL_WEBHOOK_ID, headers, rawBody);
    if (!isValid) {
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

  const eventType = payload.event_type as string;
  const resource = payload.resource || {};

  console.log(`PayPal Webhook received: ${eventType}`);

  // Handle subscription events
  if (eventType.startsWith("BILLING.SUBSCRIPTION.")) {
    try {
      // Extract user ID from custom_id field (set during subscription creation)
      const userId = resource.custom_id;

      if (!userId) {
        console.warn("No user ID found in webhook payload");
        return NextResponse.json({ received: true });
      }

      const subscriptionStatus = mapPayPalStatus(eventType);

      // Update subscription in database
      await upsertSubscriptionStatus({
        userId,
        provider: "paypal",
        status: subscriptionStatus,
        plan: "pro-month",
      });

      console.log(`Updated subscription for user ${userId}: ${eventType} -> ${subscriptionStatus}`);
    } catch (error) {
      console.error("Error processing subscription webhook:", error);
      return NextResponse.json(
        { error: "Error processing webhook" },
        { status: 500 }
      );
    }
  }

  // Handle payment events (for individual subscription payments)
  if (eventType.startsWith("PAYMENT.SALE.")) {
    try {
      const billingAgreementId = resource.billing_agreement_id;

      if (billingAgreementId) {
        console.log(`Payment completed for billing agreement: ${billingAgreementId}`);
        // Optionally fetch subscription details and update status
      }
    } catch (error) {
      console.error("Error processing payment webhook:", error);
    }
  }

  return NextResponse.json({ received: true });
}

