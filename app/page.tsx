export const runtime = "edge";

import BgRemover from "@/components/BgRemover";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";
import { cookies } from "next/headers";

async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    if (!sessionCookie) return null;

    const AUTH_SECRET = process.env.AUTH_SECRET || "";
    const [dataB64, sigB64] = sessionCookie.split(".");
    if (!dataB64 || !sigB64) return null;

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

export default async function Home() {
  const session = await getSession();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-2">
        <span className="text-2xl">✂️</span>
        <span className="font-bold text-lg text-gray-900">BG Remover</span>
        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Free</span>
        <div className="ml-auto">
          {session?.name ? (
            <SignOutButton name={session.name} />
          ) : (
            <SignInButton />
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12 gap-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
            Remove Image Background
          </h1>
          <p className="text-gray-500 text-lg">
            Free, fast, no signup required. Powered by AI.
          </p>
        </div>

        <BgRemover />
      </div>

      <footer className="text-center text-gray-400 text-sm py-6">
        No images are stored. All processing happens in memory.
      </footer>
    </main>
  );
}
