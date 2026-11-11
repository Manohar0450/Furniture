import crypto from "crypto";
import { cookies } from "next/headers";

const secret = () => process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
const sign = (v) => crypto.createHmac("sha256", secret()).update(v).digest("hex");
const same = (a, b) => { try { return a.length === b.length && crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b)); } catch { return false; } };

export const makeToken = () => { const exp = String(Date.now() + 14 * 864e5); return `${exp}.${sign(exp)}`; };
export function validToken(t) {
  if (!t || !secret()) return false;
  const [exp, sig] = t.split(".");
  return !!exp && !!sig && Number(exp) > Date.now() && same(sig, sign(exp));
}
export const isAdmin = () => validToken(cookies().get("sf_admin")?.value);
export const passwordOk = (p) => !!process.env.ADMIN_PASSWORD && same(String(p || ""), process.env.ADMIN_PASSWORD);
