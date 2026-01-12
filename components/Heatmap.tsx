import type { Metrics } from "@/lib/whatsapp/types";

const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];

export default function Heatmap({ data }: { data: Metrics["heatmap"] }) {
  const max = Math.max(...data.flat());

  return (
    <div className="rounded-[2rem] border border-teal-100 bg-white/60 p-6 shadow-sm hover-lift">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] font-black uppercase tracking-widest text-teal-400">Heatmap Semanal 📅</div>
        <div className="flex gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Menos</span>
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-sm bg-teal-50" />
            <div className="w-2 h-2 rounded-sm bg-teal-200" />
            <div className="w-2 h-2 rounded-sm bg-teal-400" />
            <div className="w-2 h-2 rounded-sm bg-teal-600" />
          </div>
          <span>Más</span>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-[repeat(24,minmax(0,1fr))] gap-1">
          {data.map((row, rowIndex) =>
            row.map((value, colIndex) => {
              const intensity = max ? value / max : 0;
              // Calculate color based on intensity
              let bg = "bg-teal-50";
              if (intensity > 0) bg = "bg-teal-100";
              if (intensity > 0.25) bg = "bg-teal-200";
              if (intensity > 0.5) bg = "bg-teal-300";
              if (intensity > 0.75) bg = "bg-teal-400";
              if (intensity > 0.9) bg = "bg-teal-500";

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`h-3 w-full rounded-sm transition-all hover:scale-150 hover:z-10 cursor-help ${bg}`}
                  style={{
                    opacity: value === 0 ? 0.3 : 1,
                  }}
                  title={`${DAYS[rowIndex]} ${colIndex}:00 - ${value} mensajes`}
                />
              );
            })
          )}
        </div>

        {/* Axis Labels */}
        <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>00:00</span>
          <span>12:00</span>
          <span>23:00</span>
        </div>

        <div className="absolute -left-6 top-0 bottom-0 flex flex-col justify-between text-[8px] font-bold text-slate-400 py-1">
          {DAYS.map(day => <span key={day}>{day.charAt(0)}</span>)}
        </div>
      </div>
    </div>
  );
}
