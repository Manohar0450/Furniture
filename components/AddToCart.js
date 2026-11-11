"use client";
import { useCart } from "./CartProvider";

export default function AddToCart({ product, label = "Add to cart" }) {
  const { add, items } = useCart();
  const inCart = items[product.id]?.q || 0;
  return (
    <button className="btn" disabled={product.stock === 0 || inCart >= product.stock} onClick={() => add(product)}>
      {product.stock === 0 ? "Out of stock" : inCart ? `${label} (${inCart} in cart)` : label}
    </button>
  );
}
