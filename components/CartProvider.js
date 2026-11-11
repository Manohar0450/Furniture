"use client";
import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { id: { q, name, price, stock } }
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("sf_cart") || "{}");
      setItems(Object.fromEntries(Object.entries(saved).filter(([, v]) => v && typeof v === "object")));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("sf_cart", JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = (p) => setItems((c) => {
    const q = Math.min((c[p.id]?.q || 0) + 1, p.stock);
    return { ...c, [p.id]: { q, name: p.name, price: p.price, stock: p.stock } };
  });
  const remove = (id) => setItems((c) => {
    const n = { ...c };
    if (n[id].q > 1) n[id] = { ...n[id], q: n[id].q - 1 }; else delete n[id];
    return n;
  });
  const count = Object.values(items).reduce((a, b) => a + b.q, 0);
  return <Ctx.Provider value={{ items, add, remove, count, open, setOpen }}>{children}</Ctx.Provider>;
}
