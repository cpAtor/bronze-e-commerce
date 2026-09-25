import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // If DATABASE_URL is provided and LibSQL client is initialized, ping DB
    const dbUrl = process.env.DATABASE_URL;
    let dbStatus = 'connected';

    if (dbUrl && dbUrl.startsWith('libsql://')) {
      const { createClient } = await import('@libsql/client');
      const client = createClient({
        url: dbUrl,
        authToken: process.env.DATABASE_AUTH_TOKEN,
      });
      await client.execute('SELECT 1');
    }

    return NextResponse.json(
      {
        status: 'ok',
        db: dbStatus,
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
      },
      { status: 503 }
    );
  }
}
