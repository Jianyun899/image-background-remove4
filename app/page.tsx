import BgRemover from "@/components/BgRemover";
import UserAuth from "@/components/UserAuth";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✂️</span>
            <span className="font-bold text-lg text-gray-900">BG Remover</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Free</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="/pricing" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <UserAuth />
          </div>
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
