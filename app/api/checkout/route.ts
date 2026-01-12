import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN || "";

// Comment out for future Stripe implementation
// const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";

interface CheckoutRequest {
    userId: string;
    email: string;
    reportId?: string;
}

export async function POST(request: Request) {
    try {
        const body: CheckoutRequest = await request.json();
        const { userId, email, reportId } = body;

        if (!userId || !email) {
            return NextResponse.json(
                { error: "userId and email are required" },
                { status: 400 }
            );
        }

        // MercadoPago Subscription (Preapproval)
        // This creates an automatic recurring payment
        const subscriptionPayload = {
            reason: "WspWrapped Pro - Suscripción Mensual",
            auto_recurring: {
                frequency: 1,
                frequency_type: "months",
                transaction_amount: 10000,
                currency_id: "CLP"
            },
            payer_email: email,
            back_url: `${getBaseUrl(request)}/payment/success?userId=${userId}&reportId=${reportId || ""}`,
            external_reference: userId,
            status: "authorized", // Auto-active
        };

        const response = await fetch("https://api.mercadopago.com/preapproval", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(subscriptionPayload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("MercadoPago subscription error:", errorData);
            return NextResponse.json(
                { error: "Error creating subscription" },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            checkoutUrl: data.init_point, // URL where user approves the subscription
            preferenceId: data.id,
        });

    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

function getBaseUrl(request: Request): string {
    const url = new URL(request.url);
    // In production, use your domain
    if (process.env.NODE_ENV === "production") {
        return process.env.NEXT_PUBLIC_BASE_URL || `${url.protocol}//${url.host}`;
    }
    return `${url.protocol}//${url.host}`;
}
