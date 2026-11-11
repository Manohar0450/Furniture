"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  async function go(e) {
    e.preventDefault(); setErr("");
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) });
    r.ok ? router.refresh() : setErr("Wrong password. Try again.");
  }
  return (
    <div className="wrap" style={{ maxWidth: 420 }}>
      <h1>Owner login</h1>
      <form onSubmit={go}>
        <label className="field">Password<input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn">Sign in</button>
      </form>
    </div>
  );
}
