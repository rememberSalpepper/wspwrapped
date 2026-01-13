import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CheckoutRequest {
    userId: string;
    email: string;
    reportId?: string;
}

export async function POST(request: Request) {
    try {
        const body: CheckoutRequest = await request.json();
        const { userId, email } = body;

        if (!userId || !email) {
            return NextResponse.json(
                { error: "userId and email are required" },
                { status: 400 }
            );
        }

        const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

        if (!planId) {
            console.error("Missing NEXT_PUBLIC_PAYPAL_PLAN_ID");
            return NextResponse.json(
                { error: "Server configuration error: Missing Plan ID" },
                { status: 500 }
            );
        }

        // For PayPal subscriptions, the frontend handles the subscription creation
        // We just return the plan ID (which is also available on the frontend)
        // This endpoint can be used for logging or future enhancements
        return NextResponse.json({
            planId,
            clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

