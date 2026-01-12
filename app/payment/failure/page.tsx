"use client";

import Link from "next/link";

export default function PaymentFailurePage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-slate-50/30 flex items-center justify-center p-6">
            <div className="glass-premium max-w-lg w-full p-12 text-center space-y-8 animate-pop">
                {/* Failure Icon */}
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-rose-400 to-rose-600 text-white text-5xl shadow-xl shadow-rose-200">
                    ✕
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-indigo-950">Pago No Completado</h1>
                    <p className="text-slate-500 font-medium">
                        Hubo un problema con tu pago o fue cancelado. No te preocupes, puedes intentarlo de nuevo.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <p className="text-sm font-bold text-slate-600">
                            💡 Tu análisis sigue guardado y puedes desbloquearlo en cualquier momento.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/upload"
                            className="inline-block w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                        >
                            Intentar de Nuevo
                        </Link>
                        <Link
                            href="/"
                            className="inline-block w-full py-3 rounded-2xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                        >
                            Volver al Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
