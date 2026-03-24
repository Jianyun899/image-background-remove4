"use client";

import { useCallback, useRef, useState } from "react";

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || "/api/remove-bg";

type State = "idle" | "uploading" | "processing" | "done" | "error";

export default function BgRemover() {
  const [state, setState] = useState<State>("idle");
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setErrorMsg("Unsupported format. Please use JPG, PNG, or WEBP.");
      setState("error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("File too large. Max size is 5MB.");
      setState("error");
      return;
    }

    setOriginalUrl(URL.createObjectURL(file));
    setResultUrl(null);
    setResultBlob(null);
    setState("uploading");

    try {
      setState("processing");
      const form = new FormData();
      form.append("image_file", file);

      const res = await fetch(WORKER_URL, { method: "POST", body: form });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const blob = await res.blob();
      setResultBlob(blob);
      setResultUrl(URL.createObjectURL(blob));
      setState("done");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const reset = () => {
    setState("idle");
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setErrorMsg("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const download = () => {
    if (!resultBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(resultBlob);
    a.download = "removed-bg.png";
    a.click();
  };

  const isLoading = state === "uploading" || state === "processing";

  return (
    <div className="w-full max-w-3xl flex flex-col items-center gap-8">
      {/* Upload zone */}
      {state === "idle" || state === "error" ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-14 text-center cursor-pointer transition-all
            ${isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/50"
            }`}
        >
          <div className="text-5xl mb-4">🖼️</div>
          <p className="font-semibold text-gray-700 text-lg mb-1">
            Drag &amp; drop your image here
          </p>
          <p className="text-gray-400 text-sm mb-5">
            Supports JPG, PNG, WEBP · Max 5MB
          </p>
          <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            Choose File
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={onFileChange}
          />
        </div>
      ) : null}

      {/* Error */}
      {state === "error" && (
        <p className="text-red-500 text-sm -mt-4">{errorMsg}</p>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex flex-col items-center gap-4 py-8">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">
            {state === "uploading" ? "Uploading..." : "Removing background..."}
          </p>
        </div>
      )}

      {/* Result */}
      {state === "done" && originalUrl && resultUrl && (
        <div className="w-full flex flex-col items-center gap-6">
          {/* Compare */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-4 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Original
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Original"
                className="w-full object-contain max-h-72 bg-gray-50"
              />
            </div>
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="px-4 py-2.5 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Background Removed
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resultUrl}
                alt="Result"
                className="w-full object-contain max-h-72"
                style={{
                  background:
                    "repeating-conic-gradient(#e5e7eb 0% 25%, #fff 0% 50%) 0 0 / 20px 20px",
                }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={download}
              className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl text-base transition-colors"
            >
              ⬇ Download PNG
            </button>
            <button
              onClick={reset}
              className="border border-gray-300 hover:border-blue-400 hover:text-blue-600 text-gray-500 px-6 py-3 rounded-xl text-sm transition-colors"
            >
              Process another image
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
