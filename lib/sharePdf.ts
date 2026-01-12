import PDFDocument from "pdfkit";
import type { Metrics } from "./whatsapp/types";

export async function renderSharePdf(metrics: Metrics, variant: "free" | "pro"): Promise<Buffer> {
  const doc = new PDFDocument({ size: "A4", margin: 48 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));

  const topInitiator = Object.entries(metrics.dailyInitiators).sort((a, b) => b[1] - a[1])[0];
  const topInitiatorLabel = topInitiator ? `${topInitiator[0]} (${topInitiator[1]} dias)` : "Sin datos";
  const topEmoji = metrics.emojiTop[0] ? `${metrics.emojiTop[0].emoji} x${metrics.emojiTop[0].count}` : "N/A";

  doc.fontSize(22).fillColor("#0C1116").text("WSP Analyser", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(12).fillColor("#1C2530").text("Resumen rapido del chat", { align: "left" });

  doc.moveDown(1.5);
  doc.fontSize(14).fillColor("#0C1116").text(`Mensajes totales: ${metrics.totalMessages}`);
  doc.text(`Iniciador top: ${topInitiatorLabel}`);
  doc.text(`Top emoji: ${topEmoji}`);
  doc.text(`"Te amo": ${metrics.loveCount}`);

  doc.moveDown(1);
  doc.fontSize(12).fillColor("#666666").text("Privacidad primero. No guardamos tu chat.");

  if (variant === "free") {
    doc.moveDown(1);
    doc.fontSize(12).fillColor("#F05438").text("Vista Free - WSP Analyser", { align: "right" });
  }

  const endPromise = new Promise<void>((resolve) => {
    doc.on("end", () => resolve());
  });

  doc.end();
  await endPromise;

  return Buffer.concat(chunks);
}
