"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
    const searchParams = useSearchParams();
    const reportId = searchParams.get("reportId");
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // Redirect to report or home
                    if (reportId) {
                        window.location.href = `/report/${reportId}`;
                    } else {
                        window.location.href = "/upload";
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [reportId]);

    return (
        <div className="glass-premium max-w-lg w-full p-12 text-center space-y-8 animate-pop">
            {/* Success Icon */}
            <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-5xl shadow-xl shadow-emerald-200 animate-bounce">
                ✓
            </div>

            <div className="space-y-3">
                <h1 className="text-4xl font-black text-indigo-950">¡Pago Exitoso! 🎉</h1>
                <p className="text-slate-500 font-medium">
                    Tu suscripción Pro está activa. Ahora puedes ver todas las métricas y descargar tus imágenes.
                </p>
            </div>

            <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-700">
                        ✨ Dashboard completo desbloqueado
                    </p>
                </div>

                <p className="text-sm text-slate-400">
                    Redirigiendo en {countdown} segundos...
                </p>

                <Link
                    href={reportId ? `/report/${reportId}` : "/upload"}
                    className="inline-block w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                >
                    Ver Mi Análisis Ahora
                </Link>
            </div>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="glass-premium max-w-lg w-full p-12 text-center space-y-8 animate-pulse">
            <div className="mx-auto h-24 w-24 rounded-[2rem] bg-slate-200"></div>
            <div className="h-8 bg-slate-200 rounded-xl"></div>
            <div className="h-4 bg-slate-100 rounded-xl w-3/4 mx-auto"></div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-indigo-50/30 to-pink-50/30 flex items-center justify-center p-6">
            <Suspense fallback={<LoadingFallback />}>
                <SuccessContent />
            </Suspense>
        </div>
    );
}
