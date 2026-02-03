# WSP Wrapped (WSP Analyser)

SaaS *mobile-first* para analizar exportaciones de WhatsApp (TXT/ZIP) y generar métricas, imágenes y PDFs **sin guardar el contenido crudo**. Procesa en memoria, entrega un teaser gratis (2 métricas) y el resto queda tras paywall por suscripción.

🌐 Demo: https://wspwrapped.vercel.app

---

## ✨ Qué hace

- Importa exportes de WhatsApp en **TXT o ZIP**
- Procesa el chat **en memoria** (sin persistir texto/archivos)
- Muestra **2 métricas gratis** (teaser)
- Bloquea métricas avanzadas tras **suscripción**
- Genera **imagen (SVG)** y **PDF** “al vuelo”
- Comparte resultados con **share link firmado** y con expiración

---

## 🔐 Privacidad (core del proyecto)

- **No se guarda** texto crudo ni archivos
- El parseo corre en un worker en memoria y los agregados viven **15 min**
- Alias automáticos para participantes por defecto
- PDFs/imagenes se generan “on the fly” y **no se persisten**
- Links de share usan payload firmado con agregados (sin texto crudo) y **expiran 24h**

> Si se requiere “recalcular” resultados reales, se solicita re-upload o se cifra el export en el link.

---

## 🧱 Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS**
- **Supabase Auth** (magic link + OAuth opcional)
- **MPayPal** (webhooks para activar/cancelar suscripción)
- Deploy: **Vercel**

---

## 🚀 Quick start

### Requisitos
- Node.js 18+ (recomendado)
- Cuenta en Supabase (Auth)
- Credenciales de Mercado Pago y/o PayPal (si usarás el paywall)

### Instalar
```bash
npm install
npm run dev
