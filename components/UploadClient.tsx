"use client";

import { useEffect, useMemo, useState } from "react";
import type { Metrics, TeaserMetrics } from "@/lib/whatsapp/types";
import { useAuth } from "@/lib/auth/AuthContext";
import MetricCard from "./MetricCard";
import Heatmap from "./Heatmap";
import BarChart from "./BarChart";
import EmojiList from "./EmojiList";
import PaywallModal from "./PaywallModal";
import Timeline from "./Timeline";
import BlurOverlay from "./BlurOverlay";

const ACCEPTED = ".txt,.zip";

const LOADING_MESSAGES = [
    "Analizando patrones de conversación...",
    "Identificando momentos clave...",
    "Calculando dinámicas de respuesta...",
    "Escaneando la esencia del chat...",
    "Descubriendo la chispa de la charla...",
    "Procesando flujos de interacción...",
];

export default function UploadClient({ initialMetrics, initialReportId }: { initialMetrics?: Metrics | null, initialReportId?: string | null }) {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [reportId, setReportId] = useState<string | null>(initialReportId || null);
    const [metrics, setMetrics] = useState<Metrics | null>(initialMetrics || null);
    const [teaser, setTeaser] = useState<TeaserMetrics | null>(null);
    const [plan, setPlan] = useState<"free" | "pro">("free");
    const [paywallOpen, setPaywallOpen] = useState(false);
    const [downloadingSection, setDownloadingSection] = useState<string | null>(null);

    const downloadImage = async (section: string) => {
        // Block downloads for free users
        if (plan === "free") {
            setPaywallOpen(true);
            return;
        }
        try {
            setDownloadingSection(section);
            const response = await fetch(`/api/generate-image?reportId=${reportId}&variant=${plan}&section=${section}`);
            if (!response.ok) throw new Error("Error generating image");

            const svgText = await response.text();

            // Use Blob for robust UTF-8/Emoji handling
            const blob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(blob);

            const img = new Image();
            img.src = url;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            const canvas = document.createElement("canvas");
            canvas.width = 1080;
            canvas.height = 1350;
            const ctx = canvas.getContext("2d");
            if (!ctx) throw new Error("Canvas context not supported");

            ctx.drawImage(img, 0, 0);

            // Clean up the object URL
            URL.revokeObjectURL(url);

            const pngBlob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
            if (!pngBlob) throw new Error("Blob creation failed");

            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement("a");
            a.href = pngUrl;
            a.download = `wspwrapped-${section}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(pngUrl);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Error al descargar la imagen. Intenta de nuevo.");
        } finally {
            setDownloadingSection(null);
        }
    };
    const [shareUrl, setShareUrl] = useState<string | null>(null);

    // Sync plan state with auth context
    const { isPro, refreshSubscription } = useAuth();

    useEffect(() => {
        if (isPro) {
            setPlan("pro");
        }
    }, [isPro]);

    const locked = plan === "free";

    useEffect(() => {
        if (loading) {
            const interval = setInterval(() => {
                setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
            }, 2500);
            return () => clearInterval(interval);
        }
    }, [loading]);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        setFile(selectedFile);
        setError(null);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Error al procesar el archivo");

            const data = await res.json();

            if (data.totalMessages === 0) {
                throw new Error("No se pudieron detectar mensajes válidos. Verifica el formato.");
            }

            setReportId(data.reportId);
            setMetrics(data.metrics);
            setTeaser(data.teaser);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!reportId) return;
        const url = `${window.location.origin}/report/${reportId}`;
        setShareUrl(url);
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Mi Análisis de WhatsApp",
                    text: "Mira las dinámicas de mi chat ✨",
                    url,
                });
            } catch (err) {
                console.error("Error sharing:", err);
            }
        }
    };

    const responseTimes = useMemo(() => {
        if (!metrics) return {};
        const data: Record<string, number> = {};
        metrics.responseTimes.forEach((rt) => {
            data[rt.user] = Math.round(rt.avgMinutes);
        });
        return data;
    }, [metrics]);

    return (
        <div className="mx-auto max-w-6xl space-y-8 md:space-y-12 pb-24 px-4 md:px-6">
            {/* Upload Zone */}
            <div className="glass-premium p-6 md:p-12 text-center animate-reveal relative overflow-hidden group">
                <div className="absolute inset-0 -z-10 animate-mesh opacity-10 group-hover:opacity-20 transition-opacity" />
                {!file ? (
                    <label className="group flex cursor-pointer flex-col items-center gap-6">
                        <div className="flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-indigo-50 text-indigo-600 transition-all group-hover:scale-110 group-hover:rotate-6 shadow-sm">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl md:text-4xl font-black text-indigo-950 tracking-tight">Sube tu Chat</h2>
                            <p className="text-sm font-medium text-slate-500">Exporta tu chat de WhatsApp y súbelo aquí para revelar la verdad.</p>
                        </div>
                        <input type="file" accept={ACCEPTED} onChange={handleUpload} className="hidden" />
                        <div className="badge-premium bg-white shadow-sm text-slate-400">Privacidad 100% Garantizada ✨</div>
                    </label>
                ) : loading ? (
                    <div className="space-y-12 py-20 relative overflow-hidden">
                        <div className="absolute inset-0 -z-10 animate-mesh opacity-20" />
                        <div className="relative mx-auto h-32 w-32">
                            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20" />
                            <div className="absolute inset-2 animate-pulse-slow rounded-full bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-2xl shadow-indigo-500/50" />
                            <div className="absolute inset-0 animate-shimmer rounded-full opacity-30" />
                            <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">✨</div>
                        </div>
                        <div className="space-y-4">
                            <p className="text-2xl font-black text-indigo-950 animate-reveal">
                                {LOADING_MESSAGES[loadingMsgIdx]}
                            </p>
                            <div className="mx-auto h-1.5 w-48 overflow-hidden rounded-full bg-indigo-50">
                                <div className="h-full animate-shimmer bg-indigo-600" style={{ width: "60%" }} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 animate-pop">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-lg shadow-emerald-100 rotate-3">
                            <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-black text-indigo-950">Análisis Listo ✨</h2>
                        <p className="text-sm font-medium text-slate-500">{file.name}</p>
                    </div>
                )}

                {error ? (
                    <div className="mt-8 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-600 animate-pop">
                        ⚠️ {error}
                    </div>
                ) : null}
            </div>

            {teaser && metrics ? (
                <div className="space-y-16">
                    {/* 1. Hero & Summary */}
                    {/* Top Metrics (Redesigned) */}
                    <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-3 animate-reveal" style={{ animationDelay: "0.1s" }}>
                        <MetricCard
                            title="Dinámica de Afecto"
                            value={teaser.loveCount > 100 ? "❤️ Alto" : `${teaser.loveCount} ❤️`}
                            detail="Nivel de cariño detectado"
                        />
                        <MetricCard
                            title="Iniciador de Charla"
                            value={teaser.topInitiator ? teaser.topInitiator.user : "-"}
                            detail={teaser.topInitiator ? `Inició ${teaser.topInitiator.count} conversaciones 🔥` : undefined}
                        />
                        <MetricCard
                            title="Interés & Respuesta"
                            value={locked ? "???" : "Ver Pro"}
                            detail="Tiempo promedio de respuesta ⏳"
                            locked={locked}
                        />
                    </div>

                    {/* The Roast Section */}
                    <div className="glass-premium border-orange-100 bg-orange-50/30 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8" style={{ animationDelay: "0.15s" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-orange-100 text-orange-600 text-2xl">
                                    🔥
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-orange-950">The Roast</h3>
                            </div>
                            <button
                                onClick={() => downloadImage("roast")}
                                disabled={downloadingSection === "roast"}
                                className="btn-icon bg-white text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                                title="Descargar Roast"
                            >
                                {downloadingSection === "roast" ? "⏳" : "📸"}
                            </button>
                        </div>

                        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                            {/* Audio Terrorista */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-orange-100 space-y-2 hover-lift">
                                <p className="text-[10px] font-black uppercase tracking-widest text-orange-400">Audio Terrorista 🎙️</p>
                                {Object.entries(metrics.audioCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-orange-950">{user}</p>
                                        <p className="text-sm font-bold text-orange-600">{count} audios</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.audioCount).length === 0 && <p className="text-sm text-slate-400">Nadie manda audios 😇</p>}
                            </div>

                            {/* El Yo-Yo */}
                            <div className={`p-6 rounded-[2rem] bg-white/60 border border-purple-100 space-y-2 hover-lift relative ${locked ? "blur-sm select-none" : ""}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">El Yo-Yo 🪞</p>
                                {Object.entries(metrics.yoyoCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-purple-950">{user}</p>
                                        <p className="text-sm font-bold text-purple-600">{count} veces "yo/mi"</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.yoyoCount).length === 0 && <p className="text-sm text-slate-400">Nadie es egocéntrico 🧘</p>}
                            </div>

                            {/* Conversation Killer */}
                            <div className={`p-6 rounded-[2rem] bg-white/60 border border-slate-200 space-y-2 hover-lift relative ${locked ? "blur-sm select-none" : ""}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">El Cortante 💀</p>
                                {Object.entries(metrics.killerCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-slate-800">{user}</p>
                                        <p className="text-sm font-bold text-slate-500">{count} respuestas secas</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.killerCount).length === 0 && <p className="text-sm text-slate-400">Todos conversan bien 🗣️</p>}
                            </div>

                            {/* Toxic-O-Meter */}
                            <div className={`p-6 rounded-[2rem] bg-white/60 border border-green-200 space-y-2 hover-lift relative ${locked ? "blur-sm select-none" : ""}`}>
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-500">Toxic-O-Meter ☢️</p>
                                {Object.entries(metrics.toxicCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-green-900">{user}</p>
                                        <p className="text-sm font-bold text-green-600">{count} gritos/explosiones</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.toxicCount).length === 0 && <p className="text-sm text-slate-400">Chat 100% pacífico 🕊️</p>}
                            </div>
                        </div>
                    </div>

                    {/* Ghosting Section */}
                    <BlurOverlay
                        locked={locked}
                        onUnlock={() => setPaywallOpen(true)}
                        title="Zona Ghosting 👻"
                        description="Descubre quién ghostea y quién responde al instante"
                    >
                        <div className="glass-premium border-slate-200 bg-slate-50/50 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8" style={{ animationDelay: "0.2s" }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-200 text-slate-600 text-2xl">
                                        👻
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-slate-800">Zona Ghosting</h3>
                                </div>
                                <button
                                    onClick={() => downloadImage("ghosting")}
                                    disabled={downloadingSection === "ghosting"}
                                    className="btn-icon bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                                    title="Descargar Ghosting"
                                >
                                    {downloadingSection === "ghosting" ? "⏳" : "📸"}
                                </button>
                            </div>

                            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                                {/* Avg Response Time */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-slate-200 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tiempo Promedio Respuesta ⏳</p>
                                    {metrics.responseTimes.map((rt) => (
                                        <div key={rt.user} className="flex justify-between items-center">
                                            <span className="font-bold text-slate-700">{rt.user}</span>
                                            <span className="font-black text-slate-900">{rt.avgMinutes} min</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Longest Ghosting */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-slate-200 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Récord de Ghosting 🏆</p>
                                    {Object.entries(metrics.longestResponseTime).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, minutes]) => (
                                        <div key={user}>
                                            <p className="text-xl font-black text-slate-800">{user}</p>
                                            <p className="text-sm font-bold text-slate-500">
                                                Tardó {minutes > 1440 ? `${Math.round(minutes / 1440)} días` : `${Math.round(minutes / 60)} horas`} en responder
                                            </p>
                                        </div>
                                    ))}
                                    {Object.keys(metrics.longestResponseTime).length === 0 && <p className="text-sm text-slate-400">Nadie ghostea aquí 👻</p>}
                                </div>

                                {/* El Ansioso */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-slate-200 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">El Ansioso 😬</p>
                                    {Object.entries(metrics.fastResponseCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                        <div key={user}>
                                            <p className="text-xl font-black text-slate-800">{user}</p>
                                            <p className="text-sm font-bold text-slate-500">Respondió {count} veces al instante</p>
                                        </div>
                                    ))}
                                    {Object.keys(metrics.fastResponseCount).length === 0 && <p className="text-sm text-slate-400">Nadie corre 🐢</p>}
                                </div>

                                {/* El Desaparecido */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-slate-200 space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">El Desaparecido 😶‍🌫️</p>
                                    {Object.entries(metrics.longResponseCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                        <div key={user}>
                                            <p className="text-xl font-black text-slate-800">{user}</p>
                                            <p className="text-sm font-bold text-slate-500">Tardó +6h en responder {count} veces</p>
                                        </div>
                                    ))}
                                    {Object.keys(metrics.longResponseCount).length === 0 && <p className="text-sm text-slate-400">Nadie desaparece 👻</p>}
                                </div>
                            </div>
                        </div>
                    </BlurOverlay>

                    {/* Viral Metrics Grid */}
                    <BlurOverlay
                        locked={locked}
                        onUnlock={() => setPaywallOpen(true)}
                        title="Métricas Virales 🔥"
                        description="Chat Dryness, risas, double texting y más"
                    >
                        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-reveal" style={{ animationDelay: "0.25s" }}>
                            {/* Chat Dryness */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">🌵</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Chat Dryness</p>
                                </div>
                                {Object.entries(metrics.chatDryness).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{val} words/msg</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.chatDryness).length === 0 && <p className="text-sm text-slate-400">Todos hablan mucho 🗣️</p>}
                            </div>

                            {/* Laugh Meter */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">😂</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Laugh Meter</p>
                                </div>
                                {Object.entries(metrics.laughMeter).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">{val} risas</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.laughMeter).length === 0 && <p className="text-sm text-slate-400">Nadie se ríe 😐</p>}
                            </div>

                            {/* Double Texting */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">📱</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Double Texting</p>
                                </div>
                                {Object.entries(metrics.doubleTexting).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">{val} veces</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.doubleTexting).length === 0 && <p className="text-sm text-slate-400">Nadie es intenso 😌</p>}
                            </div>

                            {/* Night Owl */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">🌙</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Noctámbulos</p>
                                </div>
                                {Object.entries(metrics.nightOwl).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-indigo-950 bg-slate-100 px-2 py-1 rounded-lg">{val} msgs (0-6am)</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.nightOwl).length === 0 && <p className="text-sm text-slate-400">Todos duermen temprano 😴</p>}
                            </div>

                            {/* Longest Monologue */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">🎤</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Monólogo</p>
                                </div>
                                {Object.entries(metrics.longestMonologue).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-pink-600 bg-pink-50 px-2 py-1 rounded-lg">{val} seguidos</span>
                                    </div>
                                ))}
                                {Object.keys(metrics.longestMonologue).length === 0 && <p className="text-sm text-slate-400">Nadie habla solo 🤐</p>}
                            </div>

                            {/* Weekend Warrior */}
                            <div className={`glass-premium p-6 space-y-3 ${locked ? "blur-sm select-none" : ""}`}>
                                <div className="flex items-center gap-2 text-slate-400">
                                    <span className="text-xl">🎉</span>
                                    <p className="text-[10px] font-black uppercase tracking-widest">Weekend Warrior</p>
                                </div>
                                {Object.entries(metrics.weekendWarrior).map(([user, val]) => (
                                    <div key={user} className="flex justify-between items-center text-sm font-bold text-slate-600">
                                        <span>{user}</span>
                                        <span className="text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{val} msgs (Sáb/Dom)</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </BlurOverlay>

                    {/* 3. Romance & Deep Insights */}
                    {/* Romance Section */}
                    <BlurOverlay
                        locked={locked}
                        onUnlock={() => setPaywallOpen(true)}
                        title="Romance & Cursilerías 💘"
                        description="Buenos días, apodos, intensidad amorosa y más"
                    >
                        <div className="glass-premium border-pink-100 bg-pink-50/30 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8" style={{ animationDelay: "0.3s" }}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-pink-100 text-pink-600 text-2xl">
                                        💘
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-pink-950">Romance & Cursilerías</h3>
                                </div>
                                <button
                                    onClick={() => downloadImage("romance")}
                                    disabled={downloadingSection === "romance"}
                                    className="btn-icon bg-white text-pink-600 hover:bg-pink-50 disabled:opacity-50"
                                    title="Descargar Romance"
                                >
                                    {downloadingSection === "romance" ? "⏳" : "📸"}
                                </button>
                            </div>

                            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                                {/* Good Morning Streak */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-pink-100 space-y-2 hover-lift">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Racha Buenos Días ☀️</p>
                                    {Object.entries(metrics.goodMorningStreak).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                        <div key={user}>
                                            <p className="text-xl font-black text-pink-950">{user}</p>
                                            <p className="text-sm font-bold text-pink-600">{count} días seguidos</p>
                                        </div>
                                    ))}
                                    {Object.keys(metrics.goodMorningStreak).length === 0 && <p className="text-sm text-slate-400">Nadie saluda 😢</p>}
                                </div>

                                {/* Intensidad Amorosa (New) */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-pink-100 space-y-2 hover-lift">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Intensidad Amorosa 💖</p>
                                    {Object.entries(metrics.loveCountByUser).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                        <div key={user}>
                                            <p className="text-xl font-black text-pink-950">{user}</p>
                                            <p className="text-sm font-bold text-pink-600">{count} palabras de amor</p>
                                        </div>
                                    ))}
                                    {Object.keys(metrics.loveCountByUser).length === 0 && <p className="text-sm text-slate-400">Amor silencioso 🤫</p>}
                                </div>

                                {/* Nicknames Cloud */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-pink-100 space-y-2 hover-lift col-span-1 md:col-span-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Apodos Favoritos ☁️</p>
                                    <div className="flex flex-wrap gap-2">
                                        {Array.from(new Set(Object.values(metrics.nicknames).flatMap(Object.keys))).map(nick => {
                                            const total = Object.values(metrics.nicknames).reduce((acc, userNicks) => acc + (userNicks[nick] || 0), 0);
                                            return total > 0 ? (
                                                <span key={nick} className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold" style={{ fontSize: Math.min(12 + total, 24) }}>
                                                    {nick} ({total})
                                                </span>
                                            ) : null;
                                        })}
                                        {Object.keys(metrics.nicknames).length === 0 && <span className="text-sm text-slate-400 italic">No usan apodos cursis...</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Love Timeline (Simple Bar) */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-pink-100 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-pink-400">Timeline del Amor 📈</p>
                                {metrics.loveTimeline.length > 0 ? (
                                    <div className="flex items-end gap-1 h-32">
                                        {metrics.loveTimeline.slice(-12).map((item) => (
                                            <div key={item.date} className="flex-1 flex flex-col items-center gap-1 group">
                                                <div className="w-full bg-pink-400 rounded-t-md relative group-hover:bg-pink-600 transition-colors min-h-[4px]" style={{ height: `${Math.max((item.count / (Math.max(...metrics.loveTimeline.map(t => t.count)) || 1)) * 100, 5)}%` }}>
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                        {item.date}: {item.count}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-32 flex items-center justify-center text-slate-400 text-sm italic">
                                        No hay suficientes datos de amor... 💔
                                    </div>
                                )}
                                <p className="text-center text-xs text-slate-400 font-bold">Últimos 12 meses</p>
                            </div>
                        </div>
                    </BlurOverlay>

                    {/* Insights Section */}
                    <BlurOverlay
                        locked={locked}
                        onUnlock={() => setPaywallOpen(true)}
                        title="Insights Psicológicos 🧠"
                        description="Patrones de comportamiento y dinámicas ocultas"
                    >
                        <div className="glass-premium border-blue-100 bg-blue-50/30 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8" style={{ animationDelay: "0.35s" }}>
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-2xl">
                                    🧠
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-blue-950">Insights Psicológicos</h3>
                            </div>

                            <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
                                {/* El Arrepentido */}
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/60 border border-blue-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1">El Arrepentido 🙏</p>
                                        {Object.entries(metrics.pardonCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                            <div key={user}>
                                                <p className="text-xl font-black text-blue-950">{user}</p>
                                                <p className="text-sm font-bold text-blue-600">Pidió perdón {count} veces</p>
                                            </div>
                                        ))}
                                        {Object.keys(metrics.pardonCount).length === 0 && <p className="text-sm text-slate-400">Nadie pide perdón aquí 😤</p>}
                                    </div>
                                    <div className="text-4xl">🥺</div>
                                </div>

                                {/* Prime Time */}
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/60 border border-indigo-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">Prime Time 📺</p>
                                        <p className="text-xl font-black text-indigo-950">
                                            {metrics.primeTime.hour}:00 - {metrics.primeTime.hour + 1}:00
                                        </p>
                                        <p className="text-sm font-bold text-indigo-600">
                                            Hora pico de actividad
                                        </p>
                                    </div>
                                    <div className="text-4xl">🕰️</div>
                                </div>

                                {/* El Iniciador */}
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/60 border border-cyan-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-cyan-500 mb-1">El Iniciador 🚀</p>
                                        {Object.entries(metrics.dailyInitiators).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                            <div key={user}>
                                                <p className="text-xl font-black text-cyan-950">{user}</p>
                                                <p className="text-sm font-bold text-cyan-600">Inició la charla {count} días</p>
                                            </div>
                                        ))}
                                        {Object.keys(metrics.dailyInitiators).length === 0 && <p className="text-sm text-slate-400">Conversación espontánea ✨</p>}
                                    </div>
                                    <div className="text-4xl">👋</div>
                                </div>

                                {/* El Curioso */}
                                <div className="flex items-center justify-between p-6 rounded-[2rem] bg-white/60 border border-violet-100">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-violet-400 mb-1">El Curioso ❓</p>
                                        {Object.entries(metrics.questionCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                            <div key={user}>
                                                <p className="text-xl font-black text-violet-950">{user}</p>
                                                <p className="text-sm font-bold text-violet-600">Hizo {count} preguntas</p>
                                            </div>
                                        ))}
                                        {Object.keys(metrics.questionCount).length === 0 && <p className="text-sm text-slate-400">Nadie pregunta nada 😶</p>}
                                    </div>
                                    <div className="text-4xl">🤔</div>
                                </div>
                            </div>
                        </div>
                    </BlurOverlay>

                    {/* Charts Grid */}
                    <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 animate-reveal" style={{ animationDelay: "0.4s" }}>
                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Análisis de Mensajes ✨</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none" : ""}>
                                <BarChart title="Volumen de Conversación" data={metrics.messagesByUser} />
                            </div>
                        </div>

                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Tiempos de Respuesta ⏳</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none" : ""}>
                                <BarChart title="Minutos para responder" data={responseTimes} />
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 animate-reveal" style={{ animationDelay: "0.45s" }}>
                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Mapa de Calor de Interacción 🔥</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none" : ""}>
                                <Heatmap data={metrics.heatmap} />
                            </div>
                        </div>

                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Mood del Chat ✨</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none" : ""}>
                                <EmojiList data={metrics.emojiTop} />
                                {/* Emoji Density (New) */}
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Densidad de Emojis 📊</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(metrics.emojiDensity).map(([user, density]) => (
                                            <div key={user} className="bg-slate-50 rounded-xl p-3 text-center">
                                                <p className="text-xs font-bold text-slate-500">{user}</p>
                                                <p className="text-lg font-black text-indigo-600">{density}%</p>
                                                <p className="text-[10px] text-slate-400">emojis/palabras</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-4 md:gap-8 grid-cols-1 md:grid-cols-2 animate-reveal" style={{ animationDelay: "0.5s" }}>
                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Flujo de Interacción 📈</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none" : ""}>
                                <Timeline data={metrics.timeline} />
                            </div>
                        </div>

                        <div className={`glass-premium relative overflow-hidden rounded-[3rem] p-8 ${locked ? "bg-slate-50/50" : ""}`}>
                            {locked && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
                                    <span className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">Títulos Ganados 🏆</span>
                                </div>
                            )}
                            <div className={locked ? "blur-xl select-none space-y-6" : "space-y-6"}>
                                <div className="space-y-4">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">Hall of Fame</p>
                                    <div className="grid gap-3">
                                        {metrics.badges.map((badge) => (
                                            <div key={badge.badge + badge.user} className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 hover-lift">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 text-lg shadow-sm">
                                                    🏆
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-indigo-950">{badge.badge}</p>
                                                    <p className="text-xs font-bold text-slate-500">{badge.user} • {badge.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {metrics.badges.length === 0 && (
                                            <span className="text-sm font-bold text-slate-300 italic">Sin títulos aún...</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                                    ¡Comparte tus dinámicas de chat y sorprende a todos! ✨
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4. Linguistics */}
                    {/* Linguistic Section */}
                    <div className={`glass-premium border-teal-100 bg-teal-50/30 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 ${locked ? "blur-sm select-none" : ""}`} style={{ animationDelay: "0.55s" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-teal-100 text-teal-600 text-2xl">
                                    🧠
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-teal-950">Psicología Lingüística</h3>
                            </div>
                            <button
                                onClick={() => downloadImage("linguistics")}
                                disabled={downloadingSection === "linguistics"}
                                className="btn-icon bg-white text-teal-600 hover:bg-teal-50 disabled:opacity-50"
                                title="Descargar Psicología"
                            >
                                {downloadingSection === "linguistics" ? "⏳" : "📸"}
                            </button>
                        </div>

                        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {/* Laugh Styles */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-teal-100 space-y-4 col-span-1 md:col-span-1 lg:col-span-1 row-span-2">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">Estilos de Risa 😂</p>
                                <div className="grid gap-4">
                                    {metrics.participants.map(user => {
                                        const styles = metrics.laughStyles[user] || { jaja: 0, haha: 0, lol: 0, other: 0 };
                                        const total = styles.jaja + styles.haha + styles.lol + styles.other || 1;
                                        const maxStyleEntry = Object.entries(styles).sort((a, b) => b[1] - a[1])[0];
                                        const maxStyle = maxStyleEntry[0] === 'other' ? 'Risa Rara' : maxStyleEntry[0];

                                        return (
                                            <div key={user} className="bg-teal-50 rounded-xl p-3">
                                                <p className="font-bold text-teal-900 text-sm mb-1">{user}</p>
                                                <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-teal-200/50">
                                                    <div style={{ width: `${(styles.jaja / total) * 100}%` }} className="bg-yellow-400" title="jaja" />
                                                    <div style={{ width: `${(styles.haha / total) * 100}%` }} className="bg-blue-400" title="haha" />
                                                    <div style={{ width: `${(styles.lol / total) * 100}%` }} className="bg-green-400" title="lol" />
                                                    <div style={{ width: `${(styles.other / total) * 100}%` }} className="bg-purple-400" title="risa rara" />
                                                </div>
                                                <p className="text-[10px] text-teal-600 mt-1 font-bold capitalize">Team {maxStyle}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* El Indeciso */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-teal-100 space-y-2 hover-lift">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">El Indeciso 😐</p>
                                {Object.entries(metrics.ellipsisCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-teal-950">{user}</p>
                                        <p className="text-sm font-bold text-teal-600">Dudó {count} veces</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.ellipsisCount).length === 0 && <p className="text-sm text-slate-400">Nadie duda 🤖</p>}
                            </div>

                            {/* El Entusiasta (New) */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-teal-100 space-y-2 hover-lift">
                                <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">El Entusiasta 🤩</p>
                                {Object.entries(metrics.exclamationCount).sort((a, b) => b[1] - a[1]).slice(0, 1).map(([user, count]) => (
                                    <div key={user}>
                                        <p className="text-xl font-black text-teal-950">{user}</p>
                                        <p className="text-sm font-bold text-teal-600">Gritó {count} veces (!)</p>
                                    </div>
                                ))}
                                {Object.keys(metrics.exclamationCount).length === 0 && <p className="text-sm text-slate-400">Nadie se emociona 😐</p>}
                            </div>

                            {/* Bad Words & Politeness */}
                            <div className="space-y-6 col-span-1 md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                {/* Groserómetro */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-red-100 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-red-400">Groserómetro 🤬</p>
                                    {metrics.participants.map(user => {
                                        const badWordsMap = metrics.badWords[user] || {};
                                        const totalBad = Object.values(badWordsMap).reduce((a, b) => a + b, 0);
                                        const topBad = Object.entries(badWordsMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

                                        return (
                                            <div key={user} className="border-b border-red-100 last:border-0 pb-2 last:pb-0">
                                                <div className="flex justify-between items-baseline">
                                                    <p className="font-black text-red-950 text-sm">{user}</p>
                                                    <p className="text-xs font-bold text-red-600">{totalBad}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {topBad.map(([word, count]) => (
                                                        <span key={word} className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-700 rounded">
                                                            {word} ({count})
                                                        </span>
                                                    ))}
                                                    {topBad.length === 0 && <span className="text-[10px] text-slate-400 italic">Limpio ✨</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* El Educado */}
                                <div className="p-6 rounded-[2rem] bg-white/60 border border-emerald-100 space-y-3">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">El Educado 🎩</p>
                                    {metrics.participants.map(user => {
                                        const politeMap = metrics.politeness[user] || {};
                                        const totalPolite = Object.values(politeMap).reduce((a, b) => a + b, 0);
                                        const topPolite = Object.entries(politeMap).sort((a, b) => b[1] - a[1]).slice(0, 3);

                                        return (
                                            <div key={user} className="border-b border-emerald-100 last:border-0 pb-2 last:pb-0">
                                                <div className="flex justify-between items-baseline">
                                                    <p className="font-black text-emerald-950 text-sm">{user}</p>
                                                    <p className="text-xs font-bold text-emerald-600">{totalPolite}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {topPolite.map(([word, count]) => (
                                                        <span key={word} className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">
                                                            {word} ({count})
                                                        </span>
                                                    ))}
                                                    {topPolite.length === 0 && <span className="text-[10px] text-slate-400 italic">Nada 😶</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 5. Content & Media */}
                    {/* Content & Media Section (Bento Grid) */}
                    <div className={`glass-premium border-indigo-100 bg-indigo-50/30 animate-reveal p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 ${locked ? "blur-sm select-none" : ""}`} style={{ animationDelay: "0.6s" }}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 text-2xl">
                                    🎨
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-indigo-950">Contenido & Multimedia</h3>
                            </div>
                            <button
                                onClick={() => downloadImage("multimedia")}
                                disabled={downloadingSection === "multimedia"}
                                className="btn-icon bg-white text-indigo-600 hover:bg-indigo-50 disabled:opacity-50"
                                title="Descargar Multimedia"
                            >
                                {downloadingSection === "multimedia" ? "⏳" : "📸"}
                            </button>
                        </div>

                        <div className="grid gap-4 md:gap-4 grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[500px]">
                            {/* Large Card: Media King/Queen */}
                            <div className="col-span-1 md:col-span-2 md:row-span-2 p-8 rounded-[2.5rem] bg-white/80 border border-indigo-100 flex flex-col justify-center items-center text-center space-y-4 shadow-sm hover-lift">
                                <div className="h-20 w-20 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 text-4xl mb-2">
                                    👑
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-indigo-400">Rey/Reina Multimedia</p>
                                    <p className="text-3xl md:text-4xl font-black text-indigo-950 mt-2">
                                        {metrics.participants.reduce((a, b) => {
                                            const countA = (metrics.imageCount[a] || 0) + (metrics.stickerCount[a] || 0) + (metrics.audioCount[a] || 0);
                                            const countB = (metrics.imageCount[b] || 0) + (metrics.stickerCount[b] || 0) + (metrics.audioCount[b] || 0);
                                            return countA > countB ? a : b;
                                        })}
                                    </p>
                                    <p className="text-sm font-bold text-indigo-600 mt-1">Domina el contenido visual</p>
                                </div>
                            </div>

                            {/* Audio */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-indigo-50 flex flex-col justify-between hover:bg-white/80 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl">🎤</span>
                                    <span className="text-xs font-black text-indigo-300">AUDIO</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-indigo-900">
                                        {Object.values(metrics.audioCount).reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">Audios totales</p>
                                </div>
                            </div>

                            {/* Stickers */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-pink-50 flex flex-col justify-between hover:bg-white/80 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl">👾</span>
                                    <span className="text-xs font-black text-pink-300">STICKERS</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-pink-900">
                                        {Object.values(metrics.stickerCount).reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">Stickers enviados</p>
                                </div>
                            </div>

                            {/* Photos */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-blue-50 flex flex-col justify-between hover:bg-white/80 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl">📸</span>
                                    <span className="text-xs font-black text-blue-300">FOTOS</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-blue-900">
                                        {Object.values(metrics.imageCount).reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">Imágenes compartidas</p>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="p-6 rounded-[2rem] bg-white/60 border border-emerald-50 flex flex-col justify-between hover:bg-white/80 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className="text-2xl">🔗</span>
                                    <span className="text-xs font-black text-emerald-300">LINKS</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-emerald-900">
                                        {Object.values(metrics.linkCount).reduce((a, b) => a + b, 0)}
                                    </p>
                                    <p className="text-xs font-bold text-slate-500">Enlaces enviados</p>
                                </div>
                            </div>
                        </div>

                        {/* Top Words */}
                        <div className="p-6 rounded-[2rem] bg-white/60 border border-indigo-100 space-y-4 col-span-1 md:col-span-1 lg:col-span-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Palabras Top 🗣️</p>
                            <div className="flex flex-wrap gap-2">
                                {(() => {
                                    const allWords = Object.values(metrics.topWords).flat();
                                    const wordMap = new Map<string, number>();
                                    allWords.forEach(({ word, count }) => {
                                        wordMap.set(word, (wordMap.get(word) || 0) + count);
                                    });
                                    const sortedWords = Array.from(wordMap.entries())
                                        .map(([word, count]) => ({ word, count }))
                                        .sort((a, b) => b.count - a.count)
                                        .slice(0, 15);

                                    if (sortedWords.length === 0) return <p className="text-sm text-slate-400 italic">No hay palabras suficientes 🤐</p>;

                                    return sortedWords.map((word, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold"
                                            style={{ opacity: 1 - i * 0.05 }}
                                        >
                                            {word.word} <span className="opacity-50 text-[10px]">({word.count})</span>
                                        </span>
                                    ));
                                })()}
                            </div>
                        </div>

                        {/* Top Phrases */}
                        <div className="p-6 rounded-[2rem] bg-white/60 border border-indigo-100 space-y-4 col-span-1 md:col-span-1 lg:col-span-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Frases Típicas 💬</p>
                            <div className="grid gap-2">
                                {(() => {
                                    const allPhrases = Object.values(metrics.topPhrases).flat();
                                    const phraseMap = new Map<string, number>();
                                    allPhrases.forEach(({ phrase, count }) => {
                                        phraseMap.set(phrase, (phraseMap.get(phrase) || 0) + count);
                                    });
                                    const sortedPhrases = Array.from(phraseMap.entries())
                                        .map(([phrase, count]) => ({ phrase, count }))
                                        .sort((a, b) => b.count - a.count)
                                        .slice(0, 5);

                                    if (sortedPhrases.length === 0) return <p className="text-sm text-slate-400 italic">No hay frases repetidas 🤔</p>;

                                    return sortedPhrases.map((phrase, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 bg-indigo-50 rounded-xl">
                                            <p className="font-medium text-indigo-900 text-sm">"{phrase.phrase}"</p>
                                            <span className="text-xs font-bold text-indigo-400 bg-white px-2 py-1 rounded-lg shadow-sm">
                                                {phrase.count}x
                                            </span>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    </div>

                    {/* Export Section */}
                    <div className="glass-premium border-pink-100 bg-pink-50/30 animate-reveal p-6 md:p-10 rounded-[2rem] md:rounded-[3rem]" style={{ animationDelay: "0.5s" }}>
                        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-indigo-950 text-shimmer">Guarda tus Momentos</h3>
                                <p className="text-sm font-medium text-slate-500">
                                    Descarga en HD para compartir. <span className="text-pink-600 font-bold">Sin marca de agua en Pro.</span>
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href={`/api/generate-image?reportId=${reportId}&variant=${plan}`}
                                    className="btn-primary bg-indigo-950 text-xs px-10 py-5 hover-lift shadow-xl shadow-indigo-100"
                                >
                                    Descargar Imagen 📸
                                </a>
                                <button
                                    onClick={handleShare}
                                    className="btn-spicy text-xs px-10 py-5 hover-lift shadow-xl shadow-pink-100"
                                >
                                    Generar Enlace ✨
                                </button>
                            </div>
                        </div>
                        {shareUrl && (
                            <div className="mt-8 p-6 rounded-[2rem] bg-white border border-pink-100 text-sm font-black text-pink-600 animate-pop shadow-xl shadow-pink-100/50">
                                Enlace público de resultados: <span className="text-slate-600 ml-2 select-all underline decoration-pink-300 decoration-2">{shareUrl}</span>
                            </div>
                        )}
                    </div>

                    {/* Paywall Banner */}
                    {
                        locked && (
                            <div className="glass-premium bg-indigo-950 text-white shadow-2xl shadow-indigo-500/20 border-none animate-glow animate-reveal p-6 md:p-12 rounded-[2rem] md:rounded-[4rem]" style={{ animationDelay: "0.6s" }}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-10">
                                    <div className="space-y-4 text-center md:text-left">
                                        <h3 className="text-3xl md:text-4xl font-black text-shimmer">Descubre el Análisis Completo ✨</h3>
                                        <p className="text-indigo-200 font-medium text-lg max-w-md">
                                            Desbloquea el Análisis de Intensidad, Tiempos de Respuesta y exportaciones HD sin marca de agua.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setPaywallOpen(true)}
                                        className="btn-spicy bg-white text-pink-600 hover:bg-pink-50 shadow-none w-full md:w-auto text-xl px-12 py-6 hover-lift"
                                    >
                                        Ser Pro Ahora ✨
                                    </button>
                                </div>
                            </div>
                        )
                    }
                </div >
            ) : null
            }

            <PaywallModal
                open={paywallOpen}
                onClose={() => setPaywallOpen(false)}
                onUnlock={() => {
                    refreshSubscription();
                    setPlan("pro");
                    setPaywallOpen(false);
                }}
                reportId={reportId}
            />
        </div >
    );
}
