import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDb, dbReady } from "@/lib/db";

const str = (v, n = 500) => String(v ?? "").trim().slice(0, n);
const int = (v) => Math.max(0, Math.round(Number(v) || 0));
const okUrl = (u) => typeof u === "string" && (u.startsWith("/api/images/") || u.startsWith("http"));
function clean(b) {
  const r = {};
  if ("name" in b) r.name = str(b.name, 120);
  if ("category" in b) r.category = str(b.category, 40) || "Other";
  if ("price" in b) r.price = int(b.price);
  if ("stock" in b) r.stock = int(b.stock);
  if ("description" in b) r.description = str(b.description, 2000);
  for (const k of ["dimensions", "material", "colours", "warranty"]) if (k in b) r[k] = str(b[k], 200);
  if ("images" in b) r.images = (Array.isArray(b.images) ? b.images : []).filter(okUrl).slice(0, 12);
  if ("active" in b) r.active = !!b.active;
  return r;
}
const plain = ({ _id, createdAt, ...r }) => ({ id: _id, ...r });
const imageIds = (urls = []) => urls.filter((u) => u.startsWith("/api/images/")).map((u) => u.split("/").pop());
const guard = () => !isAdmin() ? NextResponse.json({ error: "Please sign in again." }, { status: 401 })
  : !dbReady ? NextResponse.json({ error: "Database is not connected." }, { status: 503 }) : null;
const fail = (e) => NextResponse.json({ error: e.code === 11000 ? "A product with this ID already exists." : e.message }, { status: 500 });

export async function POST(req) {
  const g = guard(); if (g) return g;
  try {
    const b = await req.json().catch(() => ({}));
    const row = clean(b);
    if (!row.name) return NextResponse.json({ error: "Enter the product name." }, { status: 400 });
    const cat = (row.category || "ITM").replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "ITM";
    const id = str(b.id, 40) || `SF-${cat}-${String(Date.now()).slice(-5)}`;
    const doc = { category: "Other", price: 0, stock: 0, description: "", dimensions: "", material: "", colours: "", warranty: "", images: [], active: true, ...row, _id: id, createdAt: new Date() };
    await (await getDb()).collection("products").insertOne(doc);
    return NextResponse.json({ product: plain(doc) });
  } catch (e) { return fail(e); }
}
export async function PUT(req) {
  const g = guard(); if (g) return g;
  try {
    const b = await req.json().catch(() => ({}));
    if (!b.id) return NextResponse.json({ error: "Missing product id." }, { status: 400 });
    const db = await getDb(), col = db.collection("products");
    const before = await col.findOne({ _id: b.id });
    if (!before) return NextResponse.json({ error: "Product not found." }, { status: 404 });
    const set = clean(b);
    const after = Object.keys(set).length ? await col.findOneAndUpdate({ _id: b.id }, { $set: set }, { returnDocument: "after" }) : before;
    if (set.images) { // remove photos the owner took out
      const gone = imageIds(before.images).filter((i) => !imageIds(set.images).includes(i));
      if (gone.length) await db.collection("images").deleteMany({ _id: { $in: gone } });
    }
    return NextResponse.json({ product: plain(after) });
  } catch (e) { return fail(e); }
}
export async function DELETE(req) {
  const g = guard(); if (g) return g;
  try {
    const id = new URL(req.url).searchParams.get("id");
    const db = await getDb();
    const doc = await db.collection("products").findOneAndDelete({ _id: id });
    if (doc?.images?.length) await db.collection("images").deleteMany({ _id: { $in: imageIds(doc.images) } });
    return NextResponse.json({ ok: true });
  } catch (e) { return fail(e); }
}
