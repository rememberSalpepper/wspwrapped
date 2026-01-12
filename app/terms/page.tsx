import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#fcfaff] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <SiteHeader />

            <main className="px-6 pt-32 pb-20">
                <div className="mx-auto max-w-4xl">
                    <div className="glass-premium p-8 md:p-12 rounded-[3rem] animate-reveal space-y-8">
                        <div className="text-center space-y-4 mb-12">
                            <div className="badge-premium bg-indigo-50 text-indigo-600 mb-2">Legal</div>
                            <h1 className="text-4xl md:text-5xl font-black text-indigo-950 tracking-tight">
                                Términos y Condiciones
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Última actualización: {new Date().toLocaleDateString()}
                            </p>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-indigo-950 prose-p:text-slate-600 prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                            <h3>1. Aceptación de los Términos</h3>
                            <p>
                                Al acceder y utilizar WspWrapped ("el Servicio"), aceptas estar sujeto a estos Términos y Condiciones. Si no estás de acuerdo con alguna parte de estos términos, no podrás acceder al Servicio.
                            </p>

                            <h3>2. Descripción del Servicio</h3>
                            <p>
                                WspWrapped es una herramienta de análisis de datos que permite a los usuarios visualizar estadísticas de sus chats de WhatsApp. El servicio procesa los archivos exportados localmente en el dispositivo del usuario o mediante un procesamiento seguro en memoria, sin almacenar el contenido de los mensajes de forma permanente.
                            </p>

                            <h3>3. Privacidad y Datos</h3>
                            <p>
                                Tu privacidad es nuestra prioridad. <strong>No leemos ni almacenamos el contenido de tus mensajes.</strong> El archivo de chat se procesa para extraer métricas numéricas (conteo de mensajes, emojis, tiempos, etc.) y luego se descarta. Los reportes generados contienen solo estas métricas agregadas y son accesibles únicamente a través de un enlace único generado para ti.
                            </p>

                            <h3>4. Uso Aceptable</h3>
                            <p>
                                Te comprometes a utilizar el Servicio solo para fines legales y de acuerdo con estos Términos. No debes usar el servicio para analizar chats de terceros sin su consentimiento explícito.
                            </p>

                            <h3>5. Suscripciones y Pagos</h3>
                            <p>
                                Algunas funciones del Servicio pueden requerir un pago único o suscripción ("Servicio Premium"). Los pagos se procesan a través de proveedores seguros (como MercadoPago). Al adquirir el Servicio Premium, aceptas pagar las tarifas indicadas. No se ofrecen reembolsos una vez que el servicio digital ha sido entregado (el análisis ha sido desbloqueado).
                            </p>

                            <h3>6. Propiedad Intelectual</h3>
                            <p>
                                El Servicio y su contenido original (excluyendo el contenido proporcionado por los usuarios), características y funcionalidad son y seguirán siendo propiedad exclusiva de WspWrapped y sus licenciantes.
                            </p>

                            <h3>7. Limitación de Responsabilidad</h3>
                            <p>
                                En ningún caso WspWrapped, ni sus directores, empleados, socios, agentes, proveedores o afiliados, serán responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, pérdida de beneficios, datos, uso, buena voluntad, u otras pérdidas intangibles, resultantes de tu acceso o uso o la imposibilidad de acceder o usar el Servicio.
                            </p>

                            <h3>8. Cambios</h3>
                            <p>
                                Nos reservamos el derecho, a nuestra sola discreción, de modificar o reemplazar estos Términos en cualquier momento. Si una revisión es material, intentaremos proporcionar un aviso con al menos 30 días de antelación antes de que entren en vigor los nuevos términos.
                            </p>

                            <h3>9. Contacto</h3>
                            <p>
                                Si tienes alguna pregunta sobre estos Términos, por favor contáctanos.
                            </p>
                        </div>

                        <div className="pt-8 border-t border-slate-100 flex justify-center">
                            <Link
                                href="/"
                                className="btn-spicy px-8 py-3 text-sm"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}
