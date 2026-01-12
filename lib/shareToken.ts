import { createHmac } from "crypto";
import { Metrics } from "./whatsapp/types";

export interface SharePayload {
    metrics: Metrics;
    variant: "free" | "pro";
    exp: number;
}

export function signShareToken(payload: SharePayload, secret: string): string {
    const data = JSON.stringify(payload);
    const signature = createHmac("sha256", secret).update(data).digest("hex");
    return `${Buffer.from(data).toString("base64")}.${signature}`;
}

export function verifyShareToken(token: string, secret: string): SharePayload | null {
    try {
        const [b64Data, signature] = token.split(".");
        if (!b64Data || !signature) return null;

        const data = Buffer.from(b64Data, "base64").toString();
        const expectedSignature = createHmac("sha256", secret).update(data).digest("hex");

        if (signature !== expectedSignature) return null;

        const payload = JSON.parse(data) as SharePayload;
        if (payload.exp < Date.now()) return null;

        return payload;
    } catch {
        return null;
    }
}
