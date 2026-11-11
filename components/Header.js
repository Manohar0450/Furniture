"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";
import { PHONE, SHOP } from "@/lib/utils";

export default function Header() {
  const { count, setOpen } = useCart();
  return (
    <header className="site-header">
      <Link href="/" className="brand">{SHOP}</Link>
      <a className="btn ghost" href={`tel:${PHONE}`}>Call us</a>
      <button className="btn" onClick={() => setOpen(true)}>Cart ({count})</button>
    </header>
  );
}
