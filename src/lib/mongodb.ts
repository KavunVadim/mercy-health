import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Initialize and return a connected MongoDB database instance.
 * The connection is cached for the lifetime of the server process.
 */
export async function getDb(): Promise<Db> {
  if (db) return db;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  if (!dbName) {
    throw new Error('MONGODB_DB is not defined in environment variables');
  }

  client = new MongoClient(uri);

  await client.connect();
  db = client.db(dbName);
  console.log('✅ Connected to MongoDB');
  return db;
}

/**
 * Close the MongoDB connection (useful for tests).
 */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('🔌 MongoDB connection closed');
  }
}
