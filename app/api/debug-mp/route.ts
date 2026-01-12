import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
    const token = process.env.MERCADOPAGO_ACCESS_TOKEN || "";
    const prefix = token.substring(0, 10);
    return NextResponse.json({
        status: "ok",
        token_prefix: prefix,
        is_test: token.startsWith("TEST-"),
        is_prod: token.startsWith("APP_USR-"),
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
}
