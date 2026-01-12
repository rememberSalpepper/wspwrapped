import { parseWhatsAppExport } from "./parser";
import { computeMetrics } from "./metrics";
import type { Metrics } from "./types";

export async function parseInWorker(text: string): Promise<Metrics> {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      try {
        const parsed = parseWhatsAppExport(text);
        const metrics = computeMetrics(parsed.messages);
        resolve(metrics);
      } catch (error) {
        reject(error);
      }
    });
  });
}
