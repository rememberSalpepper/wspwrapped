export type Region = "latam" | "global";

const LATAM_COUNTRIES = new Set([
  "AR",
  "BO",
  "BR",
  "CL",
  "CO",
  "CR",
  "DO",
  "EC",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  "PE",
  "PY",
  "SV",
  "UY",
  "VE"
]);

export function detectRegion(headers: Headers): Region {
  const country = headers.get("x-vercel-ip-country") || headers.get("x-geo-country") || "";
  if (country && LATAM_COUNTRIES.has(country.toUpperCase())) {
    return "latam";
  }

  const language = headers.get("accept-language") || "";
  if (language.toLowerCase().includes("es-") || language.toLowerCase().includes("pt")) {
    return "latam";
  }

  return "global";
}
