"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import SiteHeader from "@/components/SiteHeader";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        // Check if user has valid session from email link
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/");
            }
        });
    }, [router]);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push("/upload");
            }, 2000);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-white">
                <SiteHeader />
                <div className="flex items-center justify-center px-6 py-32">
                    <div className="card-spicy max-w-md w-full p-12 text-center space-y-6">
                        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-indigo-950">
                            ¡Contraseña Actualizada!
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Tu contraseña ha sido cambiada exitosamente. Redirigiendo...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <SiteHeader />

            <div className="flex items-center justify-center px-6 py-32">
                <div className="card-spicy max-w-md w-full p-8 md:p-10">
                    <div className="text-center space-y-3 mb-8">
                        <div className="badge-premium bg-indigo-50 text-indigo-600 mb-2">
                            Seguridad
                        </div>
                        <h1 className="text-3xl font-black text-indigo-950">
                            Nueva Contraseña
                        </h1>
                        <p className="text-slate-500 font-medium text-sm">
                            Ingresa tu nueva contraseña para tu cuenta
                        </p>
                    </div>

                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div>
                            <input
                                type="password"
                                placeholder="Nueva contraseña (mínimo 6 caracteres)"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 text-slate-800 font-medium placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                                className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 text-slate-800 font-medium placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
                            />
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl text-sm font-bold bg-rose-50 text-rose-600">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
                        >
                            {loading ? "Actualizando..." : "Cambiar Contraseña"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => router.push("/")}
                            className="text-sm text-slate-400 hover:text-indigo-600 font-bold transition-colors"
                        >
                            ← Volver al inicio
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
