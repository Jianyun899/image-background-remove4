import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// API Key is injected at build time via environment variable
const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY || "";

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 400 });
    }

    if (!REMOVE_BG_API_KEY) {
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
      headers: { "X-Api-Key": REMOVE_BG_API_KEY },
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
