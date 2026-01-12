"use client";

interface MetricCardProps {
  title: string;
  value: string | number;
  detail?: string;
  subtext?: string; // Alias for detail
  locked?: boolean;
  color?: string; // e.g. "indigo", "pink", "blue"
  delay?: string; // e.g. "0.1s"
}

export default function MetricCard({ title, value, detail, subtext, locked, color = "indigo", delay = "0s" }: MetricCardProps) {
  const displayDetail = detail || subtext;

  const colorClasses: Record<string, string> = {
    indigo: "from-indigo-100 via-white to-pink-100",
    pink: "from-pink-100 via-white to-purple-100",
    blue: "from-blue-100 via-white to-cyan-100",
    cyan: "from-cyan-100 via-white to-teal-100",
    purple: "from-purple-100 via-white to-indigo-100",
    teal: "from-teal-100 via-white to-emerald-100",
    red: "from-red-100 via-white to-orange-100",
    emerald: "from-emerald-100 via-white to-lime-100",
  };

  const gradientClass = colorClasses[color] || colorClasses.indigo;

  return (
    <div
      className={`card-spicy relative overflow-hidden group hover-lift ${locked ? "bg-slate-50/50" : "bg-white/80"} animate-reveal`}
      style={{ animationDelay: delay }}
    >
      {/* Gradient Border Effect */}
      <div className={`absolute inset-0 p-[1px] rounded-[2rem] bg-gradient-to-br ${gradientClass} -z-10`} />

      {locked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-[4px]">
          <div className="badge-premium bg-pink-600 text-white shadow-xl shadow-pink-200 animate-pop">
            Pro ✨
          </div>
        </div>
      )}

      <div className={`space-y-4 p-6 ${locked ? "blur-xl select-none" : ""}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400 group-hover:text-pink-500 transition-colors">
          {title}
        </p>
        <div className="space-y-1">
          <p className="text-3xl md:text-4xl font-black text-indigo-950 tracking-tight group-hover:text-indigo-600 transition-colors break-words">
            {value}
          </p>
          {displayDetail && (
            <p className="text-xs font-bold text-slate-400">
              {displayDetail}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
