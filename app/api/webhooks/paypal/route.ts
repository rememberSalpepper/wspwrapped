import { NextResponse } from "next/server";
import { upsertSubscriptionStatus } from "@/lib/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mapStatus(eventType?: string): "active" | "canceled" | "past_due" | "pending" {
  if (!eventType) return "pending";
  if (eventType.includes("CANCELLED")) return "canceled";
  if (eventType.includes("SUSPENDED")) return "past_due";
  if (eventType.includes("ACTIVATED") || eventType.includes("RENEWED")) return "active";
  return "pending";
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}));
  const eventType = payload.event_type as string | undefined;
  const resource = payload.resource ?? {};
  const userId = resource.custom_id || resource.subscriber?.payer_id || resource.metadata?.user_id;
  const plan = resource.plan_id ? "pro-month" : "pro-month";

  if (!userId) {
    return NextResponse.json({ received: true });
  }

  await upsertSubscriptionStatus({
    userId,
    provider: "paypal",
    status: mapStatus(eventType),
    plan
  });

  return NextResponse.json({ received: true });
}
