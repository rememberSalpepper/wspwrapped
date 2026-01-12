import { getReport } from "@/lib/store/reportStore";
import UploadClient from "@/components/UploadClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
    params: {
        id: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const report = await getReport(params.id);
    if (!report) return { title: "Reporte no encontrado" };

    return {
        title: "Análisis de WhatsApp - Resultados",
        description: "Descubre la verdad de tu chat con este análisis detallado.",
    };
}

export default async function ReportPage({ params }: Props) {
    const report = await getReport(params.id);

    if (!report) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-pink-500/30">
            <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20 pointer-events-none" />
            <div className="fixed inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10 pointer-events-none" />

            <UploadClient initialMetrics={report.metrics} initialReportId={params.id} />
        </main>
    );
}
