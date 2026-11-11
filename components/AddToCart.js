"use client";
import { useCart } from "./CartProvider";

export default function AddToCart({ id, stock, label = "Add to cart" }) {
  const { add, items } = useCart();
  const inCart = items[id] || 0;
  return (
    <button className="btn" disabled={stock === 0 || inCart >= stock} onClick={() => add(id)}>
      {stock === 0 ? "Out of stock" : inCart ? `${label} (${inCart} in cart)` : label}
    </button>
  );
}
