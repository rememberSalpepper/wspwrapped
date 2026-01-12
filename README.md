# WSP Analyser

Mobile-first SaaS para analizar exportes de WhatsApp (TXT/ZIP). Procesa en memoria, muestra 2 metricas teaser gratis y bloquea el resto tras paywall.

## Stack
- Next.js (App Router) + Tailwind
- Supabase Auth (magic link + social opcional)
- Webhooks Mercado Pago / PayPal

## Quick start
```bash
npm install
npm run dev
```

Copia `.env.example` a `.env.local` y completa los valores.

## Endpoints principales
- `POST /api/upload` -> procesa TXT/ZIP, devuelve `teaser` y `metrics` + `reportId` (en memoria).
- `GET /api/metrics?reportId=...` -> devuelve metricas si el reporte no expiro.
- `POST /api/share` -> devuelve `shareUrl` con token firmado (sin almacenamiento).
- `GET /api/generate-image` -> SVG al vuelo (free con watermark).
- `GET /api/generate-pdf` -> PDF al vuelo.
- `POST /api/webhooks/mercadopago` -> activa/cancela suscripciones.
- `POST /api/webhooks/paypal` -> activa/cancela suscripciones.

## Privacidad
- No se guarda texto crudo ni archivos.
- El parseo corre en worker en memoria (setImmediate) y los agregados viven solo 15 min.
- Alias automaticos para participantes por defecto.
- PDFs/imagenes se generan al vuelo y no se persisten.
- Share links usan payload firmado con agregados (sin texto crudo). Para recalculo real, pedir re-upload o cifrar el export en el link.

## Supabase (minimo)
Tablas sugeridas:
- `users` (id, plan, created_at)
- `user_subscriptions` (user_id, provider, status, plan, updated_at)
- `reports` (id, user_id, created_at, flags)

## Pagos
- LatAm: Mercado Pago preapproval.
- Global: PayPal Subscriptions.
- Deteccion region: `Accept-Language` y `x-vercel-ip-country` (selector manual en UI).

## Deploy
1. Crear proyecto en Vercel o Node server.
2. Configurar variables de entorno (.env).
3. Configurar webhooks:
   - Mercado Pago: apunta a `/api/webhooks/mercadopago`.
   - PayPal: apunta a `/api/webhooks/paypal`.
4. Configurar Supabase Auth (magic link + OAuth opcional).

## QA checklist
- Upload TXT/ZIP valido e invalido.
- Verifica que no se escriba a disco (logs y storage vacios).
- Teaser muestra solo 2 metricas; resto bloqueado.
- Paywall: Mercado Pago/PayPal en region correcta y selector manual.
- Webhooks activan/cancelan plan en Supabase.
- Imagen/PDF se generan al vuelo y tienen watermark en free.
- Share link expira a 24h.
- Borrado de metadata a demanda.
