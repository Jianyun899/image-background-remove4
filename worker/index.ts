/**
 * Cloudflare Worker - Image Background Remover Proxy
 * Receives image upload, forwards to Remove.bg API, returns transparent PNG
 */

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return corsResponse(null, 204);
    }

    if (request.method === "POST" && url.pathname === "/remove-bg") {
      return handleRemoveBg(request, env);
    }

    return new Response("Not Found", { status: 404 });
  },
};

async function handleRemoveBg(request: Request, env: Env): Promise<Response> {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return corsResponse(JSON.stringify({ error: "Expected multipart/form-data" }), 400, "application/json");
    }

    const formData = await request.formData();
    const imageFile = formData.get("image_file") as File | null;

    if (!imageFile) {
      return corsResponse(JSON.stringify({ error: "Missing image_file field" }), 400, "application/json");
    }

    const bgForm = new FormData();
    bgForm.append("image_file", imageFile);
    bgForm.append("size", "auto");

    const bgRes = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: { "X-Api-Key": env.REMOVE_BG_API_KEY },
      body: bgForm,
    });

    if (!bgRes.ok) {
      const errText = await bgRes.text();
      return corsResponse(
        JSON.stringify({ error: `Remove.bg error: ${errText}` }),
        bgRes.status,
        "application/json"
      );
    }

    const resultBuffer = await bgRes.arrayBuffer();

    return new Response(resultBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return corsResponse(JSON.stringify({ error: message }), 500, "application/json");
  }
}

function corsResponse(body: BodyInit | null, status = 200, contentType = "text/plain"): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": contentType,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

interface Env {
  REMOVE_BG_API_KEY: string;
}
