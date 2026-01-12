import { NextResponse } from "next/server";
import { getReport } from "@/lib/store/reportStore";
import { verifyShareToken } from "@/lib/shareToken";
import { renderSharePdf } from "@/lib/sharePdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("reportId");
    const token = searchParams.get("token");
    const variant = (searchParams.get("variant") as "free" | "pro") ?? "free";

    let metrics = null;
    let resolvedVariant = variant;

    if (token) {
      const secret = process.env.SHARE_TOKEN_SECRET ?? "";
      if (!secret) {
        return NextResponse.json({ error: "Share token secret missing" }, { status: 500 });
      }
      const payload = verifyShareToken(token, secret);
      if (!payload) {
        return NextResponse.json({ error: "Token invalido" }, { status: 400 });
      }
      metrics = payload.metrics;
      resolvedVariant = payload.variant;
    } else if (reportId) {
      const report = await getReport(reportId);
      if (!report) {
        return NextResponse.json({ error: "Reporte expirado" }, { status: 404 });
      }
      metrics = report.metrics;
    }

    if (!metrics) {
      return NextResponse.json({ error: "Sin datos" }, { status: 400 });
    }

    const pdfBuffer = await renderSharePdf(metrics, resolvedVariant);

    return new NextResponse(pdfBuffer as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=share.pdf",
        "Cache-Control": "no-store"
      }
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json({ error: "Error interno al generar PDF" }, { status: 500 });
  }
}
