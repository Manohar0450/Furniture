"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { getProduct } from "@/lib/products";
import { inr, waLink, SHOP } from "@/lib/utils";

export default function CartDrawer() {
  const { items, add, remove, open, setOpen } = useCart();
  const [f, setF] = useState({ name: "", phone: "", address: "" });
  const [err, setErr] = useState("");
  if (!open) return null;

  const lines = Object.entries(items).map(([id, q]) => ({ ...getProduct(id), q }));
  const total = lines.reduce((s, l) => s + l.price * l.q, 0);

  function send() {
    if (!f.name.trim() || !f.phone.trim()) return setErr("Enter your name and phone number so we can confirm your order.");
    const body = lines.map((l) => `• ${l.id} ${l.name} × ${l.q} (${inr(l.price)})`).join("\n");
    window.open(waLink(`Hello ${SHOP}, I would like to request this order:\n${body}\nItems total: ${inr(total)}\n\nName: ${f.name}\nPhone: ${f.phone}\nAddress: ${f.address || "-"}\n\nPlease confirm availability, delivery charges and payment details.`), "_blank");
  }

  return (
    <div className="scrim" onClick={() => setOpen(false)}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} aria-label="Cart">
        <div className="drawer-head"><h2>Your cart</h2><button className="btn ghost" onClick={() => setOpen(false)}>Close</button></div>
        {lines.length === 0 ? <p className="muted">Your cart is empty. Add a product to request an order.</p> : (
          <>
            {lines.map((l) => (
              <div className="line" key={l.id}>
                <div><strong>{l.name}</strong><div className="muted">{inr(l.price)} each</div></div>
                <div className="qty">
                  <button className="btn ghost" onClick={() => remove(l.id)} aria-label="Remove one">−</button>
                  <span>{l.q}</span>
                  <button className="btn ghost" onClick={() => add(l.id)} disabled={l.q >= l.stock} aria-label="Add one">+</button>
                </div>
              </div>
            ))}
            <p><strong>Items total: {inr(total)}</strong><br /><span className="muted">Our team confirms delivery charges and the final price before accepting the order.</span></p>
            <label className="field">Name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label className="field">Phone<input type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <label className="field">Delivery address<textarea rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
            {err && <p className="error">{err}</p>}
            <button className="btn wa" onClick={send}>Send order request on WhatsApp</button>
          </>
        )}
      </aside>
    </div>
  );
}
