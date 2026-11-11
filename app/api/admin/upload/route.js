import { NextResponse } from "next/server";
import { Binary } from "mongodb";
import { isAdmin } from "@/lib/auth";
import { getDb, dbReady } from "@/lib/db";

const types = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req) {
  if (!isAdmin()) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  if (!dbReady) return NextResponse.json({ error: "Database is not connected." }, { status: 503 });
  try {
    const file = (await req.formData()).get("file");
    if (!file || typeof file === "string" || !types.includes(file.type)) return NextResponse.json({ error: "Upload a JPG, PNG or WebP photo." }, { status: 400 });
    if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Photo is too large (max 4 MB)." }, { status: 413 });
    const id = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    await (await getDb()).collection("images").insertOne({ _id: id, type: file.type, data: new Binary(Buffer.from(await file.arrayBuffer())), createdAt: new Date() });
    return NextResponse.json({ url: `/api/images/${id}` });
  } catch (e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
