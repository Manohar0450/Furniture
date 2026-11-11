import Link from "next/link";
import { notFound } from "next/navigation";
import { listProducts, getProduct } from "@/lib/store";
import { inr, stockLabel, waLink, enquiryMessage, PHONE } from "@/lib/utils";
import AddToCart from "@/components/AddToCart";
import Gallery from "@/components/Gallery";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }) {
  const p = await getProduct(params.id);
  return p ? { title: `${p.name} | Sri Furniture`, description: `${p.name} at ${inr(p.price)}. ${p.material || ""} ${p.dimensions || ""}`.trim() } : {};
}

export default async function ProductPage({ params }) {
  const p = await getProduct(params.id);
  if (!p) notFound();
  const similar = (await listProducts()).filter((x) => x.category === p.category && x.id !== p.id).slice(0, 3);
  const rows = [["Product ID", p.id], ["Category", p.category], ["Dimensions", p.dimensions], ["Material", p.material], ["Colours", p.colours], ["Warranty", p.warranty], ["Delivery", "Charges confirmed by our team"]].filter(([, v]) => v);
  return (
    <div className="wrap product">
      <Link href="/#shop" className="muted">Back to shop</Link>
      <div className="product-grid">
        <Gallery images={p.images} emoji={p.emoji} tone={p.tone} name={p.name} />
        <div>
          <h1>{p.name}</h1>
          <p className="price big-price">{inr(p.price)}</p>
          <p className={p.stock ? "stock ok" : "stock out"}>{stockLabel(p.stock)}</p>
          {p.description && <p>{p.description}</p>}
          <table><tbody>{rows.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}</tbody></table>
          <div className="row wrap-row">
            <a className="btn wa" target="_blank" rel="noopener" href={waLink(enquiryMessage(p))}>Enquire on WhatsApp</a>
            <a className="btn ghost" href={`tel:${PHONE}`}>Call</a>
            <AddToCart product={p} />
          </div>
        </div>
      </div>
      {similar.length > 0 && (<><h2>Similar products</h2><ul className="similar">{similar.map((s) => <li key={s.id}><Link href={`/products/${s.id}`}>{s.name}</Link> <span className="muted">{inr(s.price)}</span></li>)}</ul></>)}
    </div>
  );
}
