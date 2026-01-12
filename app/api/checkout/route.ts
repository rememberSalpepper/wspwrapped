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

        // MercadoPago Preference (Pago Único Simple)
        // Esto es mucho más robusto para empezar
        const preference = {
            items: [
                {
                    id: "wspwrapped-pro",
                    title: "WspWrapped Pro - Análisis Completo",
                    description: "Desbloquea todas las métricas y descarga tus imágenes sin marca de agua",
                    quantity: 1,
                    currency_id: "CLP",
                    unit_price: 10000,
                },
            ],
            payer: {
                email: email,
            },
            back_urls: {
                success: `${getBaseUrl(request)}/payment/success?userId=${userId}&reportId=${reportId || ""}`,
                failure: `${getBaseUrl(request)}/payment/failure`,
                pending: `${getBaseUrl(request)}/payment/pending`,
            },
            auto_return: "approved",
            external_reference: userId,
            metadata: {
                user_id: userId,
                plan: "pro-month",
                report_id: reportId,
            },
            notification_url: `${getBaseUrl(request)}/api/webhooks/mercadopago`,
        };

        if (!MERCADOPAGO_ACCESS_TOKEN) {
            console.error("Missing MERCADOPAGO_ACCESS_TOKEN");
            return NextResponse.json(
                { error: "Server configuration error: Missing Payment Token" },
                { status: 500 }
            );
        }

        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(preference),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("MercadoPago subscription error:", errorData);
            return NextResponse.json(
                { error: "Error creating subscription", details: errorData },
                { status: response.status }
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
