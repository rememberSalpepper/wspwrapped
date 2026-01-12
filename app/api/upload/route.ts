import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import AdmZip from "adm-zip";
import { buildTeaser } from "@/lib/whatsapp/metrics";
import { parseInWorker } from "@/lib/whatsapp/worker";
import { cleanupExpiredReports, setReport } from "@/lib/store/reportStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_MB = 50;

function extractText(fileName: string, buffer: Buffer): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith(".txt")) {
    return buffer.toString("utf8");
  }

  if (lower.endsWith(".zip")) {
    const zip = new AdmZip(buffer);
    const entries = zip.getEntries();

    // Prioritize _chat.txt (standard WhatsApp export name)
    const chatFile = entries.find((entry) => entry.entryName.toLowerCase().endsWith("_chat.txt"));
    if (chatFile) {
      return chatFile.getData().toString("utf8");
    }

    // Fallback to any .txt file
    const txtFile = entries.find((entry) => entry.entryName.toLowerCase().endsWith(".txt"));
    if (txtFile) {
      return txtFile.getData().toString("utf8");
    }

    throw new Error("El ZIP no contiene un archivo .txt válido (_chat.txt)");
  }

  throw new Error("Formato no soportado. Sube un .txt o .zip");
}

export async function POST(request: Request) {
  // Fire and forget cleanup, or await it? 
  // Better to not block upload on cleanup, but catch errors.
  cleanupExpiredReports().catch(err => console.error("Cleanup failed:", err));

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }

  if (file.size > MAX_FILE_MB * 1024 * 1024) {
    return NextResponse.json({ error: `El archivo excede el límite de ${MAX_FILE_MB}MB` }, { status: 413 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let text: string;
  try {
    text = extractText(file.name, buffer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error de lectura";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    const metrics = await parseInWorker(text);

    const reportId = randomUUID();
    const stored = await setReport(reportId, metrics);
    const teaser = buildTeaser(metrics);

    return NextResponse.json({
      reportId,
      teaser,
      metrics,
      totalMessages: metrics.totalMessages,
      expiresAt: stored.expiresAt
    });
  } catch (error) {
    console.error("Error processing file:", error);
    const message = error instanceof Error ? error.message : "Error desconocido al procesar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
