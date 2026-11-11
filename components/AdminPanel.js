"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { inr } from "@/lib/utils";

async function api(url, method, body) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Something went wrong.");
  return j;
}
// Shrink photos before upload so they stay small and fast (max 1400px, JPEG).
async function compress(file) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 1400 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob(res, "image/jpeg", 0.82));
}
const blank = { name: "", category: "", price: "", stock: 1, description: "", dimensions: "", material: "", colours: "", warranty: "", images: [], active: true };

export default function AdminPanel({ initial }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState(null); // null | "new" | product
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const cats = [...new Set(items.map((p) => p.category))];

  async function quick(p, change) {
    try {
      const { product } = await api("/api/admin/products", "PUT", { id: p.id, ...change });
      setItems((l) => l.map((x) => (x.id === p.id ? product : x)));
      setMsg(`Saved ${p.name}.`);
    } catch (e) { setMsg(e.message); }
  }
  async function del(p) {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await api(`/api/admin/products?id=${encodeURIComponent(p.id)}`, "DELETE"); setItems((l) => l.filter((x) => x.id !== p.id)); setMsg("Deleted."); }
    catch (e) { setMsg(e.message); }
  }
  async function logout() { await api("/api/admin/login", "DELETE"); router.refresh(); }

  if (editing) return <Editor product={editing === "new" ? null : editing} cats={cats} onCancel={() => setEditing(null)}
    onSaved={(row, isNew) => { setItems((l) => (isNew ? [row, ...l] : l.map((p) => (p.id === row.id ? row : p)))); setEditing(null); setMsg("Saved."); }} />;

  const shown = items.filter((p) => !q || `${p.name} ${p.id} ${p.category}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="wrap admin">
      <div className="admin-bar"><h1 style={{ marginRight: "auto" }}>Owner dashboard</h1>
        <a className="btn ghost" href="/">View shop</a><button className="btn ghost" onClick={logout}>Sign out</button></div>
      <div className="admin-bar">
        <input type="search" placeholder="Search your products" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn" onClick={() => setEditing("new")}>Add product</button>
      </div>
      {msg && <p className="muted" role="status">{msg}</p>}
      {shown.length === 0 && <p className="muted">{items.length ? "No products match." : "No products yet. Select Add product to create your first one."}</p>}
      {shown.map((p) => (
        <div className="arow" key={p.id}>
          <div className="thumb">{p.images?.[0] ? <img src={p.images[0]} alt="" /> : "🪑"}</div>
          <div><strong>{p.name}</strong> {!p.active && <span className="stock out">Hidden</span>}<div className="muted">{p.id} · {p.category} · {inr(p.price)}</div></div>
          <div className="fields">
            <label>Price (₹)<input type="number" min="0" key={p.price} defaultValue={p.price} onBlur={(e) => Number(e.target.value) !== p.price && quick(p, { price: e.target.value })} /></label>
            <label>Pieces in stock
              <span className="step">
                <button className="btn ghost" onClick={() => quick(p, { stock: Math.max(0, p.stock - 1) })} aria-label="One less">−</button>
                <input type="number" min="0" key={p.stock} defaultValue={p.stock} onBlur={(e) => Number(e.target.value) !== p.stock && quick(p, { stock: e.target.value })} />
                <button className="btn ghost" onClick={() => quick(p, { stock: p.stock + 1 })} aria-label="One more">+</button>
              </span></label>
            <button className="btn ghost" onClick={() => setEditing(p)}>Edit</button>
            <button className="btn ghost" onClick={() => quick(p, { active: !p.active })}>{p.active ? "Hide" : "Show"}</button>
            <button className="btn ghost" onClick={() => del(p)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function Editor({ product, cats, onCancel, onSaved }) {
  const [f, setF] = useState(product ? { ...product } : blank);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(null);
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));

  async function addFiles(e) {
    const files = [...e.target.files]; e.target.value = "";
    if (!files.length) return;
    setBusy(true); setErr("");
    try {
      const urls = [];
      for (const file of files) {
        const fd = new FormData(); fd.append("file", await compress(file), "photo.jpg");
        const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || "Upload failed.");
        urls.push(j.url);
      }
      setF((x) => ({ ...x, images: [...x.images, ...urls].slice(0, 12) }));
    } catch (e) { setErr(e.message); }
    setBusy(false);
  }
  const reorder = (from, to) => setF((x) => {
    if (to < 0 || to >= x.images.length || from === to) return x;
    const a = [...x.images]; const [m] = a.splice(from, 1); a.splice(to, 0, m);
    return { ...x, images: a };
  });
  const removeImg = (i) => setF((x) => ({ ...x, images: x.images.filter((_, k) => k !== i) }));

  async function save(e) {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Enter the product name.");
    if (!String(f.category).trim()) return setErr("Enter a category, for example Sofas.");
    setBusy(true); setErr("");
    try {
      const body = { ...f, price: Number(f.price) || 0, stock: Number(f.stock) || 0 };
      const { product: row } = await api("/api/admin/products", product ? "PUT" : "POST", body);
      onSaved(row, !product);
    } catch (e) { setErr(e.message); setBusy(false); }
  }
  const field = (k, label, props = {}) => <label className="field">{label}<input value={f[k] ?? ""} onChange={(e) => set(k, e.target.value)} {...props} /></label>;

  return (
    <form className="wrap admin" onSubmit={save}>
      <h1>{product ? "Edit product" : "Add product"}</h1>
      <div className="formgrid">
        {field("name", "Product name")}
        <label className="field">Category<input list="cats" value={f.category} onChange={(e) => set("category", e.target.value)} placeholder="Sofas, Beds, Chairs…" /></label>
        <datalist id="cats">{cats.map((c) => <option key={c} value={c} />)}</datalist>
        {field("price", "Price (₹)", { type: "number", min: 0 })}
        {field("stock", "Pieces in stock", { type: "number", min: 0 })}
        {field("dimensions", "Dimensions", { placeholder: "200 × 85 × 90 cm" })}
        {field("material", "Material")}
        {field("colours", "Colours")}
        {field("warranty", "Warranty")}
      </div>
      <label className="field">Description<textarea rows={3} value={f.description || ""} onChange={(e) => set("description", e.target.value)} /></label>
      <label className="check"><input type="checkbox" checked={f.active} onChange={(e) => set("active", e.target.checked)} /> Show this product in the shop</label>

      <h2>Photos</h2>
      <p className="muted">The first photo is the cover in the shop. Drag photos to reorder, or use the arrows on your phone.</p>
      <div className="photos">
        {f.images.map((u, i) => (
          <div className="ph" key={u} draggable onDragStart={() => setDrag(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => { reorder(drag, i); setDrag(null); }}>
            {i === 0 && <div className="cover">Cover</div>}
            <img src={u} alt={`Photo ${i + 1}`} />
            <div className="ctl">
              <button type="button" className="btn ghost" onClick={() => reorder(i, i - 1)} disabled={i === 0} aria-label="Move earlier">◀</button>
              <button type="button" className="btn ghost" onClick={() => reorder(i, i + 1)} disabled={i === f.images.length - 1} aria-label="Move later">▶</button>
              {i > 0 && <button type="button" className="btn ghost" onClick={() => reorder(i, 0)}>Cover</button>}
              <button type="button" className="btn ghost" onClick={() => removeImg(i)} aria-label="Remove photo">✕</button>
            </div>
          </div>
        ))}
      </div>
      <label className="btn ghost" style={{ cursor: "pointer" }}>{busy ? "Uploading…" : "Add photos"}
        <input type="file" accept="image/*" multiple hidden onChange={addFiles} disabled={busy || f.images.length >= 12} /></label>
      {err && <p className="error">{err}</p>}
      <div className="row"><button className="btn" disabled={busy}>Save product</button><button type="button" className="btn ghost" onClick={onCancel}>Cancel</button></div>
    </form>
  );
}
