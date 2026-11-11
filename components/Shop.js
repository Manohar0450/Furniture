"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { inr, stockLabel } from "@/lib/utils";
import AddToCart from "./AddToCart";

const bands = [
  ["any", "Any price", () => true],
  ["lt10", "Under ₹10,000", (p) => p.price < 10000],
  ["mid", "₹10,000 – ₹25,000", (p) => p.price >= 10000 && p.price <= 25000],
  ["gt25", "Above ₹25,000", (p) => p.price > 25000],
];

export default function Shop({ products }) {
  const categories = [...new Set(products.map((p) => p.category))];
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [band, setBand] = useState("any");
  const [sort, setSort] = useState("pop");
  const [inStock, setInStock] = useState(false);

  const list = useMemo(() => {
    const test = bands.find((b) => b[0] === band)[2];
    const l = products.filter((p) =>
      (!q || `${p.name} ${p.category} ${p.id} ${p.material}`.toLowerCase().includes(q.toLowerCase())) &&
      (!cat || p.category === cat) && (!inStock || p.stock > 0) && test(p));
    return l.sort((a, b) => sort === "lo" ? a.price - b.price : sort === "hi" ? b.price - a.price : (b.popularity || 0) - (a.popularity || 0));
  }, [products, q, cat, band, sort, inStock]);

  return (
    <section id="shop" className="wrap">
      <h2>Shop the showroom</h2>
      <div className="tools">
        <input type="search" placeholder="Search sofas, beds, tables" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={band} onChange={(e) => setBand(e.target.value)}>{bands.map((b) => <option key={b[0]} value={b[0]}>{b[1]}</option>)}</select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="pop">Featured</option><option value="lo">Price, low to high</option><option value="hi">Price, high to low</option>
        </select>
        <label className="check"><input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> In stock only</label>
      </div>
      {list.length === 0 && <p className="muted">No products match. Clear a filter or search for something else.</p>}
      <div className="grid">
        {list.map((p) => (
          <article className="card" key={p.id}>
            <Link href={`/products/${p.id}`} className="tile" style={{ background: p.tone || "#d8e2dc" }} aria-label={p.name}>{p.images?.[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : p.emoji || "🪑"}</Link>
            <div className="card-body">
              <span className="muted">{p.id} · {p.category}</span>
              <h3><Link href={`/products/${p.id}`}>{p.name}</Link></h3>
              <span className="price">{inr(p.price)}</span>
              <span className={p.stock ? "stock ok" : "stock out"}>{stockLabel(p.stock)}</span>
              <div className="row"><AddToCart product={p} label="Add" /></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
