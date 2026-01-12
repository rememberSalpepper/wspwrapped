import { NextResponse } from "next/server";

export const runtime = "edge"; // Use edge runtime for speed

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/";

    // Since we are using client-side auth (createClient in AuthContext) without @supabase/ssr cookies,
    // the server-side exchangeCodeForSession won't persist the session to the browser automatically.
    //
    // However, Supabase's email links usually include a hash fragment (#access_token=...) if configured for implicit flow,
    // OR a code if configured for PKCE.
    //
    // If we get a code, we can't easily exchange it here and set a cookie without @supabase/ssr.
    // BUT, the client-side library handles the code exchange automatically if we redirect the user 
    // to a page where the Supabase client is active.
    //
    // So, we just redirect to the destination. The URL parameters (code) will be passed along,
    // and the client-side `supabase.auth.onAuthStateChange` should pick it up.

    // We construct the redirect URL preserving the query parameters so the client can handle them.
    const redirectUrl = new URL(next, origin);
    if (code) {
        redirectUrl.searchParams.set("code", code);
    }

    return NextResponse.redirect(redirectUrl);
}
