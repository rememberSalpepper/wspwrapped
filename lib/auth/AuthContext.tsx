"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient, User, Session, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Create client only if URL is available (prevents build errors during static pre-rendering)
let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

type SubscriptionStatus = "active" | "canceled" | "past_due" | "pending" | "none";

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    subscriptionStatus: SubscriptionStatus;
    isPro: boolean;
    signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
    signInWithGoogle: () => Promise<{ error: Error | null }>;
    signOut: () => Promise<void>;
    refreshSubscription: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>("none");

    const isPro = subscriptionStatus === "active";

    // Fetch subscription status from API
    const refreshSubscription = async () => {
        if (!user) {
            setSubscriptionStatus("none");
            return;
        }

        try {
            const res = await fetch(`/api/subscription?userId=${user.id}`);
            if (res.ok) {
                const data = await res.json();
                setSubscriptionStatus(data.status || "none");
            }
        } catch (err) {
            console.error("Error fetching subscription:", err);
        }
    };

    useEffect(() => {
        // Skip if supabase client is not available
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Refresh subscription when user changes
    useEffect(() => {
        if (user) {
            refreshSubscription();
        } else {
            setSubscriptionStatus("none");
        }
    }, [user]);

    const signInWithEmail = async (email: string, password: string) => {
        if (!supabase) return { error: new Error("Auth not available") };
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return { error: error as Error | null };
    };

    const signUpWithEmail = async (email: string, password: string) => {
        if (!supabase) return { error: new Error("Auth not available") };
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { error: error as Error | null };
    };

    const signInWithGoogle = async () => {
        if (!supabase) return { error: new Error("Auth not available") };
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        });
        return { error: error as Error | null };
    };

    const signOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        setSubscriptionStatus("none");
    };

    const resetPassword = async (email: string) => {
        if (!supabase) return { error: new Error("Auth not available") };
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
        });
        return { error: error as Error | null };
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                loading,
                subscriptionStatus,
                isPro,
                signInWithEmail,
                signUpWithEmail,
                signInWithGoogle,
                signOut,
                refreshSubscription,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
