import { getSupabaseAdminClient } from "./supabase/server";

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "pending";

export async function upsertSubscriptionStatus(params: {
  userId: string;
  provider: "mercadopago" | "paypal";
  status: SubscriptionStatus;
  plan: "pro-month" | "pro-annual";
}) {
  const supabase = getSupabaseAdminClient();

  const { error } = await supabase.from("user_subscriptions").upsert({
    user_id: params.userId,
    provider: params.provider,
    status: params.status,
    plan: params.plan,
    updated_at: new Date().toISOString()
  });

  if (error) {
    throw new Error(`Supabase error: ${error.message}`);
  }
}
