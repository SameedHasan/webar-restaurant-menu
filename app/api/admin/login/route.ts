import { NextResponse } from 'next/server';
import { DEV_ADMIN_COOKIE, shouldUseMockData } from '@/lib/config/env';

export async function POST() {
  if (!shouldUseMockData()) {
    return NextResponse.json({ error: 'Use Supabase auth in production mode' }, { status: 400 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(DEV_ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
