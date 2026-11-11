import { Bricolage_Grotesque, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/CartProvider";
import Header from "@/components/Header";
import CartDrawer from "@/components/CartDrawer";
import { waLink, SHOP } from "@/lib/utils";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Source_Sans_3({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Sri Furniture | Sofas, beds and dining sets in Beeramguda, Hyderabad",
  description: "Browse furniture from the Sri Furniture showroom in Beeramguda, Hyderabad. Check availability and order on WhatsApp.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <CartDrawer />
          <a className="btn wa fab" target="_blank" rel="noopener" href={waLink(`Hello ${SHOP}, I have a question.`)}>WhatsApp</a>
        </CartProvider>
        <footer className="site-footer">
          <p>{SHOP}, Beeramguda, Hyderabad, Telangana. Open daily 10 AM to 8 PM (update with real hours).</p>
          <p>Privacy · Terms · Shipping and delivery · Cancellation and refund</p>
        </footer>
      </body>
    </html>
  );
}
