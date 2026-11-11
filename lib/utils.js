export const SHOP = "Sri Furniture";
export const WA = process.env.NEXT_PUBLIC_WA_NUMBER || "910000000000";
export const PHONE = process.env.NEXT_PUBLIC_PHONE || "+910000000000";
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "";
export const inr = (n) => "₹" + n.toLocaleString("en-IN");
export const waLink = (text) => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;
export const enquiryMessage = (p) =>
  `Hello ${SHOP}, I am interested in Product ${p.id} (${p.name}). Is it available? Please share the final price and delivery details.\n${SITE}/products/${p.id}`;
export const stockLabel = (s) => (s === 0 ? "Out of stock" : s <= 3 ? `Only ${s} left` : "In stock");
