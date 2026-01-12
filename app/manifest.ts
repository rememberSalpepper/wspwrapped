import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "WSP Analyser",
    short_name: "WSP Analyser",
    description: "Insights de WhatsApp sin guardar tu chat.",
    start_url: "/",
    display: "standalone",
    background_color: "#fefbf6",
    theme_color: "#ff6b4a",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
