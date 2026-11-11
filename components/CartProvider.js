"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getProduct } from "@/lib/products";

const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);

export default function CartProvider({ children }) {
  const [items, setItems] = useState({}); // { productId: qty }
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("sf_cart") || "{}")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem("sf_cart", JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = (id) => setItems((c) => {
    const max = getProduct(id)?.stock ?? 0;
    return { ...c, [id]: Math.min((c[id] || 0) + 1, max) };
  });
  const remove = (id) => setItems((c) => {
    const n = { ...c }; n[id] > 1 ? n[id]-- : delete n[id]; return n;
  });
  const count = Object.values(items).reduce((a, b) => a + b, 0);

  return <Ctx.Provider value={{ items, add, remove, count, open, setOpen }}>{children}</Ctx.Provider>;
}
