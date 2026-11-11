import Shop from "@/components/Shop";
import { listProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await listProducts();
  return (
    <>
      <section className="hero">
        <h1>Furniture you can sit on before you buy.</h1>
        <p>Browse the Beeramguda showroom range online, check what is in stock, then confirm price and delivery with our team on WhatsApp.</p>
        <div className="row">
          <a className="btn" href="#shop">Browse furniture</a>
          <a className="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=Sri+Furniture+Beeramguda+Hyderabad">Get directions</a>
        </div>
      </section>
      <Shop products={products} />
      <section className="wrap faq">
        <h2>Before you order</h2>
        <details><summary>Is the listed price final?</summary><p>Prices are for reference. We confirm the final price, delivery charge and availability before accepting your order.</p></details>
        <details><summary>Where do you deliver?</summary><p>Hyderabad and nearby areas. Charges depend on the location and product.</p></details>
        <details><summary>How do I pay?</summary><p>We share payment details once your order is confirmed.</p></details>
      </section>
    </>
  );
}
