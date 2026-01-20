import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import Link from "next/link";

export const metadata = {
    title: "Política Legal | WspWrapped",
    description: "Información legal sobre el uso de WspWrapped"
};

export default function LegalPage() {
    return (
        <div className="min-h-screen bg-white">
            <SiteHeader />

            <main className="px-6 py-20">
                <div className="mx-auto max-w-4xl space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-5xl font-black text-indigo-950 tracking-tight">
                            Información Legal
                        </h1>
                        <p className="text-slate-500 font-medium">
                            Última actualización: {new Date().toLocaleDateString('es-ES')}
                        </p>
                    </div>

                    <div className="glass-premium p-8 md:p-12 space-y-8 rounded-[3rem]">
                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">1. Información General</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong>WspWrapped</strong> ("nosotros", "nuestro" o "la Plataforma") es un servicio de análisis de conversaciones de WhatsApp que opera bajo los principios de privacidad y seguridad.
                                </p>
                                <p>
                                    Al utilizar nuestro servicio, aceptas los términos y condiciones establecidos en esta página y en nuestras políticas de <Link href="/privacy" className="text-indigo-600 hover:underline">privacidad</Link> y <Link href="/terms" className="text-indigo-600 hover:underline">términos de servicio</Link>.
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">2. Uso del Servicio</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    <strong>¿Qué hacemos?</strong> Analizamos archivos de exportación de WhatsApp (.txt o .zip) para generar métricas sobre dinámicas de conversación.
                                </p>
                                <p>
                                    <strong>¿Qué NO hacemos?</strong>
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>No guardamos el contenido de tus mensajes</li>
                                    <li>No almacenamos archivos de chat en nuestros servidores</li>
                                    <li>No compartimos información con terceros</li>
                                    <li>No tenemos acceso a tu cuenta de WhatsApp</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">3. Pagos y Suscripciones</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Las suscripciones Pro se gestionan a través de <strong>PayPal</strong>. Al suscribirte:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Se te cobrará $10 USD mensualmente</li>
                                    <li>La suscripción se renueva automáticamente cada mes</li>
                                    <li>Puedes cancelar en cualquier momento desde tu cuenta de PayPal</li>
                                    <li>No ofrecemos reembolsos una vez procesado el pago</li>
                                    <li>El acceso Pro permanece activo hasta el final del período pagado</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">4. Propiedad Intelectual</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Todo el contenido visual, código, y marca de WspWrapped son propiedad exclusiva. No está permitido:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Copiar, modificar o distribuir nuestro código</li>
                                    <li>Usar nuestra marca o logo sin permiso</li>
                                    <li>Crear servicios derivados o competidores usando nuestro sistema</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">5. Limitación de Responsabilidad</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    WspWrapped se proporciona "tal cual". No garantizamos:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Disponibilidad ininterrumpida del servicio</li>
                                    <li>Precisión absoluta de las métricas</li>
                                    <li>Compatibilidad con todos los formatos de exportación</li>
                                </ul>
                                <p>
                                    No nos hacemos responsables por:
                                </p>
                                <ul className="list-disc pl-6 space-y-2">
                                    <li>Decisiones personales tomadas en base a las métricas</li>
                                    <li>Conflictos interpersonales derivados del uso del servicio</li>
                                    <li>Pérdida de datos o archivos durante el procesamiento</li>
                                </ul>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">6. Contacto</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Para consultas legales o soporte, contáctanos en:
                                </p>
                                <p className="font-bold text-indigo-600">
                                    support@wspwrapped.online
                                </p>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-2xl font-black text-indigo-950">7. Modificaciones</h2>
                            <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-600">
                                <p>
                                    Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados a través de la plataforma.
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
