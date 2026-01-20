"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const HERO_STATS = [
  { label: "Mensajes Analizados", value: "12M+", color: "text-indigo-600" },
  { label: "Patrones Detectados", value: "850k", color: "text-pink-600" },
  { label: "Momentos Clave", value: "4.2M", color: "text-rose-500" },
];

const FEATURES = [
  {
    title: "Dinámicas de Pareja",
    description: "Analizamos quién lleva el ritmo de la conversación y quién suele dar el primer paso en cada charla.",
    icon: "✨",
    color: "bg-rose-50 text-rose-600",
  },
  {
    title: "Análisis de Intensidad",
    description: "Descubre los picos de actividad y quién mantiene viva la chispa (o el drama) en el chat.",
    icon: "🔥",
    color: "bg-amber-50 text-amber-600",
  },
  {
    title: "Tiempos de Respuesta",
    description: "La métrica definitiva sobre el interés. ¿Quién responde al instante y quién se toma su tiempo?",
    icon: "⏳",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "Hábitos Nocturnos",
    description: "Identificamos a quién le gusta más trasnochar enviando mensajes y quién prefiere el día.",
    icon: "🌙",
    color: "bg-pink-50 text-pink-600",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="relative min-h-[90vh] overflow-hidden px-6 pt-32 pb-20">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10 animate-mesh-simple opacity-40" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_100%)]" />

          <div className="mx-auto max-w-7xl text-center">
            <div className="inline-flex animate-pop items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
              Análisis de Nueva Generación ✨
            </div>

            <h1 className="mt-12 text-6xl font-black tracking-tighter text-indigo-950 md:text-8xl lg:text-9xl leading-[0.85] animate-reveal">
              La verdad detrás <br /> de cada <span className="text-shimmer">Mensaje</span>
            </h1>

            <p className="mx-auto mt-10 max-w-2xl text-lg font-medium text-slate-500 md:text-xl leading-relaxed animate-reveal" style={{ animationDelay: "0.2s" }}>
              Descubre las dinámicas reales de tu relación con elegancia y privacidad absoluta. <br className="hidden md:block" />
              <span className="text-indigo-600 font-bold">Sin registros. Sin huellas. Solo respuestas.</span>
            </p>

            <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-reveal" style={{ animationDelay: "0.4s" }}>
              <Link
                href="/upload"
                className="btn-spicy group relative overflow-hidden px-8 md:px-10 py-4 md:py-5 text-sm hover:scale-105 transition-all w-full sm:w-auto text-center"
              >
                <span className="relative z-10">Empezar Análisis ✨</span>
                <div className="absolute inset-0 -z-10 animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="#features"
                className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
              >
                Ver Funciones
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Hero Visual */}
            <div className="mt-24 relative mx-auto max-w-5xl animate-reveal" style={{ animationDelay: "0.6s" }}>
              <div className="glass-premium rounded-[3rem] p-4 md:p-8 animate-float-slow">
                <div className="aspect-[16/9] overflow-hidden rounded-[2rem] bg-slate-50 shadow-inner relative group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center space-y-4">
                      <div className="badge-premium bg-white shadow-xl animate-pop">Preview HD ✨</div>
                      <div className="flex gap-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-32 w-24 rounded-2xl bg-white shadow-lg animate-pulse-slow" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-12 -left-12 h-24 w-24 animate-float-slow rounded-3xl bg-pink-500/10 blur-2xl" />
              <div className="absolute -bottom-12 -right-12 h-32 w-32 animate-float-slow rounded-full bg-indigo-500/10 blur-3xl" style={{ animationDelay: "-3s" }} />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-6 py-24 bg-white relative overflow-hidden">
          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-16 animate-reveal">
              <div className="badge-premium bg-indigo-50 text-indigo-600 mx-auto">Fácil y Rápido ✨</div>
              <h2 className="text-4xl font-black text-indigo-950 md:text-5xl tracking-tight">
                ¿Cómo <span className="text-shimmer">Funciona?</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-2xl mx-auto">
                En solo 3 pasos simples puedes analizar tu chat y descubrir todas las métricas.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Step 1 */}
              <div className="glass-premium p-6 rounded-[2.5rem] space-y-6 hover-lift animate-reveal group" style={{ animationDelay: "0.1s" }}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50">
                  <img
                    src="/step1-export.png"
                    alt="Exportar chat de WhatsApp"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white text-xl font-black shadow-lg shadow-indigo-200">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-indigo-950">Exporta tu Chat</h3>
                    <p className="text-sm font-medium text-slate-500">
                      Desde WhatsApp: Opciones → Más → Exportar chat
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="glass-premium p-6 rounded-[2.5rem] space-y-6 hover-lift animate-reveal group" style={{ animationDelay: "0.2s" }}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50">
                  <img
                    src="/step2-upload.png"
                    alt="Subir archivo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pink-600 text-white text-xl font-black shadow-lg shadow-pink-200">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-indigo-950">Sube el Archivo</h3>
                    <p className="text-sm font-medium text-slate-500">
                      Arrastra tu archivo .txt o .zip a la plataforma
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="glass-premium p-6 rounded-[2.5rem] space-y-6 hover-lift animate-reveal group" style={{ animationDelay: "0.3s" }}>
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] bg-slate-50">
                  <img
                    src="/step3-results.png"
                    alt="Ver resultados"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-xl font-black shadow-lg shadow-indigo-200">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-indigo-950">Recibe tu Análisis</h3>
                    <p className="text-sm font-medium text-slate-500">
                      Métricas completas en segundos, 100% privado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-12 text-center">
              <Link
                href="/upload"
                className="btn-spicy inline-flex items-center gap-2 px-8 py-4 text-sm hover:scale-105 transition-all"
              >
                <span>Empezar Ahora</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="px-6 py-32 bg-slate-50/50 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

          <div className="mx-auto max-w-6xl">
            <div className="text-center space-y-4 mb-20 animate-reveal">
              <h2 className="text-4xl font-black text-indigo-950 md:text-6xl tracking-tight">
                Análisis <span className="text-shimmer">Ultra-Detallado</span>
              </h2>
              <p className="text-slate-500 font-medium max-w-xl mx-auto">
                Algoritmos avanzados que revelan lo que las palabras no dicen.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature, idx) => (
                <div
                  key={feature.title}
                  className="glass-premium group relative overflow-hidden rounded-[2.5rem] p-8 hover-lift animate-reveal"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-6 ${feature.color}`}>
                    {feature.icon}
                  </div>
                  <h3 className="mb-3 text-xl font-black text-indigo-950 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium leading-relaxed text-slate-500">
                    {feature.description}
                  </p>

                  {/* Decorative element */}
                  <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-indigo-500/5 blur-2xl group-hover:bg-indigo-500/10 transition-colors" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Viral Preview Section */}
        <section className="px-6 py-32 overflow-hidden relative bg-slate-50">
          <div className="absolute inset-0 bg-mesh-light opacity-30" />
          <div className="absolute top-0 right-0 h-96 w-96 bg-pink-500/5 blur-[100px] -z-10" />
          <div className="mx-auto max-w-6xl relative z-10">
            <div className="glass-premium flex flex-col items-center gap-12 md:flex-row p-12 md:p-20 animate-reveal relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

              <div className="flex-1 space-y-8 relative z-10">
                <div className="badge-premium bg-pink-50 text-pink-600 animate-pop">Viral en Stories ✨</div>
                <h2 className="text-4xl font-black text-indigo-950 md:text-6xl tracking-tight leading-tight">
                  Resultados que <br /> <span className="text-shimmer">dan de qué hablar</span>
                </h2>
                <p className="text-lg font-medium text-slate-500 leading-relaxed">
                  Genera visualizaciones estéticas y únicas de tus dinámicas de chat. Perfectas para compartir y sorprender.
                </p>
                <div className="flex flex-wrap gap-4">
                  {["Diseño HD", "Sin Marcas", "Link Único"].map((tag, i) => (
                    <div key={tag} className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 animate-reveal" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                      <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 relative animate-float-slow">
                <div className="relative z-10 rounded-[2.5rem] bg-white p-4 shadow-2xl shadow-indigo-200/50 rotate-3 transition-transform hover:rotate-0 duration-700">
                  <div className="aspect-[9/16] w-full max-w-[280px] rounded-[2rem] bg-slate-50 overflow-hidden relative">
                    <div className="absolute inset-0 animate-shimmer opacity-20" />
                    <div className="flex h-full items-center justify-center text-slate-300 font-black text-2xl text-center p-8">
                      STORY PREVIEW ✨
                    </div>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-10 -right-10 h-40 w-40 bg-pink-500/10 blur-3xl animate-pulse-slow" />
                <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-indigo-500/10 blur-3xl animate-pulse-slow" style={{ animationDelay: "-2s" }} />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="precios" className="px-6 py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-light opacity-40" />

          <div className="mx-auto max-w-4xl text-center relative z-10 animate-reveal">
            <div className="badge-premium bg-indigo-50 text-indigo-600 mb-8">Acceso Ilimitado</div>
            <h2 className="mb-8 text-5xl font-black text-indigo-950 md:text-7xl tracking-tight">
              Eleva tu <span className="text-shimmer">Experiencia</span>
            </h2>
            <p className="mx-auto mb-16 max-w-xl text-lg font-medium text-slate-500">
              Desbloquea el análisis completo, tiempos de respuesta pro y exportaciones en alta definición.
            </p>

            <div className="glass-premium p-12 md:p-20 rounded-[4rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-black px-8 py-2 rounded-bl-3xl uppercase tracking-[0.2em] animate-shimmer shadow-lg">
                Más Popular
              </div>

              <div className="grid gap-12 md:grid-cols-2 items-center">
                <div className="text-left space-y-6">
                  <div className="text-7xl font-black tracking-tighter text-indigo-950">
                    $10 <span className="text-xl font-bold text-slate-400 uppercase tracking-widest">USD</span>
                  </div>
                  <ul className="space-y-4">
                    {["Dashboard Completo ✨", "Tiempos de Respuesta ⏳", "Exportación HD 📸", "Badges Exclusivos 🏆"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-[10px] shadow-sm">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <Link
                    href="/upload"
                    className="btn-spicy w-full py-6 text-base hover:scale-105 transition-transform shadow-xl shadow-pink-200 block"
                  >
                    Ser Pro Ahora ✨
                  </Link>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Suscripción mensual • Cancela cuando quieras
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
