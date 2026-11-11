import { NextResponse } from "next/server";
import { passwordOk, makeToken } from "@/lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!passwordOk(password)) return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sf_admin", makeToken(), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 14 * 86400 });
  return res;
}
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("sf_admin", "", { path: "/", maxAge: 0 });
  return res;
}
