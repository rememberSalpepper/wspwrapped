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
    const { signInWithEmail, signUpWithEmail, user } = useAuth();
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
        const result: any = await authFn(email, password);

        if (result.error) {
            // Improve error messages
            const errorMsg = result.error.message;

            if (errorMsg.includes("User already registered") || errorMsg.includes("already been registered")) {
                setError("Este correo ya está registrado. Por favor inicia sesión.");
                // Automatically switch to login mode
                setTimeout(() => {
                    setMode("login");
                    setError(null);
                }, 2000);
            } else if (errorMsg.includes("Invalid login credentials")) {
                setError("Correo o contraseña incorrectos.");
            } else if (errorMsg.includes("Email not confirmed")) {
                setError("Por favor confirma tu email antes de iniciar sesión.");
            } else {
                setError(errorMsg);
            }
            setLoading(false);
        } else {
            // Check if this is actually a new user or existing user
            if (mode === "register") {
                // Supabase returns success even if user exists but email is not confirmed
                // We need to check the response more carefully
                if (result.data?.user && !result.data?.session) {
                    // New user, needs email confirmation
                    setSuccessMsg("¡Cuenta creada! Revisa tu email para confirmarla.");
                } else if (result.data?.session) {
                    // User was able to sign in directly (auto-confirmed or already exists)
                    // This means the user already existed
                    setError("Este correo ya está registrado. Iniciando sesión...");
                    setTimeout(() => {
                        onSuccess();
                    }, 1500);
                }
                setLoading(false);
            } else {
                // Login mode - proceed to success
                onSuccess();
            }
        }
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
