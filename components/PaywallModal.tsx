"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import AuthModal from "./AuthModal";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onUnlock: () => void;
  reportId?: string | null;
}

export default function PaywallModal({ open, onClose, onUnlock, reportId }: PaywallModalProps) {
  const { user, isPro } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  // If user is already Pro, just unlock
  if (isPro) {
    onUnlock();
    return null;
  }

  const handleUnlockClick = async () => {
    // Step 1: If not logged in, show auth modal
    if (!user) {
      setShowAuth(true);
      return;
    }

    // Step 2: If logged in, redirect to checkout
    await proceedToCheckout();
  };

  const handleAuthSuccess = async () => {
    setShowAuth(false);
    // After auth, proceed to checkout
    await proceedToCheckout();
  };

  const proceedToCheckout = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          reportId: reportId,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Checkout error details:", errorData);
        // Try to show the most relevant error message
        const msg = errorData.details?.message || errorData.error || "Error al crear el checkout";
        throw new Error(msg);
      }

      const data = await res.json();

      // Redirect to MercadoPago checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error("No se obtuvo URL de checkout");
      }
    } catch (err: any) {
      setError(err.message || "Error al procesar el pago");
      setLoading(false);
    }
  };

  // Show AuthModal if user clicked unlock but isn't logged in
  if (showAuth) {
    return (
      <AuthModal
        open={true}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md animate-reveal" onClick={onClose} />

      <div className="card-spicy relative w-full max-w-lg bg-white p-8 md:p-12 animate-pop shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-colors"
        >
          ✕
        </button>

        <div className="text-center space-y-4 mb-10">
          <div className="badge-premium bg-pink-50 text-pink-600 mb-2">Análisis Premium</div>
          <h2 className="text-3xl md:text-4xl font-black text-indigo-950">Desbloquea Todo ✨</h2>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Accede a todas las métricas, descargas HD y mucho más.
          </p>
        </div>

        {/* Pro Plan Card */}
        <div className="rounded-[2.5rem] bg-indigo-950 p-8 space-y-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
            🔥 Oferta
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black">$10.000</span>
            <span className="text-sm font-bold text-indigo-300">CLP/mes</span>
          </div>

          <ul className="space-y-3 text-sm font-bold text-indigo-100">
            <li className="flex items-center gap-3">
              <span className="text-lg">✨</span> Dashboard Completo
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">👻</span> Zona Ghosting
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">💘</span> Romance & Cursilerías
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">🧠</span> Insights Psicológicos
            </li>
            <li className="flex items-center gap-3">
              <span className="text-lg">📸</span> Descargas HD sin marca
            </li>
          </ul>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-200 text-sm font-bold">
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleUnlockClick}
            disabled={loading}
            className="btn-spicy w-full py-5 text-sm hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin">⏳</span> Procesando...
              </span>
            ) : user ? (
              "Ir a Pagar 💳"
            ) : (
              "Crear Cuenta y Pagar ✨"
            )}
          </button>

          {user && (
            <p className="text-center text-xs text-indigo-300">
              Conectado como {user.email}
            </p>
          )}
        </div>

        <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
          Pago seguro vía MercadoPago 🔒
        </p>

        {/* Hidden region selector for future global implementation
        <div className="mt-6 flex items-center justify-center gap-3 p-1 bg-slate-50 rounded-full border border-slate-100">
          {[
            { id: "latam", label: "Latinoamérica" },
            { id: "global", label: "Global" }
          ].map((r) => (
            <button
              key={r.id}
              className="px-6 py-1.5 rounded-full text-[10px] font-black transition-all bg-white text-indigo-600 shadow-sm"
            >
              {r.label}
            </button>
          ))}
        </div>
        */}
      </div>
    </div>
  );
}
