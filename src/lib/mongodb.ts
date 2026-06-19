import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let db: Db | null = null;
let connecting: Promise<Db> | null = null;

const RETRIES = 3;
const RETRY_DELAY_MS = 500;

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function connectWithRetry(uri: string, attempt = 1): Promise<MongoClient> {
  try {
    const c = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 30000,
    });
    await c.connect();
    c.on('connectionPoolCleared', () => {
      db = null;
      client = null;
    });
    return c;
  } catch (err) {
    if (attempt < RETRIES) {
      await delay(RETRY_DELAY_MS * attempt);
      return connectWithRetry(uri, attempt + 1);
    }
    throw err;
  }
}

export async function getDb(): Promise<Db> {
  if (db) return db;

  if (connecting) return connecting;

  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }
  if (!dbName) {
    throw new Error('MONGODB_DB is not defined in environment variables');
  }

  connecting = (async () => {
    client = await connectWithRetry(uri);
    db = client.db(dbName);
    connecting = null;
    return db;
  })();

  return connecting;
}

export async function closeDb(): Promise<void> {
  connecting = null;
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
