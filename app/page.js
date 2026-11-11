import Shop from "@/components/Shop";

export default function Home() {
  return (
    <>
      <section className="hero">
        <h1>Furniture you can sit on before you buy.</h1>
        <p>Browse the Beeramguda showroom range online, check what is in stock, then confirm price and delivery with our team on WhatsApp.</p>
        <div className="row">
          <a className="btn" href="#shop">Browse furniture</a>
          <a className="btn ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/place/17%C2%B031'46.0%22N+78%C2%B017'54.8%22E/@17.5294313,78.2985611,17z/data=!3m1!4b1!4m4!3m3!8m2!3d17.5294313!4d78.2985611?entry=ttu&g_ep=EgoyMDI2MTEwOC4wIKXMDSoASAFQAw%3D%3D">Get directions</a>
        </div>
      </section>
      <Shop />
      <section className="wrap faq">
        <h2>Before you order</h2>
        <details><summary>Is the listed price final?</summary><p>Prices are for reference. We confirm the final price, delivery charge and availability before accepting your order.</p></details>
        <details><summary>Where do you deliver?</summary><p>Hyderabad and nearby areas. Charges depend on the location and product.</p></details>
        <details><summary>How do I pay?</summary><p>We share payment details once your order is confirmed.</p></details>
      </section>
    </>
  );
}
