import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#fcfaff] font-sans selection:bg-indigo-100 selection:text-indigo-900">
            <SiteHeader />

            <main className="px-6 pt-32 pb-20">
                <div className="mx-auto max-w-4xl">
                    <div className="glass-premium p-8 md:p-12 rounded-[3rem] animate-reveal space-y-8">
                        <div className="text-center space-y-4 mb-12">
                            <div className="badge-premium bg-pink-50 text-pink-600 mb-2">Privacidad</div>
                            <h1 className="text-4xl md:text-5xl font-black text-indigo-950 tracking-tight">
                                Política de Privacidad
                            </h1>
                            <p className="text-slate-500 font-medium">
                                Tu confianza es lo más importante para nosotros.
                            </p>
                        </div>

                        <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:text-indigo-950 prose-p:text-slate-600 prose-a:text-indigo-600 hover:prose-a:text-indigo-500">
                            <h3>1. Introducción</h3>
                            <p>
                                Esta Política de Privacidad describe Nuestras políticas y procedimientos sobre la recopilación, uso y divulgación de Su información cuando utiliza el Servicio y le informa sobre Sus derechos de privacidad y cómo la ley lo protege.
                            </p>

                            <h3>2. Datos que Recopilamos</h3>
                            <p>
                                <strong>Datos de Uso:</strong> Información recopilada automáticamente al usar el servicio (dirección IP, tipo de navegador, páginas visitadas).
                                <br />
                                <strong>Datos de Chat (Transitorios):</strong> Al subir un archivo de chat, este se procesa para extraer métricas. <strong>El contenido del chat NO se almacena en nuestros servidores de forma permanente.</strong> Solo guardamos el reporte numérico resultante (estadísticas) asociado a un ID único.
                                <br />
                                <strong>Datos de Pago:</strong> Si realizas una compra, nuestro procesador de pagos (MercadoPago) recopila la información necesaria para procesar la transacción. Nosotros no almacenamos ni tenemos acceso a los detalles completos de tu tarjeta de crédito.
                            </p>

                            <h3>3. Uso de la Información</h3>
                            <p>
                                Utilizamos sus datos personales para proporcionar y mantener el Servicio, gestionar su cuenta, contactarlo con noticias u ofertas (si optó por ello) y gestionar sus solicitudes.
                            </p>

                            <h3>4. Seguridad de los Datos</h3>
                            <p>
                                La seguridad de sus datos es importante para nosotros, pero recuerde que ningún método de transmisión por Internet o método de almacenamiento electrónico es 100% seguro. Nos esforzamos por utilizar medios comercialmente aceptables para proteger sus Datos Personales, pero no podemos garantizar su seguridad absoluta.
                            </p>

                            <h3>5. Retención de Datos</h3>
                            <p>
                                Los reportes generados se almacenan temporalmente para que puedas acceder a ellos. Puedes solicitar la eliminación de tu reporte en cualquier momento. Los archivos de chat originales se descartan inmediatamente después del procesamiento.
                            </p>

                            <h3>6. Cookies</h3>
                            <p>
                                Utilizamos Cookies y tecnologías de seguimiento similares para rastrear la actividad en Nuestro Servicio y almacenar cierta información. Puede configurar su navegador para rechazar todas las Cookies.
                            </p>

                            <h3>7. Enlaces a Otros Sitios</h3>
                            <p>
                                Nuestro Servicio puede contener enlaces a otros sitios web que no son operados por Nosotros. Si hace clic en un enlace de un tercero, será dirigido al sitio de ese tercero. Le recomendamos encarecidamente que revise la Política de Privacidad de cada sitio que visite.
                            </p>

                            <h3>8. Cambios a esta Política</h3>
                            <p>
                                Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos cualquier cambio publicando la nueva Política de Privacidad en esta página.
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
