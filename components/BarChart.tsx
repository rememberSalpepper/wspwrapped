import type { Metrics } from "@/lib/whatsapp/types";

export default function BarChart({
  title,
  data
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = entries[0]?.[1] ?? 1;

  return (
    <div className="rounded-[2rem] border border-indigo-100 bg-white/60 p-6 shadow-sm hover-lift">
      <div className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-4">{title}</div>
      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map(([label, value], index) => (
            <div key={label} className="group">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-bold text-indigo-950">{label}</span>
                <span className="font-medium text-indigo-600">{value.toLocaleString()}</span>
              </div>
              <div className="h-3 rounded-full bg-indigo-50 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 animate-reveal"
                  style={{
                    width: `${Math.round((value / max) * 100)}%`,
                    animationDelay: `${index * 0.1}s`
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            Sin datos para mostrar 📉
          </div>
        )}
      </div>
    </div>
  );
}
