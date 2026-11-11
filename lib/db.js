import { MongoClient } from "mongodb";

export const dbReady = !!process.env.MONGODB_URI;

// One shared connection, reused across requests (and across hot reloads in dev).
export async function getDb() {
  if (!globalThis._sfMongo) {
    globalThis._sfMongo = new MongoClient(process.env.MONGODB_URI).connect().catch((e) => { globalThis._sfMongo = null; throw e; });
  }
  const client = await globalThis._sfMongo;
  return client.db(process.env.MONGODB_DB || "srifurniture");
}
