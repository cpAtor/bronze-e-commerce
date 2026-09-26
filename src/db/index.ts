import { createClient, type Client } from '@libsql/client';
import { drizzle, type LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from './schema';
import { SEED_PREDEFINED_PRODUCTS, SEED_PORTFOLIO_PIECES } from '@/data/seed-data';

// Global singleton pattern to prevent multiple connection pools during hot reloads in Next.js
const globalForDb = globalThis as unknown as {
  libsqlClient?: Client;
  drizzleDb?: LibSQLDatabase<typeof schema>;
  dbInitialized?: boolean;
};

export function getDbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && url !== '[SENSITIVE]' && url.trim().length > 0) {
    return url;
  }
  // Local development SQLite fallback
  return 'file:local.db';
}

export function getLibsqlClient(): Client {
  if (!globalForDb.libsqlClient) {
    const url = getDbUrl();
    const authToken = process.env.DATABASE_AUTH_TOKEN;

    globalForDb.libsqlClient = createClient({
      url,
      authToken: authToken && authToken !== '[SENSITIVE]' ? authToken : undefined,
    });
  }
  return globalForDb.libsqlClient;
}

export function getDb(): LibSQLDatabase<typeof schema> {
  if (!globalForDb.drizzleDb) {
    const client = getLibsqlClient();
    globalForDb.drizzleDb = drizzle(client, { schema });
  }
  return globalForDb.drizzleDb;
}

/**
 * Ensures tables exist and initial starter catalog data is seeded in the SQL database.
 * Runs once on database startup.
 */
export async function ensureDatabaseReady(): Promise<void> {
  if (globalForDb.dbInitialized) {
    return;
  }

  const client = getLibsqlClient();

  // Configure busy timeout & WAL mode for SQLite to prevent locking under concurrent queries
  try {
    await client.execute('PRAGMA busy_timeout = 5000;');
    await client.execute('PRAGMA journal_mode = WAL;');
  } catch {}

  // Create tables if they do not exist
  await client.batch(
    [
      `CREATE TABLE IF NOT EXISTS predefined_products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price_paise INTEGER NOT NULL,
        weight TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        alloy_description TEXT NOT NULL,
        care_guide TEXT NOT NULL,
        stock_quantity INTEGER NOT NULL DEFAULT 0,
        images TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS portfolio_pieces (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        reference_dimensions TEXT NOT NULL,
        casting_technique TEXT NOT NULL,
        finish_options TEXT NOT NULL,
        typical_lead_time TEXT NOT NULL,
        images TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        google_id TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL,
        name TEXT NOT NULL,
        avatar_url TEXT,
        phone_number TEXT,
        created_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_code TEXT NOT NULL UNIQUE,
        customer_id TEXT NOT NULL REFERENCES customers(id),
        items TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        shipping_cost_paise INTEGER NOT NULL,
        total_paise INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Ordered',
        courier_tracking_url TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );`,
      `CREATE TABLE IF NOT EXISTS commission_inquiries (
        id TEXT PRIMARY KEY,
        commission_code TEXT NOT NULL UNIQUE,
        customer_id TEXT NOT NULL REFERENCES customers(id),
        item_type TEXT NOT NULL,
        deity_iconography TEXT NOT NULL,
        dimensions TEXT NOT NULL,
        finish_preference TEXT NOT NULL,
        target_date TEXT NOT NULL,
        phone_number TEXT NOT NULL,
        inspired_by_portfolio_id TEXT REFERENCES portfolio_pieces(id),
        created_at INTEGER NOT NULL
      );`,
    ],
    'write'
  );

  // Check if predefined products table needs initial seeding
  const productCountRes = await client.execute(
    'SELECT COUNT(*) as count FROM predefined_products;'
  );
  const count = Number(productCountRes.rows[0]?.count ?? 0);

  if (count === 0) {
    // Seed starter Predefined Products
    for (const p of SEED_PREDEFINED_PRODUCTS) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO predefined_products 
              (id, name, slug, description, price_paise, weight, dimensions, alloy_description, care_guide, stock_quantity, images, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
          p.id,
          p.name,
          p.slug,
          p.description,
          p.pricePaise,
          p.weight,
          p.dimensions,
          p.alloyDescription,
          p.careGuide,
          p.stockQuantity,
          JSON.stringify(p.images),
          p.createdAt,
          p.updatedAt,
        ],
      });
    }

    // Seed starter Portfolio Pieces
    for (const piece of SEED_PORTFOLIO_PIECES) {
      await client.execute({
        sql: `INSERT OR IGNORE INTO portfolio_pieces
              (id, name, slug, description, reference_dimensions, casting_technique, finish_options, typical_lead_time, images, created_at, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
        args: [
          piece.id,
          piece.name,
          piece.slug,
          piece.description,
          piece.referenceDimensions,
          piece.castingTechnique,
          JSON.stringify(piece.finishOptions),
          piece.typicalLeadTime,
          JSON.stringify(piece.images),
          piece.createdAt,
          piece.updatedAt,
        ],
      });
    }
  }

  globalForDb.dbInitialized = true;
}
