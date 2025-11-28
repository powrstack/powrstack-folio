import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    runtime: process.env.NEXT_RUNTIME || 'nodejs',
    environment: process.env.NODE_ENV || 'production',
  };

  return NextResponse.json(health, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
