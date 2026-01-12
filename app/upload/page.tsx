import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import UploadClient from "@/components/UploadClient";

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16">
        <div className="mb-8 rounded-3xl border border-sand-200 bg-white p-6 shadow-soft">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Analiza tu chat en minutos</h1>
              <p className="text-sm text-ink-600">
                2 metricas gratis, el resto se desbloquea con Pro.
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-sand-200 px-4 py-2 text-sm font-semibold text-ink-800"
            >
              Volver al landing
            </Link>
          </div>
        </div>
        <UploadClient />
      </main>
      <SiteFooter />
    </div>
  );
}
