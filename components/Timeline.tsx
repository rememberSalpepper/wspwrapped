import type { Metrics } from "@/lib/whatsapp/types";

export default function Timeline({ data, title = "Timeline de Actividad 📈" }: { data: Metrics["timeline"], title?: string }) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-[2rem] border border-pink-100 bg-white/60 p-6 shadow-sm hover-lift flex items-center justify-center h-48">
        <p className="text-sm text-slate-400 italic">Sin datos de tiempo 🕰️</p>
      </div>
    );
  }

  // Normalize data for SVG
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const height = 100;
  const width = 100;

  // Generate points for the area chart
  const points = data.map((d, i) => {
    const x = data.length > 1 ? (i / (data.length - 1)) * width : width / 2; // Center if single point
    const y = height - (d.count / maxCount) * height;
    return `${x},${y}`;
  }).join(" ");

  // Create area path (close the loop at the bottom)
  const areaPath = `${points} ${width},${height} 0,${height}`;

  return (
    <div className="rounded-[2rem] border border-pink-100 bg-white/60 p-6 shadow-sm hover-lift">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-pink-400">{title}</div>
        <div className="text-[10px] font-bold text-pink-300 bg-pink-50 px-2 py-1 rounded-full">
          {data.length} días
        </div>
      </div>

      <div className="relative h-32 w-full">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gradientArea" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={`M ${areaPath} Z`} fill="url(#gradientArea)" />

          {/* Line Stroke */}
          <path d={`M ${points}`} fill="none" stroke="#ec4899" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* Peak Label (Simple) */}
        {data.length > 0 && (
          <div className="absolute top-0 right-0 text-[10px] font-bold text-pink-600 bg-white/80 backdrop-blur px-2 py-1 rounded-lg shadow-sm border border-pink-100">
            Max: {maxCount} msgs
          </div>
        )}
      </div>

      {/* X Axis Labels (Start/End) */}
      <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
        <span>{data[0]?.date}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}
