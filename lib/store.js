import { getDb, dbReady } from "./db";
import { sampleProducts } from "./products";

const plain = ({ _id, createdAt, ...rest }) => ({ id: _id, ...rest });

// strict = true throws on database errors (used by the owner page so problems are visible).
export async function listProducts({ includeInactive = false, strict = false } = {}) {
  if (!dbReady) return sampleProducts;
  try {
    const rows = await (await getDb()).collection("products").find(includeInactive ? {} : { active: { $ne: false } }).sort({ createdAt: -1 }).toArray();
    return rows.map(plain);
  } catch (e) { console.error(e); if (strict) throw e; return []; }
}
export async function getProduct(id) {
  if (!dbReady) return sampleProducts.find((p) => p.id === id) || null;
  try {
    const d = await (await getDb()).collection("products").findOne({ _id: id });
    return d && d.active !== false ? plain(d) : null;
  } catch (e) { console.error(e); return null; }
}
