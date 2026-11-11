import { getDb, dbReady } from "@/lib/db";

export const dynamic = "force-dynamic";

// Public: serves a product photo stored in MongoDB. Photo ids never change, so browsers can cache them for a year.
export async function GET(_req, { params }) {
  if (!dbReady) return new Response("Not found", { status: 404 });
  try {
    const doc = await (await getDb()).collection("images").findOne({ _id: params.id });
    if (!doc) return new Response("Not found", { status: 404 });
    return new Response(doc.data.buffer.subarray(0, doc.data.length()), { headers: { "Content-Type": doc.type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch { return new Response("Error", { status: 500 }); }
}
