export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const AUTH_SECRET = process.env.AUTH_SECRET || "";

function getBaseUrl(req: NextRequest): string {
  return `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

// Simple HMAC-based session token
async function signToken(payload: object): Promise<string> {
  const data = JSON.stringify(payload);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(AUTH_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(sig)));
  return btoa(data) + "." + sigB64;
}

async function verifyToken(token: string): Promise<object | null> {
  try {
    const [dataB64, sigB64] = token.split(".");
    const data = atob(dataB64);
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(AUTH_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sig = Uint8Array.from(atob(sigB64), (c) => c.charCodeAt(0));
    const valid = await crypto.subtle.verify("HMAC", key, sig, new TextEncoder().encode(data));
    if (!valid) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const BASE_URL = getBaseUrl(req);

  // /api/auth?action=signin → redirect to Google
  if (action === "signin") {
    const state = crypto.randomUUID();
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${BASE_URL}/api/auth`,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    const res = NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
    res.cookies.set("oauth_state", state, { httpOnly: true, secure: true, maxAge: 600, path: "/" });
    return res;
  }

  // /api/auth?action=signout → clear cookie
  if (action === "signout") {
    const res = NextResponse.redirect(BASE_URL);
    res.cookies.delete("session");
    return res;
  }

  // /api/auth?code=...&state=... → Google callback
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (code) {
    const savedState = req.cookies.get("oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return new NextResponse("Invalid state", { status: 400 });
    }

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: `${BASE_URL}/api/auth`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json() as { access_token?: string };
    if (!tokenData.access_token) {
      return new NextResponse("Token exchange failed", { status: 500 });
    }

    // Get user info
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const user = await userRes.json() as { name?: string; email?: string; picture?: string };

    // Create signed session token
    const session = await signToken({ name: user.name, email: user.email, picture: user.picture });
    const res = NextResponse.redirect(BASE_URL);
    res.cookies.set("session", session, { httpOnly: true, secure: true, maxAge: 60 * 60 * 24 * 7, path: "/" });
    res.cookies.delete("oauth_state");
    return res;
  }

  // /api/auth?action=session → return session JSON
  if (action === "session") {
    const token = req.cookies.get("session")?.value;
    if (!token) return NextResponse.json(null);
    const payload = await verifyToken(token);
    return NextResponse.json(payload);
  }

  return new NextResponse("Not found", { status: 404 });
}
