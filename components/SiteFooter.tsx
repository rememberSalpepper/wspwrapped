"use client";

import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-slate-100 bg-white px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="col-span-2 space-y-6">
            <Link href="/" className="text-xl font-black tracking-tighter text-indigo-950">
              WSP<span className="text-pink-600">ANALYSER</span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed text-slate-500">
              Revelando las dinámicas reales de tus conversaciones con elegancia y privacidad absoluta.
            </p>
            <div className="flex gap-4">
              {["Instagram", "TikTok"].map((social) => (
                <span key={social} className="text-xs font-bold uppercase tracking-widest text-slate-300 cursor-not-allowed">
                  {social}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Producto</h4>
            <ul className="space-y-4 text-sm font-bold text-indigo-950">
              <li><Link href="/upload" className="hover:text-pink-600 transition-colors">Analizar Chat</Link></li>
              <li><Link href="/#features" className="hover:text-pink-600 transition-colors">Características</Link></li>
              <li><Link href="/#precios" className="hover:text-pink-600 transition-colors">Precios Pro</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Legal</h4>
            <ul className="space-y-4 text-sm font-bold text-indigo-950">
              <li><Link href="/privacy" className="hover:text-pink-600 transition-colors">Privacidad</Link></li>
              <li><Link href="/terms" className="hover:text-pink-600 transition-colors">Términos</Link></li>
              <li><Link href="/cookies" className="hover:text-pink-600 transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-20 border-t border-slate-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400">
            © {new Date().getFullYear()} WspAnalyser. Hecho con ✨ para gente curiosa.
          </p>
          <div className="badge-premium bg-slate-50 text-slate-400">
            100% Seguro & Privado
          </div>
        </div>
      </div>
    </footer>
  );
}
