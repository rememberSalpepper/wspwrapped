"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { createClient } from "@supabase/supabase-js";

interface AuthModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
    const { signInWithEmail, signUpWithEmail, signInWithGoogle, user } = useAuth();
    const [mode, setMode] = useState<"login" | "register" | "forgot">("register");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    if (!open) return null;

    // If user is already logged in, trigger success
    if (user) {
        onSuccess();
        return null;
    }

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMsg(null);

        if (mode === "forgot") {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
            });

            if (error) {
                setError(error.message);
            } else {
                setSuccessMsg("¡Revisa tu correo para restablecer tu contraseña!");
            }
            setLoading(false);
            return;
        }

        const authFn = mode === "login" ? signInWithEmail : signUpWithEmail;
        const { error } = await authFn(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            if (mode === "register") {
                setSuccessMsg("¡Revisa tu email para confirmar tu cuenta!");
                setLoading(false);
            } else {
                onSuccess();
            }
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);
        const { error } = await signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // Redirect will happen automatically
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-md animate-reveal" onClick={onClose} />

            <div className="card-spicy relative w-full max-w-md bg-white p-8 md:p-10 animate-pop shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    ✕
                </button>

                <div className="text-center space-y-3 mb-8">
                    <div className="badge-premium bg-pink-50 text-pink-600 mb-2">
                        {mode === "forgot" ? "Recuperar Acceso" : "Paso 1 de 2"}
                    </div>
                    <h2 className="text-3xl font-black text-indigo-950">
                        {mode === "login" ? "Bienvenido de vuelta" : mode === "register" ? "Crea tu cuenta" : "¿Olvidaste tu clave?"}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                        {mode === "forgot" ? "Te enviaremos un link para restablecerla." : "Para desbloquear tu análisis completo"}
                    </p>
                </div>

                {mode !== "forgot" && (
                    <>
                        {/* Google Button */}
                        <button
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50 mb-6"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuar con Google
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200"></div>
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-4 text-slate-400 font-bold">o con email</span>
                            </div>
                        </div>
                    </>
                )}

                {/* Email Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 text-slate-800 font-medium placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
                    />
                    {mode !== "forgot" && (
                        <input
                            type="password"
                            placeholder="Contraseña (mínimo 6 caracteres)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 text-slate-800 font-medium placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none transition-colors"
                        />
                    )}

                    {error && (
                        <div className="p-3 rounded-xl text-sm font-bold bg-rose-50 text-rose-600">
                            {error}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 rounded-xl text-sm font-bold bg-emerald-50 text-emerald-600">
                            {successMsg}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        {loading ? "Procesando..." : mode === "login" ? "Iniciar Sesión" : mode === "register" ? "Crear Cuenta" : "Enviar Link"}
                    </button>
                </form>

                <div className="text-center text-sm text-slate-500 mt-6 space-y-2">
                    {mode === "login" ? (
                        <>
                            <p>
                                ¿No tienes cuenta?{" "}
                                <button onClick={() => setMode("register")} className="text-indigo-600 font-bold hover:underline">
                                    Regístrate
                                </button>
                            </p>
                            <button onClick={() => setMode("forgot")} className="text-slate-400 text-xs font-bold hover:text-indigo-600">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </>
                    ) : mode === "register" ? (
                        <p>
                            ¿Ya tienes cuenta?{" "}
                            <button onClick={() => setMode("login")} className="text-indigo-600 font-bold hover:underline">
                                Inicia sesión
                            </button>
                        </p>
                    ) : (
                        <button onClick={() => setMode("login")} className="text-indigo-600 font-bold hover:underline">
                            Volver a Iniciar Sesión
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
