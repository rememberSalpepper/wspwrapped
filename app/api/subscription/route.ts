import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ status: "none" });
    }

    try {
        const supabase = getSupabaseAdminClient();

        const { data, error } = await supabase
            .from("user_subscriptions")
            .select("status, plan, updated_at")
            .eq("user_id", userId)
            .single();

        if (error || !data) {
            return NextResponse.json({ status: "none" });
        }

        return NextResponse.json({
            status: data.status,
            plan: data.plan,
            updatedAt: data.updated_at
        });
    } catch (err) {
        console.error("Error checking subscription:", err);
        return NextResponse.json({ status: "none" });
    }
}
