import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    // Cloudflare Pages Edge Runtime: env vars are available via process.env at runtime
    // but also accessible via globalThis for Workers compatibility
    const apiKey =
      process.env.REMOVE_BG_API_KEY ||
      (globalThis as unknown as Record<string, string>).REMOVE_BG_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "REMOVE_BG_API_KEY not configured" }, { status: 500 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image_file") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "Missing image_file field" }, { status: 400 });
    }

    const bgForm = new FormData();
    bgForm.append("image_file", imageFile);
    bgForm.append("size", "auto");

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": apiKey },
      body: bgForm,
    });

    if (!bgRes.ok) {
      const errText = await bgRes.text();
      return NextResponse.json(
        { error: `Remove.bg error: ${errText}` },
        { status: bgRes.status }
      );
    }

    const buffer = await bgRes.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
