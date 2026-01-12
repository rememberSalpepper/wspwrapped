import { NextResponse } from "next/server";
import { getReport } from "@/lib/store/reportStore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reportId = searchParams.get("reportId");

  if (!reportId) {
    return NextResponse.json({ error: "reportId requerido" }, { status: 400 });
  }

  const report = await getReport(reportId);
  if (!report) {
    return NextResponse.json({ error: "Reporte expirado" }, { status: 404 });
  }

  return NextResponse.json({ metrics: report.metrics, expiresAt: report.expiresAt });
}
