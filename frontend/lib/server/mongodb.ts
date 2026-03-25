import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
const databaseName = process.env.DATABASE_NAME || "market-pulse";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  const client = new MongoClient(mongoUri);
  global._mongoClientPromise = client.connect();
}

const clientPromise = global._mongoClientPromise;

export async function getDatabase() {
  const client = await clientPromise;
  return client.db(databaseName);
}

export function dateToIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  return null;
}
