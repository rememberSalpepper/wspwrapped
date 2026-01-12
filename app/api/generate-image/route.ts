import { NextResponse } from "next/server";
import { renderShareSvg, ShareSection } from "@/lib/shareImage";
import { getReport } from "@/lib/store/reportStore";
import { verifyShareToken } from "@/lib/shareToken";

export const runtime = "nodejs";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const reportId = searchParams.get("reportId");
        const token = searchParams.get("token");
        const variant = (searchParams.get("variant") as "free" | "pro") ?? "free";
        const section = (searchParams.get("section") as ShareSection) ?? "summary";

        let metrics = null;
        let resolvedVariant = variant;

        if (token && process.env.SHARE_TOKEN_SECRET) {
            const payload = verifyShareToken(token, process.env.SHARE_TOKEN_SECRET);
            if (payload) {
                metrics = payload.metrics;
                resolvedVariant = payload.variant;
            }
        }

        if (!metrics && reportId) {
            const report = await getReport(reportId);
            if (report) {
                metrics = report.metrics;
            }
        }

        if (!metrics) {
            return NextResponse.json({ error: "Sin datos" }, { status: 404 });
        }

        const svg = renderShareSvg(metrics, resolvedVariant, section);

        return new NextResponse(svg, {
            headers: {
                "Content-Type": "image/svg+xml; charset=utf-8",
                "Content-Disposition": `attachment; filename="wspwrapped-${section}.svg"`,
                "Cache-Control": "no-store"
            }
        });
    } catch (error) {
        console.error("Error generating image:", error);
        return NextResponse.json({ error: "Error interno al generar imagen" }, { status: 500 });
    }
}
