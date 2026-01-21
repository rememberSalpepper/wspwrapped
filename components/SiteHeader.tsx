"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import AuthModal from "./AuthModal";

export default function SiteHeader() {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full px-6 py-4 glass border-b border-slate-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm transition-transform group-hover:rotate-12">
              W
            </div>
            <span className="text-lg font-black tracking-tighter text-indigo-950">
              WSP<span className="text-pink-600">WRAPPED</span>
            </span>
          </Link>

          <nav className="hidden gap-8 text-[10px] font-black uppercase tracking-[0.2em] md:flex items-center">
            <Link href="/#features" className="text-slate-400 hover:text-indigo-600 transition-colors">
              Funciones
            </Link>
            <Link href="/#precios" className="text-slate-400 hover:text-indigo-600 transition-colors">
              Precios
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 text-indigo-950 hover:text-indigo-600 transition-colors"
                >
                  <span className="truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                  <svg className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-pop">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          signOut();
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                Iniciar Sesión
              </button>
            )}
          </nav>

          <Link
            href="/upload"
            className="btn-glass text-[10px] px-4 md:px-6 py-2 md:py-3 hover-lift whitespace-nowrap"
          >
            Empezar ✨
          </Link>
        </div>
      </header>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => setAuthOpen(false)}
      />
    </>
  );
}
