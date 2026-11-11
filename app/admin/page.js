import { isAdmin } from "@/lib/auth";
import { dbReady } from "@/lib/db";
import { listProducts } from "@/lib/store";
import AdminLogin from "@/components/AdminLogin";
import AdminPanel from "@/components/AdminPanel";

export const dynamic = "force-dynamic";
export const metadata = { title: "Owner | Sri Furniture", robots: { index: false, follow: false } };

const Notice = ({ title, children }) => <div className="wrap"><div className="notice"><h1>{title}</h1>{children}</div></div>;

export default async function Admin() {
  if (!isAdmin()) return <AdminLogin />;
  if (!dbReady) return <Notice title="Connect the database first"><p>Set <code>MONGODB_URI</code> in <code>.env.local</code> (and in Vercel), then restart. Steps are in README.md.</p></Notice>;
  let products;
  try { products = await listProducts({ includeInactive: true, strict: true }); }
  catch (e) { return <Notice title="Cannot reach the database"><p>{e.message}</p><p className="muted">Check <code>MONGODB_URI</code> (username, password, cluster address) and that Atlas Network Access allows your IP.</p></Notice>; }
  return <AdminPanel initial={products} />;
}
