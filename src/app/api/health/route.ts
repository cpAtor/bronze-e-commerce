import { NextResponse } from 'next/server';
import { getLibsqlClient, ensureDatabaseReady } from '@/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Ensure database tables and schema are verified
    await ensureDatabaseReady();

    // Direct ping to database (Turso in prod / local SQLite in dev)
    const client = getLibsqlClient();
    await client.execute('SELECT 1 as ping;');

    return NextResponse.json(
      {
        status: 'ok',
        db: 'connected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        db: 'disconnected',
        message: error instanceof Error ? error.message : 'Database unreachable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
