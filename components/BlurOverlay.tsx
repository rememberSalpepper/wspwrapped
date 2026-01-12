"use client";

import { useState } from "react";

interface BlurOverlayProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    onUnlock: () => void;
    locked?: boolean;
}

export default function BlurOverlay({
    children,
    title = "Contenido Premium",
    description = "Desbloquea el análisis completo de tu chat",
    onUnlock,
    locked = true,
}: BlurOverlayProps) {
    const [isHovered, setIsHovered] = useState(false);

    if (!locked) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Blurred Content */}
            <div className="blur-[8px] select-none pointer-events-none">
                {children}
            </div>

            {/* Overlay */}
            <div
                className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 md:gap-6 p-6 bg-gradient-to-b from-white/40 via-white/60 to-white/40 backdrop-blur-[2px] rounded-[2rem] md:rounded-[3rem] transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Lock Icon */}
                <div
                    className={`h-16 w-16 md:h-20 md:w-20 flex items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-pink-500 text-white text-3xl md:text-4xl shadow-xl shadow-indigo-200/50 transition-transform duration-300 ${isHovered ? "scale-110 rotate-3" : ""
                        }`}
                >
                    🔒
                </div>

                {/* Title & Description */}
                <div className="text-center space-y-2 max-w-sm">
                    <h4 className="text-lg md:text-xl font-black text-indigo-950">
                        {title}
                    </h4>
                    <p className="text-sm font-medium text-slate-500">{description}</p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onUnlock}
                    className={`group relative overflow-hidden px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 via-pink-500 to-indigo-600 bg-[length:200%_100%] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-pink-200/50 transition-all duration-500 hover:bg-right hover:scale-105 hover:shadow-2xl hover:shadow-pink-300/50 ${isHovered ? "animate-pulse" : ""
                        }`}
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Desbloquear Todo
                        <span className="text-lg transition-transform group-hover:translate-x-1">
                            ✨
                        </span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>

                {/* Price Badge */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-slate-100 shadow-sm">
                    <span className="text-xs font-black text-indigo-600">$9.99</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        /mes
                    </span>
                </div>
            </div>
        </div>
    );
}
