import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-sand-50">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-sand-200 bg-white p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Tu dashboard</h1>
          <p className="mt-2 text-sm text-ink-600">
            Inicia sesion para ver tus reportes recientes o sube un chat nuevo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/upload"
              className="rounded-full bg-ink-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Subir nuevo export
            </Link>
            <button className="rounded-full border border-sand-200 px-4 py-2 text-sm font-semibold text-ink-800">
              Iniciar sesion
            </button>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
