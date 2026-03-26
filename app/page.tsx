export const runtime = "edge";

import BgRemover from "@/components/BgRemover";
import { SignInButton, SignOutButton } from "@/components/AuthButtons";

async function getSession(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const sessionMatch = cookie.match(/session=([^;]+)/);
  if (!sessionMatch) return null;

  try {
    const res = await fetch("https://imagebackgroundremoverave.shop/api/auth?action=session", {
      headers: { Cookie: `session=${sessionMatch[1]}` },
    });
    return await res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const session = await getSession(new Request("https://imagebackgroundremoverave.shop"));

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
