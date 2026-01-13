"use client";

import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";

interface PayPalButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export default function PayPalButton({ onSuccess, onError }: PayPalButtonProps) {
    const { user } = useAuth();
    const [error, setError] = useState<string | null>(null);

    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "";
    const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID || "";

    if (!clientId || !planId) {
        return (
            <div className="p-4 rounded-xl bg-rose-500/20 text-rose-600 text-sm font-bold">
                ⚠️ PayPal configuration missing. Please contact support.
            </div>
        );
    }

    return (
        <PayPalScriptProvider
            options={{
                clientId,
                vault: true,
                intent: "subscription",
            }}
        >
            <div className="w-full">
                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-rose-500/20 text-rose-200 text-sm font-bold">
                        ⚠️ {error}
                    </div>
                )}

                <PayPalButtons
                    style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "subscribe",
                    }}
                    createSubscription={(data, actions) => {
                        return actions.subscription.create({
                            plan_id: planId,
                            custom_id: user?.id || "", // Pass user ID to identify in webhooks
                            application_context: {
                                shipping_preference: "NO_SHIPPING",
                                return_url: `${window.location.origin}/payment/success`,
                                cancel_url: `${window.location.origin}/payment/cancelled`,
                            },
                        });
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            console.log("Subscription approved:", data.subscriptionID);

                            // Optionally call your backend to update the subscription immediately
                            // Most apps rely on webhooks, but you can also update here
                            const response = await fetch("/api/subscriptions/activate", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    subscriptionId: data.subscriptionID,
                                    userId: user?.id,
                                }),
                            });

                            if (response.ok) {
                                onSuccess?.();
                            } else {
                                throw new Error("Failed to activate subscription");
                            }
                        } catch (err: any) {
                            const errorMsg = err.message || "Error activating subscription";
                            setError(errorMsg);
                            onError?.(errorMsg);
                        }
                    }}
                    onError={(err) => {
                        console.error("PayPal error:", err);
                        const errorMsg = "Error processing payment. Please try again.";
                        setError(errorMsg);
                        onError?.(errorMsg);
                    }}
                    onCancel={() => {
                        setError("Payment cancelled");
                    }}
                />
            </div>
        </PayPalScriptProvider>
    );
}
