import type { Metrics } from "@/lib/whatsapp/types";

export default function EmojiList({ data }: { data: Metrics["emojiTop"] }) {
  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-4 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-ink-700">Top emojis</div>
      <div className="mt-4 space-y-2">
        {data.length ? (
          data.map((entry) => (
            <div key={entry.emoji} className="flex items-center justify-between text-sm">
              <span>{entry.emoji}</span>
              <span className="text-ink-600">{entry.count}</span>
            </div>
          ))
        ) : (
          <span className="text-sm text-ink-500">Sin emojis detectados</span>
        )}
      </div>
    </div>
  );
}
