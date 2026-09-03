// GET/PUT /api/moonlab — เก็บ state ใน Netlify Blobs (key-value ในตัว ไม่ต้องมี DB ภายนอก)
import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore({ name: "moonlab", consistency: "strong" });

  if (req.method === "GET") {
    const raw = await store.get("state");
    return new Response(raw ?? "null", {
      headers: { "content-type": "application/json", "cache-control": "no-store" }
    });
  }

  if (req.method === "PUT") {
    let body = null;
    try { body = await req.json(); } catch {}
    if (!body || (!body.months && !body.days)) {
      return Response.json({ error: "invalid state" }, { status: 400 });
    }
    await store.set("state", JSON.stringify(body));
    return Response.json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
};

export const config = { path: "/api/moonlab" };
