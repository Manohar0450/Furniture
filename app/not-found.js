import Link from "next/link";
export default function NotFound() {
  return <div className="wrap"><h1>Product not found</h1><p>It may have been removed. <Link href="/#shop">Browse all furniture</Link>.</p></div>;
}
