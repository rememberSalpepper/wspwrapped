import { NextResponse } from "next/server";
import { upsertSubscriptionStatus } from "@/lib/subscriptions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ActivateRequest {
    subscriptionId: string;
    userId: string;
}

export async function POST(request: Request) {
    try {
        const body: ActivateRequest = await request.json();
        const { subscriptionId, userId } = body;

        if (!subscriptionId || !userId) {
            return NextResponse.json(
                { error: "subscriptionId and userId are required" },
                { status: 400 }
            );
        }

        // Verify the subscription with PayPal API
        const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.error("Missing PayPal credentials");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        // Get PayPal access token
        const authResponse = await fetch(
            `${getPayPalBaseUrl()}/v1/oauth2/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
                },
                body: "grant_type=client_credentials",
            }
        );

        if (!authResponse.ok) {
            console.error("Failed to get PayPal access token");
            return NextResponse.json(
                { error: "PayPal authentication failed" },
                { status: 500 }
            );
        }

        const { access_token } = await authResponse.json();

        // Verify subscription status
        const subscriptionResponse = await fetch(
            `${getPayPalBaseUrl()}/v1/billing/subscriptions/${subscriptionId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        if (!subscriptionResponse.ok) {
            console.error("Failed to fetch subscription from PayPal");
            return NextResponse.json(
                { error: "Failed to verify subscription" },
                { status: 500 }
            );
        }

        const subscription = await subscriptionResponse.json();

        // Update database
        await upsertSubscriptionStatus({
            userId,
            provider: "paypal",
            status: subscription.status === "ACTIVE" ? "active" : "pending",
            plan: "pro-month",
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

function getPayPalBaseUrl(): string {
    return process.env.NODE_ENV === "production"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
}
