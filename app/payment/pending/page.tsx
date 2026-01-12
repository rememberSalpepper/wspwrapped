"use client";

import Link from "next/link";

export default function PaymentPendingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-slate-50/30 flex items-center justify-center p-6">
            <div className="glass-premium max-w-lg w-full p-12 text-center space-y-8 animate-pop">
                {/* Pending Icon */}
                <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-400 to-amber-600 text-white text-5xl shadow-xl shadow-amber-200 animate-pulse">
                    ⏳
                </div>

                <div className="space-y-3">
                    <h1 className="text-4xl font-black text-indigo-950">Pago Pendiente</h1>
                    <p className="text-slate-500 font-medium">
                        Tu pago está siendo procesado. Te notificaremos cuando se confirme.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <p className="text-sm font-bold text-amber-700">
                            📬 Recibirás un email cuando tu Pro esté activo.
                        </p>
                    </div>

                    <Link
                        href="/upload"
                        className="inline-block w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black text-sm uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                    >
                        Volver al Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
