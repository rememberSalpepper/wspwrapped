import { Metrics } from "./whatsapp/types";

export type ShareSection = "summary" | "roast" | "romance" | "linguistics" | "multimedia" | "ghosting";

function escapeXml(value: string): string {
  if (typeof value !== 'string') return String(value);
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function getTheme(section: ShareSection) {
  switch (section) {
    case "roast":
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#431407" /><stop offset="100%" stop-color="#9a3412" /></linearGradient>`,
        title: "THE ROAST 🔥",
        accent: "#fb923c", // Orange-400
        text: "#fff7ed" // Orange-50
      };
    case "romance":
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#831843" /><stop offset="100%" stop-color="#db2777" /></linearGradient>`,
        title: "ROMANCE REPORT 💘",
        accent: "#f472b6", // Pink-400
        text: "#fdf2f8" // Pink-50
      };
    case "linguistics":
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#134e4a" /><stop offset="100%" stop-color="#0d9488" /></linearGradient>`,
        title: "PSICOLOGÍA 🧠",
        accent: "#2dd4bf", // Teal-400
        text: "#f0fdfa" // Teal-50
      };
    case "multimedia":
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#312e81" /><stop offset="100%" stop-color="#4f46e5" /></linearGradient>`,
        title: "MULTIMEDIA 🎨",
        accent: "#818cf8", // Indigo-400
        text: "#eef2ff" // Indigo-50
      };
    case "ghosting":
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0f172a" /><stop offset="100%" stop-color="#334155" /></linearGradient>`,
        title: "ZONA GHOSTING 👻",
        accent: "#94a3b8", // Slate-400
        text: "#f8fafc" // Slate-50
      };
    default:
      return {
        bg: `<linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#1e1b4b" /><stop offset="100%" stop-color="#6d28d9" /></linearGradient>`,
        title: "CHAT WRAPPED ✨",
        accent: "#c084fc", // Purple-400
        text: "#faf5ff" // Purple-50
      };
  }
}

