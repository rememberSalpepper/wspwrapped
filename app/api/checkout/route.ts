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

        // MercadoPago Preference for LATAM
        const preference = {
            items: [
                {
                    id: "wspwrapped-pro",
                    title: "WspWrapped Pro - Análisis Completo",
                    description: "Desbloquea todas las métricas y descarga tus imágenes sin marca de agua",
                    quantity: 1,
                    currency_id: "ARS", // Can be USD, BRL, CLP, etc.
                    unit_price: 9990, // In cents for ARS (adjust per country)
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
            console.error("MercadoPago error:", errorData);
            return NextResponse.json(
                { error: "Error creating payment preference" },
                { status: 500 }
            );
        }

        const data = await response.json();

        return NextResponse.json({
            checkoutUrl: data.init_point,
            preferenceId: data.id,
            // For sandbox testing use: data.sandbox_init_point
        });

        /* 
        // ==========================================
        // STRIPE IMPLEMENTATION (FUTURE - GLOBAL)
        // ==========================================
        // Uncomment when ready to use Stripe
        
        const stripe = new Stripe(STRIPE_SECRET_KEY);
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "subscription",
          line_items: [
            {
              price: process.env.STRIPE_PRICE_ID,
              quantity: 1,
            },
          ],
          customer_email: email,
          client_reference_id: userId,
          metadata: {
            user_id: userId,
            plan: "pro-month",
          },
          success_url: `${getBaseUrl(request)}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${getBaseUrl(request)}/payment/failure`,
        });
    
        return NextResponse.json({
          checkoutUrl: session.url,
          sessionId: session.id,
        });
        */
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
