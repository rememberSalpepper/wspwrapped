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
    default: "WspWrapped | Analiza tu WhatsApp con IA",
    template: "%s | WspWrapped"
  },
  description: "Descubre la verdad de tus chats. Análisis detallado de dinámicas de pareja, tiempos de respuesta y más. 100% Privado y Seguro.",
  keywords: ["whatsapp wrapped", "analisis whatsapp", "estadisticas chat", "amor", "pareja", "exportar chat whatsapp"],
  authors: [{ name: "WspWrapped" }],
  creator: "WspWrapped",
  metadataBase: new URL("https://wspwrapped.online"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://wspwrapped.online",
    title: "WspWrapped | Tu Año en WhatsApp",
    description: "¿Quién manda más mensajes? ¿Quién es más cursi? Descúbrelo ahora.",
    siteName: "WspWrapped",
    images: [
      {
        url: "/og-image.png", // We need to ensure this exists or use a placeholder
        width: 1200,
        height: 630,
        alt: "WspWrapped Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WspWrapped | Analiza tu WhatsApp",
    description: "Descubre las dinámicas ocultas de tus chats. Rápido, privado y divertido.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

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