export function renderShareSvg(metrics: Metrics, variant: "free" | "pro", section: ShareSection = "summary"): string {
  const width = 1080;
  const height = 1350; // 4:5 Aspect Ratio (Instagram Portrait)
  const theme = getTheme(section);
  const fontStack = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

  // Helper for truncation
  const truncate = (str: string, n: number) => (str.length > n ? str.slice(0, n - 1) + "..." : str);

  // Helper for dynamic font size
  const getFontSize = (str: string) => {
    if (str.length > 20) return 36;
    if (str.length > 15) return 48;
    if (str.length > 10) return 60;
    return 72;
  };

  // Helper for cards
  const card = (y: number, title: string, value: string, sub: string = "", icon: string = "") => {
    const safeValue = truncate(escapeXml(value), 25);
    const fontSize = getFontSize(safeValue);

    return `
    <g transform="translate(100, ${y})">
      <!-- Card Background -->
      <rect width="880" height="220" rx="40" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
      
      <!-- Title (Top Left) -->
      <text x="50" y="60" font-family="${fontStack}" font-size="24" fill="${theme.accent}" font-weight="800" letter-spacing="2" text-transform="uppercase">${escapeXml(title)}</text>
      
      <!-- Icon (Top Right) -->
      <text x="830" y="60" text-anchor="end" font-size="40" opacity="0.9">${icon}</text>
      
      <!-- Value (Center) -->
      <text x="440" y="140" text-anchor="middle" font-family="${fontStack}" font-size="${fontSize}" fill="#fff" font-weight="900" letter-spacing="-1">${safeValue}</text>
      
      <!-- Subtext (Bottom Center) -->
      <text x="440" y="190" text-anchor="middle" font-family="${fontStack}" font-size="24" fill="rgba(255,255,255,0.7)" font-weight="500">${escapeXml(sub)}</text>
    </g>
  `;
  };

  let content = "";

  if (section === "roast") {
    const audioTerrorist = Object.entries(metrics.audioCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const yoyo = Object.entries(metrics.yoyoCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const toxic = Object.entries(metrics.toxicCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const killer = Object.entries(metrics.killerCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];

    content = `
      ${card(350, "Audio Terrorista", audioTerrorist[0], `${audioTerrorist[1]} audios`, "🎙️")}
      ${card(600, "El Yo-Yo", yoyo[0], `${yoyo[1]} veces "yo"`, "🪞")}
      ${card(850, "Toxic-O-Meter", toxic[0], `${toxic[1]} gritos`, "☢️")}
    `;
  } else if (section === "romance") {
    const love = Object.entries(metrics.loveCountByUser).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const streak = Object.entries(metrics.goodMorningStreak).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const totalLove = metrics.loveCount;

    content = `
      ${card(350, "Intensidad Total", `${totalLove}`, "Palabras de amor", "❤️")}
      ${card(600, "Más Romántico", love[0], `${love[1]} palabras`, "💘")}
      ${card(850, "Racha Buenos Días", streak[0], `${streak[1]} días seguidos`, "☀️")}
    `;
  } else if (section === "ghosting") {
    const ghost = Object.entries(metrics.longestResponseTime).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const ghostTime = Math.round(ghost[1] / 60); // hours
    const ansioso = Object.entries(metrics.fastResponseCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];

    content = `
      ${card(350, "Récord Ghosting", ghost[0], `${ghostTime} horas sin responder`, "👻")}
      ${card(600, "El Ansioso", ansioso[0], `${ansioso[1]} respuestas flash`, "😬")}
      ${card(850, "Tiempo Promedio", `${Math.round(metrics.responseTimes[0]?.avgMinutes || 0)} min`, "Tiempo de respuesta", "⏳")}
    `;
  } else if (section === "multimedia") {
    const king = metrics.participants.reduce((a, b) => {
      const countA = (metrics.imageCount[a] || 0) + (metrics.stickerCount[a] || 0);
      const countB = (metrics.imageCount[b] || 0) + (metrics.stickerCount[b] || 0);
      return countA > countB ? a : b;
    });
    const totalMedia = Object.values(metrics.imageCount).reduce((a, b) => a + b, 0);
    const totalStickers = Object.values(metrics.stickerCount).reduce((a, b) => a + b, 0);

    content = `
      ${card(350, "Rey/Reina Multimedia", king, "El más activo", "👑")}
      ${card(600, "Fotos y Videos", `${totalMedia}`, "Enviados", "📸")}
      ${card(850, "Stickers", `${totalStickers}`, "Enviados", "👾")}
    `;
  } else if (section === "linguistics") {
    const enthusiast = Object.entries(metrics.exclamationCount).sort((a, b) => b[1] - a[1])[0] || ["Nadie", 0];
    const swear = metrics.participants.reduce((a, b) => (metrics.badWords[a]?.total || 0) > (metrics.badWords[b]?.total || 0) ? a : b);
    const swearCount = Object.values(metrics.badWords[swear] || {}).reduce((a, b) => a + b, 0);

    content = `
      ${card(350, "El Entusiasta", enthusiast[0], `${enthusiast[1]} gritos (!)`, "🤩")}
      ${card(600, "Groserómetro", swear, `${swearCount} malas palabras`, "🤬")}
      ${card(850, "Palabra Top 1", metrics.topWords[metrics.participants[0]]?.[0]?.word || "-", "Más usada", "🗣️")}
    `;
  } else {
    // Summary
    const totalMessages = metrics.totalMessages.toLocaleString();
    const duration = metrics.timeline.length > 0
      ? Math.round((new Date(metrics.timeline[metrics.timeline.length - 1].date).getTime() - new Date(metrics.timeline[0].date).getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    content = `
      ${card(350, "Mensajes Totales", totalMessages, "mensajes enviados", "💬")}
      ${card(600, "Historia", `${duration}`, "días de chat", "📅")}
      ${card(850, "Amor Total", `${metrics.loveCount}`, "palabras románticas", "❤️")}
    `;
  }

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${theme.bg}
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="rgba(0,0,0,0.3)" />
        </filter>
      </defs>
      
      <!-- Background -->
      <rect width="100%" height="100%" fill="url(#bg)" />
      
      <!-- Header -->
      <g transform="translate(540, 180)">
        <text text-anchor="middle" font-family="${fontStack}" font-size="80" fill="#fff" font-weight="900" letter-spacing="4" filter="url(#shadow)">${theme.title}</text>
        <rect x="-100" y="30" width="200" height="6" rx="3" fill="${theme.accent}" />
      </g>
      
      <!-- Content -->
      ${content}

      <!-- Footer -->
      <g transform="translate(540, 1250)">
        <text text-anchor="middle" font-family="${fontStack}" font-size="28" fill="rgba(255,255,255,0.6)" font-weight="500">wspwrapped.online ✨</text>
      </g>
    </svg>
  `;
}
