import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Política de Cookies | WspWrapped",
    description: "Información sobre el uso de cookies en WspWrapped"
};

export default function CookiesPage() {
    return (
        <div className="min-h-screen bg-white">
            <SiteHeader />

            <main className="px-6 py-20">
                <div className="mx-auto max-w-4xl space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-black text-indigo-950 tracking-tight">
                            Política de Cookies
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Última actualización: {new Date().toLocaleDateString('es-ES')}
                        </p>
                    </div>

                    <div className="glass-premium p-8 md:p-12 space-y-8 rounded-[3rem]">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">¿Qué son las cookies?</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas un sitio web. Se utilizan para mejorar tu experiencia y recordar tus preferencias.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">Cookies que utilizamos</h2>
                            <div className="space-y-6">
                                {/* Cookies Esenciales */}
                                <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100">
                                    <h3 className="text-lg font-black text-indigo-950 mb-3">🔒 Cookies Esenciales</h3>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Necesarias para el funcionamiento básico del sitio. No se pueden desactivar.
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 mt-0.5">•</span>
                                            <span><strong>Autenticación:</strong> Para mantener tu sesión activa cuando inicias sesión</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-indigo-600 mt-0.5">•</span>
                                            <span><strong>Seguridad:</strong> Para proteger contra ataques y abusos</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Cookies Funcionales */}
                                <div className="p-6 rounded-2xl bg-pink-50 border border-pink-100">
                                    <h3 className="text-lg font-black text-pink-950 mb-3">⚙️ Cookies Funcionales</h3>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Mejoran tu experiencia recordando tus preferencias.
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-pink-600 mt-0.5">•</span>
                                            <span><strong>Preferencias:</strong> Idioma, configuración de privacidad</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-pink-600 mt-0.5">•</span>
                                            <span><strong>Estado Pro:</strong> Para recordar tu nivel de suscripción</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Cookies de Terceros */}
                                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                                    <h3 className="text-lg font-black text-slate-950 mb-3">🌐 Cookies de Terceros</h3>
                                    <p className="text-sm text-slate-600 mb-3">
                                        Proveedores externos que utilizamos para funcionalidad específica.
                                    </p>
                                    <ul className="space-y-2 text-sm text-slate-600">
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-600 mt-0.5">•</span>
                                            <span><strong>Supabase (Auth):</strong> Autenticación y base de datos</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-slate-600 mt-0.5">•</span>
                                            <span><strong>PayPal:</strong> Procesamiento de pagos</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">¿Guardamos tu información personal?</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong>No.</strong> Las cookies que utilizamos NO almacenan:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Contenido de tus mensajes</li>
                                    <li>Archivos de chat</li>
                                    <li>Información financiera (esto lo maneja PayPal)</li>
                                    <li>Datos sensibles de terceros</li>
                                </ul>
                                <p>
                                    Solo guardamos información básica necesaria para el funcionamiento del servicio (email, estado de suscripción).
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">Cómo gestionar las cookies</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Puedes controlar y eliminar cookies a través de la configuración de tu navegador:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
                                    <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad</li>
                                    <li><strong>Safari:</strong> Preferencias → Privacidad</li>
                                    <li><strong>Edge:</strong> Configuración → Privacidad</li>
                                </ul>
                                <p className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
                                    <strong>⚠️ Nota:</strong> Bloquear cookies esenciales puede afectar el funcionamiento del sitio (por ejemplo, no podrás iniciar sesión).
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">Actualizaciones de esta política</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Podemos actualizar esta política de cookies ocasionalmente. Te recomendamos revisarla periódicamente.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">Contacto</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Si tienes preguntas sobre nuestra política de cookies:
                                </p>
                                <p className="font-bold text-indigo-600">
                                    support@wspwrapped.online
                                </p>
                            </div>
                        </section>
                    </div>

                    <div className="text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-pink-600 transition-colors"
                        >
                            ← Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
