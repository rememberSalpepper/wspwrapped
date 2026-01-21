import "./globals.css";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/lib/auth/AuthContext";

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: {
    default: "WspWrapped - Analiza tus Chats de WhatsApp | Estadísticas y Métricas",
    template: "%s | WspWrapped"
  },
  description: "Descubre las dinámicas ocultas de tus conversaciones de WhatsApp. Análisis completo de tiempos de respuesta, emojis, patrones y estadísticas. 100% privado, sin guardar mensajes. Exporta y comparte resultados en HD.",
  keywords: [
    // Primary keywords
    "whatsapp wrapped",
    "analisis whatsapp",
    "estadisticas whatsapp",
    "analizar chat whatsapp",

    // Long-tail keywords
    "como analizar conversaciones whatsapp",
    "estadisticas chat pareja",
    "tiempos de respuesta whatsapp",
    "wrapped whatsapp 2024",
    "whatsapp analytics",

    // Spanish variations
    "análisis de chat",
    "métricas whatsapp",
    "exportar chat whatsapp",
    "dinámicas de pareja",

    // Related
    "spotify wrapped whatsapp",
    "analizar mensajes",
    "estadísticas conversación",
    "privacidad whatsapp",
  ],
  authors: [{ name: "WspWrapped", url: "https://wspwrapped.online" }],
  creator: "WspWrapped",
  publisher: "WspWrapped",
  category: "Social Media Analytics",
  metadataBase: new URL("https://wspwrapped.online"),
  alternates: {
    canonical: "https://wspwrapped.online",
    languages: {
      'es': 'https://wspwrapped.online',
      'pt': 'https://wspwrapped.online?lang=pt',
      'en': 'https://wspwrapped.online?lang=en',
      'x-default': 'https://wspwrapped.online',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["pt_BR", "en_US"],
    url: "https://wspwrapped.online",
    title: "WspWrapped - Tu Año en WhatsApp | Análisis Completo de Conversaciones",
    description: "¿Quién manda más mensajes? ¿Quién es más cursi? ¿Cuánto tardan en responder? Descubre las métricas ocultas de tus chats de WhatsApp. 100% privado y seguro.",
    siteName: "WspWrapped",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WspWrapped - Analiza tus chats de WhatsApp",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@wspwrapped",
    creator: "@wspwrapped",
    title: "WspWrapped - Analiza tus Chats de WhatsApp",
    description: "Descubre las dinámicas ocultas de tus conversaciones. Tiempos de respuesta, emojis, estadísticas y más. Rápido, privado y divertido.",
    images: ["/og-image.png"],
  },
  other: {
    'application-name': 'WspWrapped',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'WspWrapped',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'theme-color': '#4F46E5',
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    // google: "your-google-verification-code", // Add when you verify with Google Search Console
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen bg-[#fcfaff] text-[#1e1b4b]">
        <AuthProvider>
          <div className="min-h-screen">{children}</div>
        </AuthProvider>
      </body>
    </html>
  );
}
